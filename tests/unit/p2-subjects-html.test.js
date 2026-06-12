import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

export async function runTests() {
  const filePath = path.resolve("p2-subjects.html");
  assert.ok(fs.existsSync(filePath), "p2-subjects.html should exist");
  
  const content = fs.readFileSync(filePath, "utf-8");
  
  // Required structure elements
  assert.ok(content.includes("subjects-container"), "has subjects container");
  assert.ok(content.includes("selection-summary"), "has selection summary");
  assert.ok(content.includes("generate-comments"), "has generate button");
  assert.ok(content.includes("current-grade-month"), "has grade/month display");
  assert.ok(content.includes('type="module"'), "uses ES modules");
  assert.ok(content.includes("P2SubjectsController"), "imports controller");
  assert.ok(content.includes("TeachersPetApp"), "imports app controller");
  
  console.log("✅ p2-subjects-html tests passed");
}