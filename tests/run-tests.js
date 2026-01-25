import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const args = new Set(process.argv.slice(2));
const runUnit = args.size === 0 || args.has("--unit") || args.has("--all");
const runIntegration =
  args.size === 0 || args.has("--integration") || args.has("--all");

const root = path.resolve("tests");
const unitDir = path.join(root, "unit");
const integrationDir = path.join(root, "integration");

const testFiles = [];

function collectTests(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir)
    .filter((file) => file.endsWith(".test.js"))
    .forEach((file) => testFiles.push(path.join(dir, file)));
}

if (runUnit) collectTests(unitDir);
if (runIntegration) collectTests(integrationDir);

if (testFiles.length === 0) {
  console.log("No tests found for the selected scope.");
  process.exit(0);
}

let failures = 0;

for (const file of testFiles) {
  try {
    const module = await import(pathToFileURL(file));
    const runner = module.runTests || module.default;
    if (typeof runner !== "function") {
      throw new Error("Missing runTests export");
    }
    await runner();
    console.log(`✅ ${path.relative(root, file)} passed`);
  } catch (error) {
    failures += 1;
    console.error(`❌ ${path.relative(root, file)} failed`);
    console.error(error);
  }
}

if (failures > 0) {
  console.error(`\n${failures} test suite(s) failed.`);
  process.exit(1);
} else {
  console.log("\nAll test suites passed.");
}
