import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const filePath = path.resolve("assets/data/curriculum/k2/december.json");

export async function runTests() {
  assert.ok(fs.existsSync(filePath), "december.json should exist");
  
  const content = fs.readFileSync(filePath, "utf-8");
  let curriculum;
  assert.doesNotThrow(() => {
    curriculum = JSON.parse(content);
  }, "Should be valid JSON");

  assert.equal(curriculum.grade, "K2", "grade should be K2");
  assert.equal(curriculum.month, "December", "month should be December");
  assert.ok(Array.isArray(curriculum.subjects), "subjects should be an array");

  curriculum.subjects.forEach((subject, index) => {
    assert.ok(subject.name, `subject[${index}] should have name`);
    assert.ok(Array.isArray(subject.topics), `subject[${index}] topics should be array`);
    assert.ok(subject.description, `subject[${index}] should have description`);
  });

  const subjectNames = curriculum.subjects.map(s => s.name);
  const expectedSubjects = [
    "Mathematics", "I.Q", "Social", "English", "Phonics",
    "Science", "Conversation 1", "Conversation 3",
    "Arts", "Physical Education", "Puppet Show", "Cooking"
  ];
  expectedSubjects.forEach(expected => {
    assert.ok(subjectNames.includes(expected), `Should contain subject: ${expected}`);
  });

  console.log("✅ K2 December Curriculum JSON tests passed");
}