#!/usr/bin/env node
/**
 * Enlight Layer pitch-deck image pipeline — `npm run photos`
 *
 * Source of truth: scripts/photo-manifest.json (defaults + thermal settings) and
 * scripts/photos/*.json (one entry per slug: raw file, pre-crop, tone tweaks, alt,
 * subject, tone, focal, quiet, people, tags, credit, ROIs).
 *
 * Writes (all re-generated on every run, deterministic — the grain is seeded per slug):
 *   public/img/photo/<slug>.jpg                neutral grayscale (single-channel JPEG): levels, local
 *                                              clarity + structure, S-curve, deep blacks / bright
 *                                              highlights, fine sharpening, almost no grain
 *   public/img/ir/<slug>--<key>.webp  thermal ROI overlays (ironbow): RGBA, cropped exactly to the box
 *   public/img/thumb/<slug>.jpg                960 px copy for small tiles and phones (srcset)
 *   qa/photo-previews/<slug>.jpg               QA: overlays composited, every ROI outlined + keyed
 *   content/photos.ts                          generated registry (contract: content/photos.types.ts)
 *   PHOTO_SOURCES.md                           generated rights / provenance table
 *
 * Options:  --only slugA,slugB   process just these (registry + docs still cover every entry)
 *           --no-previews        skip QA previews
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = path.join(ROOT, "scripts/photo-manifest.json");
const PARTS = path.join(ROOT, "scripts/photos");
const OUT_PHOTO = path.join(ROOT, "public/img/photo");
const OUT_OVERLAY = path.join(ROOT, "public/img/ir");
const OUT_DRAWING = path.join(ROOT, "public/img/drawings");
const OUT_PREVIEW = path.join(ROOT, "qa/photo-previews");
const OUT_THUMB = path.join(ROOT, "public/img/thumb");
const THUMB_W = 960;
const OUT_REGISTRY = path.join(ROOT, "content/photos.ts");
const OUT_SOURCES = path.join(ROOT, "PHOTO_SOURCES.md");

const argv = process.argv.slice(2);
const onlyArg = argv.includes("--only") ? argv[argv.indexOf("--only") + 1] : null;
const ONLY = onlyArg ? new Set(onlyArg.split(",")) : null;
const PREVIEWS = !argv.includes("--no-previews");

sharp.cache(false);
const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
// photos live in scripts/photos/*.json ({ "photos": [...] }) so several people can add images in parallel
manifest.photos = [
  ...(manifest.photos || []),
  ...fs
    .readdirSync(PARTS)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .flatMap((f) => JSON.parse(fs.readFileSync(path.join(PARTS, f), "utf8")).photos || []),
];
const D = manifest.defaults;
const T = manifest.thermal;

// ───────────────────────────── helpers ─────────────────────────────
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (e0, e1, x) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const r5 = (v) => Math.round(v * 100000) / 100000;

/** deterministic PRNG (mulberry32) + Box–Muller → N(0,1) */
function rng(seedStr) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  const uni = () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  let spare = null;
  return () => {
    if (spare !== null) {
      const s = spare;
      spare = null;
      return s;
    }
    let u = 0,
      v = 0;
    while (u === 0) u = uni();
    while (v === 0) v = uni();
    const m = Math.sqrt(-2 * Math.log(u));
    spare = m * Math.sin(2 * Math.PI * v);
    return m * Math.cos(2 * Math.PI * v);
  };
}

function percentiles(values, ps) {
  const bins = new Uint32Array(4096);
  for (let i = 0; i < values.length; i++) bins[Math.min(4095, Math.max(0, Math.round(values[i] * 4095)))]++;
  const out = [];
  for (const p of ps) {
    const target = (p / 100) * values.length;
    let acc = 0,
      b = 0;
    for (; b < 4096; b++) {
      acc += bins[b];
      if (acc >= target) break;
    }
    out.push(b / 4095);
  }
  return out;
}

/** 256-entry thermal colour LUT from the manifest stops */
const LUT = (() => {
  const stops = T.stops.map(([p, h]) => [p, hex(h)]);
  const lut = new Uint8Array(256 * 3);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let k = 0;
    while (k < stops.length - 2 && t > stops[k + 1][0]) k++;
    const [p0, c0] = stops[k],
      [p1, c1] = stops[k + 1];
    const f = clamp01((t - p0) / (p1 - p0));
    for (let c = 0; c < 3; c++) lut[i * 3 + c] = Math.round(c0[c] + (c1[c] - c0[c]) * f);
  }
  return lut;
})();

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

