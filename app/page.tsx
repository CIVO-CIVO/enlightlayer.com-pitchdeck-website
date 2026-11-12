import fs from "node:fs";
import path from "node:path";
import { Fragment } from "react";
import { Deck, type SlideMeta } from "@/components/Deck";
import type { Tone } from "@/components/Slide";
import { Area } from "@/components/slides/Area";
import { Contact, Deploy, Market, Trust } from "@/components/slides/Closing";
import { Cover, Flagship, Focus, Problem, Solution } from "@/components/slides/Opening";
import { FLAGSHIP, GROUPS } from "@/content/deck";

const PDF = "/enlight-layer-pitch.pdf";

const AREA_TONES: Tone[] = ["paper-2", "dark", "paper", "dark", "paper", "dark", "paper"];

type Entry = SlideMeta & { render: (n: number, pdf?: string) => React.ReactNode };

const SLIDES: Entry[] = [
  { id: "cover", label: "Enlight Layer", tone: "dark", render: (n) => <Cover n={n} /> },
  { id: "problem", label: "The problem", tone: "paper", render: (n) => <Problem n={n} /> },
  { id: "solution", label: "What we do", tone: "paper-2", render: (n) => <Solution n={n} /> },
  { id: "services", label: "Our services", tone: "dark", render: (n) => <Focus n={n} /> },
  { id: "old-equipment", label: FLAGSHIP.kicker, tone: "paper", render: (n) => <Flagship n={n} /> },
  ...GROUPS.map((g, k): Entry => ({ id: g.id, label: g.name, tone: AREA_TONES[k], render: (n) => <Area n={n} group={g} tone={AREA_TONES[k]} /> })),
  { id: "deployment", label: "How it's deployed", tone: "paper-2", render: (n) => <Deploy n={n} /> },
  { id: "trust", label: "Privacy and safety", tone: "dark", render: (n) => <Trust n={n} /> },
  { id: "market", label: "Market", tone: "paper", render: (n) => <Market n={n} /> },
  { id: "contact", label: "Contact", tone: "dark", render: (n, pdf) => <Contact n={n} pdf={pdf} /> },
];

export default function Page() {
  // the PDF is generated from this page (npm run pdf) and committed; link it only once it exists
  const pdf = fs.existsSync(path.join(process.cwd(), "public", PDF)) ? PDF : undefined;
  return (
    <Deck slides={SLIDES.map(({ id, label, tone }) => ({ id, label, tone }))} pdf={pdf}>
      {SLIDES.map((s, k) => (
        <Fragment key={s.id}>{s.render(k + 1, pdf)}</Fragment>
      ))}
    </Deck>
  );
}
