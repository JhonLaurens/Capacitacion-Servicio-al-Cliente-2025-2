#!/usr/bin/env node
// @ts-nocheck
import archiver from "archiver";
import axios from "axios";
import FormData from "form-data";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Env vars
const API_BASE =
  process.env.SCORMCLOUD_API_BASE || "https://cloud.scorm.com/api/v2";
const APP_ID = process.env.SCORMCLOUD_APP_ID; // required
const SECRET_KEY = process.env.SCORMCLOUD_SECRET; // required
const ORG_ID = process.env.SCORMCLOUD_ORG || "default";
const COURSE_ID = process.env.SCORMCLOUD_COURSE_ID || `colte-${Date.now()}`;
const VERSION_TAG = process.env.SCORMCLOUD_VERSION || new Date().toISOString();
const REPORT_DIR =
  process.env.QA_REPORT_DIR || path.resolve(__dirname, "..", "reports");
const PACKAGE_DIR =
  process.env.SCORM_PACKAGE_DIR ||
  path.resolve(__dirname, "..", "..", "scorm-package");
const PACKAGE_ZIP = path.resolve("Coltefinanciera-SAC-2025-2.zip");

// Thresholds (SCORM level)
const THRESHOLDS = {
  completion: Number(process.env.QA_SCORM_COMPLETION || 100), // % registrations completed
  successRate: Number(process.env.QA_SCORM_SUCCESS || 100), // % passed if applies
};

await fs.ensureDir(REPORT_DIR);

function assertEnv(name) {
  if (!process.env[name]) {
    throw new Error(`Missing required env var: ${name}`);
  }
}

assertEnv("SCORMCLOUD_APP_ID");
assertEnv("SCORMCLOUD_SECRET");

function scormClient() {
  const instance = axios.create({ baseURL: API_BASE, timeout: 60000 });
  instance.interceptors.request.use((config) => {
    // Basic auth: appId:secret
    const token = Buffer.from(`${APP_ID}:${SECRET_KEY}`).toString("base64");
    config.headers.Authorization = `Basic ${token}`;
    return config;
  });
  return instance;
}

async function zipPackage(inputDir, outZip) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outZip);
    const archive = archiver("zip", { zlib: { level: 9 } });
    output.on("close", resolve);
    archive.on("error", reject);
    archive.pipe(output);
    archive.directory(inputDir, false);
    archive.finalize();
  });
}

async function uploadCourse(api, orgId, courseId, zipPath, versionTag) {
  const form = new FormData();
  form.append("courseId", courseId);
  form.append("versionId", versionTag);
  form.append("contentZip", fs.createReadStream(zipPath));
  const res = await api.post(`/courses/${orgId}/imports`, form, {
    headers: form.getHeaders(),
  });
  return res.data; // contains import job id
}

async function waitImport(api, orgId, jobId, timeoutMs = 300000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const { data } = await api.get(`/courses/${orgId}/imports/${jobId}`);
    if (data.status === "completed") return data;
    if (data.status === "failed")
      throw new Error(`Import failed: ${JSON.stringify(data)}`);
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error("Import timed out");
}

async function createRegistration(api, orgId, courseId) {
  const regId = `${courseId}-reg-${Date.now()}`;
  const learner = {
    id: `auto-${Date.now()}`,
    firstName: "QA",
    lastName: "Bot",
    email: "qa@example.com",
  };
  const payload = { courseId, registrationId: regId, learner, postBack: null };
  await api.post(`/registrations/${orgId}`, payload);
  return regId;
}

async function launchAndPoll(api, orgId, regId, timeoutMs = 300000) {
  // Request launch link
  const { data: launch } = await api.post(
    `/registrations/${orgId}/${regId}/launchLink`,
    {
      redirectOnExitUrl: "https://example.com",
    }
  );

  // We cannot interactively complete the course here; instead, poll for data to ensure the course initializes, tracks, and terminates correctly.
  const start = Date.now();
  let initialized = false;
  while (Date.now() - start < timeoutMs) {
    const { data } = await api.get(`/registrations/${orgId}/${regId}/progress`);
    if (data?.registration?.updated !== null) {
      initialized = true;
    }
    if (
      data?.registration?.completion === "COMPLETED" ||
      data?.registration?.success === "PASSED"
    ) {
      return data; // Completed
    }
    // keep polling
    await new Promise((r) => setTimeout(r, 5000));
  }
  if (!initialized)
    throw new Error(
      "Registration never initialized (API data did not change)."
    );
  return { registration: { completion: "UNKNOWN" } };
}

function evaluateScorm(progressData) {
  const completion = progressData?.registration?.completion || "UNKNOWN";
  const success = progressData?.registration?.success || "UNKNOWN";
  const passed = completion === "COMPLETED";
  const successPassed = success === "PASSED" || success === "UNKNOWN";

  const metrics = {
    completionState: completion,
    successState: success,
    passed,
    successPassed,
  };
  return metrics;
}

async function run() {
  // Zip the package if not present or asked to rebuild
  const forceZip = process.env.SCORM_FORCE_ZIP === "1";
  if (forceZip || !(await fs.pathExists(PACKAGE_ZIP))) {
    await zipPackage(PACKAGE_DIR, PACKAGE_ZIP);
  }

  const api = scormClient();

  // Upload/import
  const importJob = await uploadCourse(
    api,
    ORG_ID,
    COURSE_ID,
    PACKAGE_ZIP,
    VERSION_TAG
  );
  const completedImport = await waitImport(api, ORG_ID, importJob.id);

  // Create a registration and poll
  const regId = await createRegistration(api, ORG_ID, COURSE_ID);
  const progress = await launchAndPoll(api, ORG_ID, regId);

  // Evaluate results
  const metrics = evaluateScorm(progress);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const jsonPath = path.join(REPORT_DIR, `scormcloud-${timestamp}.json`);
  await fs.writeFile(
    jsonPath,
    JSON.stringify({ courseId: COURSE_ID, regId, progress, metrics }, null, 2)
  );

  // Thresholds: Require completion
  const scormPassed = metrics.passed;
  if (!scormPassed) {
    console.error(
      "SCORM validation failed (completion not achieved):",
      metrics
    );
    process.exit(1);
  } else {
    console.log("SCORM validation passed:", metrics);
  }
}

run().catch((err) => {
  console.error(
    "SCORM Cloud run failed:",
    err?.response?.data || err.message || err
  );
  process.exit(1);
});
