import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Building2,
  CircleParking,
  Factory,
  Flame,
  HardHat,
  Luggage,
  Moon,
  Package,
  PawPrint,
  PlugZap,
  Recycle,
  Sailboat,
  School,
  ShoppingBag,
  SprayCan,
  Sprout,
  Tent,
  Tractor,
  Warehouse,
  WashingMachine,
} from "lucide-react";
import { IDEAS, MORE_IDEAS } from "@/content/deck";
import { cx } from "@/lib/cx";
import { Scene } from "../Scene";
import { Slide } from "../Slide";

const pad = (n: number) => String(n).padStart(2, "0");
const ICON: Record<string, LucideIcon> = {
  sites: HardHat,
  storage: Warehouse,
  shops: ShoppingBag,
  homes: Building2,
  production: Factory,
  farms: Tractor,
  selfservice: WashingMachine,
  night: Moon,
  recycling: Recycle,
  parking: CircleParking,
  school: School,
  lobby: Luggage,
  heritage: Flame,
  graffiti: SprayCan,
  greenhouse: Sprout,
  boat: Sailboat,
  chargers: PlugZap,
  selfstorage: Package,
  stable: PawPrint,
  campsite: Tent,
};

type Place = { id: string; name: string; photo: string; items: readonly string[]; main?: boolean };

// the photograph stops short of the card bottom and fades into it, so the marked problem sits above the text
const SHADE =
  "linear-gradient(0deg, rgba(18,18,17,1) 0%, rgba(18,18,17,.6) 24%, rgba(18,18,17,0) 52%), linear-gradient(180deg, rgba(18,18,17,.5) 0%, rgba(18,18,17,0) 22%)";

/** A kind of place as a photo card: the problem marked in the photograph, the examples over the bottom. */
export function PlaceCard({
  p,
  n,
  big,
  className,
  sizes,
  icon,
  href,
}: {
  p: Place;
  n: number;
  big?: boolean;
  className?: string;
  sizes: string;
  icon?: LucideIcon;
  href?: string;
}) {
  const Icon = icon ?? ICON[p.id];
  return (
    <li
      className={cx("rise relative min-h-[250px] overflow-hidden rounded-[14px] bg-night text-white lg:min-h-0", className)}
      style={{ "--d": n } as React.CSSProperties}
    >
      <Scene slug={p.photo} label={null} shade={SHADE} sizes={sizes} className="!absolute inset-x-0 top-0 bottom-[clamp(44px,14%,84px)] w-full" />
      {href ? <a href={href} aria-label={p.name} className="absolute inset-0 z-[4] rounded-[14px]" /> : null}
      <p className="t-label absolute top-[clamp(10px,1.6vh,16px)] left-[clamp(12px,1.3vw,20px)] z-[3] flex items-center gap-2.5 text-white/75">
        <span className="tabular-nums">{pad(n)}</span>
        {p.main ? <span className="rounded-[3px] bg-orange px-1.5 py-[3px] text-white">Main focus</span> : null}
      </p>
      <div className="absolute inset-x-0 bottom-0 z-[3] p-[clamp(12px,1.3vw,20px)]">
        <h3
          className={cx(
            "flex items-center gap-2 leading-[1.05] font-semibold tracking-[-0.03em]",
            big ? "text-[clamp(1.35rem,min(2.1vw,3.6vh),2.2rem)]" : "text-[clamp(1.05rem,min(1.35vw,2.5vh),1.45rem)]",
          )}
        >
          <Icon className="h-[0.8em] w-[0.8em] flex-none" strokeWidth={1.9} aria-hidden />
          {p.name}
        </h3>
        <p className={cx("mt-1.5 leading-snug text-white/75", big ? "text-[clamp(.85rem,1vw,1.05rem)]" : "text-[clamp(.8rem,.92vw,.95rem)]")}>
          {p.items.join(" · ")}
        </p>
      </div>
    </li>
  );
}

