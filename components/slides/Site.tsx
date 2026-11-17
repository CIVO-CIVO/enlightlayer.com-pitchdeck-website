import type { LucideIcon } from "lucide-react";
import { ClipboardCheck, Construction, HardHat, Radius, TriangleAlert, Truck, UserX } from "lucide-react";
import { SITE } from "@/content/deck";
import { Scene } from "../Scene";
import { Slide } from "../Slide";

const CHECK_ICON: LucideIcon[] = [HardHat, Radius, Construction, UserX, Truck, ClipboardCheck];

/**
 * Building sites as one operation: every camera on the site in one view. A wide overview
 * camera with several situations marked at once, three more cameras below it, the checks
 * on the left and an example HSE log under the wall.
 */
export function Site({ n, label }: { n: number; label: string }) {
  const main = SITE.overview;
  return (
    <Slide id={SITE.id} n={n} label={label} tone="dark">
      <div className="mt-[clamp(10px,2.4vh,30px)] grid flex-1 gap-8 lg:min-h-0 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col lg:col-span-4">
          <h2 className="t-title rise">{SITE.title}</h2>
          <p className="t-lead rise mt-3 text-white/70 [@media(min-width:1024px)_and_(max-height:760px)]:text-[1rem]" style={{ "--d": 1 } as React.CSSProperties}>
            {SITE.text}
          </p>
          <ul className="mt-[clamp(12px,2.6vh,28px)] border-t border-white/12" aria-label="What the layer checks">
            {SITE.checks.map((c, k) => {
              const Icon = CHECK_ICON[k];
              return (
                <li
                  key={c.title}
                  className="rise grid grid-cols-[1.75rem_1fr] items-start border-b border-white/12 py-[clamp(7px,1.25vh,12px)]"
                  style={{ "--d": 2 + k } as React.CSSProperties}
                >
                  <Icon className="mt-0.5 h-[17px] w-[17px] text-orange" strokeWidth={1.8} aria-hidden />
                  <p className="text-[clamp(.86rem,1vw,.98rem)] leading-snug">
                    <span className="font-semibold">{c.title}.</span> <span className="text-white/60">{c.text}</span>
                  </p>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-[12px] leading-snug text-white/45">{SITE.note}</p>
        </div>

        <figure className="fade-in flex flex-col lg:col-span-8 lg:min-h-0">
          <div className="flex flex-1 flex-col gap-[6px] rounded-[12px] bg-black/45 p-[6px] lg:min-h-0">
            <div className="relative aspect-[4/3] sm:aspect-[16/8] lg:aspect-auto lg:min-h-0 lg:flex-1">
              <Scene slug={main.slug} all tags={main.tags} label={main.cam} className="absolute inset-0 h-full w-full rounded-[7px]" sizes="(min-width: 1024px) 60vw, 100vw" eager />
              <span className="t-label pointer-events-none absolute top-3 right-3 z-[4] flex items-center gap-1.5 rounded-[4px] bg-orange px-1.5 py-1 text-[10px] text-white">
                <TriangleAlert className="h-3 w-3" strokeWidth={2.2} aria-hidden />
                {main.tags.length} open
              </span>
            </div>
            <ul className="grid grid-cols-2 gap-[6px] lg:grid-cols-4">
              {SITE.feeds.map((f) => (
                <li key={f.slug} className="flex min-w-0 flex-col">
                  <Scene slug={f.slug} label={null} className="aspect-[16/10] w-full rounded-[6px]" sizes="(min-width: 1024px) 15vw, 50vw" />
                  <p className="px-1 pt-1.5 pb-0.5">
                    <span className="t-label block truncate text-[9.5px] text-white/45">{f.cam}</span>
                    <span className="mt-0.5 flex items-start gap-1.5 text-[12px] leading-tight font-semibold 2xl:text-[13px]">
                      <TriangleAlert className="mt-px h-3 w-3 flex-none text-orange" strokeWidth={2.2} aria-hidden />
                      {f.alert}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <figcaption className="mt-[clamp(8px,1.4vh,12px)] flex flex-wrap items-baseline gap-x-4 gap-y-1.5 text-[12.5px] leading-snug text-white/60">
            <span className="t-label text-white/40">{SITE.logLabel}</span>
            {SITE.log.map((e) => (
              <span key={e.time} className="whitespace-nowrap">
                <span className="font-mono text-[11.5px] text-orange tabular-nums">{e.time}</span> {e.text}
              </span>
            ))}
          </figcaption>
        </figure>
      </div>
    </Slide>
  );
}
