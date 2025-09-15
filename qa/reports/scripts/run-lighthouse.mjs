#!/usr/bin/env node
import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';
import fs from 'fs-extra';
import path from 'path';

const PORT = process.env.QA_PORT ? Number(process.env.QA_PORT) : 8080;
const TARGET_URL = process.env.QA_TARGET_URL || `http://localhost:${PORT}/index.html`;
const OUT_DIR = process.env.QA_REPORT_DIR || path.resolve('qa', 'reports');
const THRESHOLDS = {
  performance: Number(process.env.QA_LH_PERF || 80),
  accessibility: Number(process.env.QA_LH_A11Y || 90),
  'best-practices': Number(process.env.QA_LH_BP || 90),
  seo: Number(process.env.QA_LH_SEO || 80),
};

await fs.ensureDir(OUT_DIR);

async function run() {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless', '--no-sandbox'] });
  const options = { logLevel: 'info', output: ['html', 'json'], onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'], port: chrome.port };
  const runnerResult = await lighthouse(TARGET_URL, options);

  const reportHtml = runnerResult.report[0];
  const reportJson = runnerResult.report[1];
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const htmlPath = path.join(OUT_DIR, `lighthouse-${timestamp}.html`);
  const jsonPath = path.join(OUT_DIR, `lighthouse-${timestamp}.json`);
  await fs.writeFile(htmlPath, reportHtml);
  await fs.writeFile(jsonPath, reportJson);

  const categories = runnerResult.lhr.categories;
  const scores = {
    performance: Math.round(categories.performance.score * 100),
    accessibility: Math.round(categories.accessibility.score * 100),
    'best-practices': Math.round(categories['best-practices'].score * 100),
    seo: Math.round(categories.seo.score * 100),
  };

  const passed = Object.entries(THRESHOLDS).every(([key, th]) => scores[key] >= th);

  const summary = { target: TARGET_URL, scores, thresholds: THRESHOLDS, passed, htmlPath, jsonPath };
  const summaryPath = path.join(OUT_DIR, `lighthouse-summary-${timestamp}.json`);
  await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));

  await chrome.kill();

  if (!passed) {
    console.error('Lighthouse thresholds not met:', summary);
    process.exit(1);
  } else {
    console.log('Lighthouse passed:', summary);
  }
}

run().catch(async (err) => {
  console.error('Lighthouse run failed:', err);
  process.exit(1);
});
