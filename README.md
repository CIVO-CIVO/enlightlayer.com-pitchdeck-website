# Enlight Layer — pitch deck website

A one-page pitch deck for **Enlight Layer**: custom AI monitoring on cameras and sensors, for the places nobody watches (Europe and North America). Sixteen slides, each one screen from 1280×720 up; on phones the slides grow with their content.

- **Live:** every push to `main` deploys on Vercel. Server code is pinned to Stockholm (`vercel.json` → `arn1`).
- **Shared by link, not by search:** every route is `noindex` (metadata, `X-Robots-Tag`, `robots.txt`).
- The bigger site with 15 design variants lives next door in `../website/` (local only).

## Run it

```bash
npm install
npm run dev                      # http://localhost:3200
NEXT_DIST_DIR=.next-build npm run build && NEXT_DIST_DIR=.next-build npm start   # production preview on :3210
```

Presenting: ← → / ↑ ↓ / Space / PgUp PgDn move slide by slide, Home/End jump, **F** (or the Present button) goes fullscreen with one slide per screen. `#svc-<id>` links open a single service (e.g. `/#svc-marinas`).

## Where things are

| | |
|---|---|
| `content/deck.ts` | **All copy**: the 26 services in 7 areas (what each watches, an example alert, who buys it, why it pays, its photo), plus every slide's text |
| `docs/` (local only) | Internal notes kept out of this public repo: the owner's original service list, a generated catalogue (`scripts/services-md.mjs`) and the claims still to confirm |
| `app/page.tsx` | Slide order and slide colours |
| `components/slides/` | `Opening.tsx` (cover, problem, layers, services index, 1/25 slide), `Area.tsx` (one slide per area), `Closing.tsx` (deployment, privacy, market, contact) |
| `components/Scene.tsx` | Photo + infrared + brackets + example alert, cover-cropped in pure CSS |
| `components/Stack.tsx` | The exploded L0–L3 layer view |
| `components/Deck.tsx` | Header, counter, keyboard, present mode, side rail (the only client JS) |
| `app/credits/` | Photo credits page (required by the CC BY / BY-SA licences) |

To change a service: edit `content/deck.ts`; the index, the area slide and the PDF all follow. A sixth service in one area still works (the picker handles six); more needs another rule in `.svc` in `app/globals.css`.

## Photos

Every photo is openly licensed (public domain, CC0, CC BY or CC BY-SA), downloaded once without any account or key, and processed by `scripts/process-photos.mjs`: crop, neutral grayscale, tone-mapping, one soft infrared glow on the focus object (an illustration computed from the photo — not sensor data). The infrared never animates.

- Entries: `scripts/photos/*.json` (one file per contributor) + defaults in `scripts/photo-manifest.json`.
- Raw files: `assets-src/raw/` (not committed); provenance in `assets-src/raw/sources-*.json` (committed).
- Run `npm run photos` (or `-- --only slugA,slugB`) → `public/img/photo|thumb|ir/`, `content/photos.ts`, `PHOTO_SOURCES.md`, QA previews in `qa/photo-previews/`.

## PDF and link preview

After content changes, build and start the production preview, then `npm run pdf` → `public/enlight-layer-pitch.pdf` (one 16:9 page per slide) and `public/og.jpg`. Commit both; the header's PDF button appears once the file exists.

## QA

`npm run qa` (dev server running) screenshots every slide at 1440×900, 1280×720, 1920×1080 and 390×844, checks one-screen fit, sideways overflow, broken and missing photos, and writes contact sheets to `qa/`.

## Rules

- Never invent customers, partners, numbers, prices or traction. Alerts on photos are examples.
- No animation on the infrared. Motion is limited to a few one-time entrances, and is off with reduced motion.
