import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const filePath = path.resolve("assets/data/curriculum/k1/december.json");

export async function runTests() {
  // Test 1: File exists and is valid JSON
  assert.ok(fs.existsSync(filePath), "december.json should exist");
  
  const content = fs.readFileSync(filePath, "utf-8");
  let curriculum;
  assert.doesNotThrow(() => {
    curriculum = JSON.parse(content);
  }, "Should be valid JSON");

  // Test 2: Required schema
  assert.equal(curriculum.grade, "K1", "grade should be K1");
  assert.equal(curriculum.month, "December", "month should be December");
  assert.ok(Array.isArray(curriculum.subjects), "subjects should be an array");
  assert.ok(curriculum.subjects.length > 0, "should have at least one subject");

  // Test 3: Each subject has name, topics, description
  curriculum.subjects.forEach((subject, index) => {
    assert.ok(subject.name, `subject[${index}] should have name`);
    assert.ok(Array.isArray(subject.topics), `subject[${index}] topics should be array`);
    assert.ok(subject.description, `subject[${index}] should have description`);
  });

  // Test 4: Contains all 10 expected K1 December subjects
  const subjectNames = curriculum.subjects.map(s => s.name);
  const expectedSubjects = [
    "English", "Mathematics", "I.Q", "Phonics", "Science",
    "Conversation 1", "Conversation 3", "Arts",
    "Physical Education", "Puppet Show"
  ];
  expectedSubjects.forEach(expected => {
    assert.ok(subjectNames.includes(expected), `Should contain subject: ${expected}`);
  });

  console.log("✅ K1 December Curriculum JSON tests passed");
}