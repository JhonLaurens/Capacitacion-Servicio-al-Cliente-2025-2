#!/usr/bin/env node
// @ts-nocheck
import * as chromeLauncher from "chrome-launcher";
import fs from "fs-extra";
import lighthouse from "lighthouse";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const URL_TO_TEST = process.env.LH_URL || "http://localhost:8080/index.html";
const REPORT_DIR =
  process.env.QA_REPORT_DIR || path.resolve(__dirname, "..", "reports");

const PERF_MIN = Number(process.env.LH_MIN_PERF || 80);
const A11Y_MIN = Number(process.env.LH_MIN_A11Y || 90);
const BP_MIN = Number(process.env.LH_MIN_BP || 90);
const SEO_MIN = Number(process.env.LH_MIN_SEO || 80);

await fs.ensureDir(REPORT_DIR);

const chrome = await chromeLauncher.launch({
  chromeFlags: ["--headless=new", "--disable-gpu", "--no-sandbox"],
});
const options = {
  logLevel: "info",
  output: ["html", "json"],
  onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
  port: chrome.port,
};
const runnerResult = await lighthouse(URL_TO_TEST, options);

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const htmlPath = path.join(REPORT_DIR, `lighthouse-${timestamp}.html`);
const jsonPath = path.join(REPORT_DIR, `lighthouse-${timestamp}.json`);

await fs.writeFile(htmlPath, runnerResult.report[0]);
await fs.writeFile(jsonPath, runnerResult.report[1]);

const categories = runnerResult.lhr.categories;
const scores = {
  performance: Math.round((categories.performance.score || 0) * 100),
  accessibility: Math.round((categories.accessibility.score || 0) * 100),
  bestPractices: Math.round((categories["best-practices"].score || 0) * 100),
  seo: Math.round((categories.seo.score || 0) * 100),
};

const thresholds = {
  performance: PERF_MIN,
  accessibility: A11Y_MIN,
  bestPractices: BP_MIN,
  seo: SEO_MIN,
};
const passed =
  scores.performance >= PERF_MIN &&
  scores.accessibility >= A11Y_MIN &&
  scores.bestPractices >= BP_MIN &&
  scores.seo >= SEO_MIN;

const summary = {
  target: URL_TO_TEST,
  scores,
  thresholds,
  passed,
  htmlPath,
  jsonPath,
};
const summaryPath = path.join(
  REPORT_DIR,
  `lighthouse-summary-${timestamp}.json`
);
await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));

await chrome.kill();

if (!passed) {
  console.error("Lighthouse thresholds not met:", summary);
  process.exit(1);
} else {
  console.log("Lighthouse passed:", summary);
}
