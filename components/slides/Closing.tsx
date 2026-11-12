import { ArrowRight, Download, EyeOff, Layers, Mail, Server, UserCheck } from "lucide-react";
import { CONTACT, CONTACT_EMAIL, DEPLOY, MARKET, TRUST } from "@/content/deck";
import { Mark } from "../Logo";
import { Scene } from "../Scene";
import { Slide } from "../Slide";

const pad = (n: number) => String(n).padStart(2, "0");

/* ── Deployment + how a project runs ─────────────────────────────────────── */
export function Deploy({ n }: { n: number }) {
  return (
    <Slide id="deployment" n={n} label="How it's deployed" tone="paper-2">
      <div className="mt-[clamp(14px,3.4vh,40px)] grid gap-5 lg:grid-cols-12 lg:items-end">
        <h2 className="t-title rise lg:col-span-6">{DEPLOY.title}</h2>
        <p className="t-lead muted rise lg:col-span-5 lg:col-start-8" style={{ "--d": 1 } as React.CSSProperties}>
          {DEPLOY.text}
        </p>
      </div>

      <ol className="mt-[clamp(16px,3.4vh,36px)] grid gap-4 md:grid-cols-3 md:gap-5">
        {DEPLOY.paths.map((p, k) => (
          <li key={p.title} className="rise panel overflow-hidden rounded-[12px]" style={{ "--d": 2 + k } as React.CSSProperties}>
            <Scene
              slug={p.photo}
              label={pad(k + 1)}
              className="aspect-[16/8.4] w-full [@media(min-width:768px)_and_(max-height:760px)]:aspect-[16/7]"
              sizes="(min-width: 768px) 31vw, 100vw"
            />
            <div className="p-[clamp(12px,2vh,18px)]">
              <p className="text-[clamp(1rem,1.2vw,1.1rem)] font-semibold tracking-[-0.018em]">{p.title}</p>
              <p className="muted mt-1 text-[14px] leading-snug">{p.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-auto pt-[clamp(16px,3.4vh,36px)]">
        <p className="t-label muted">From first call to first alert</p>
        <ol className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {DEPLOY.steps.map((s, k) => (
            <li key={s.title} className="rise hairline relative border-t pt-3 lg:pr-8" style={{ "--d": 5 + k } as React.CSSProperties}>
              <span aria-hidden className="absolute -top-[4.5px] left-0 h-2 w-2 rounded-full bg-ink" />
              <p className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.015em]">
                <span className="t-label muted tabular-nums">{pad(k + 1)}</span>
                {s.title}
                {k < DEPLOY.steps.length - 1 ? <ArrowRight className="muted hidden h-3.5 w-3.5 lg:block" aria-hidden /> : null}
              </p>
              <p className="muted mt-1 text-[13.5px] leading-snug">{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="muted mt-4 text-[13.5px]">{DEPLOY.where}</p>
      </div>
    </Slide>
  );
}

/* ── Built for Europe ────────────────────────────────────────────────────── */
const TRUST_ICON = [EyeOff, Server, UserCheck, Layers];

export function Trust({ n }: { n: number }) {
  return (
    <Slide id="trust" n={n} label="Privacy and safety" tone="dark">
      <div className="mt-[clamp(18px,4vh,48px)] grid flex-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <h2 className="t-slide rise">{TRUST.title}</h2>
          <p className="t-lead rise mt-5 max-w-[30rem] text-white/70" style={{ "--d": 1 } as React.CSSProperties}>
            {TRUST.text}
          </p>
        </div>
        <ul className="grid gap-px overflow-hidden rounded-[14px] bg-white/10 sm:grid-cols-2 lg:col-span-7">
          {TRUST.points.map((p, k) => {
            const Icon = TRUST_ICON[k];
            return (
              <li key={p.title} className="rise bg-night p-[clamp(18px,3.2vh,30px)]" style={{ "--d": 2 + k } as React.CSSProperties}>
                <Icon className="h-5 w-5 text-orange" strokeWidth={1.8} aria-hidden />
                <p className="mt-[clamp(10px,2.4vh,22px)] text-[clamp(1.05rem,1.35vw,1.2rem)] leading-tight font-semibold tracking-[-0.02em]">{p.title}</p>
                <p className="mt-2 text-[14.5px] leading-snug text-white/65 2xl:text-[16px]">{p.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </Slide>
  );
}

/* ── Market: why now + who buys ──────────────────────────────────────────── */
export function Market({ n }: { n: number }) {
  return (
    <Slide id="market" n={n} label="Market" tone="paper">
      <div className="mt-[clamp(18px,4vh,48px)] grid gap-5 lg:grid-cols-12 lg:items-end">
        <h2 className="t-slide rise lg:col-span-6">{MARKET.title}</h2>
        <p className="t-lead muted rise lg:col-span-5 lg:col-start-8" style={{ "--d": 1 } as React.CSSProperties}>
          {MARKET.text}
        </p>
      </div>
      <div className="mt-[clamp(20px,4.6vh,48px)] grid flex-1 content-start gap-10 lg:grid-cols-12 lg:gap-12">
        <section className="lg:col-span-5" aria-labelledby="why-now">
          <h3 id="why-now" className="t-label muted">
            Why now
          </h3>
          <ol className="mt-3 grid gap-[clamp(10px,2vh,16px)]">
            {MARKET.why.map((w, k) => (
              <li
                key={w.title}
                className="rise hairline grid grid-cols-[2rem_1fr] border-t pt-[clamp(8px,1.6vh,12px)]"
                style={{ "--d": 2 + k } as React.CSSProperties}
              >
                <span className="t-label muted pt-0.5 tabular-nums">{pad(k + 1)}</span>
                <div>
                  <p className="text-[15.5px] leading-tight font-semibold tracking-[-0.015em]">{w.title}</p>
                  <p className="muted mt-1 text-[14px] leading-snug">{w.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section className="lg:col-span-7" aria-labelledby="who-buys">
          <h3 id="who-buys" className="t-label muted">
            Who buys
          </h3>
          <ul className="fade-in mt-3 flex flex-wrap gap-2">
            {MARKET.buyers.map((b) => (
              <li key={b} className="panel rounded-full px-3.5 py-[7px] text-[14px] leading-none 2xl:px-4 2xl:py-[9px] 2xl:text-[15.5px]">
                {b}
              </li>
            ))}
          </ul>
          <p className="muted mt-5 max-w-[34rem] text-[13.5px] leading-snug">
            Customer types the services are built for — not a list of customers. Every project is a custom solution for one company.
          </p>
        </section>
      </div>
    </Slide>
  );
}

/* ── Contact ─────────────────────────────────────────────────────────────── */
export function Contact({ n, pdf }: { n: number; pdf?: string }) {
  return (
    <Slide id="contact" n={n} label="Contact" tone="dark">
      <div className="mt-[clamp(18px,4vh,48px)] flex flex-1 flex-col justify-center">
        <Mark tone="white" className="rise h-10 w-10" />
        <h2 className="t-cover rise mt-8 max-w-[14ch] !text-[clamp(2.6rem,min(6.4vw,11.5vh),7rem)]" style={{ "--d": 1 } as React.CSSProperties}>
          {CONTACT.title}
        </h2>
        <p className="t-lead rise mt-6 max-w-[36rem] text-white/70" style={{ "--d": 2 } as React.CSSProperties}>
          {CONTACT.text}
        </p>
        <div className="rise mt-9 flex flex-wrap items-center gap-3" style={{ "--d": 3 } as React.CSSProperties}>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Enlight Layer")}`}
            className="inline-flex h-12 items-center gap-2.5 rounded-full bg-white px-6 text-[15px] font-semibold text-ink hover:bg-white/90"
          >
            <Mail className="h-4 w-4" strokeWidth={2} aria-hidden />
            {CONTACT_EMAIL}
          </a>
          {pdf ? (
            <a
              href={pdf}
              download
              className="no-print inline-flex h-12 items-center gap-2.5 rounded-full border border-white/30 px-6 text-[15px] font-medium text-white hover:bg-white/10"
            >
              <Download className="h-4 w-4" strokeWidth={2} aria-hidden />
              Download the deck (PDF)
            </a>
          ) : null}
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-3 border-t border-white/12 pt-5 text-[12.5px] leading-snug text-white/60 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <p className="max-w-[48rem]">{CONTACT.fine}</p>
        <p className="flex flex-none gap-5">
          <a href="/credits" className="underline underline-offset-4 hover:text-white">
            Photo credits
          </a>
          <span>© {new Date().getFullYear()} Enlight Layer</span>
        </p>
      </div>
    </Slide>
  );
}
