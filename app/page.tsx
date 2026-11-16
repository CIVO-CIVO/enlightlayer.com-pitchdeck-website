import fs from "node:fs";
import path from "node:path";
import { Fragment } from "react";
import { Deck, type SlideMeta } from "@/components/Deck";
import type { Tone } from "@/components/Slide";
import { Area } from "@/components/slides/Area";
import { Contact, Deploy, Market, Trust } from "@/components/slides/Closing";
import { Ideas, MoreIdeas } from "@/components/slides/Ideas";
import { Cover, Flagship, Problem, Solution } from "@/components/slides/Opening";
import { Overview } from "@/components/slides/Overview";
import { Why } from "@/components/slides/Why";
import { CONTACT, DEPLOY, FLAGSHIP, FOCUS, GROUPS, IDEAS, MORE_IDEAS, WHY } from "@/content/deck";

const PDF = "/enlight-layer-pitch.pdf";

const AREA_TONES: Tone[] = ["paper", "dark", "paper", "dark", "paper", "dark", "paper"];

type Entry = SlideMeta & { render: (n: number, pdf?: string) => React.ReactNode };

const SLIDES: Entry[] = [
  { id: "cover", label: "Enlight Layer", tone: "dark", render: (n) => <Cover n={n} /> },
  { id: "solution", label: "What we do", tone: "paper-2", render: (n) => <Solution n={n} /> },
  { id: "problem", label: "The problem", tone: "paper", render: (n) => <Problem n={n} /> },
  { id: "ideas", label: IDEAS.kicker, tone: "paper-2", render: (n) => <Ideas n={n} /> },
  { id: "why", label: WHY.kicker, tone: "dark", render: (n) => <Why n={n} /> },
  { id: "services", label: FOCUS.kicker, tone: "paper-2", render: (n) => <Overview n={n} /> },
  { id: "old-equipment", label: FLAGSHIP.kicker, tone: "paper", render: (n) => <Flagship n={n} /> },
  // the first area continues "Where we start": same look, labelled 2/2
  ...GROUPS.map((g, k): Entry => ({
    id: g.id,
    label: k === 0 ? FLAGSHIP.kicker : g.name,
    tone: AREA_TONES[k],
    render: (n) => <Area n={n} group={g} tone={AREA_TONES[k]} label={k === 0 ? `${FLAGSHIP.kicker} · 2/2 · ${g.name}` : undefined} />,
  })),
  { id: "deployment", label: DEPLOY.kicker, tone: "dark", render: (n) => <Deploy n={n} /> },
  { id: "market", label: "Market", tone: "paper", render: (n) => <Market n={n} /> },
  { id: "trust", label: "Privacy and safety", tone: "dark", render: (n) => <Trust n={n} /> },
  { id: "more-ideas", label: MORE_IDEAS.kicker, tone: "paper-2", render: (n) => <MoreIdeas n={n} /> },
  { id: "contact", label: CONTACT.kicker, tone: "dark", render: (n, pdf) => <Contact n={n} pdf={pdf} /> },
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
