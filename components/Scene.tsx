import { Gauge, TriangleAlert } from "lucide-react";
import type { CSSProperties } from "react";
import { cx } from "@/lib/cx";
import { getPhoto } from "@/lib/photo";

export type SceneCard = { meta: string; title: string; kind?: "alert" | "reading" };

/**
 * A processed photograph cover-cropped around its focal point, with its
 * infrared overlay, corner brackets on the focus object and an example alert.
 * Pure CSS geometry (see .scene in globals.css) — no client JS, and the
 * infrared is a still image: it never animates.
 */
export function Scene({
  slug,
  card,
  className,
  eager,
  label = "Example",
  brackets = true,
  infrared = true,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  shade,
  mirror,
  side: sideProp,
  callout,
  all,
  tags,
  zoom,
  at,
}: {
  slug: string;
  card?: SceneCard;
  className?: string;
  eager?: boolean;
  /** small corner label, top left; null hides it */
  label?: string | null;
  brackets?: boolean;
  infrared?: boolean;
  sizes?: string;
  /** a gradient painted between the photograph and the card */
  shade?: string;
  /** show the photograph mirrored left to right (infrared, brackets and card follow) */
  mirror?: boolean;
  /** which side of the focus object the card sits on (default: the side with more room) */
  side?: "left" | "right";
  /** show the card as a callout above or below the focus object, joined to it by a leader line (the banner) */
  callout?: "above" | "below";
  /** mark every thermal ROI of the photograph, each with a small tag (the site overview camera) */
  all?: boolean;
  /** tag texts for `all`, in ROI order (default: each ROI's suggestion) */
  tags?: string[];
  /** crop tighter than cover, around the focus object (1 = plain cover) */
  zoom?: number;
  /** where in the frame the focus object should sit, as fractions (default: where it sits in the photograph) */
  at?: readonly [number, number];
}) {
  const p = getPhoto(slug);
  if (!p) {
    return (
      <div className={cx("scene grid place-items-center", className)}>
        <span className="t-label text-white/35">Photo · {slug}</span>
      </div>
    );
  }
  const roi = p.rois.find((r) => r.kind === "thermal") ?? p.rois[0];
  const flipBox = (b: readonly number[]) => (mirror ? ([1 - b[0] - b[2], b[1], b[2], b[3]] as const) : b);
  const box = roi ? flipBox(roi.box) : undefined;
  const marks = (all ? p.rois.filter((r) => r.kind === "thermal") : roi ? [roi] : []).map((r) => ({ r, b: flipBox(r.box) }));
  const flip = mirror ? { transform: "scaleX(-1)" } : undefined;
  // Cover-crop around the focus object: with object-position = the box center, that center stays
  // inside the frame at every aspect ratio, so the infrared and the alert are never cropped away.
  const [fx, fy] = box ? [box[0] + box[2] / 2, box[1] + box[3] / 2] : mirror ? [1 - p.focal[0], p.focal[1]] : p.focal;
  const style = { "--ar": (p.width / p.height).toFixed(5), "--fx": fx.toFixed(4), "--fy": fy.toFixed(4), ...(zoom ? { "--z": zoom } : null), ...(at ? { "--px": at[0], "--py": at[1] } : null) } as CSSProperties;
  const side = sideProp ?? (box && box[0] + box[2] / 2 < 0.56 ? "right" : "left");
  const lead = box
    ? ({ "--cx": box[0] + box[2] / 2, "--bt": box[1] + box[3] * 0.1, "--bb": box[1] + box[3] * 0.9 } as CSSProperties)
    : undefined;
  const anchor = box
    ? ({ "--ax": side === "right" ? box[0] + box[2] * 0.9 : box[0] + box[2] * 0.1, "--ay": box[1] + box[3] * 0.42 } as CSSProperties)
    : undefined;

  return (
    <div className={cx("scene", className)} style={style} data-at={at ? "" : undefined}>
      <div className="scene-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.src}
          srcSet={p.thumb ? `${p.thumb} 960w, ${p.src} ${p.width}w` : undefined}
          sizes={p.thumb ? sizes : undefined}
          alt={p.alt}
          width={p.width}
          height={p.height}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          decoding="async"
          className="inset-0 h-full w-full"
          style={flip}
        />
        {infrared
          ? marks.map(({ r, b }) =>
              r.overlay ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={r.key}
                  src={r.overlay}
                  alt=""
                  aria-hidden
                  loading={eager ? "eager" : "lazy"}
                  decoding="async"
                  style={{ left: `${b[0] * 100}%`, top: `${b[1] * 100}%`, width: `${b[2] * 100}%`, height: `${b[3] * 100}%`, ...flip }}
                />
              ) : null,
            )
          : null}
        {brackets
          ? marks.map(({ r, b }) => (
              <span
                key={r.key}
                aria-hidden
                className="scene-brackets"
                style={{
                  left: `${(b[0] + b[2] * 0.1) * 100}%`,
                  top: `${(b[1] + b[3] * 0.1) * 100}%`,
                  width: `${b[2] * 0.8 * 100}%`,
                  height: `${b[3] * 0.8 * 100}%`,
                }}
              />
            ))
          : null}
      </div>

      {shade ? <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]" style={{ background: shade }} /> : null}

      {all
        ? marks.map(({ r, b }, k) => (
            <span key={r.key} className="scene-tag" style={{ "--tx": b[0] + b[2] * 0.1, "--ty": b[1] + b[3] * 0.1 } as CSSProperties}>
              {tags?.[k] ?? r.suggestion}
            </span>
          ))
        : null}

      {label ? (
        <span className="t-label absolute top-3 left-3 z-[2] rounded-[4px] bg-black/55 px-1.5 py-1 text-[10px] text-white/80 backdrop-blur-[2px]">{label}</span>
      ) : null}

      {card && box && callout ? (
        <>
          <span aria-hidden className="scene-lead" data-place={callout} style={lead} />
          <div className="scene-callout" data-place={callout} style={lead}>
            <div className="flex items-start gap-2.5 rounded-[8px] border border-white/15 bg-[#121211]/88 px-3 py-2.5 text-white shadow-[0_18px_44px_-20px_rgba(0,0,0,.8)] backdrop-blur-[6px]">
              <TriangleAlert className="mt-[2px] h-4 w-4 flex-none text-orange" strokeWidth={2.1} aria-hidden />
              <span className="min-w-0">
                <span className="block text-[14px] leading-snug font-semibold tracking-[-0.01em]">{card.title}</span>
                <span className="mt-0.5 block text-[12px] leading-snug text-white/60">{card.meta}</span>
              </span>
            </div>
          </div>
        </>
      ) : card && box ? (
        <div className="scene-card" data-side={side} style={anchor}>
          <div className="rounded-[9px] border border-white/12 bg-[#121211]/90 px-3.5 py-3 text-white shadow-[0_18px_44px_-20px_rgba(0,0,0,.8)] backdrop-blur-[6px]">
            <p className="t-label flex items-center gap-2 text-[10px] text-white/55">
              <span className={cx("h-1.5 w-1.5 flex-none rounded-full", card.kind === "reading" ? "bg-white/70" : "bg-orange")} aria-hidden />
              <span className="truncate">{card.meta}</span>
            </p>
            <p className="mt-1.5 flex items-start gap-2 text-[14px] leading-snug font-semibold tracking-[-0.01em]">
              {card.kind === "reading" ? (
                <Gauge className="mt-[2px] h-[15px] w-[15px] flex-none text-white/80" strokeWidth={2} aria-hidden />
              ) : (
                <TriangleAlert className="mt-[2px] h-[15px] w-[15px] flex-none text-orange" strokeWidth={2.1} aria-hidden />
              )}
              <span>{card.title}</span>
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
