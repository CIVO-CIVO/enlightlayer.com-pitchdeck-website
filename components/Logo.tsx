import { cx } from "@/lib/cx";

/** The mark: two opposing inspection brackets around a single signal — "a region of interest". */
export function Mark({ className, tone = "ink" }: { className?: string; tone?: "ink" | "white" }) {
  const stroke = tone === "white" ? "#ffffff" : "#151515";
  return (
    <svg viewBox="0 0 24 24" className={cx("h-6 w-6", className)} aria-hidden focusable="false">
      <path d="M3.5 10V3.5H10" fill="none" stroke={stroke} strokeWidth="2.1" strokeLinecap="square" />
      <path d="M20.5 14v6.5H14" fill="none" stroke={stroke} strokeWidth="2.1" strokeLinecap="square" />
      <circle cx="12" cy="12" r="3.1" fill="#cf4622" />
      <circle cx="12" cy="12" r="5.2" fill="none" stroke="#d04a9a" strokeOpacity=".45" strokeWidth="1" />
    </svg>
  );
}

export function Logo({ className, tone = "ink" }: { className?: string; tone?: "ink" | "white" }) {
  return (
    <span className={cx("inline-flex items-center gap-2.5", tone === "white" ? "text-white" : "text-ink", className)}>
      <Mark tone={tone} />
      <span className="text-[16.5px] leading-none font-semibold tracking-[-0.025em]">Enlight Layer</span>
    </span>
  );
}
