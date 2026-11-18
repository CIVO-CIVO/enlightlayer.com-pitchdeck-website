import { cx } from "@/lib/cx";

/**
 * The mark, the same family as Enlightdata.ai: two corner brackets framing one point of interest.
 * On Enlight Layer the point is orange.
 */
export function Mark({ className, tone = "ink" }: { className?: string; tone?: "ink" | "white" }) {
  const stroke = tone === "white" ? "#ffffff" : "#151515";
  return (
    <svg viewBox="0 0 24 24" className={cx("h-6 w-6", className)} aria-hidden focusable="false">
      <path d="M3.2 10.2V3.2h7" fill="none" stroke={stroke} strokeWidth="2.6" strokeLinecap="square" />
      <path d="M20.8 13.8v7h-7" fill="none" stroke={stroke} strokeWidth="2.6" strokeLinecap="square" />
      <rect x="9.2" y="9.2" width="5.6" height="5.6" fill="#cf4622" />
    </svg>
  );
}

export function Logo({ className, tone = "ink" }: { className?: string; tone?: "ink" | "white" }) {
  return (
    <span className={cx("inline-flex items-center gap-2.5", tone === "white" ? "text-white" : "text-ink", className)}>
      <Mark tone={tone} />
      <span className="font-wordmark text-[1.15rem] leading-none font-semibold tracking-[-0.03em]">Enlight Layer</span>
    </span>
  );
}