/** Separable box blur (3 passes ≈ gaussian, σ ≈ r) of a Float32 plane region → region-sized result. */
function boxBlur(src, W, H, r, x0 = 0, y0 = 0, x1 = W, y1 = H) {
  r = Math.max(1, Math.round(r));
  const w = x1 - x0,
    h = y1 - y0;
  let a = new Float32Array(w * h),
    b = new Float32Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) a[y * w + x] = src[(y + y0) * W + x + x0];
  const norm = 1 / (2 * r + 1);
  for (let pass = 0; pass < 3; pass++) {
    for (let y = 0; y < h; y++) {
      // horizontal
      let acc = 0;
      const row = y * w;
      for (let x = -r; x <= r; x++) acc += a[row + Math.min(w - 1, Math.max(0, x))];
      for (let x = 0; x < w; x++) {
        b[row + x] = acc * norm;
        acc += a[row + Math.min(w - 1, x + r + 1)] - a[row + Math.max(0, x - r)];
      }
    }
    for (let x = 0; x < w; x++) {
      // vertical
      let acc = 0;
      for (let y = -r; y <= r; y++) acc += b[Math.min(h - 1, Math.max(0, y)) * w + x];
      for (let y = 0; y < h; y++) {
        a[y * w + x] = acc * norm;
        acc += b[Math.min(h - 1, y + r + 1) * w + x] - b[Math.max(0, y - r) * w + x];
      }
    }
  }
  return a; // region-sized result
}

/** Retouch: blur a rectangle (fractions of the processed frame) with a feathered blend — used to
 *  make small legible brand marks / machine-readable codes unreadable. */
function retouchBlur(L, W, H, [fx, fy, fw, fh]) {
  const x0 = Math.max(0, Math.floor(fx * W)),
    y0 = Math.max(0, Math.floor(fy * H));
  const x1 = Math.min(W, Math.ceil((fx + fw) * W)),
    y1 = Math.min(H, Math.ceil((fy + fh) * H));
  const w = x1 - x0,
    h = y1 - y0;
  if (w < 4 || h < 4) return;
  const blurred = boxBlur(L, W, H, Math.max(4, Math.min(w, h) * 0.18), x0, y0, x1, y1);
  const fe = Math.max(2, Math.min(w, h) * 0.15);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const m = smoothstep(0, fe, Math.min(x + 0.5, w - x - 0.5)) * smoothstep(0, fe, Math.min(y + 0.5, h - y - 0.5));
      const i = (y + y0) * W + x + x0;
      L[i] = L[i] * (1 - m) + blurred[y * w + x] * m;
    }
}

// ───────────────────────────── per photo ─────────────────────────────
async function loadLuma(entry) {
  const rawPath = path.join(ROOT, entry.raw);
  if (!fs.existsSync(rawPath)) throw new Error(`raw missing: ${entry.raw}`);
  const meta = await sharp(rawPath, { limitInputPixels: false, failOn: "none" }).metadata();
  const swap = (meta.orientation || 1) >= 5;
  const RW = swap ? meta.height : meta.width,
    RH = swap ? meta.width : meta.height;
  const [cx, cy, cw, ch] = entry.crop || [0, 0, 1, 1];
  const ext = { left: Math.round(cx * RW), top: Math.round(cy * RH), width: Math.round(cw * RW), height: Math.round(ch * RH) };
  ext.width = Math.min(ext.width, RW - ext.left);
  ext.height = Math.min(ext.height, RH - ext.top);
  const maxEdge = entry.maxEdge || (entry.hero ? D.heroMaxEdge : D.maxEdge);
  const scale = Math.min(1, maxEdge / Math.max(ext.width, ext.height));
  const W = Math.round(ext.width * scale),
    H = Math.round(ext.height * scale);

  let img = sharp(rawPath, { limitInputPixels: false, failOn: "none" }).rotate().extract(ext);
  if (entry.flop) img = img.flop();
  img = img.resize(W, H, { kernel: "lanczos3" }).removeAlpha().toColourspace("srgb");
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const n = info.width * info.height,
    chn = info.channels;
  const mix = entry.mix || [0.2126, 0.7152, 0.0722];
  const L = new Float32Array(n);
  for (let i = 0, j = 0; i < n; i++, j += chn) {
    L[i] = chn >= 3 ? (mix[0] * data[j] + mix[1] * data[j + 1] + mix[2] * data[j + 2]) / 255 : data[j] / 255;
  }
  // drawings: erase title blocks / text (white rectangles given in raw fractions)
  for (const [ex, ey, ew, eh] of entry.drawing?.erase || []) {
    const x0 = Math.max(0, Math.floor(((ex - cx) / cw) * W)),
      x1 = Math.min(W, Math.ceil(((ex + ew - cx) / cw) * W));
    const y0 = Math.max(0, Math.floor(((ey - cy) / ch) * H)),
      y1 = Math.min(H, Math.ceil(((ey + eh - cy) / ch) * H));
    for (let y = y0; y < y1; y++) L.fill(1, y * W + x0, y * W + x1);
  }
  for (const rect of entry.retouch || []) retouchBlur(L, info.width, info.height, rect);
  return { L, W: info.width, H: info.height, source: [RW, RH], ext };
}

