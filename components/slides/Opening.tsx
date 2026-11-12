import { ArrowDown, ArrowRight } from "lucide-react";
import { COVER, FLAGSHIP, FOCUS, GROUPS, PROBLEM, SERVICES, SOLUTION, servicesIn } from "@/content/deck";
import { cx } from "@/lib/cx";
import { Scene } from "../Scene";
import { Slide } from "../Slide";
import { Stack } from "../Stack";

const pad = (n: number) => String(n).padStart(2, "0");

/* ── 01 · Cover ──────────────────────────────────────────────────────────── */
export function Cover({ n }: { n: number }) {
  return (
    <Slide
      id="cover"
      n={n}
      label="Pitch deck"
      tone="dark"
      backdrop={
        <Scene
          slug={COVER.photo}
          card={COVER.card}
          eager
          label={null}
          sizes="100vw"
          className="!absolute inset-0 -z-10 h-full w-full"
          shade="linear-gradient(90deg, rgba(18,18,17,.9) 0%, rgba(18,18,17,.7) 30%, rgba(18,18,17,.12) 58%, rgba(18,18,17,0) 76%), linear-gradient(0deg, rgba(18,18,17,.8) 0%, rgba(18,18,17,0) 42%)"
        />
      }
    >
      <div className="mt-auto max-w-[min(100%,46rem)] pt-[24vh] lg:pt-0">
        <h1 className="t-cover">
          <span className="mask-line">
            <span>Enlight</span>
          </span>
          <span className="mask-line">
            <span style={{ "--d": 1 } as React.CSSProperties}>Layer</span>
          </span>
        </h1>
        <p className="t-lead rise mt-6 max-w-[34rem] text-white/80" style={{ "--d": 4 } as React.CSSProperties}>
          {COVER.tagline}
        </p>
        <div className="rise mt-8 flex flex-wrap items-center gap-3" style={{ "--d": 6 } as React.CSSProperties}>
          <a href="#problem" className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[14.5px] font-semibold text-ink hover:bg-white/90">
            Start the deck
            <ArrowDown className="h-4 w-4" strokeWidth={2} aria-hidden />
          </a>
          <a
            href="#services"
            className="inline-flex h-11 items-center rounded-full border border-white/30 px-5 text-[14.5px] font-medium text-white hover:bg-white/10"
          >
            Jump to the services
          </a>
        </div>
        <p className="t-label rise mt-10 flex flex-wrap gap-x-6 gap-y-2 text-white/50" style={{ "--d": 8 } as React.CSSProperties}>
          <span>{COVER.markets}</span>
          <span className="hidden lg:inline">← → or Space to move · F to present</span>
        </p>
      </div>
    </Slide>
  );
}

/* ── 02 · Problem: a wall of feeds, one problem in progress ──────────────── */
const WALL = ["substations", "garage-flood", "robot-cells", "marinas", "pump-stations", "rental-yards", "waste-fire", "ferry-docks", "livestock-barns"];
const WALL_HOT = 4;

