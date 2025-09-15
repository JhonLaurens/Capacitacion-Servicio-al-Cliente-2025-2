# QA Automation Suite (Lighthouse + SCORM Cloud)

This folder contains a Node.js-based QA automation to validate:

- Technical quality with Lighthouse
- SCORM 1.2 interoperability via SCORM Cloud API v2 (optional)

## Prerequisites

- Node.js 18+
- Docker Desktop running

## Install

From the repo root:

```
cd qa
npm install
```

## Configure

Copy the env sample and edit as needed:

```
copy .env.example .env
```

Key variables (also accepted from CI secrets):

- `LH_URL`: URL to audit (default `http://localhost:8080/index.html`).
- `LH_MIN_PERF`, `LH_MIN_A11Y`, `LH_MIN_BP`, `LH_MIN_SEO`: Thresholds for Lighthouse scores.
- `REQUIRE_SCORM`: If `true`, the overall run fails when SCORM credentials are missing or the SCORM step fails.
- `SCORMCLOUD_APP_ID`, `SCORMCLOUD_SECRET`: Credentials for SCORM Cloud (Basic Auth). When present, SCORM validation runs.
- `QA_REPORT_DIR`: Output folder for reports (default `qa/reports`).

## Run locally

From the repo root:

```
# Start Docker and run full orchestration
npm --prefix qa run orchestrate

# Or CI-like mode (auto stops Docker on exit)
npm --prefix qa run ci
```

Artifacts are saved in `qa/reports`:

- Lighthouse: `lighthouse-*.html`, `lighthouse-*.json`, `lighthouse-summary-*.json`
- SCORM: `scormcloud-*.json`
- Consolidated: `consolidated-report.json`, `consolidated-report.md`

## CI Usage (GitHub Actions)

See workflow at `.github/workflows/qa.yml`. It:

- Checks out the repo
- Sets up Node 18
- Installs QA deps in `qa/`
- Runs `npm --prefix qa run ci`
- Uploads `qa/reports` as artifacts

Provide secrets `SCORMCLOUD_APP_ID` and `SCORMCLOUD_SECRET` if you want the SCORM step executed. Otherwise, leave `REQUIRE_SCORM` as `false` so the pipeline doesn't fail due to missing credentials.