/** Add a band-pass detail layer: v += k·soft(v − blur_σ(v))·weight(v).  soft() compresses large
 *  differences (halo control); weight() protects the deepest blacks and brightest highlights. */
function localContrast(V, W, H, sigma, k, limit = 0.22) {
  if (!k || sigma < 0.5) return;
  const B = boxBlur(V, W, H, sigma);
  for (let i = 0; i < V.length; i++) {
    const v = V[i];
    const d = v - B[i];
    const soft = d / (1 + Math.abs(d) / limit);
    const wgt = 0.35 + 0.65 * Math.min(1, 4.4 * v * (1 - v));
    V[i] = v + k * soft * wgt;
  }
}

/**
 * New look: levels → gamma → clarity (large radius) → structure (medium) → S-curve → re-stretch to
 * deep black / bright white → fine sharpening.  Returns tone-mapped v in 0..1 (before grain).
 */
function toneMap(L, W, H, adjust) {
  const a = { ...D.adjust, ...(adjust || {}) };
  const [lo, hi] = percentiles(L, a.levels);
  const span = Math.max(1e-3, hi - lo);
  const g = 1 / a.gamma,
    b = a.brightness || 0;
  const long = Math.max(W, H);
  const V = new Float32Array(L.length);
  for (let i = 0; i < L.length; i++) V[i] = Math.pow(clamp01((L[i] - lo) / span + b), g);
  localContrast(V, W, H, (a.clarityRadius ?? 0.016) * long, a.clarity ?? 0);
  localContrast(V, W, H, (a.structureRadius ?? 0.0025) * long, a.structure ?? 0, 0.15);
  const c = a.contrast;
  for (let i = 0; i < V.length; i++) {
    const v = clamp01(V[i]);
    V[i] = (1 - c) * v + c * (v * v * (3 - 2 * v));
  }
  // re-stretch so the frame keeps a true black and a clean white after the local operations
  const [l2, h2] = percentiles(V, a.restretch ?? [0.12, 99.88]);
  const s2 = Math.max(1e-3, h2 - l2);
  for (let i = 0; i < V.length; i++) V[i] = clamp01((V[i] - l2) / s2);
  if (a.sharpen) {
    const B = boxBlur(V, W, H, a.sharpenRadius ?? 1);
    for (let i = 0; i < V.length; i++) V[i] = clamp01(V[i] + a.sharpen * (V[i] - B[i]));
  }
  return V;
}

async function encodeGray(entry, gray, W, H) {
  const budget = (entry.maxKB ?? (entry.hero ? D.heroMaxKB : D.maxKB)) * 1024;
  let q = entry.quality ?? D.quality,
    buf;
  for (;;) {
    buf = await sharp(gray, { raw: { width: W, height: H, channels: 1 } })
      .toColourspace("b-w")
      .jpeg({ quality: q, progressive: true, mozjpeg: true })
      .toBuffer();
    if (buf.length <= budget || q <= D.minQuality) break;
    q -= 3;
  }
  return { buf, q };
}

