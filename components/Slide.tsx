import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export type Tone = "paper" | "paper-2" | "dark";

const pad = (n: number) => String(n).padStart(2, "0");

/** One slide = one screen from 1280×720 up; on phones it grows with its content. */
export function Slide({
  id,
  n,
  label,
  tone,
  children,
  className,
  bodyClassName,
  backdrop,
}: {
  id: string;
  n: number;
  label: string;
  tone: Tone;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  /** full-bleed layer behind the content (the cover photograph) */
  backdrop?: ReactNode;
}) {
  return (
    <section id={id} data-slide="" data-tone={tone} aria-label={label} className={cx("slide", className)}>
      {backdrop}
      <div className={cx("slide-body", bodyClassName)}>
        <p className="t-label muted flex items-center gap-3">
          <span className="tabular-nums">{pad(n)}</span>
          <span aria-hidden className="h-px w-6 bg-current opacity-40" />
          <span>{label}</span>
        </p>
        {children}
      </div>
    </section>
  );
}
