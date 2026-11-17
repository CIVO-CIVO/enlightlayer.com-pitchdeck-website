"use client";

import { Pause, Play, TriangleAlert } from "lucide-react";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { COVER, SERVICES } from "@/content/deck";
import { Scene } from "./Scene";

const pad = (n: number) => String(n).padStart(2, "0");
const DUR = 6500; // ms per scenario

const SCENES = COVER.reel.map((r) => {
  const s = SERVICES.find((x) => x.id === r.service)!;
  return { ...r, name: s.name, card: r.card ?? s.card };
});

/** "02:14:07" + seconds since the scenario opened */
function clock(start: string, plus: number) {
  const [h, m, s] = start.split(":").map(Number);
  const t = (h * 3600 + m * 60 + s + plus) % 86400;
  return `${pad(Math.floor(t / 3600))}:${pad(Math.floor(t / 60) % 60)}:${pad(t % 60)}`;
}

type Reel = {
  i: number;
  prev: number | null;
  sec: number;
  run: boolean;
  playing: boolean;
  still: boolean;
  go: (k: number) => void;
  toggle: () => void;
  watch: (el: HTMLElement | null) => void;
};
const Ctx = createContext<Reel | null>(null);
const useReel = () => useContext(Ctx)!;

/**
 * The cover as a banner reel in the Enlightdata style: one scenario after another on the
 * right, each a still scene (grayscale photograph, static infrared on the problem, brackets,
 * a callout joined to it by a leader line). The scene fades in over the last, the photograph
 * drifts slowly toward the problem (off with ?motion=still), the brackets lock on and the
 * callout rises. The infrared itself never animates. Starts paused under reduced motion and
 * pauses when the cover is off screen. The provider wraps the whole cover slide so the
 * photographs (backdrop) and the scenario bar (in the slide body) share one clock.
 */
export function ReelProvider({ children }: { children: ReactNode }) {
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [playing, setPlaying] = useState(true);
  const [onScreen, setOnScreen] = useState(true);
  const [still, setStill] = useState(false);
  const [sec, setSec] = useState(0);
  const [el, watch] = useState<HTMLElement | null>(null);
  const run = playing && onScreen;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
    setStill(new URLSearchParams(location.search).get("motion") === "still");
  }, []);

  useEffect(() => {
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [el]);

  // the camera clock
  useEffect(() => {
    if (!run) return;
    const t = window.setInterval(() => setSec((n) => n + 1), 1000);
    return () => window.clearInterval(t);
  }, [run]);

  const go = (k: number) => {
    if (k === i) return;
    setPrev(i);
    setI(k);
    setSec(0);
  };

  return (
    <Ctx.Provider value={{ i, prev, sec, run, playing, still, go, toggle: () => setPlaying((p) => !p), watch }}>{children}</Ctx.Provider>
  );
}

/** The photographs and the viewfinder: the right 64% of the cover on laptops, the top of it on phones. */
export function ReelPhotos() {
  const { i, prev, sec, still, watch } = useReel();
  const scene = SCENES[i];
  const frame = useRef<HTMLDivElement>(null);
  useEffect(() => watch(frame.current), [watch]);

  return (
    <div ref={frame} className="cover-frame reel absolute -z-10" data-still={still ? "" : undefined}>
      {SCENES.map((s, k) => (
        <div
          key={s.photo}
          className="reel-item absolute inset-0"
          data-on={k === i ? "" : undefined}
          data-prev={k === prev ? "" : undefined}
          aria-hidden={k !== i}
        >
          <Scene
            slug={s.photo}
            mirror={s.mirror}
            card={s.card}
            callout={s.place ?? "above"}
            zoom={s.zoom}
            at={s.at}
            eager={k === 0}
            label={null}
            sizes="(min-width: 1024px) 64vw, 100vw"
            className="!absolute inset-0 h-full w-full !bg-night"
            shade="var(--cover-shade)"
          />
        </div>
      ))}

      {/* viewfinder: thin corners, REC + camera + time code, and the honest flag (the photographs are stand-ins) */}
      <div aria-hidden className="cover-hud pointer-events-none absolute z-[5] font-mono text-[10px] tracking-[0.14em] text-white uppercase">
        <span className="absolute top-0 left-0 h-5 w-5 border-t border-l border-white/70" />
        <span className="absolute top-0 right-0 h-5 w-5 border-t border-r border-white/70" />
        <span className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-white/70" />
        <span className="absolute right-0 bottom-0 h-5 w-5 border-r border-b border-white/70" />
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 sm:top-4 sm:right-4">
          <div className="flex items-center gap-2.5 rounded-[4px] bg-black/60 px-2.5 py-1.5 backdrop-blur-[2px]">
            <span className="flex items-center gap-1.5">
              <span className="h-[7px] w-[7px] rounded-full bg-orange" />
              Rec
            </span>
            <span className="text-white/60">{scene.cam}</span>
            <span className="tabular-nums">{clock(scene.clock, sec)}</span>
          </div>
          <span className="rounded-[3px] bg-black/45 px-1.5 py-[3px] text-[9px] text-white/65">Illustrative frame</span>
        </div>
      </div>
    </div>
  );
}

/** Scenario NN/NN, what it is, the progress dashes and play/pause. Lives in the slide body, under the photograph. */
export function ReelBar({ className }: { className?: string }) {
  const { i, run, playing, go, toggle } = useReel();
  const scene = SCENES[i];
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10.5px] tracking-[0.16em] text-white/85 uppercase ${className ?? ""}`}>
      <span className="rounded-[3px] bg-orange px-1.5 py-[3px] whitespace-nowrap text-white">
        Scenario {pad(i + 1)}/{pad(SCENES.length)}
      </span>
      <span key={i} className="reel-label min-w-0" aria-live="polite">
        {scene.label}
      </span>
      <span className="flex items-center gap-1">
        <ol className="flex items-center gap-1">
          {SCENES.map((s, k) => (
            <li key={s.photo} className="flex">
              <button
                type="button"
                onClick={() => go(k)}
                aria-label={`Scenario ${k + 1}: ${s.label}`}
                aria-current={k === i ? "true" : undefined}
                className="group -my-2.5 flex h-6 items-center py-2.5"
              >
                <span className={`relative block h-[3px] overflow-hidden rounded-full bg-white/30 group-hover:bg-white/55 ${k === i ? "w-6" : "w-3"}`}>
                  {k === i ? (
                    <span
                      key={`${i}`}
                      className="reel-fill absolute inset-0 origin-left bg-orange"
                      style={{ animationDuration: `${DUR}ms`, animationPlayState: run ? "running" : "paused" }}
                      onAnimationEnd={() => go((i + 1) % SCENES.length)}
                    />
                  ) : null}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause the scenarios" : "Play the scenarios"}
          className="-my-2 ml-1 grid h-8 w-8 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
        >
          {playing ? <Pause className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden /> : <Play className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />}
        </button>
      </span>
      {/* phones: the callout on the photograph is hidden, so the alert is spelled out here */}
      <span key={`t${i}`} className="reel-label flex basis-full items-start gap-2 font-sans text-[14.5px] leading-snug font-semibold tracking-[-0.01em] text-white normal-case sm:hidden">
        <TriangleAlert className="mt-[2px] h-4 w-4 flex-none text-orange" strokeWidth={2.1} aria-hidden />
        {scene.card.title}
      </span>
    </div>
  );
}