async function writePhoto(entry, V, W, H) {
  const black = hex(D.black)[0],
    white = hex(D.white)[0];
  const gauss = rng(`grain:${entry.slug}`);
  const sigma = Math.min(entry.grain ?? D.grain, D.grainMax ?? 1.2);
  const gray = Buffer.alloc(W * H);
  let sum = 0;
  for (let i = 0; i < V.length; i++) {
    const v = V[i];
    sum += v;
    const o = black + v * (white - black) + gauss() * sigma;
    gray[i] = o < 0 ? 0 : o > 255 ? 255 : Math.round(o);
  }
  const out = path.join(OUT_PHOTO, `${entry.slug}.jpg`);
  const { buf, q } = await encodeGray(entry, gray, W, H);
  fs.writeFileSync(out, buf);
  return { file: out, gray, mean: sum / V.length, bytes: buf.length, quality: q };
}

/** Rasterise a polygon (box-fraction coordinates) into a 0/1 mask of bw×bh (even-odd rule). */
function polygonMask(poly, bw, bh) {
  const m = new Float32Array(bw * bh);
  const pts = poly.map(([px, py]) => [px * bw, py * bh]);
  for (let j = 0; j < bh; j++) {
    const yc = j + 0.5;
    const xs = [];
    for (let k = 0; k < pts.length; k++) {
      const [x1, y1] = pts[k],
        [x2, y2] = pts[(k + 1) % pts.length];
      if (y1 <= yc !== y2 <= yc) xs.push(x1 + ((yc - y1) / (y2 - y1)) * (x2 - x1));
    }
    xs.sort((p, q) => p - q);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const a = Math.max(0, Math.ceil(xs[k] - 0.5)),
        b = Math.min(bw - 1, Math.floor(xs[k + 1] - 0.5));
      for (let i = a; i <= b; i++) m[j * bw + i] = 1;
    }
  }
  return m;
}

/**
 * Thermal (ironbow) overlay for one ROI, computed from the tone-mapped luminance V.
 *   heat  = kL·Ln + kD·core − offset           (clamped; Ln = box luminance stretched p2–p98)
 *   core  = max_i w_i·(1 − smoothstep(0,1,d_i))^dExp, d_i = rotated elliptical distance to hot spot i
 *   rgb   = ironbow(heat) · (1 + detail·highpass)  so edges / ribs / bolts stay readable in the colour
 *   alpha = alphaMax · edgeFeather(~9 % of the box) · shapeMask · (floor + (1−floor)·smoothstep(0, knee, heat))
 */
