#!/usr/bin/env node
/**
 * `npm run pdf [-- --url http://localhost:3210]`
 *
 * Prints the deck to public/enlight-layer-pitch.pdf (one 16:9 page per slide, the
 * print stylesheet in app/globals.css) and renders the link preview public/og.jpg
 * from the cover. Run it against a production server after every content change
 * and commit both files.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const URL = argv.includes("--url") ? argv[argv.indexOf("--url") + 1] : "http://localhost:3210";
const PDF = path.join(ROOT, "public/enlight-layer-pitch.pdf");
const OG = path.join(ROOT, "public/og.jpg");

const browser = await chromium.launch({ channel: "chrome", headless: true });

async function loadAll(page) {
  await page.evaluate(async () => {
    const imgs = [...document.images];
    imgs.forEach((i) => (i.loading = "eager"));
    await Promise.all(imgs.map((i) => (i.complete ? null : new Promise((r) => ((i.onload = r), (i.onerror = r))))));
    await document.fonts.ready;
  });
}

// the deck, one slide per page
{
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, reducedMotion: "reduce" });
  await page.goto(URL, { waitUntil: "networkidle" });
  await loadAll(page);
  await page.emulateMedia({ media: "print" });
  await page.pdf({ path: PDF, width: "1600px", height: "900px", printBackground: true, preferCSSPageSize: true });
  const slides = await page.$$eval("[data-slide]", (els) => els.length);
  console.log(`✓ ${path.relative(ROOT, PDF)} — ${slides} slides, ${(fs.statSync(PDF).size / 1048576).toFixed(1)} MB`);
  await page.close();
}

// link preview from the cover
{
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  await page.goto(URL, { waitUntil: "networkidle" });
  await loadAll(page);
  await page.addStyleTag({ content: ".deck-rail,.deck-progress,nextjs-portal{display:none!important}" });
  await page.screenshot({ path: OG, type: "jpeg", quality: 86 });
  console.log(`✓ ${path.relative(ROOT, OG)}`);
  await page.close();
}

await browser.close();
