import type { LucideIcon } from "lucide-react";
import { ArrowUp, Camera, Cpu, Download, EyeOff, FlaskConical, Gauge, Layers, Mail, RefreshCw, Search, Server, Thermometer, UserCheck } from "lucide-react";
import { CONTACT, CONTACT_EMAIL, DEPLOY, MARKET, TRUST } from "@/content/deck";
import { CoverageMap } from "../CoverageMap";
import { Scene } from "../Scene";
import { Slide } from "../Slide";

const pad = (n: number) => String(n).padStart(2, "0");

/* ── Deployment: one photograph, four steps ──────────────────────────────── */
const STEP_ICON: LucideIcon[] = [Search, FlaskConical, Layers, RefreshCw];

export function Deploy({ n }: { n: number }) {
  return (
    <Slide
      id="deployment"
      n={n}
      label={DEPLOY.kicker}
      tone="dark"
      backdrop={
        <>
          <Scene
            slug={DEPLOY.photo}
            label={null}
            sizes="(min-width: 1024px) 70vw, 100vw"
            className="!absolute inset-y-0 right-0 -z-10 h-full w-full lg:w-[70%]"
            shade="linear-gradient(90deg, rgba(18,18,17,1) 0%, rgba(18,18,17,.7) 22%, rgba(18,18,17,0) 52%), linear-gradient(0deg, rgba(18,18,17,.96) 0%, rgba(18,18,17,.55) 30%, rgba(18,18,17,0) 58%)"
          />
          <div aria-hidden className="absolute inset-0 -z-10 bg-night/70 lg:hidden" />
        </>
      }
    >
      <div className="mt-[clamp(12px,3vh,36px)] max-w-[40rem]">
        <h2 className="t-title rise">{DEPLOY.title}</h2>
        <p className="t-lead rise mt-3 text-white/75" style={{ "--d": 1 } as React.CSSProperties}>
          {DEPLOY.text}
        </p>
      </div>

      <div className="mt-auto pt-[clamp(24px,8vh,120px)]">
        <ol className="grid overflow-hidden rounded-[14px] border border-white/15 bg-night/80 backdrop-blur-[2px] sm:grid-cols-2 lg:grid-cols-4">
          {DEPLOY.steps.map((s, k) => {
            const Icon = STEP_ICON[k];
            return (
              <li
                key={s.title}
                className="rise border-white/12 p-[clamp(14px,2.4vh,22px)] max-lg:border-b lg:border-r lg:last:border-r-0"
                style={{ "--d": 2 + k } as React.CSSProperties}
              >
                <p className="flex items-center justify-between">
                  <span className="t-label text-white/45 tabular-nums">{pad(k + 1)}</span>
                  <Icon className="h-[18px] w-[18px] text-orange" strokeWidth={1.8} aria-hidden />
                </p>
                <p className="mt-[clamp(12px,2.4vh,22px)] text-[clamp(1.1rem,1.5vw,1.4rem)] leading-tight font-semibold tracking-[-0.02em]">{s.title}</p>
                <p className="mt-2 text-[14px] leading-snug text-white/70 2xl:text-[15px]">{s.text}</p>
              </li>
            );
          })}
        </ol>
        <p className="t-label mt-3 text-white/45">{DEPLOY.where}</p>
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

/* ── Market: the two regions on a map, why now, who buys ─────────────────── */
const WHY_ICON: LucideIcon[] = [Camera, Thermometer, Cpu, Gauge];

export function Market({ n }: { n: number }) {
  return (
    <Slide id="market" n={n} label="Market" tone="paper">
      <div className="mt-[clamp(14px,3vh,40px)] grid flex-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <h2 className="t-slide rise">{MARKET.title}</h2>
          <p className="t-lead muted rise mt-4" style={{ "--d": 1 } as React.CSSProperties}>
            {MARKET.text}
          </p>
          <ul className="hairline mt-[clamp(14px,3vh,30px)] border-t" aria-label="Why now">
            {MARKET.why.map((w, k) => {
              const Icon = WHY_ICON[k];
              return (
                <li
                  key={w.title}
                  className="rise hairline grid grid-cols-[1.75rem_1fr] items-start border-b py-[clamp(9px,1.7vh,15px)]"
                  style={{ "--d": 2 + k } as React.CSSProperties}
                >
                  <Icon className="mt-0.5 h-[18px] w-[18px]" strokeWidth={1.7} aria-hidden />
                  <p className="text-[clamp(.9rem,1.05vw,1rem)] leading-snug">
                    <span className="font-semibold">{w.title}.</span> <span className="muted">{w.text}</span>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="lg:col-span-7">
          <CoverageMap className="fade-in" />
          <section className="mt-[clamp(14px,3vh,30px)]" aria-labelledby="who-buys">
            <h3 id="who-buys" className="t-label muted">
              Who buys
            </h3>
            <ul className="fade-in mt-2.5 flex flex-wrap gap-1.5">
              {MARKET.buyers.map((b) => (
                <li key={b} className="panel rounded-full px-3 py-[6px] text-[13px] leading-none 2xl:px-3.5 2xl:py-[8px] 2xl:text-[14.5px]">
                  {b}
                </li>
              ))}
            </ul>
            <p className="muted mt-3 text-[12.5px] leading-snug">
              Customer types the services are built for, not a list of customers. Every project is a custom solution for one company.
            </p>
          </section>
        </div>
      </div>
    </Slide>
  );
}

/* ── Contact: copy on the left, a photograph bleeding in from the right ──── */
export function Contact({ n, pdf }: { n: number; pdf?: string }) {
  return (
    <Slide
      id="contact"
      n={n}
      label={CONTACT.kicker}
      tone="dark"
      backdrop={
        <>
          <Scene
            slug={CONTACT.photo}
            mirror={CONTACT.mirror}
            label={null}
            sizes="(min-width: 1024px) 64vw, 100vw"
            className="!absolute inset-y-0 right-0 -z-10 h-full w-full lg:w-[64%]"
            shade="linear-gradient(90deg, rgba(18,18,17,1) 0%, rgba(18,18,17,.55) 22%, rgba(18,18,17,0) 50%), linear-gradient(0deg, rgba(18,18,17,.9) 0%, rgba(18,18,17,0) 30%)"
          />
          <div aria-hidden className="absolute inset-0 -z-10 bg-night/70 lg:hidden" />
        </>
      }
    >
      <div className="flex flex-1 flex-col justify-center py-[clamp(16px,4vh,48px)]">
        <div className="max-w-[40rem]">
          <h2 className="t-cover rise !text-[clamp(2.6rem,min(5.6vw,10vh),6.2rem)]">{CONTACT.title}</h2>
          <p className="t-lead rise mt-6 max-w-[34rem] text-white/80" style={{ "--d": 1 } as React.CSSProperties}>
            {CONTACT.text}
          </p>
          <div className="rise mt-8 flex flex-wrap items-center gap-3" style={{ "--d": 2 } as React.CSSProperties}>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Enlight Layer")}`}
              className="inline-flex h-12 items-center gap-2.5 rounded-[6px] bg-white px-5 text-[15px] font-semibold text-ink hover:bg-white/90"
            >
              <Mail className="h-4 w-4" strokeWidth={2} aria-hidden />
              {CONTACT.cta}
              <span className="font-normal text-ink/55">{CONTACT_EMAIL}</span>
            </a>
            {pdf ? (
              <a
                href={pdf}
                download
                className="no-print inline-flex h-12 items-center gap-2.5 rounded-[6px] border border-white/30 px-5 text-[15px] font-medium text-white hover:bg-white/10"
              >
                <Download className="h-4 w-4" strokeWidth={2} aria-hidden />
                {CONTACT.pdf}
              </a>
            ) : null}
          </div>
          <a href="#cover" className="no-print rise mt-8 inline-flex items-center gap-2 border-b border-white/40 pb-1 text-[14.5px] text-white/70 hover:text-white" style={{ "--d": 3 } as React.CSSProperties}>
            {CONTACT.back}
            <ArrowUp className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </div>
      <div className="flex flex-col gap-3 border-t border-white/15 pt-5 text-[12.5px] leading-snug text-white/55 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <p className="max-w-[52rem]">
          © {new Date().getFullYear()} Enlight Layer · {CONTACT.fine}
        </p>
        <a href="/credits" className="flex-none underline-offset-4 hover:text-white hover:underline">
          Photo credits
        </a>
      </div>
    </Slide>
  );
}
