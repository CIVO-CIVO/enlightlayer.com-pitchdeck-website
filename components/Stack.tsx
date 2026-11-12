import { Camera, Radio, Router, Thermometer, TriangleAlert } from "lucide-react";
import type { CSSProperties } from "react";
import { LAYERS } from "@/content/deck";
import { cx } from "@/lib/cx";
import { getPhoto } from "@/lib/photo";
import { Scene, type SceneCard } from "./Scene";

export type SensorMark = {
  /** position on the plane, 0..1 */
  x: number;
  y: number;
  kind: "camera" | "thermal" | "vibration" | "gateway";
  label: string;
  /** field of view on the sensing plane: direction (deg, 0 = right; default: aimed at the focus object), spread (deg), reach (share of plane width) */
  cone?: { angle?: number; spread: number; reach: number };
};

const SENSOR_ICON = { camera: Camera, thermal: Thermometer, vibration: Radio, gateway: Router } as const;

/** L0 gray, L1 outlined, L2 infrared, L3 solid. */
export function LayerSwatch({ n, className }: { n: number; className?: string }) {
  const style =
    n === 0
      ? "bg-[#a3a19c]"
      : n === 1
        ? "border border-current bg-transparent"
        : n === 2
          ? "bg-[linear-gradient(135deg,#5b23a8_0%,#c73f97_45%,#ff7d1f_80%,#ffd36b_100%)]"
          : "bg-current";
  return <span aria-hidden className={cx("inline-block h-2.5 w-2.5 flex-none rounded-[2px]", style, className)} />;
}

/* ── Geometry ──────────────────────────────────────────────────────────────
 * Measured in cqw of the stack container (100 wide, h tall), so leader lines,
 * the alert and the labels are computed on the server and stay locked to the
 * tilted planes at every size. */
const TILT = 57;
const TURN = -37;
const DEPTH = 260;
const G = { cx: 34, cy: 51, p: 54, gap: 15, h: 90 };
const rad = (d: number) => (d * Math.PI) / 180;
const lift = (n: number) => (1.5 - n) * G.gap;

function project(n: number, u: number, v: number): [number, number] {
  const rx = (u - 0.5) * G.p;
  const ry = (v - 0.5) * (G.p / 1.5);
  const c = Math.cos(rad(TURN));
  const s = Math.sin(rad(TURN));
  const x1 = rx * c - ry * s;
  const y1 = rx * s + ry * c;
  const y2 = y1 * Math.cos(rad(TILT));
  const z2 = y1 * Math.sin(rad(TILT));
  const k = DEPTH / (DEPTH - z2);
  return [G.cx + x1 * k, G.cy + lift(n) + y2 * k];
}

const planeStyle = (n: number): CSSProperties => ({
  left: `${G.cx}cqw`,
  top: `${G.cy}cqw`,
  width: `${G.p}cqw`,
  transform: `translate(-50%, -50%) translateY(${lift(n)}cqw) perspective(${DEPTH}cqw) rotateX(${TILT}deg) rotateZ(${TURN}deg)`,
  zIndex: 10 + n * 2,
});

type Box = [number, number, number, number];

/** Cover-crop an image of any aspect into the 3:2 plane, keeping the focus box in view. */
function crop(w: number, h: number, box: Box, target = 1.5): { pos: string; box: Box } {
  const a = w / h;
  if (Math.abs(a - target) < 0.01) return { pos: "50% 50%", box };
  if (a > target) {
    const vis = target / a;
    const x0 = Math.min(1 - vis, Math.max(0, box[0] + box[2] / 2 - vis / 2));
    return { pos: `${((x0 / (1 - vis)) * 100).toFixed(2)}% 50%`, box: [(box[0] - x0) / vis, box[1], box[2] / vis, box[3]] };
  }
  const vis = a / target;
  const y0 = Math.min(1 - vis, Math.max(0, box[1] + box[3] / 2 - vis / 2));
  return { pos: `50% ${((y0 / (1 - vis)) * 100).toFixed(2)}%`, box: [box[0], (box[1] - y0) / vis, box[2], box[3] / vis] };
}

/**
 * The exploded layer stack: one scene separated into L0 physical, L1 sensing,
 * L2 intelligence (only the infrared) and L3 action. Static — hovering or
 * focusing a label isolates that layer (CSS only, see .stack in globals.css).
 */
