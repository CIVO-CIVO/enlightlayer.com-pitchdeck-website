#!/usr/bin/env node
// Writes docs/SERVICES.md from content/deck.ts — the readable catalogue of every service.
// Run: node --experimental-strip-types --no-warnings scripts/services-md.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GROUPS, SENSE_LABEL, SERVICES } from "../content/deck.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
let md = `# Enlight Layer — services

Generated from \`content/deck.ts\` by \`scripts/services-md.mjs\` — edit the content file, then re-run. The owner's original list (verbatim, mostly Norwegian) is in \`docs/service-ideas-2026-11-11.md\`.

**${SERVICES.length} services in ${GROUPS.length} areas.** Custom AI monitoring on cameras and sensors for companies across Europe and North America. Alerts are examples, not measured results.

`;
GROUPS.forEach((g, k) => {
  md += `## ${String(k + 1).padStart(2, "0")} · ${g.name}\n\n*${g.title}* ${g.line}\n\n`;
  for (const s of SERVICES.filter((x) => x.group === g.id)) {
    md += `### ${s.name}${s.flagship ? " ★" : ""}\n\n${s.line}\n\n`;
    md += `- **Watches:** ${s.watches}\n- **Alert when:** ${cap(s.alert)}.\n`;
    if (s.then) md += `- **Then:** ${s.then}\n`;
    md += `- **For:** ${s.buyers}\n- **Why it pays:** ${s.value}\n- **Sensors:** ${s.senses.map((x) => SENSE_LABEL[x]).join(", ")}\n`;
    if (s.note) md += `- **Boundary:** ${s.note}\n`;
    md += `- **Photo:** \`${s.photo}\` · example card: “${s.card.meta} — ${s.card.title}”\n\n`;
  }
});
md += `★ = the owner's strongest candidates (old equipment online, unmanned pump stations, marinas). Not shown as a badge on the deck.\n`;
fs.writeFileSync(path.join(ROOT, "docs/SERVICES.md"), md);
console.log(`docs/SERVICES.md — ${SERVICES.length} services`);