export function Problem({ n }: { n: number }) {
  return (
    <Slide id="problem" n={n} label="The problem" tone="paper">
      <div className="mt-[clamp(18px,4vh,48px)] grid flex-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <h2 className="t-slide">
            <span className="mask-line">
              <span>Cameras record.</span>
            </span>
            <span className="mask-line">
              <span style={{ "--d": 1 } as React.CSSProperties}>Nobody watches.</span>
            </span>
          </h2>
          <ol className="mt-[clamp(20px,4.5vh,44px)] grid gap-[clamp(14px,2.6vh,24px)]">
            {PROBLEM.points.map((p, k) => (
              <li
                key={p.title}
                className="rise hairline grid grid-cols-[2.25rem_1fr] border-t pt-[clamp(10px,2vh,16px)]"
                style={{ "--d": 3 + k } as React.CSSProperties}
              >
                <span className="t-label muted pt-1 tabular-nums">{pad(k + 1)}</span>
                <div>
                  <p className="text-[clamp(1.05rem,1.4vw,1.25rem)] leading-tight font-semibold tracking-[-0.02em]">{p.title}</p>
                  <p className="muted mt-1.5 text-[clamp(.9rem,1.05vw,1rem)] leading-snug">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <figure className="lg:col-span-7">
          <div className="grid grid-cols-3 gap-[clamp(4px,.5vw,8px)] rounded-[12px] bg-night p-[clamp(4px,.5vw,8px)]">
            {WALL.map((slug, k) => (
              <Scene
                key={slug}
                slug={slug}
                label={`CAM ${pad(k + 1)}`}
                infrared={k === WALL_HOT}
                brackets={k === WALL_HOT}
                sizes="(min-width: 1024px) 18vw, 32vw"
                className={cx("aspect-[16/10] rounded-[6px]", k !== WALL_HOT && "opacity-90")}
              />
            ))}
          </div>
          <figcaption className="muted mt-3 flex items-center gap-2 text-[13px]">
            <span className="h-1.5 w-1.5 rounded-full bg-orange" aria-hidden />
            Nine feeds. One problem in progress — and nobody looking at CAM {pad(WALL_HOT + 1)}.
          </figcaption>
        </figure>
      </div>
    </Slide>
  );
}

/* ── 03 · Solution: the layer stack ──────────────────────────────────────── */
export function Solution({ n }: { n: number }) {
  return (
    <Slide id="solution" n={n} label="What we do" tone="paper-2">
      <div className="mt-[clamp(18px,4vh,48px)] grid flex-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <h2 className="t-slide rise">{SOLUTION.title}</h2>
          <p className="t-lead muted rise mt-6" style={{ "--d": 2 } as React.CSSProperties}>
            {SOLUTION.text}
          </p>
          <ul className="rise mt-8 grid gap-2.5 text-[15px]" style={{ "--d": 3 } as React.CSSProperties}>
            {["Custom-built for each problem", "Existing cameras first", "An alert with the picture — not a video wall"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="h-px w-5 bg-current opacity-50" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="fade-in w-full lg:col-span-8 lg:max-w-[min(100%,calc((100svh-200px)/0.9))] lg:justify-self-end">
          <Stack
            slug={SOLUTION.photo}
            alert={SOLUTION.alert}
            sensors={[
              { x: 0.1, y: 0.16, kind: "camera", label: "Existing camera", cone: { spread: 34, reach: 0.62 } },
              { x: 0.9, y: 0.22, kind: "thermal", label: "Thermal camera", cone: { spread: 26, reach: 0.5 } },
              { x: 0.86, y: 0.84, kind: "gateway", label: "Edge gateway" },
            ]}
          />
        </div>
      </div>
    </Slide>
  );
}

/* ── 04 · Focus: niche on purpose + the index of all services ────────────── */
export function Focus({ n }: { n: number }) {
  return (
    <Slide id="services" n={n} label="Our services" tone="dark">
      <div className="mt-[clamp(18px,4vh,44px)] grid gap-6 lg:grid-cols-12 lg:items-end">
        <h2 className="t-slide rise lg:col-span-5">{FOCUS.title}</h2>
        <p className="t-lead rise text-white/70 lg:col-span-6 lg:col-start-7" style={{ "--d": 2 } as React.CSSProperties}>
          {FOCUS.text}
        </p>
      </div>
      <div className="mt-[clamp(22px,5vh,52px)] grid flex-1 grid-cols-2 content-start gap-x-5 gap-y-7 sm:grid-cols-4 xl:grid-cols-7">
        {GROUPS.map((g, k) => (
          <section key={g.id} className="rise border-t border-white/15 pt-3" style={{ "--d": 3 + k } as React.CSSProperties} aria-labelledby={`idx-${g.id}`}>
            <p className="t-label text-white/55 tabular-nums">{pad(k + 1)}</p>
            <h3 id={`idx-${g.id}`} className="mt-1 text-[15px] leading-tight font-semibold tracking-[-0.015em] 2xl:text-[18px]">
              <a href={`#${g.id}`} className="hover:underline hover:underline-offset-4">
                {g.name}
              </a>
            </h3>
            <ul className="mt-3 grid gap-1.5 2xl:gap-2.5">
              {servicesIn(g.id).map((s) => (
                <li key={s.id}>
                  <a href={`#svc-${s.id}`} className="group flex items-start gap-2 text-[13.5px] leading-snug text-white/70 hover:text-white 2xl:text-[15.5px]">
                    <span className="mt-[7px] h-[5px] w-[5px] flex-none rounded-full bg-white/30 group-hover:bg-orange" aria-hidden />
                    {s.short}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="t-label rise mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-white/60" style={{ "--d": 10 } as React.CSSProperties}>
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

/* ── 05 · Flagship: old equipment online at about 1/25 of the price ──────── */
export function Flagship({ n }: { n: number }) {
  const max = Math.max(...FLAGSHIP.compare.map((c) => c.value));
  return (
    <Slide id="old-equipment" n={n} label={FLAGSHIP.kicker} tone="paper">
      <div className="mt-[clamp(18px,4vh,44px)] grid flex-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col lg:col-span-6">
          <h2 className="t-slide rise">{FLAGSHIP.title}</h2>
          <p className="t-lead muted rise mt-5 max-w-[36rem]" style={{ "--d": 2 } as React.CSSProperties}>
            {FLAGSHIP.text}
          </p>

          <figure className="rise mt-[clamp(20px,4.5vh,44px)]" style={{ "--d": 3 } as React.CSSProperties}>
            <figcaption className="t-label muted">Cost to get one old panel online</figcaption>
            <div className="mt-3 grid gap-4">
              {FLAGSHIP.compare.map((c, k) => (
                <div key={c.label}>
                  <div className="flex items-baseline justify-between gap-4 text-[14.5px]">
                    <span className="font-semibold">{c.label}</span>
                    <span className="t-label tabular-nums">{c.value === 1 ? "1×" : `≈ ${c.value}×`}</span>
                  </div>
                  <div className="mt-1.5 h-2.5 w-full rounded-full bg-ink/[0.07]">
                    <div
                      className={cx("grow-x h-full rounded-full", k === 0 ? "bg-ink/70" : "bg-orange")}
                      style={{ width: `${Math.max(1.2, (c.value / max) * 100)}%` }}
                    />
                  </div>
                  <p className="muted mt-1.5 text-[13px]">{c.note}</p>
                </div>
              ))}
            </div>
            <p className="muted mt-3 text-[12px] italic">{FLAGSHIP.footnote}</p>
          </figure>

          <ul className="hairline mt-auto grid gap-4 border-t pt-5 sm:grid-cols-3">
            {FLAGSHIP.facts.map((f, k) => (
              <li key={f.title} className="rise" style={{ "--d": 5 + k } as React.CSSProperties}>
                <p className="text-[15px] font-semibold tracking-[-0.015em]">{f.title}</p>
                <p className="muted mt-1 text-[13.5px] leading-snug">{f.text}</p>
              </li>
            ))}
          </ul>
        </div>
        <Scene
          slug={FLAGSHIP.photo}
          card={FLAGSHIP.card}
          className="min-h-[340px] rounded-[12px] lg:col-span-6 lg:min-h-0"
          sizes="(min-width: 1024px) 46vw, 100vw"
        />
      </div>
    </Slide>
  );
}