/** Everyday ideas: seven kinds of places, each a photograph with the problem marked. Static, so the PDF shows all of it. */
export function Ideas({ n }: { n: number }) {
  return (
    <Slide id="ideas" n={n} label={IDEAS.kicker} tone="paper-2">
      <div className="mt-[clamp(10px,2.4vh,30px)] grid gap-4 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <h2 className="t-title rise">{IDEAS.title}</h2>
          <p className="t-lead muted rise mt-2" style={{ "--d": 1 } as React.CSSProperties}>
            {IDEAS.text}
          </p>
        </div>
        <ul className="rise flex flex-wrap gap-2 lg:col-span-4 lg:justify-end" style={{ "--d": 2 } as React.CSSProperties} aria-label="What they catch">
          {IDEAS.tags.map((t) => (
            <li key={t} className="panel rounded-full px-4 py-2 text-[14px] leading-none 2xl:text-[15.5px]">
              {t}
            </li>
          ))}
        </ul>
      </div>

      <ul className="mt-[clamp(14px,2.8vh,32px)] grid flex-1 gap-[clamp(10px,1.1vw,16px)] sm:grid-cols-2 lg:min-h-0 lg:grid-cols-4 lg:grid-rows-2">
        {IDEAS.groups.map((p, k) => (
          <PlaceCard
            key={p.id}
            p={p}
            n={k + 1}
            big={k === 0}
            className={k === 0 ? "sm:col-span-2" : undefined}
            sizes={k === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
          />
        ))}
      </ul>
    </Slide>
  );
}

/** Near the end: one more place as a photograph, a wall of smaller ideas, and an invitation to bring your own. */
export function MoreIdeas({ n }: { n: number }) {
  const night = MORE_IDEAS.night;
  return (
    <Slide id="more-ideas" n={n} label={MORE_IDEAS.kicker} tone="paper-2">
      <div className="mt-[clamp(10px,2.4vh,30px)] grid gap-4 lg:grid-cols-12 lg:items-end">
        <h2 className="t-title rise lg:col-span-6">{MORE_IDEAS.title}</h2>
        <p className="t-lead muted rise lg:col-span-5 lg:col-start-8" style={{ "--d": 1 } as React.CSSProperties}>
          {MORE_IDEAS.text}
        </p>
      </div>

      <div className="mt-[clamp(14px,2.8vh,32px)] grid flex-1 gap-[clamp(10px,1.1vw,16px)] lg:min-h-0 lg:grid-cols-12">
        <ul className="grid lg:col-span-5">
          <PlaceCard p={night} n={IDEAS.groups.length + 1} big sizes="(min-width: 1024px) 40vw, 100vw" />
        </ul>
        <ul className="grid gap-[clamp(8px,0.9vw,12px)] sm:grid-cols-2 lg:col-span-7 lg:grid-cols-3">
          {MORE_IDEAS.ideas.map((x, k) => {
            const Icon = ICON[x.id];
            return (
              <li key={x.id} className="rise panel rounded-[12px] p-[clamp(10px,1.5vh,16px)]" style={{ "--d": 2 + (k % 6) } as React.CSSProperties}>
                <p className="t-label muted flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 flex-none text-orange" strokeWidth={2} aria-hidden />
                  {x.place}
                </p>
                <p className="mt-1.5 text-[clamp(.9rem,min(1.1vw,2.1vh),1.12rem)] leading-snug font-medium tracking-[-0.01em]">{x.text}</p>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-col gap-3 pt-[clamp(14px,2.8vh,30px)] lg:flex-row lg:items-center lg:justify-between">
        <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] font-medium lg:flex-none" aria-label="How it works">
          {MORE_IDEAS.how.map((h, k) => (
            <li key={h} className="flex items-center gap-3">
              <span className="t-label muted tabular-nums">{pad(k + 1)}</span>
              {h}
              {k < MORE_IDEAS.how.length - 1 ? <ArrowRight className="muted h-3.5 w-3.5" aria-hidden /> : null}
            </li>
          ))}
        </ol>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] lg:justify-end lg:text-right">
          <span className="muted">{MORE_IDEAS.fine}</span>
          <a href="#contact" className="font-semibold underline underline-offset-4">
            {MORE_IDEAS.cta}
          </a>
        </p>
      </div>
    </Slide>
  );
}
