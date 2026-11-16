// Dot map of North America and Europe (incl. Eastern Europe) for the Enlight Layer market slide.
// Natural Earth 1:50m via world-atlas (public domain). Writes an SVG per tone + a small JSON with label positions.
// usage (the three packages are not project dependencies):
//   cd $(mktemp -d) && npm i world-atlas@2.0.2 topojson-client@3.1.0 d3-geo@3.1.1 && cp <repo>/scripts/make-map.cjs . && node make-map.cjs out
//   then copy out/map-*.svg to public/img/ and out/map.json to content/
const fs = require("fs");
const path = require("path");
const t = require("world-atlas/countries-50m.json");
const { feature } = require("topojson-client");
const { geoContains } = require("d3-geo");

const out = process.argv[2];
const W = 1200, STEP = 8, R = 2.3;
const LON0 = -168, LON1 = 62, LAT0 = 9, LAT1 = 80;
const kx = W / (LON1 - LON0);
const ky = kx * 1.12; // a touch taller than plain equirectangular so Europe doesn't look squashed
const H = Math.round((LAT1 - LAT0) * ky / STEP) * STEP;

const NA = new Set(["United States of America", "Canada"]);
const EU = new Set([
  // EU-27
  "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czechia", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece",
  "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania",
  "Slovakia", "Slovenia", "Spain", "Sweden", "Åland",
  // EEA, UK, Switzerland and the small states
  "Iceland", "Liechtenstein", "Norway", "United Kingdom", "Switzerland", "Andorra", "Monaco", "San Marino", "Vatican",
  "Faeroe Is.", "Isle of Man", "Guernsey", "Jersey",
  // the rest of Eastern Europe and the Balkans
  "Ukraine", "Moldova", "Serbia", "Bosnia and Herz.", "Montenegro", "Macedonia", "Albania", "Kosovo",
]);

const countries = feature(t, t.objects.countries).features.filter((f) => f.properties.name !== "Antarctica");
const dots = [];
for (let y = STEP / 2; y < H; y += STEP) {
  for (let x = STEP / 2; x < W; x += STEP) {
    const lon = LON0 + x / kx, lat = LAT1 - y / ky;
    let hit = null;
    for (const f of countries) {
      if (geoContains(f, [lon, lat])) { hit = f.properties.name; break; }
    }
    if (!hit) continue;
    let region = 0;
    if (NA.has(hit) && !(lat < 30 && lon < -140)) region = 1; // no Hawaii
    if (EU.has(hit) && lon > -25 && lat > 34 && lat < 72) region = 2; // no Canaries, Caribbean France or Svalbard
    dots.push([x, y, region]);
  }
}

const centroid = (r) => {
  const d = dots.filter((p) => p[2] === r);
  return [d.reduce((s, p) => s + p[0], 0) / d.length / W * 100, d.reduce((s, p) => s + p[1], 0) / d.length / H * 100];
};
const labels = { NA: centroid(1).map((v) => +v.toFixed(1)), EU: centroid(2).map((v) => +v.toFixed(1)) };

const svg = (rest, accent) => {
  const g = (r, fill) => `<g fill="${fill}">${dots.filter((p) => p[2] === r).map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="${R}"/>`).join("")}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">${g(0, rest)}${g(1, accent)}${g(2, accent)}</svg>\n`;
};
fs.writeFileSync(path.join(out, "map-light.svg"), svg("#cfcdc5", "#cf4622"));
fs.writeFileSync(path.join(out, "map-dark.svg"), svg("#3a3a37", "#e0603c"));
fs.writeFileSync(path.join(out, "map.json"), JSON.stringify({ w: W, h: H, labels }, null, 2) + "\n");
console.log({ W, H, dots: dots.length, na: dots.filter((p) => p[2] === 1).length, eu: dots.filter((p) => p[2] === 2).length, labels });
