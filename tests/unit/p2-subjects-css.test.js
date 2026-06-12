import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

export async function runTests() {
  const cssPath = path.resolve("assets/css/subjects.css");
  const content = fs.readFileSync(cssPath, "utf-8");
  
  // P2-specific styles
  assert.ok(content.includes(".subject-name-th"), "has Thai name styling");
  assert.ok(content.includes(".subject-name-en"), "has English name styling");
  assert.ok(content.includes(".topic-name-th"), "has Thai topic styling");
  assert.ok(content.includes(".rating-stars"), "has star rating styles");
  assert.ok(content.includes(".star.filled"), "has filled star style");
  
  console.log("✅ p2-subjects-css tests passed");
}