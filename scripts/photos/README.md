One JSON file per contributor: `{ "photos": [ ...manifest entries... ] }`.
`scripts/process-photos.mjs` merges `scripts/photo-manifest.json` (defaults + thermal settings) with every `*.json` here.
