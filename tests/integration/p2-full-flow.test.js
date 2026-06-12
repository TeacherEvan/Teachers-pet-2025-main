import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

export async function runTests() {
  // Test 1: month-selection.html links to p2-subjects.html for P2
  const monthSelPath = path.resolve("month-selection.html");
  const content = fs.readFileSync(monthSelPath, "utf-8");
  assert.ok(content.includes("p2-subjects.html"), "month-selection links to p2-subjects.html");
  assert.ok(content.includes("params.toString()"), "uses params for URL construction");
  assert.ok(content.includes("currentGrade === 'P2'"), "checks for P2 grade");

  // Test 2: app-controller.js registers p2-subjects
  const appCtrlPath = path.resolve("assets/js/controllers/app-controller.js");
  const appCtrl = fs.readFileSync(appCtrlPath, "utf-8");
  assert.ok(appCtrl.includes("p2-subjects"), "app-controller handles p2-subjects");
  assert.ok(appCtrl.includes("p2Subjects"), "app-controller has p2Subjects controller");
  assert.ok(appCtrl.includes("P2SubjectsController"), "imports P2SubjectsController");

  console.log("✅ p2-full-flow integration tests passed");
}