async function writeThermal(entry, roi, V, W, H) {
  const P = { ...T, ...(roi.thermal || {}) };
  const [x, y, w, h] = roi.box;
  const bx = Math.max(0, Math.round(x * W)),
    by = Math.max(0, Math.round(y * H));
  const bw = Math.min(W - bx, Math.round(w * W)),
    bh = Math.min(H - by, Math.round(h * H));
  const fine = boxBlur(V, W, H, Math.max(1, P.blur * Math.min(bw, bh)), bx, by, bx + bw, by + bh);
  const coarse = boxBlur(V, W, H, Math.max(2, P.detailRadius * Math.min(bw, bh)), bx, by, bx + bw, by + bh);
  const [p2, p98] = percentiles(fine, [2, 98]);
  const span = Math.max(1e-3, p98 - p2);
  const lum = roi.lum ?? 1; // 1 = bright is hot, −1 = dark is hot, 0.3 = mostly core-driven
  const spots = Array.isArray(roi.hot?.[0]) ? roi.hot : [roi.hot || [0.5, 0.5]];
  const [sx, sy] = roi.spread || P.spread;
  const ang = ((roi.angle || 0) * Math.PI) / 180,
    ca = Math.cos(ang),
    sa = Math.sin(ang);
  const fx = Math.max(2, P.feather * bw),
    fy = Math.max(2, P.feather * bh);
  let shape = null;
  if (Array.isArray(roi.shape)) {
    const m = polygonMask(roi.shape, bw, bh);
    shape = boxBlur(m, bw, bh, Math.max(1.5, 0.5 * P.feather * Math.min(bw, bh)));
  }
  const rgba = Buffer.alloc(bw * bh * 4);
  for (let j = 0; j < bh; j++) {
    const ay = smoothstep(0, fy, Math.min(j + 0.5, bh - j - 0.5));
    for (let i = 0; i < bw; i++) {
      const k = j * bw + i;
      const ax = smoothstep(0, fx, Math.min(i + 0.5, bw - i - 0.5));
      let Ln = clamp01((fine[k] - p2) / span);
      if (lum < 0) Ln = 1 - Ln;
      const lw = Math.abs(lum);
      let core = 0;
      for (const s of spots) {
        // offset from the hot spot in pixels, rotated by `angle`, normalised by the spread radii
        // (fractions of the box width / height) → d = 1 at the ellipse edge
        const dx = i + 0.5 - s[0] * bw,
          dy = j + 0.5 - s[1] * bh;
        const u = (dx * ca + dy * sa) / (sx * bw),
          v = (-dx * sa + dy * ca) / (sy * bh);
        const d = Math.sqrt(u * u + v * v);
        core = Math.max(core, (s[2] ?? 1) * Math.pow(1 - smoothstep(0, 1, d), P.dExp));
      }
      // coreLum (0..1): let the hot core heat only the object's own pixels (Ln high) — keeps sky / background
      // behind a dark structure from being painted when lum < 0
      if (P.coreLum) core *= 1 - P.coreLum + P.coreLum * smoothstep(0.05, 0.6, Ln);
      let heat = P.kL * (lw * Ln + (1 - lw) * 0.5) + P.kD * core - P.offset;
      // soft knee: compress the top of the range so the core keeps its texture instead of clipping to flat white
      if (heat > P.knee) heat = P.knee + (1 - P.knee) * Math.tanh((heat - P.knee) / (1 - P.knee));
      heat = clamp01(heat);
      const li = Math.round(heat * 255) * 3;
      const hp = (fine[k] - coarse[k]) / span;
      const lift = 1 + P.detail * Math.max(-0.6, Math.min(0.6, lum < 0 ? -hp : hp));
      rgba[k * 4] = Math.min(255, Math.round(LUT[li] * lift));
      rgba[k * 4 + 1] = Math.min(255, Math.round(LUT[li + 1] * lift));
      rgba[k * 4 + 2] = Math.min(255, Math.round(LUT[li + 2] * lift));
      let el = ax * ay;
      if (roi.shape === "ellipse") {
        const ex = ((i + 0.5) / bw - 0.5) * 2,
          ey = ((j + 0.5) / bh - 0.5) * 2;
        el = 1 - smoothstep(1 - 2 * P.feather, 1, Math.sqrt(ex * ex + ey * ey));
      } else if (shape) el *= shape[k];
      const a = P.alphaMax * el * (P.alphaFloor + (1 - P.alphaFloor) * smoothstep(0, P.alphaKnee, heat));
      rgba[k * 4 + 3] = Math.round(255 * a);
    }
  }
  let pipe = sharp(rgba, { raw: { width: bw, height: bh, channels: 4 } });
  const long = Math.max(bw, bh);
  if (long > P.maxEdge) pipe = pipe.resize(Math.round((bw * P.maxEdge) / long), Math.round((bh * P.maxEdge) / long), { kernel: "lanczos3" });
  const name = `${entry.slug}--${roi.key}.webp`;
  await pipe.webp({ quality: P.quality, alphaQuality: P.alphaQuality, effort: 6, smartSubsample: true }).toFile(path.join(OUT_OVERLAY, name));
  return { px: [bx, by, bw, bh], overlay: `/img/ir/${name}` };
}

async function writeDrawingPng(entry, L, W, H) {
  const cfg = { gain: 1.7, gamma: 0.85, maxEdge: 2400, ...(entry.drawing || {}) };
  const ink = hex(D.ink);
  const scale = Math.min(1, cfg.maxEdge / Math.max(W, H));
  const rgba = Buffer.alloc(W * H * 4);
  for (let i = 0, k = 0; i < L.length; i++, k += 4) {
    const a = Math.pow(clamp01((1 - L[i]) * cfg.gain), cfg.gamma);
    rgba[k] = ink[0];
    rgba[k + 1] = ink[1];
    rgba[k + 2] = ink[2];
    rgba[k + 3] = Math.round(a * 255);
  }
  let pipe = sharp(rgba, { raw: { width: W, height: H, channels: 4 } });
  if (scale < 1) pipe = pipe.resize(Math.round(W * scale), Math.round(H * scale));
  const out = path.join(OUT_DRAWING, `${entry.slug}.png`);
  await pipe.png({ compressionLevel: 9, palette: false }).toFile(out);
  return out;
}

