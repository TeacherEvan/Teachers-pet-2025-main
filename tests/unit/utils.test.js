import assert from "node:assert/strict";
import { TeachersPetUtils } from "../../assets/js/engine/utils.js";

export async function runTests() {
  assert.equal(TeachersPetUtils.naturalJoin([]), "");
  assert.equal(TeachersPetUtils.naturalJoin(["Math"]), "Math");
  assert.equal(
    TeachersPetUtils.naturalJoin(["Math", "Science"]),
    "Math and Science",
  );
  assert.equal(
    TeachersPetUtils.naturalJoin(["Math", "Science", "Art"]),
    "Math, Science, and Art",
  );

  assert.deepEqual(
    TeachersPetUtils.processTextArray("focus, teamwork , creativity", 2),
    ["focus", "teamwork"],
  );
  assert.deepEqual(TeachersPetUtils.processTextArray("", 5), []);
  assert.deepEqual(TeachersPetUtils.processTextArray(null, 5), []);

  assert.equal(TeachersPetUtils.getWordCount("Hello   world"), 2);
  assert.equal(TeachersPetUtils.getWordCount(""), 0);

  const fixed = TeachersPetUtils.improveGrammar("hello world");
  assert.ok(fixed.startsWith("Hello"));
  assert.ok(/[.!?]$/.test(fixed));

  const nameApplied = TeachersPetUtils.ensureNameUsage(
    "He is kind. He helps.",
    "Ava",
  );
  assert.ok(nameApplied.includes("Ava"));
}
