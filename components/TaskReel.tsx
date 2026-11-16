"use client";

import { useEffect, useState } from "react";
import { Scene } from "./Scene";

export type TaskScene = { photo: string; place: string; task: string; call: string };

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * One tile of the "why" wall: its scenes cross-fade one after another, offset so the
 * tiles never change together. The infrared on each photograph is a still image and
 * never animates. Static (first scene) under reduced motion and in the PDF.
 */
export function TaskReel({ scenes, start, offset = 0, every = 5200 }: { scenes: TaskScene[]; start: number; offset?: number; every?: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (scenes.length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t: ReturnType<typeof setInterval> | undefined;
    const d = setTimeout(() => {
      const step = () => setI((n) => (n + 1) % scenes.length);
      step();
      t = setInterval(step, every);
    }, every + offset);
    return () => {
      clearTimeout(d);
      if (t) clearInterval(t);
    };
  }, [scenes.length, every, offset]);
  const s = scenes[i];
  return (
    <figure className="relative h-full overflow-hidden rounded-[12px] bg-night text-white">
      {scenes.map((sc, k) => (
        <div key={sc.photo} aria-hidden={k !== i} className="task-scene absolute inset-0" data-on={k === i ? "" : undefined}>
          <Scene slug={sc.photo} label={null} sizes="(min-width: 640px) 32vw, 100vw" className="!absolute inset-0 h-full w-full" />
        </div>
      ))}
      <p className="t-label pointer-events-none absolute top-3 left-3 z-[6] flex items-center gap-2 text-white/90">
        <span className="rounded-[3px] bg-orange px-1.5 py-[3px] text-white tabular-nums">Task {pad(start + i)}</span>
        <span key={i} className="task-fade">
          {s.place}
        </span>
      </p>
      <figcaption
        key={i}
        className="task-fade absolute inset-x-0 bottom-0 z-[6] bg-[linear-gradient(180deg,rgba(18,18,17,0),rgba(18,18,17,.92)_50%)] px-4 pt-14 pb-4"
      >
        <p className="text-[13px] text-white/65">{s.task}</p>
        <p className="mt-1 text-[clamp(1rem,1.2vw,1.15rem)] leading-tight font-semibold tracking-[-0.01em]">“{s.call}”</p>
      </figcaption>
    </figure>
  );
}
