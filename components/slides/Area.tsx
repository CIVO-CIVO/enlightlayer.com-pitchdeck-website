import { Activity, Camera, Radio, Thermometer } from "lucide-react";
import { GROUPS, SENSE_LABEL, servicesIn, type Group, type Sense } from "@/content/deck";
import { cx } from "@/lib/cx";
import { Scene } from "../Scene";
import { Slide, type Tone } from "../Slide";

const pad = (n: number) => String(n).padStart(2, "0");
const SENSE_ICON: Record<Sense, typeof Camera> = { camera: Camera, thermal: Thermometer, vibration: Activity, sensor: Radio };

/**
 * One slide per area. The services form a radio group (CSS only, see .svc in
 * globals.css): the chosen one opens its details and shows its photograph.
 * The first service is open by default — also in the PDF.
 */
export function Area({ n, group, tone }: { n: number; group: Group; tone: Tone }) {
  const items = servicesIn(group.id);
  const index = GROUPS.findIndex((g) => g.id === group.id) + 1;
  const dark = tone === "dark";

  return (
    <Slide id={group.id} n={n} label={`Area ${pad(index)} · ${group.name}`} tone={tone}>
      <div className="svc mt-[clamp(14px,3vh,36px)] grid flex-1 gap-8 lg:min-h-0 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col lg:col-span-5">
          <h2 className="t-title rise">{group.title}</h2>
          <p className="t-lead muted rise mt-3 [@media(min-width:1024px)_and_(max-height:760px)]:hidden" style={{ "--d": 1 } as React.CSSProperties}>
            {group.line}
          </p>

          <fieldset className="mt-[clamp(12px,2.6vh,30px)]">
            <legend className="sr-only">Services in {group.name}</legend>
            <div className={cx("border-t", dark ? "border-white/12" : "border-ink/12")}>
              {items.map((s, k) => (
                <div
                  key={s.id}
                  className={cx("svc-item rise relative border-b", dark ? "border-white/12" : "border-ink/12")}
                  style={{ "--d": 2 + k } as React.CSSProperties}
                >
                  <input type="radio" name={`svc-${group.id}`} id={`svc-${s.id}`} value={s.id} defaultChecked={k === 0} className="peer sr-only" />
                  <span aria-hidden className="absolute top-0 bottom-0 left-0 w-[2px] bg-orange opacity-0 peer-checked:opacity-100" />
                  <label htmlFor={`svc-${s.id}`} className="block py-[clamp(8px,1.5vh,13px)] pr-2 pl-4">
                    <span className="flex items-baseline gap-3">
                      <span className={cx("t-label tabular-nums", dark ? "text-white/40" : "text-faint")}>{pad(k + 1)}</span>
                      <span className="text-[clamp(1rem,1.25vw,1.28rem)] leading-tight font-semibold tracking-[-0.018em]">{s.name}</span>
                    </span>
                    <span className="svc-line muted mt-1 block pl-[calc(1.6rem)] text-[14px] leading-snug 2xl:text-[15px]">{s.line}</span>
                  </label>
                  <div className="svc-detail pr-2 pb-[clamp(10px,1.8vh,16px)] pl-4 lg:pl-[calc(1rem+1.6rem)]">
                    {/* phones: the photograph opens inside the chosen service */}
                    <Scene slug={s.photo} card={s.card} className="mb-4 aspect-[4/3] w-full rounded-[10px] lg:hidden" sizes="100vw" />
                    <dl className="grid gap-[clamp(6px,1.1vh,10px)] text-[13.5px] leading-snug 2xl:text-[14.5px]">
                      <div>
                        <dt className="t-label text-orange">Alert when</dt>
                        <dd className="mt-0.5">{s.alert.charAt(0).toUpperCase() + s.alert.slice(1)}.</dd>
                      </div>
                      <div className="grid gap-[clamp(6px,1.1vh,10px)] sm:grid-cols-2 sm:gap-5">
                        <div>
                          <dt className="t-label muted">For</dt>
                          <dd className="mt-0.5">{s.buyers}</dd>
                        </div>
                        <div>
                          <dt className="t-label muted">Why it pays</dt>
                          <dd className="mt-0.5">{s.value}</dd>
                        </div>
                      </div>
                    </dl>
                    <p className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      {s.senses.map((x) => {
                        const Icon = SENSE_ICON[x];
                        return (
                          <span key={x} className={cx("t-label inline-flex items-center gap-1.5", dark ? "text-white/60" : "text-muted")}>
                            <Icon className="h-3.5 w-3.5" strokeWidth={1.9} aria-hidden />
                            {SENSE_LABEL[x]}
                          </span>
                        );
                      })}
                      {s.note ? <span className={cx("text-[12px] leading-snug", dark ? "text-white/50" : "text-faint")}>{s.note}</span> : null}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="svc-scenes fade-in relative hidden lg:col-span-7 lg:block lg:min-h-0">
          {items.map((s) => (
            <Scene key={s.id} slug={s.photo} card={s.card} className="absolute inset-0 h-full w-full rounded-[12px]" sizes="(min-width: 1024px) 56vw, 100vw" />
          ))}
        </div>
      </div>
    </Slide>
  );
}
