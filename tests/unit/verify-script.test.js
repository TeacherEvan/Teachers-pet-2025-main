import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { validateRootEngineShim } from "../../scripts/verify-helpers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");

export async function runTests() {
  const rootEnginePath = path.join(repoRoot, "enhanced-comment-engine.js");
  const rootEngineSource = fs.readFileSync(rootEnginePath, "utf8");

  assert.deepEqual(validateRootEngineShim(rootEngineSource), []);

  const brokenShim = rootEngineSource.replace(
    "Legacy compatibility shim",
    "Standalone engine implementation",
  );

  assert.ok(validateRootEngineShim(brokenShim).length > 0);
}