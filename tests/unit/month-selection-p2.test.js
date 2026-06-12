// tests/unit/month-selection-p2.test.js
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");

export async function runTests() {
  const html = fs.readFileSync(path.join(repoRoot, "month-selection.html"), "utf8");
  
  // availableMonths config includes P2
  assert.ok(html.includes("'P2':"), 'availableMonths must include P2');
  assert.ok(html.includes("Semester 1"), 'availableMonths P2 must have Semester 1');
  assert.ok(html.includes("Semester 2"), 'availableMonths P2 must have Semester 2');
  
  // Grade display shows P2 correctly
  assert.ok(html.includes('Primary 2'), 'gradeDisplay logic must handle P2');
  assert.ok(html.includes('IEAP'), 'gradeDisplay must show IEAP for P2');
  
  // Semester options in select
  assert.ok(html.includes('value="Semester 1"'), 'Semester 1 option must exist');
  assert.ok(html.includes('Semester 1 (May–Sep)'), 'Semester 1 label correct');
  assert.ok(html.includes('value="Semester 2"'), 'Semester 2 option must exist');
  assert.ok(html.includes('Semester 2 (Nov–Mar)'), 'Semester 2 label correct');
  
  // Semester info boxes
  assert.ok(html.includes('id="semester1Info"'), 'Semester 1 info box must exist');
  assert.ok(html.includes('id="semester2Info"'), 'Semester 2 info box must exist');
  assert.ok(html.includes('First semester of Primary 2 IEAP'), 'Semester 1 info content');
  assert.ok(html.includes('Second semester of Primary 2 IEAP'), 'Semester 2 info content');
  
  // monthInfos includes semesters
  assert.ok(html.includes("'Semester 1': document.getElementById('semester1Info')"), 'monthInfos must include Semester 1');
  assert.ok(html.includes("'Semester 2': document.getElementById('semester2Info')"), 'monthInfos must include Semester 2');
  
  // Label updated
  assert.ok(html.includes('Curriculum Period:'), 'Label must be updated to Period');
  assert.ok(!html.includes('Curriculum Month:'), 'Old label must be removed');
}