export function Stack({ slug, sensors, alert, dark }: { slug: string; sensors: SensorMark[]; alert: SceneCard; dark?: boolean }) {
  const photo = getPhoto(slug);
  if (!photo) return <Scene slug={slug} className="aspect-square w-full rounded-[10px]" />;
  const roi = photo.rois.find((r) => r.kind === "thermal") ?? photo.rois[0];
  const fit = crop(photo.width, photo.height, roi?.box ?? [0.45, 0.35, 0.2, 0.3]);
  const box = fit.box;
  const u = box[0] + box[2] / 2;
  const v = box[1] + box[3] / 2;
  const ink = dark ? "255,255,255" : "21,21,21";
  const plane = cx("absolute aspect-[3/2] rounded-[6px]", dark ? "border border-white/22" : "border border-ink/18");

  // the alert card: up and to the right of the point
  const [ax, ay] = project(3, u, v);
  const cardW = 29;
  const cardX = Math.min(ax + 3.5, 70 - cardW);
  const cardBottom = ay - 4;

  return (
    <div>
      <div className="stack relative hidden w-full [container-type:inline-size] lg:block" style={{ aspectRatio: `100 / ${G.h}` }}>
        {/* L0 · physical */}
        <div data-plane="0" className={cx(plane, "overflow-hidden shadow-[0_50px_90px_-40px_rgba(0,0,0,.6)]")} style={planeStyle(0)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.src} alt="" className="h-full w-full object-cover" style={{ objectPosition: fit.pos }} />
        </div>

        {/* L1 · sensing */}
        <div data-plane="1" className={cx(plane, dark ? "bg-white/[0.05]" : "bg-[#fbfaf7]/55")} style={planeStyle(1)}>
          <svg viewBox="0 0 150 100" className="absolute inset-0 h-full w-full" aria-hidden>
            <defs>
              <pattern id={`dots-${slug}`} width="5" height="5" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r=".32" fill={`rgba(${ink},.28)`} />
              </pattern>
            </defs>
            <rect width="150" height="100" fill={`url(#dots-${slug})`} />
            {sensors.map((s) => {
              if (!s.cone) return null;
              const x0 = s.x * 150,
                y0 = s.y * 100,
                r = s.cone.reach * 150;
              const aim = s.cone.angle ?? (Math.atan2((v - s.y) * 100, (u - s.x) * 150) * 180) / Math.PI;
              const a1 = rad(aim - s.cone.spread / 2),
                a2 = rad(aim + s.cone.spread / 2);
              return (
                <path
                  key={s.label}
                  d={`M${x0} ${y0}L${x0 + Math.cos(a1) * r} ${y0 + Math.sin(a1) * r}A${r} ${r} 0 0 1 ${x0 + Math.cos(a2) * r} ${y0 + Math.sin(a2) * r}Z`}
                  fill={`rgba(${ink},.07)`}
                  stroke={`rgba(${ink},.5)`}
                  strokeWidth=".3"
                  strokeDasharray="1.2 1"
                />
              );
            })}
          </svg>
          {sensors.map((s) => {
            const Icon = SENSOR_ICON[s.kind];
            return (
              <span
                key={s.label}
                className={cx(
                  "absolute grid aspect-square w-[8.5%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border",
                  dark ? "border-white/80 bg-[#121212] text-white" : "border-ink bg-white text-ink",
                )}
                style={{ left: `${s.x * 100}%`, top: `${s.y * 100}%` }}
              >
                <Icon className="h-[55%] w-[55%]" strokeWidth={1.9} />
              </span>
            );
          })}
        </div>

        {/* L2 · intelligence — the infrared alone */}
        <div data-plane="2" className={cx(plane, dark ? "bg-white/[0.02]" : "bg-[#fbfaf7]/20")} style={planeStyle(2)}>
          <div className="absolute inset-0 overflow-hidden rounded-[6px]">
            {roi?.overlay ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={roi.overlay}
                alt=""
                className="absolute max-w-none"
                style={{ left: `${box[0] * 100}%`, top: `${box[1] * 100}%`, width: `${box[2] * 100}%`, height: `${box[3] * 100}%` }}
              />
            ) : null}
            <svg viewBox="0 0 150 100" className="absolute inset-0 h-full w-full" aria-hidden>
              <rect
                x={box[0] * 150}
                y={box[1] * 100}
                width={box[2] * 150}
                height={box[3] * 100}
                rx=".6"
                fill="none"
                stroke={dark ? "rgba(255,255,255,.7)" : "rgba(21,21,21,.55)"}
                strokeWidth=".45"
              />
            </svg>
          </div>
        </div>

        {/* L3 · action — the plane carries the anchor; the card stands upright above it */}
        <div data-plane="3" className={cx(plane, dark ? "bg-white/[0.02]" : "bg-white/10")} style={planeStyle(3)}>
          <svg viewBox="0 0 150 100" className="absolute inset-0 h-full w-full" aria-hidden>
            <rect
              x={box[0] * 150}
              y={box[1] * 100}
              width={box[2] * 150}
              height={box[3] * 100}
              rx=".6"
              fill="rgba(255,138,30,.06)"
              stroke="#ff8a1e"
              strokeWidth=".55"
            />
            <circle cx={u * 150} cy={v * 100} r="1.1" fill="#ff8a1e" />
          </svg>
        </div>

        {/* the same point, projected through every layer */}
        {[0, 1, 2].map((n) => {
          const [x0, y0] = project(n, u, v);
          const [, y1] = project(n + 1, u, v);
          return (
            <svg
              key={n}
              data-plane={n}
              viewBox={`0 0 100 ${G.h}`}
              className="pointer-events-none absolute inset-0 h-full w-full"
              style={{ zIndex: 11 + n * 2 }}
              aria-hidden
            >
              <line x1={x0} y1={y0} x2={x0} y2={y1} stroke={dark ? "rgba(255,255,255,.55)" : "rgba(21,21,21,.5)"} strokeWidth=".18" strokeDasharray=".7 .6" />
              <circle cx={x0} cy={y0} r=".45" fill={dark ? "#fff" : "#151515"} />
            </svg>
          );
        })}

        {/* the alert */}
        <div data-plane="3" className="pointer-events-none absolute inset-0 z-[30]">
          <svg viewBox={`0 0 100 ${G.h}`} className="absolute inset-0 h-full w-full" aria-hidden>
            <polyline points={`${ax},${ay} ${cardX},${cardBottom}`} fill="none" stroke="#ff8a1e" strokeWidth=".2" />
          </svg>
          <div
            className="absolute rounded-[8px] border border-orange/60 bg-[#141413]/95 px-[1.5cqw] py-[1.3cqw] text-white shadow-[0_18px_40px_-18px_rgba(0,0,0,.7)]"
            style={{ left: `${cardX}cqw`, top: `${cardBottom}cqw`, width: `${cardW}cqw`, transform: "translateY(-100%)" }}
          >
            <p className="t-label text-[10px] text-white/55">{alert.meta}</p>
            <p className="mt-1.5 flex items-start gap-2 text-[13.5px] leading-tight font-semibold">
              <TriangleAlert className="mt-px h-[15px] w-[15px] flex-none text-orange" strokeWidth={2} />
              {alert.title}
            </p>
          </div>
        </div>

        {/* labels, level with their planes */}
        <ol className="absolute inset-0 z-[40]">
          {[3, 2, 1, 0].map((n) => {
            const [kx] = project(n, 1, 1);
            const y = G.cy + lift(n);
            const l = LAYERS[n];
            return (
              <li
                key={n}
                data-label={n}
                tabIndex={0}
                className="absolute left-[73cqw] w-[27cqw] -translate-y-1/2 cursor-default outline-none focus-visible:ring-2 focus-visible:ring-current/40"
                style={{ top: `${y}cqw` }}
              >
                <svg className="pointer-events-none absolute top-1/2 right-full h-px overflow-visible" style={{ width: `${73 - kx - 1.2}cqw` }} aria-hidden>
                  <line x1="0" y1="0" x2="100%" y2="0" stroke={dark ? "rgba(255,255,255,.35)" : "rgba(21,21,21,.3)"} />
                </svg>
                <p className="t-label inline-flex items-center gap-2 whitespace-nowrap">
                  <LayerSwatch n={n} />
                  <span>
                    L{n} · {l.name}
                  </span>
                </p>
                <p className={cx("mt-1 text-[12.5px] leading-snug", dark ? "text-white/60" : "text-muted")}>{l.short}</p>
              </li>
            );
          })}
        </ol>
      </div>

      {/* phones and tablets: the flat scene + the four layers as a list */}
      <div className="lg:hidden">
        <Scene slug={slug} card={alert} className="aspect-[4/3] w-full rounded-[10px]" />
        <ol className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {LAYERS.map((l) => (
            <li key={l.n} className="panel flex gap-3 rounded-[10px] p-3.5">
              <LayerSwatch n={l.n} className="mt-1" />
              <div>
                <p className="t-label">
                  L{l.n} · {l.name}
                </p>
                <p className="muted mt-1 text-[13px] leading-snug">{l.line}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
