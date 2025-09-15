#!/usr/bin/env node
// @ts-nocheck
import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPORT_DIR = process.env.QA_REPORT_DIR || path.resolve("qa", "reports");
const CI_MODE = process.argv.includes("--ci");
const ROOT_DIR = path.resolve(__dirname, "..", "..");
const COMPOSE_FILE =
  process.env.COMPOSE_FILE || path.join(ROOT_DIR, "docker-compose.yml");
const REQUIRE_SCORM =
  (process.env.REQUIRE_SCORM || "false").toLowerCase() === "true";
const SCORM_ENABLED = Boolean(
  process.env.SCORMCLOUD_APP_ID && process.env.SCORMCLOUD_SECRET
);

await fs.ensureDir(REPORT_DIR);

function run(cmd, options = {}) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: "inherit", ...options });
}

function latestReport(prefix) {
  const files = fs
    .readdirSync(REPORT_DIR)
    .filter((f) => f.startsWith(prefix))
    .sort();
  if (!files.length) return null;
  return path.join(REPORT_DIR, files[files.length - 1]);
}

function consolidate() {
  const lhSummaryPath = latestReport("lighthouse-summary-");
  const scormJsonPath = latestReport("scormcloud-");
  const lighthouse = lhSummaryPath ? fs.readJSONSync(lhSummaryPath) : null;
  const scorm = scormJsonPath ? fs.readJSONSync(scormJsonPath) : null;

  const out = {
    timestamp: new Date().toISOString(),
    lighthouse,
    scorm,
    overallPassed: (() => {
      const lhPass = lighthouse?.passed ?? false;
      const scPass = scorm?.passed ?? false;
      if (REQUIRE_SCORM) return lhPass && scPass;
      return lhPass && (scorm ? scPass : true);
    })(),
  };
  const jsonOut = path.join(REPORT_DIR, "consolidated-report.json");
  fs.writeFileSync(jsonOut, JSON.stringify(out, null, 2));
  const md = [
    `# QA Consolidated Report`,
    `Date: ${out.timestamp}`,
    "",
    "## Lighthouse",
    lighthouse
      ? `- URL: ${lighthouse.target}\n- Scores: ${JSON.stringify(
          lighthouse.scores
        )}\n- Thresholds: ${JSON.stringify(lighthouse.thresholds)}\n- Passed: ${
          lighthouse.passed
        }`
      : "- No data",
    "",
    "## SCORM Cloud",
    scorm
      ? `- CourseId: ${scorm.courseId || "n/a"}\n- Import: ${
          scorm.importStatus || "n/a"
        }\n- Passed: ${scorm.passed ?? "n/a"}`
      : "- No data",
    "",
    `## Overall`,
    `- Passed: ${out.overallPassed}`,
  ].join("\n");
  const mdOut = path.join(REPORT_DIR, "consolidated-report.md");
  fs.writeFileSync(mdOut, md);
  return { jsonOut, mdOut, overallPassed: out.overallPassed };
}

try {
  // 1) Build & start Docker (compose file at repo root)
  run(`docker compose -f "${COMPOSE_FILE}" up --build -d`, { cwd: ROOT_DIR });
  // Wait for Nginx
  await new Promise((r) => setTimeout(r, 5000));

  // 2) Lighthouse
  run(`node ${path.join(ROOT_DIR, "qa", "scripts", "run-lighthouse.mjs")}`, {
    cwd: ROOT_DIR,
  });

  // 3) SCORM Cloud (optional unless REQUIRE_SCORM=true)
  if (SCORM_ENABLED) {
    run(`node ${path.join(ROOT_DIR, "qa", "scripts", "run-scormcloud.mjs")}`, {
      cwd: ROOT_DIR,
    });
  } else {
    console.log("Skipping SCORM Cloud step (credentials not provided).");
    if (REQUIRE_SCORM) {
      throw new Error(
        "REQUIRE_SCORM=true but SCORMCLOUD credentials are missing."
      );
    }
  }

  // 4) Consolidate reports
  const { jsonOut, mdOut, overallPassed } = consolidate();
  console.log("Consolidated reports:", { jsonOut, mdOut, overallPassed });

  if (!overallPassed) {
    throw new Error("Overall QA failed. See consolidated report for details.");
  }

  if (CI_MODE) {
    console.log("CI mode finished successfully.");
  }
} catch (err) {
  console.error("Orchestration failed:", err?.message || err);
  process.exit(1);
} finally {
  if (CI_MODE) {
    try {
      run(`docker compose -f "${COMPOSE_FILE}" down`, { cwd: ROOT_DIR });
    } catch {}
  }
}
