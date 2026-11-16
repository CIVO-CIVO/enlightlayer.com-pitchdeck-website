import type { LucideIcon } from "lucide-react";
import { ArrowRight, Building2, Droplets, Factory, Gauge, HardHat, Lock, Tractor } from "lucide-react";
import { FOCUS, GROUPS, SERVICES, servicesIn, type GroupId } from "@/content/deck";
import { Slide } from "../Slide";
import { PlaceCard } from "./Ideas";

const ICON: Record<GroupId, LucideIcon> = {
  rounds: Gauge,
  people: HardHat,
  theft: Lock,
  water: Droplets,
  buildings: Building2,
  production: Factory,
  farms: Tractor,
};

/** The seven areas as photo cards, each listing its services and linking to its slide. */
export function Overview({ n }: { n: number }) {
  return (
    <Slide id="services" n={n} label={FOCUS.kicker} tone="paper-2">
      <div className="mt-[clamp(10px,2.4vh,30px)] grid gap-4 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <h2 className="t-title rise">{FOCUS.title}</h2>
          <p className="t-lead muted rise mt-2" style={{ "--d": 1 } as React.CSSProperties}>
            {FOCUS.text}
          </p>
        </div>
        <ul className="rise flex flex-wrap gap-2 lg:col-span-4 lg:justify-end" style={{ "--d": 2 } as React.CSSProperties} aria-label="What the layer does">
          {FOCUS.tags.map((t) => (
            <li key={t} className="panel rounded-full px-4 py-2 text-[14px] leading-none 2xl:text-[15.5px]">
              {t}
            </li>
          ))}
        </ul>
      </div>

      <ul className="mt-[clamp(14px,2.8vh,32px)] grid flex-1 gap-[clamp(10px,1.1vw,16px)] sm:grid-cols-2 lg:min-h-0 lg:grid-cols-4 lg:grid-rows-2">
        {GROUPS.map((g, k) => (
          <PlaceCard
            key={g.id}
            p={{ id: g.id, name: g.name, photo: FOCUS.photos[g.id], items: servicesIn(g.id).map((s) => s.short), main: g.id === FOCUS.main }}
            icon={ICON[g.id]}
            href={`#${g.id}`}
            n={k + 1}
            big={k === 0}
            className={k === 0 ? "sm:col-span-2" : undefined}
            sizes={k === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
          />
        ))}
      </ul>

      <p className="t-label muted rise mt-[clamp(10px,2vh,20px)] flex flex-wrap items-center gap-x-5 gap-y-2" style={{ "--d": 9 } as React.CSSProperties}>
        <span>
          {SERVICES.length} services · {GROUPS.length} areas · one layer
        </span>
        <span className="inline-flex items-center gap-1.5">
          Each area follows <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </span>
      </p>
    </Slide>
  );
}
