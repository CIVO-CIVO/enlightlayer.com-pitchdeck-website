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
  const box = roi?.box;
  // Cover-crop around the focus object: with object-position = the box centre, that centre stays
  // inside the frame at every aspect ratio, so the infrared and the alert are never cropped away.
  const [fx, fy] = box ? [box[0] + box[2] / 2, box[1] + box[3] / 2] : p.focal;
  const style = { "--ar": (p.width / p.height).toFixed(5), "--fx": fx.toFixed(4), "--fy": fy.toFixed(4) } as CSSProperties;
  const side = box && box[0] + box[2] / 2 < 0.56 ? "right" : "left";
  const anchor = box
    ? ({ "--ax": side === "right" ? box[0] + box[2] * 0.9 : box[0] + box[2] * 0.1, "--ay": box[1] + box[3] * 0.42 } as CSSProperties)
    : undefined;

  return (
    <div className={cx("scene", className)} style={style}>
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
        />
        {infrared && box && roi?.overlay ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={roi.overlay}
            alt=""
            aria-hidden
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            style={{ left: `${box[0] * 100}%`, top: `${box[1] * 100}%`, width: `${box[2] * 100}%`, height: `${box[3] * 100}%` }}
          />
        ) : null}
        {brackets && box ? (
          <span
            aria-hidden
            className="scene-brackets"
            style={{
              left: `${(box[0] + box[2] * 0.1) * 100}%`,
              top: `${(box[1] + box[3] * 0.1) * 100}%`,
              width: `${box[2] * 0.8 * 100}%`,
              height: `${box[3] * 0.8 * 100}%`,
            }}
          />
        ) : null}
      </div>

      {shade ? <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]" style={{ background: shade }} /> : null}

      {label ? (
        <span className="t-label absolute top-3 left-3 z-[2] rounded-[4px] bg-black/55 px-1.5 py-1 text-[10px] text-white/80 backdrop-blur-[2px]">{label}</span>
      ) : null}

      {card && box ? (
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
