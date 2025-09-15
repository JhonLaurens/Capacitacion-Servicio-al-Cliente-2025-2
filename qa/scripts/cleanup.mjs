#!/usr/bin/env node
// @ts-nocheck
/**
 * Cleanup script for QA project
 * Removes old reports, temp files, and resets environment
 */

import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPORTS_DIR = path.resolve(__dirname, "..", "reports");
const TEMP_DIRS = [
  path.resolve(__dirname, "..", "node_modules", ".cache"),
  path.resolve(__dirname, "..", "..", "Coltefinanciera-SAC-2025-2.zip"),
];

async function cleanup() {
  console.log("🧹 Iniciando limpieza del proyecto QA...");

  // Clean reports directory
  try {
    if (await fs.pathExists(REPORTS_DIR)) {
      const files = await fs.readdir(REPORTS_DIR);
      const reportFiles = files.filter(
        (f) =>
          f.startsWith("lighthouse-") ||
          f.startsWith("scormcloud-") ||
          f.startsWith("consolidated-")
      );

      console.log(
        `📄 Eliminando ${reportFiles.length} archivos de reportes...`
      );
      for (const file of reportFiles) {
        await fs.remove(path.join(REPORTS_DIR, file));
      }
    }
  } catch (error) {
    console.warn("⚠️  Error limpiando reportes:", error.message);
  }

  // Clean temp directories
  for (const tempDir of TEMP_DIRS) {
    try {
      if (await fs.pathExists(tempDir)) {
        console.log(
          `🗂️  Eliminando directorio temporal: ${path.basename(tempDir)}`
        );
        await fs.remove(tempDir);
      }
    } catch (error) {
      console.warn(`⚠️  Error eliminando ${tempDir}:`, error.message);
    }
  }

  // Clean npm cache
  try {
    const { execSync } = await import("child_process");
    console.log("📦 Limpiando cache de npm...");
    execSync("npm cache clean --force", { stdio: "inherit" });
  } catch (error) {
    console.warn("⚠️  Error limpiando cache npm:", error.message);
  }

  console.log("✅ Limpieza completada exitosamente!");
}

// Show usage if called with --help
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`
🧹 QA Project Cleanup Script

Uso:
  node scripts/cleanup.mjs [options]

Opciones:
  -h, --help    Mostrar esta ayuda
  
Limpia:
  ✓ Reportes de Lighthouse (lighthouse-*)
  ✓ Reportes de SCORM Cloud (scormcloud-*)  
  ✓ Reportes consolidados (consolidated-*)
  ✓ Cache de npm
  ✓ Archivos temporales

Ejemplo:
  npm run cleanup
  `);
  process.exit(0);
}

cleanup().catch((error) => {
  console.error("❌ Error durante la limpieza:", error);
  process.exit(1);
});
