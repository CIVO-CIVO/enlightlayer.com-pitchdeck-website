#!/usr/bin/env node
/**
 * Deck QA — `npm run qa [-- --url http://localhost:3200] [--only 1440,390]`
 *
 * For every slide at every viewport: screenshot it (qa/shots/<w>x<h>/<nn>-<id>.png),
 * check that it fits one screen on desktop sizes, that nothing scrolls sideways,
 * and that every image on it loaded. Writes qa/report.json and a contact sheet
 * per viewport (qa/sheet-<w>x<h>.jpg).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const arg = (k, d) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : d);
const URL = arg("--url", "http://localhost:3200");
const ONLY = arg("--only", null)?.split(",");
const VIEWPORTS = [
  { w: 1440, h: 900, fit: true },
  { w: 1280, h: 720, fit: true },
  { w: 1920, h: 1080, fit: true },
  { w: 390, h: 844, fit: false },
].filter((v) => !ONLY || ONLY.includes(String(v.w)));

const browser = await chromium.launch({ channel: "chrome", headless: true });
const report = [];
let failures = 0;

for (const vp of VIEWPORTS) {
  const dir = path.join(ROOT, "qa/shots", `${vp.w}x${vp.h}`);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: vp.w < 500 ? 2 : 1, reducedMotion: "reduce" });
  await page.goto(URL, { waitUntil: "networkidle" });
  const ids = await page.$$eval("[data-slide]", (els) => els.map((e) => e.id));
  const files = [];
  for (const [k, id] of ids.entries()) {
    await page.evaluate((id) => document.getElementById(id).scrollIntoView({ block: "start" }), id);
    await page.waitForTimeout(250);
    // load every image on this slide that is displayed
    await page.evaluate(async (id) => {
      const imgs = [...document.getElementById(id).querySelectorAll("img")].filter((i) => i.offsetParent !== null || i.getClientRects().length);
      imgs.forEach((i) => (i.loading = "eager"));
      await Promise.all(imgs.map((i) => (i.complete ? null : new Promise((r) => ((i.onload = r), (i.onerror = r))))));
    }, id);
    await page.waitForTimeout(150);
    const m = await page.evaluate((id) => {
      const el = document.getElementById(id);
      const r = el.getBoundingClientRect();
      const broken = [...el.querySelectorAll("img")]
        .filter((i) => i.getClientRects().length && i.complete && i.naturalWidth === 0)
        .map((i) => i.getAttribute("src"));
      const missing = [...el.querySelectorAll(".scene > span.t-label")].map((s) => s.textContent).filter((t) => t?.startsWith("Photo ·"));
      return { height: Math.round(r.height), scrollW: document.documentElement.scrollWidth, broken, missing };
    }, id);
    const issues = [];
    if (m.scrollW > vp.w + 1) issues.push(`horizontal overflow ${m.scrollW}px`);
    if (vp.fit && m.height > vp.h + 1) issues.push(`taller than the screen: ${m.height}px`);
    if (m.broken.length) issues.push(`broken images: ${m.broken.join(", ")}`);
    if (m.missing.length) issues.push(`missing photos: ${m.missing.join(", ")}`);
    failures += issues.length;
    report.push({ viewport: `${vp.w}x${vp.h}`, slide: k + 1, id, ...m, issues });
    const file = path.join(dir, `${String(k + 1).padStart(2, "0")}-${id}.png`);
    if (vp.fit) await page.screenshot({ path: file });
    else await page.locator(`#${id}`).screenshot({ path: file });
    files.push(file);
    console.log(`${vp.w}x${vp.h}  ${String(k + 1).padStart(2, "0")} ${id.padEnd(16)} ${issues.length ? "✗ " + issues.join("; ") : "✓"}`);
  }
  await page.close();

  // contact sheet
  const cols = vp.fit ? 4 : 8;
  const tw = vp.fit ? 480 : 220;
  const tiles = await Promise.all(
    files.map(async (f) => {
      const img = sharp(f).resize({ width: tw });
      const { height } = await img
        .clone()
        .toBuffer({ resolveWithObject: true })
        .then((r) => r.info);
      return { buf: await img.jpeg({ quality: 78 }).toBuffer(), height };
    }),
  );
  const rowH = [];
  for (let r = 0; r < Math.ceil(tiles.length / cols); r++) rowH.push(Math.max(...tiles.slice(r * cols, r * cols + cols).map((t) => t.height)));
  const gap = 8;
  const W = cols * tw + (cols + 1) * gap;
  const H = rowH.reduce((a, b) => a + b + gap, gap);
  let y = gap;
  const comps = [];
  rowH.forEach((h, r) => {
    tiles.slice(r * cols, r * cols + cols).forEach((t, c) => comps.push({ input: t.buf, left: gap + c * (tw + gap), top: y }));
    y += h + gap;
  });
  await sharp({ create: { width: W, height: H, channels: 3, background: "#777" } })
    .composite(comps)
    .jpeg({ quality: 80 })
    .toFile(path.join(ROOT, `qa/sheet-${vp.w}x${vp.h}.jpg`));
}

await browser.close();
fs.writeFileSync(path.join(ROOT, "qa/report.json"), JSON.stringify(report, null, 2));
console.log(failures ? `\n${failures} issue(s) — see qa/report.json` : "\nAll slides pass.");
process.exitCode = failures ? 1 : 0;
