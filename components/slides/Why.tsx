import { WHY } from "@/content/deck";
import { Slide } from "../Slide";
import { TaskReel } from "../TaskReel";

/** Watching a site is thousands of small calls: three task reels and an endless line of them. */
export function Why({ n }: { n: number }) {
  const starts = WHY.reels.map((_, r) => 1 + WHY.reels.slice(0, r).reduce((k, x) => k + x.length, 0));
  const line = [...WHY.ticker, ...WHY.ticker];
  return (
    <Slide id="why" n={n} label={WHY.kicker} tone="dark">
      <div className="mt-[clamp(10px,2.4vh,30px)] grid gap-4 lg:grid-cols-12 lg:items-end lg:gap-12">
        <h2 className="t-title rise lg:col-span-7">{WHY.title}</h2>
        <p className="t-lead rise text-white/70 lg:col-span-5" style={{ "--d": 1 } as React.CSSProperties}>
          {WHY.text}
        </p>
      </div>

      <div className="fade-in mt-[clamp(14px,3vh,36px)] grid flex-1 gap-[clamp(6px,.6vw,10px)] sm:grid-cols-3 lg:min-h-0">
        {WHY.reels.map((scenes, r) => (
          <div key={r} className="aspect-[4/5] sm:aspect-auto sm:min-h-[300px] lg:min-h-0">
            <TaskReel scenes={scenes} start={starts[r]} offset={r * 1700} />
          </div>
        ))}
      </div>

      <div className="relative mt-[clamp(10px,1.8vh,16px)] overflow-hidden" aria-label={WHY.more}>
        <div className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-16 bg-gradient-to-r from-night to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[2] w-16 bg-gradient-to-l from-night to-transparent" />
        <ul className="task-ticker flex w-max gap-2">
          {line.map((t, k) => (
            <li key={k} aria-hidden={k >= WHY.ticker.length} className="rounded-full border border-white/15 px-3 py-1 text-[13px] whitespace-nowrap text-white/65">
              {t}
            </li>
          ))}
        </ul>
      </div>
      <p className="t-label mt-2.5 text-white/40">{WHY.more}</p>
    </Slide>
  );
}
