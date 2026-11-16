import map from "@/content/map.json";
import { MARKET } from "@/content/deck";
import { cx } from "@/lib/cx";

/**
 * Dot map of the two markets: North America and Europe, Eastern Europe included
 * (scripts/make-map.cjs, Natural Earth). Target markets only, never coverage claims.
 * Labels sit on the map from sm up; on phones they move below it.
 */
export function CoverageMap({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const dark = tone === "dark";
  const [na, eu] = MARKET.regions;
  return (
    <div className={cx("w-full", className)}>
      <div className="relative w-full" style={{ aspectRatio: `${map.w} / ${map.h}` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/img/map-${tone}.svg`}
          alt="Dot map highlighting Enlight Layer's two markets: North America and Europe"
          className="absolute inset-0 h-full w-full select-none"
          draggable={false}
          loading="lazy"
        />
        <div className="hidden sm:block">
          <MapLabel x={map.labels.NA[0]} y={map.labels.NA[1] + 8} {...na} dark={dark} />
          <MapLabel x={map.labels.EU[0] - 3} y={map.labels.EU[1] + 20} {...eu} dark={dark} />
        </div>
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-2 sm:hidden">
        {MARKET.regions.map((r) => (
          <li key={r.title} className={cx("rounded-[6px] border px-3 py-2", dark ? "border-white/20" : "border-ink/10 bg-white/90")}>
            <p className="flex items-center gap-1.5 text-[13px] leading-tight font-semibold">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-orange" />
              {r.title}
            </p>
            <p className="muted mt-0.5 text-[11.5px] leading-tight">{r.sub}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MapLabel({ x, y, title, sub, dark }: { x: number; y: number; title: string; sub: string; dark: boolean }) {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
      <div
        className={cx(
          "rounded-[6px] border px-3 py-2 whitespace-nowrap shadow-[0_8px_24px_rgba(0,0,0,0.18)]",
          dark ? "border-white/20 bg-night/85 text-white" : "border-ink/10 bg-white/95 text-ink",
        )}
      >
        <p className="text-[13px] leading-tight font-semibold">{title}</p>
        <p className={cx("mt-0.5 text-[11px] leading-tight", dark ? "text-white/65" : "text-muted")}>{sub}</p>
      </div>
    </div>
  );
}
