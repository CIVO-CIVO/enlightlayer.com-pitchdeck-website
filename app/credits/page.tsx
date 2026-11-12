import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { allPhotos } from "@/lib/photo";

export const metadata: Metadata = { title: "Photo credits" };

export default function Credits() {
  const photos = allPhotos().sort((a, b) => a.subject.localeCompare(b.subject));
  return (
    <main className="min-h-svh bg-paper px-[var(--gutter)] py-10 text-ink">
      <div className="mx-auto max-w-[980px]">
        <a href="/" className="inline-flex rounded-[4px]" aria-label="Back to the deck">
          <Logo />
        </a>
        <h1 className="t-title mt-12">Photo credits</h1>
        <p className="t-lead muted mt-4 max-w-[46rem]">
          Every photograph on this site is openly licensed — public domain, CC0, CC BY or CC BY-SA — and shows a real place that has nothing to do with Enlight
          Layer. We crop them, convert them to grayscale, blur or remove legible faces, plates, logos and lettering, and paint an illustrative infrared
          highlight on top; the highlights are graphics, not measurements. Adaptations of CC BY-SA photographs are shared under the same licence.
        </p>
        <ol className="mt-10 border-t border-line">
          {photos.map((p) => (
            <li key={p.slug} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[1fr_auto] sm:gap-6">
              <div>
                <p className="text-[15.5px] font-semibold tracking-[-0.015em]">{p.subject}</p>
                <p className="muted mt-0.5 text-[14px]">
                  {p.credit.author} ·{" "}
                  <a href={p.credit.url} className="underline underline-offset-4 hover:text-ink" rel="noopener">
                    {p.credit.source}
                  </a>
                </p>
              </div>
              <p className="t-label muted sm:pt-1 sm:text-right">
                {p.credit.licenseUrl ? (
                  <a href={p.credit.licenseUrl} className="underline underline-offset-4 hover:text-ink" rel="noopener license">
                    {p.credit.license}
                  </a>
                ) : (
                  p.credit.license
                )}
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-10">
          <a href="/" className="text-[14.5px] font-semibold underline underline-offset-4">
            ← Back to the deck
          </a>
        </p>
      </div>
    </main>
  );
}
