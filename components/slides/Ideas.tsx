import { ArrowRight, Building2, Factory, HardHat, Moon, ShoppingBag, Tractor, Warehouse, WashingMachine } from "lucide-react";
import { IDEAS } from "@/content/deck";
import { Slide } from "../Slide";

const pad = (n: number) => String(n).padStart(2, "0");
const ICON = {
  sites: HardHat,
  shops: ShoppingBag,
  homes: Building2,
  storage: Warehouse,
  production: Factory,
  farms: Tractor,
  selfservice: WashingMachine,
  night: Moon,
} as const;

/** Everyday ideas: what an ordinary camera can already catch, by the kind of place. Static, so the PDF shows all of it. */
export function Ideas({ n }: { n: number }) {
  return (
    <Slide id="ideas" n={n} label={IDEAS.kicker} tone="paper-2">
      <div className="mt-[clamp(14px,3vh,36px)] grid gap-5 lg:grid-cols-12 lg:items-end">
        <h2 className="t-title rise lg:col-span-6">{IDEAS.title}</h2>
        <p className="t-lead muted rise lg:col-span-5 lg:col-start-8" style={{ "--d": 1 } as React.CSSProperties}>
          {IDEAS.text}
        </p>
      </div>

      {/* the cards sit centred in the space left on tall screens */}
      <div className="flex flex-1 flex-col justify-center pt-[clamp(14px,3vh,32px)]">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {IDEAS.groups.map((g, k) => {
            const Icon = ICON[g.id as keyof typeof ICON];
            return (
              <li key={g.id} className="rise panel rounded-[12px] p-[clamp(12px,2vh,20px)]" style={{ "--d": 2 + k } as React.CSSProperties}>
                <div className="flex items-center gap-2.5">
                  <Icon className="h-[18px] w-[18px] flex-none text-orange" strokeWidth={1.8} aria-hidden />
                  <h3 className="text-[clamp(.98rem,1.15vw,1.12rem)] leading-tight font-semibold tracking-[-0.018em]">{g.name}</h3>
                </div>
                <p className="t-label muted mt-1.5">{g.who}</p>
                <ul className="mt-[clamp(8px,1.4vh,14px)] grid gap-[clamp(4px,0.8vh,8px)]">
                  {g.items.map((t) => (
                    <li key={t} className="flex gap-2 text-[13.5px] leading-snug 2xl:text-[15px]">
                      <span aria-hidden className="mt-[7px] h-[5px] w-[5px] flex-none rounded-full bg-current opacity-35" />
                      {t}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-col gap-3 pt-[clamp(14px,3vh,32px)] lg:flex-row lg:items-center lg:justify-between">
        <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] font-medium" aria-label="How it works">
          {IDEAS.how.map((h, k) => (
            <li key={h} className="flex items-center gap-3">
              <span className="t-label muted tabular-nums">{pad(k + 1)}</span>
              {h}
              {k < IDEAS.how.length - 1 ? <ArrowRight className="muted h-3.5 w-3.5" aria-hidden /> : null}
            </li>
          ))}
        </ol>
        <p className="muted text-[13px]">{IDEAS.fine}</p>
      </div>
    </Slide>
  );
}
