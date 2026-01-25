import { spawnSync } from "child_process";

const root = process.cwd();

const steps = [
  {
    label: "Verify (lint + docs checks)",
    command: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["run", "verify"],
  },
  {
    label: "Unit + Integration tests",
    command: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["test"],
  },
];

let failures = 0;

for (const step of steps) {
  console.log(`\n=== ${step.label} ===`);
  const result = spawnSync(step.command, step.args, {
    stdio: "inherit",
    cwd: root,
  });
  if (result.status !== 0) {
    console.error(`\n❌ Step failed: ${step.label}`);
    failures += 1;
    break;
  } else {
    console.log(`✅ Step passed: ${step.label}`);
  }
}

console.log("\n=== Manual Browser E2E Checklist ===");
console.log("Open each test page and confirm PASS indicators:");
console.log("- tests/test-all-subjects-audit.html");
console.log("- tests/test-data-integrity.html");
console.log("- tests/test-student-name.html");
console.log("- tests/test-topic-only-selection.html");
console.log("- tests/test-rating-issue.html");
console.log("- tests/test-pvt-integration.html");
console.log("- tests/test-pvt-isolation.html");
console.log("- tests/test-curriculum-persistence.html");
console.log("- tests/test-strengths-weaknesses.html");
console.log("- tests/test-json-loader.html");
console.log("- tests/test-iq-isolation.html");
console.log("- tests/test-december-integration.html");
console.log("- tests/test-k1-december.html");
console.log("- tests/test-k2-january.html");

console.log("\n=== Optional Performance Benchmark ===");
console.log("Run: npm run test:perf");

if (failures > 0) {
  console.error("\nE2E testall FAILED. Fix errors and re-run.");
  process.exit(1);
}

console.log("\nE2E testall completed.");
