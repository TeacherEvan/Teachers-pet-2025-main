import { spawnSync } from "child_process";
import { performance } from "node:perf_hooks";

const root = process.cwd();

const steps = [
  {
    label: "Verify (lint + docs checks)",
    command: "npm run verify",
    args: [],
  },
  {
    label: "Unit + Integration tests",
    command: "npm test",
    args: [],
  },
];

let failures = 0;

for (const step of steps) {
  console.log(`\n=== ${step.label} ===`);
  console.log(`$ ${step.command} ${step.args.join(" ")}`.trim());

  const start = performance.now();
  const result = spawnSync(step.command, step.args, {
    cwd: root,
    encoding: "utf-8",
    stdio: "pipe",
    shell: true,
  });
  const duration = (performance.now() - start).toFixed(0);

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }
  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  if (result.error) {
    console.error(`\n❌ Step error: ${step.label}`);
    console.error(result.error);
    failures += 1;
    break;
  }

  if (result.status !== 0) {
    console.error(
      `\n❌ Step failed: ${step.label} (exit ${result.status}) in ${duration}ms`,
    );
    failures += 1;
    break;
  } else {
    console.log(`✅ Step passed: ${step.label} in ${duration}ms`);
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