async function writePreview(entry, gray, W, H, rois) {
  const comps = [];
  for (const r of rois) {
    if (r.kind !== "thermal" || !r.px) continue;
    const [bx, by, bw, bh] = r.px;
    comps.push({
      input: await sharp(path.join(ROOT, "public", r.overlay))
        .resize(bw, bh)
        .png()
        .toBuffer(),
      left: bx,
      top: by,
    });
  }
  const PW = 1400,
    PH = Math.round((H * PW) / W);
  const base = await sharp(gray, { raw: { width: W, height: H, channels: 1 } })
    .toColourspace("srgb")
    .composite(comps)
    .png()
    .toBuffer();
  const parts = rois.map((r) => {
    const [x, y, w, h] = r.box;
    const X = x * PW,
      Y = y * PH,
      Wb = w * PW,
      Hb = h * PH;
    const col = r.kind === "thermal" ? "#ffffff" : r.kind === "data" ? "#ffae34" : "#9fe8ff";
    const label = `${r.key} · ${r.kind} · ${Math.round(w * 100)}%w`;
    const ty = Y > 18 ? Y - 5 : Y + Hb + 14;
    return (
      `<rect x="${X.toFixed(1)}" y="${Y.toFixed(1)}" width="${Wb.toFixed(1)}" height="${Hb.toFixed(1)}" fill="none" stroke="${col}" stroke-opacity="0.85" stroke-width="1.2" stroke-dasharray="${r.kind === "thermal" ? "none" : "5 4"}"/>` +
      `<text x="${X.toFixed(1)}" y="${ty.toFixed(1)}" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="${col}" stroke="#000" stroke-width="2.5" paint-order="stroke">${esc(label)}</text>`
    );
  });
  parts.push(
    `<text x="10" y="${PH - 10}" font-family="Helvetica, Arial, sans-serif" font-size="14" font-weight="bold" fill="#fff" stroke="#000" stroke-width="3" paint-order="stroke">${esc(entry.slug)} · ${W}×${H}</text>`,
  );
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${PW}" height="${PH}">${parts.join("")}</svg>`);
  await sharp(base)
    .resize(PW, PH)
    .composite([{ input: svg, left: 0, top: 0 }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(OUT_PREVIEW, `${entry.slug}.jpg`));
}

async function processEntry(entry) {
  const t0 = Date.now();
  const { L, W, H } = await loadLuma(entry);
  const V = toneMap(L, W, H, entry.adjust);
  const photo = await writePhoto(entry, V, W, H);
  const rois = [];
  for (const roi of entry.rois || []) {
    const r = { ...roi };
    if (roi.kind === "thermal") Object.assign(r, await writeThermal(entry, roi, V, W, H));
    rois.push(r);
  }
  if (entry.drawing) await writeDrawingPng(entry, L, W, H);
  if (PREVIEWS) await writePreview(entry, photo.gray, W, H, rois);
  const kb = Math.round(photo.bytes / 1024);
  console.log(
    `  ✓ ${entry.slug.padEnd(24)} ${String(W).padStart(4)}×${String(H).padEnd(4)} ${String(kb).padStart(4)} KB q${photo.quality}  mean ${photo.mean.toFixed(2)}  rois ${rois.length} (${rois.filter((r) => r.kind === "thermal").length} thermal)  ${((Date.now() - t0) / 1000).toFixed(1)}s`,
  );
  return { W, H, mean: photo.mean, bytes: photo.bytes, rois };
}

/** For entries not re-processed in an --only run: read dims of the existing output. */
async function existingState(entry) {
  const file = path.join(OUT_PHOTO, `${entry.slug}.jpg`);
  if (!fs.existsSync(file)) return null;
  const m = await sharp(file).metadata();
  const rois = (entry.rois || []).map((roi) => {
    const r = { ...roi };
    if (roi.kind === "thermal") {
      const [x, y, w, h] = roi.box;
      const bx = Math.round(x * m.width),
        by = Math.round(y * m.height);
      r.px = [bx, by, Math.min(m.width - bx, Math.round(w * m.width)), Math.min(m.height - by, Math.round(h * m.height))];
      r.overlay = `/img/ir/${entry.slug}--${roi.key}.webp`;
    }
    return r;
  });
  // approximate the tone-mapped mean from the encoded file (undo the black/white point mapping)
  const st = await sharp(file).stats();
  const [b0, w0] = [hex(D.black)[0], hex(D.white)[0]];
  const mean = clamp01((st.channels[0].mean - b0) / (w0 - b0));
  return { W: m.width, H: m.height, mean, bytes: fs.statSync(file).size, rois };
}

// ───────────────────────────── registry + docs ─────────────────────────────
function registryEntry(entry, st) {
  const tone = entry.tone || (st.mean == null ? "mid" : st.mean > 0.6 ? "light" : st.mean < 0.36 ? "dark" : "mid");
  const rois = st.rois.map((r) => {
    const box = r.px ? [r.px[0] / st.W, r.px[1] / st.H, r.px[2] / st.W, r.px[3] / st.H] : r.box;
    const o = { key: r.key, box: box.map(r5), kind: r.kind };
    if (r.overlay) o.overlay = r.overlay;
    o.subject = r.subject;
    o.suggestion = r.suggestion;
    return o;
  });
  const p = {
    slug: entry.slug,
    src: `/img/photo/${entry.slug}.jpg`,
    thumb: `/img/thumb/${entry.slug}.jpg`,
    width: st.W,
    height: st.H,
    alt: entry.alt,
    category: entry.category,
    subject: entry.subject,
    tone,
    focal: entry.focal,
  };
  if (entry.quiet?.length) p.quiet = entry.quiet;
  p.rois = rois;
  p.credit = entry.credit;
  p.people = entry.people;
  p.tags = entry.tags;
  return p;
}

function writeRegistry(list) {
  // pretty JSON, but keep short arrays (boxes, focal, tags) on one line
  const compact = (o) => JSON.stringify(o, null, 2).replace(/\[\s*([^\[\]{}]*?)\s*\]/g, (m, inner) => `[${inner.replace(/\s*\n\s*/g, " ").trim()}]`);
  const body = list.map((p) => `  ${JSON.stringify(p.slug)}: ${compact(p).replace(/\n/g, "\n  ")},`).join("\n");
  const ts = `// GENERATED by scripts/process-photos.mjs — do not edit by hand.
// Source of truth: scripts/photo-manifest.json + scripts/photos/*.json → \`npm run photos\`.
import type { Photo } from "./photos.types";

export const photos = {
${body}
} satisfies Record<string, Photo>;
`;
  fs.writeFileSync(OUT_REGISTRY, ts);
}

function writeSources(list, entries) {
  const cell = (s) =>
    String(s ?? "")
      .replace(/\|/g, "\\|")
      .replace(/\n/g, " ");
  const row = (p) => {
    const e = entries.find((x) => x.slug === p.slug);
    const c = p.credit;
    const thermal = p.rois.filter((r) => r.kind === "thermal").map((r) => r.key);
    return `| \`${p.slug}\` | ${p.width}×${p.height} | ${cell(p.subject)} | ${cell(c.source)} | ${cell(c.author)} | ${c.url} | ${cell(c.license)} | ${p.people} | ${thermal.length ? thermal.map((k) => `\`${k}\``).join(", ") : "—"} | ${cell(e.notes || "")} |`;
  };
  const bySource = list.reduce((a, p) => ((a[p.credit.source] = (a[p.credit.source] || 0) + 1), a), {});
  const md = `# Photo sources

Generated by \`scripts/process-photos.mjs\` from \`scripts/photo-manifest.json\` + \`scripts/photos/*.json\` — edit those, then run \`npm run photos\`. The public credits page (\`/credits\`) reads the same registry.

**${list.length} photographs** — ${Object.entries(bySource)
    .map(([k, v]) => `${v} × ${k}`)
    .join(
      ", ",
    )}. Every file was downloaded once from an openly licensed source without any account or API key, and is self-hosted under \`public/img/\`; nothing is hotlinked. Raw downloads stay in \`assets-src/raw/\` (not committed); their provenance records are in \`assets-src/raw/sources-*.json\`.

| slug | processed size | subject | source | author | source URL | license | people | infrared overlays | notes |
|---|---|---|---|---|---|---|---|---|---|
${list.map(row).join("\n")}

## Licensing

- **Public domain** — U.S. federal government works (17 U.S.C. § 105), works whose authors released them to the public domain, and **CC0 1.0** dedications. No attribution is legally required; we credit them anyway.
- **CC BY / CC BY-SA** — used with the attribution the licence requires (author, source link, licence link) on \`/credits\`. Our processed versions (crop, grayscale tone-mapping, infrared overlay) are adaptations; adaptations of CC BY-SA photographs are shared under the same licence.
- No NC, ND or "all rights reserved" images are used.
- **Processing:** every photograph is cropped, converted to neutral grayscale, tone-mapped and given a barely visible grain. Faces, plates, brand names and lettering that were legible are blurred (\`retouch\` in the manifest), cropped, or — in one case (\`inspection-proof\`, an agency name on a vest) — painted out in the raw file; the untouched download is kept beside it. The infrared overlays (\`public/img/ir/*.webp\`) are **illustrative graphics computed from the photograph's own luminance — not sensor data or real temperature measurements.**
- The photographs show real places that have nothing to do with Enlight Layer. They illustrate monitoring *concepts* and must never be presented as deployments, customers or partner sites. Government photographs do not imply endorsement by that agency.
`;
  fs.writeFileSync(OUT_SOURCES, md);
}

