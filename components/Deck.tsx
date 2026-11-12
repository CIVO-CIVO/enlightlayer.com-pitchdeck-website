"use client";

import { Download, Maximize2, Minimize2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Logo } from "./Logo";
import type { Tone } from "./Slide";

export type SlideMeta = { id: string; label: string; tone: Tone };

const pad = (n: number) => String(n).padStart(2, "0");
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The deck chrome around server-rendered slides: header with counter, progress,
 * side rail, keyboard navigation (←/→/↑/↓, PgUp/PgDn, Space, Home/End, F),
 * present mode (fullscreen + snapping) and the once-only entrance triggers.
 */
export function Deck({ slides, pdf, children }: { slides: SlideMeta[]; pdf?: string; children: ReactNode }) {
  const [i, setI] = useState(0);
  const [present, setPresent] = useState(false);
  const iRef = useRef(0);

  const els = useCallback(() => slides.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[], [slides]);

  const go = useCallback(
    (k: number) => {
      const n = Math.max(0, Math.min(slides.length - 1, k));
      document.getElementById(slides[n].id)?.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
    },
    [slides],
  );

  const step = useCallback(
    (dir: 1 | -1) => {
      const cur = document.getElementById(slides[iRef.current].id);
      const behavior: ScrollBehavior = reduced() ? "auto" : "smooth";
      if (cur) {
        const r = cur.getBoundingClientRect();
        const vh = window.innerHeight;
        // slides taller than the screen (phones): page through them first
        if (dir === 1 && r.bottom > vh + 8) return window.scrollBy({ top: Math.min(vh * 0.85, r.bottom - vh), behavior });
        if (dir === -1 && r.top < -8) return window.scrollBy({ top: Math.max(-vh * 0.85, r.top), behavior });
      }
      go(iRef.current + dir);
    },
    [go, slides],
  );

  // current slide, hash and entrance triggers
  useEffect(() => {
    const list = els();
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.45;
      let k = 0;
      for (let j = 0; j < list.length; j++) if (list[j].getBoundingClientRect().top <= line) k = j;
      if (k !== iRef.current) {
        iRef.current = k;
        setI(k);
        history.replaceState(null, "", k === 0 ? location.pathname : `#${slides[k].id}`);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.seen = "";
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -22% 0px" },
    );
    list.forEach((el) => io.observe(el));
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [els, slides]);

  // links to a single service (#svc-…): open it and show its slide
  useEffect(() => {
    const open = (hash: string) => {
      if (!hash.startsWith("#svc-")) return false;
      const input = document.getElementById(hash.slice(1)) as HTMLInputElement | null;
      if (!input) return false;
      input.checked = true;
      input.closest<HTMLElement>("[data-slide]")?.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
      return true;
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#svc-"]');
      if (a && open(a.getAttribute("href")!)) e.preventDefault();
    };
    open(location.hash);
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const enterPresent = useCallback(async () => {
    document.documentElement.dataset.present = "";
    setPresent(true);
    try {
      await document.documentElement.requestFullscreen?.();
    } catch {
      /* fullscreen refused: snapping still works */
    }
    requestAnimationFrame(() => go(iRef.current));
  }, [go]);

  const exitPresent = useCallback(async () => {
    delete document.documentElement.dataset.present;
    delete document.documentElement.dataset.idle;
    setPresent(false);
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        /* already out */
      }
    }
  }, []);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      // radio groups (the service pickers) use the arrow keys themselves
      if (t.closest("input, textarea, select, [contenteditable]") && e.key !== "PageDown" && e.key !== "PageUp") return;
      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
        case "PageDown":
          e.preventDefault();
          step(1);
          break;
        case "ArrowUp":
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          step(-1);
          break;
        case " ":
          if (t.closest("button, a, label, summary")) return;
          e.preventDefault();
          step(e.shiftKey ? -1 : 1);
          break;
        case "Home":
          e.preventDefault();
          go(0);
          break;
        case "End":
          e.preventDefault();
          go(slides.length - 1);
          break;
        case "f":
        case "F":
          if (present) exitPresent();
          else enterPresent();
          break;
        case "Escape":
          if (present) exitPresent();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enterPresent, exitPresent, go, present, slides.length, step]);

  // leaving fullscreen with the browser's own controls ends present mode; the header hides when the mouse rests
  useEffect(() => {
    if (!present) return;
    let t = 0;
    const onFs = () => {
      if (!document.fullscreenElement) exitPresent();
    };
    const wake = () => {
      delete document.documentElement.dataset.idle;
      window.clearTimeout(t);
      t = window.setTimeout(() => (document.documentElement.dataset.idle = ""), 1800);
    };
    wake();
    document.addEventListener("fullscreenchange", onFs);
    window.addEventListener("mousemove", wake);
    return () => {
      document.removeEventListener("fullscreenchange", onFs);
      window.removeEventListener("mousemove", wake);
      window.clearTimeout(t);
    };
  }, [exitPresent, present]);

  const tone = slides[i]?.tone ?? "paper";
  const dark = tone === "dark";
  const onCover = i === 0;

  return (
    <>
      <header
        className={cx(
          "deck-header fixed inset-x-0 top-0 z-50 transition-[opacity,background-color] duration-300",
          dark ? "text-white" : "text-ink",
          onCover
            ? "bg-transparent"
            : dark
              ? "bg-night/75 backdrop-blur-md"
              : tone === "paper-2"
                ? "bg-paper-2/80 backdrop-blur-md"
                : "bg-paper/80 backdrop-blur-md",
        )}
      >
        <div className="flex h-[var(--hdr)] items-center justify-between gap-4 px-[var(--gutter)]">
          <a href={`#${slides[0].id}`} aria-label="Enlight Layer — first slide" className="rounded-[4px]">
            <Logo tone={dark ? "white" : "ink"} />
          </a>
          <p className={cx("t-label hidden lg:block", dark ? "text-white/55" : "text-muted")} aria-hidden>
            {slides[i]?.label}
          </p>
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <span className={cx("t-label px-1 tabular-nums", dark ? "text-white/60" : "text-muted")} aria-live="polite">
              {pad(i + 1)} / {pad(slides.length)}
            </span>
            {pdf ? (
              <a
                href={pdf}
                download
                className={cx(
                  "hidden h-9 items-center gap-2 rounded-full px-3.5 text-[13.5px] font-medium sm:inline-flex",
                  dark ? "hover:bg-white/10" : "hover:bg-ink/[0.06]",
                )}
              >
                <Download className="h-4 w-4" strokeWidth={1.9} aria-hidden />
                PDF
              </a>
            ) : null}
            <button
              type="button"
              onClick={present ? exitPresent : enterPresent}
              className={cx(
                "hidden h-9 items-center gap-2 rounded-full px-3.5 text-[13.5px] font-medium md:inline-flex",
                dark ? "hover:bg-white/10" : "hover:bg-ink/[0.06]",
              )}
              aria-keyshortcuts="F"
            >
              {present ? <Minimize2 className="h-4 w-4" strokeWidth={1.9} aria-hidden /> : <Maximize2 className="h-4 w-4" strokeWidth={1.9} aria-hidden />}
              {present ? "Exit" : "Present"}
            </button>
            <a
              href="#contact"
              className={cx(
                "inline-flex h-9 items-center rounded-full px-4 text-[13.5px] font-semibold",
                dark ? "bg-white text-ink hover:bg-white/90" : "bg-ink text-white hover:bg-graphite",
              )}
            >
              Contact
            </a>
          </div>
        </div>
        <div
          aria-hidden
          className="deck-progress absolute bottom-0 left-0 h-[2px] w-full origin-left bg-orange transition-transform duration-500"
          style={{ transform: `scaleX(${(i + 1) / slides.length})` }}
        />
      </header>

      <nav
        aria-label="Slides"
        className="deck-rail fixed top-1/2 right-[max(10px,calc(var(--gutter)/2-6px))] z-40 hidden -translate-y-1/2 transition-opacity lg:block"
      >
        <ol className="flex flex-col items-center gap-[7px]">
          {slides.map((s, k) => (
            <li key={s.id} className="group relative flex">
              <button
                type="button"
                onClick={() => go(k)}
                aria-label={`Slide ${k + 1}: ${s.label}`}
                aria-current={k === i ? "step" : undefined}
                className="grid h-3.5 w-3.5 place-items-center rounded-full"
              >
                <span
                  className={cx(
                    "block w-[5px] rounded-full transition-[height,background-color] duration-300",
                    k === i ? "h-3.5 bg-orange" : cx("h-[5px]", dark ? "bg-white/35 group-hover:bg-white/80" : "bg-ink/25 group-hover:bg-ink/70"),
                  )}
                />
              </button>
              <span
                className={cx(
                  "t-label pointer-events-none absolute top-1/2 right-6 -translate-y-1/2 rounded-[5px] px-2 py-1 whitespace-nowrap opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100",
                  dark ? "bg-white text-ink" : "bg-ink text-white",
                )}
              >
                {s.label}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      <main>{children}</main>
    </>
  );
}
