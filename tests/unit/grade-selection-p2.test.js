// tests/unit/grade-selection-p2.test.js
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");

export async function runTests() {
  const html = fs.readFileSync(path.join(repoRoot, "grade-selection.html"), "utf8");
  
  // P2 option exists in select
  assert.ok(html.includes('value="P2"'), 'P2 option must exist in grade select');
  assert.ok(html.includes('P2 - Primary 2 (IEAP)'), 'P2 label must be correct');
  
  // K3 option removed
  assert.ok(!html.includes('value="K3"'), 'K3 option should be removed');
  assert.ok(!html.includes('Kindergarten 3'), 'K3 reference should be removed');
  
  // P2 info box exists
  assert.ok(html.includes('id="p2Info"'), 'P2 info box must exist');
  assert.ok(html.includes('Primary 2'), 'P2 info must mention Primary 2');
  assert.ok(html.includes('IEAP'), 'P2 info must mention IEAP');
  
  // Continue button enables for P2
  assert.ok(html.includes("'P2'"), 'Continue logic must include P2');
  
  // gradeInfos includes P2
  assert.ok(html.includes("'P2': document.getElementById('p2Info')"), 'gradeInfos must include P2');
  
  // Subtitle updated
  assert.ok(html.includes('Choose the grade level'), 'Subtitle must be updated');
  assert.ok(!html.includes('Choose the kindergarten level'), 'Old subtitle should be removed');
  
  // Navigation for P2 goes to month-selection
  assert.ok(html.includes('month-selection.html?grade=${selectedGrade}'), 'Navigation must work for P2');
}