// ───────────────────────────── main ─────────────────────────────
async function main() {
  for (const d of [OUT_PHOTO, OUT_OVERLAY, OUT_PREVIEW, OUT_THUMB]) fs.mkdirSync(d, { recursive: true });
  const entries = manifest.photos;
  const slugs = new Set();
  for (const e of entries) {
    if (slugs.has(e.slug)) throw new Error(`duplicate slug ${e.slug}`);
    slugs.add(e.slug);
    const keys = new Set();
    for (const r of e.rois || []) {
      if (keys.has(r.key)) throw new Error(`${e.slug}: duplicate ROI key ${r.key}`);
      keys.add(r.key);
      const [x, y, w, h] = r.box;
      if (x < 0 || y < 0 || w <= 0 || h <= 0 || x + w > 1.0001 || y + h > 1.0001) throw new Error(`${e.slug}/${r.key}: box out of frame ${r.box}`);
    }
  }
  console.log(`Processing ${ONLY ? ONLY.size : entries.length} of ${entries.length} manifest entries…`);
  const states = {};
  for (const e of entries) {
    if (ONLY && !ONLY.has(e.slug)) {
      states[e.slug] = await existingState(e);
      continue;
    }
    try {
      states[e.slug] = await processEntry(e);
    } catch (err) {
      console.log(`  ! ${e.slug}: ${err.message}`);
      states[e.slug] = null;
    }
  }
  // remove stale overlays (ROIs renamed/removed or no longer thermal)
  const wanted = new Set(entries.flatMap((e) => (e.rois || []).filter((r) => r.kind === "thermal").map((r) => `${e.slug}--${r.key}.webp`)));
  for (const f of fs.readdirSync(OUT_OVERLAY)) if (f.endsWith(".webp") && !wanted.has(f)) fs.unlinkSync(path.join(OUT_OVERLAY, f));
  // 960 px copies for small tiles and phones (srcset); rebuilt whenever the photo is newer
  for (const e of entries) {
    if (!states[e.slug]) continue;
    const src = path.join(OUT_PHOTO, `${e.slug}.jpg`);
    const dst = path.join(OUT_THUMB, `${e.slug}.jpg`);
    if (fs.existsSync(dst) && fs.statSync(dst).mtimeMs >= fs.statSync(src).mtimeMs) continue;
    await sharp(src).resize({ width: THUMB_W, withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toFile(dst);
  }
  const list = entries.filter((e) => states[e.slug]).map((e) => registryEntry(e, states[e.slug]));
  writeRegistry(list);
  writeSources(list, entries);
  const missing = entries.filter((e) => !states[e.slug]).map((e) => e.slug);
  const total = list.reduce((a, p) => a + (states[p.slug].bytes || 0), 0);
  console.log(
    `Registry: ${list.length} photos → content/photos.ts  (photo payload ${(total / 1048576).toFixed(1)} MB)${missing.length ? `  MISSING: ${missing.join(", ")}` : ""}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
