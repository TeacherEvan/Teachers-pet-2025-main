// tests/unit/p2-curriculum-data.test.js
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

export async function runTests() {
  const repoRoot = path.resolve(process.cwd());
  
  // Test Semester 1 exists and has correct structure
  const sem1Path = path.join(repoRoot, "assets/data/curriculum/p2/semester 1.json");
  assert.ok(fs.existsSync(sem1Path), "semester 1.json must exist");
  
  const sem1 = JSON.parse(fs.readFileSync(sem1Path, "utf8"));
  assert.equal(sem1.grade, "P2");
  assert.equal(sem1.month, "Semester 1");
  assert.ok(Array.isArray(sem1.subjects), "subjects must be array");
  assert.ok(sem1.subjects.length >= 8, "Must have at least 8 subjects");
  
  // Verify all 8 subjects present
  const subjectNames = sem1.subjects.map(s => s.name);
  const required = ["Thai Language", "Mathematics", "Science", "Social Studies", "English", "Arts", "Health & Physical Education", "Computing"];
  for (const req of required) {
    assert.ok(subjectNames.includes(req), `Missing subject: ${req}`);
  }
  
  // Each subject has topics
  for (const subj of sem1.subjects) {
    assert.ok(Array.isArray(subj.topics), `Subject ${subj.name} must have topics array`);
    assert.ok(subj.topics.length >= 3, `Subject ${subj.name} must have at least 3 topics`);
    for (const topic of subj.topics) {
      assert.ok(topic.id, "Topic must have id");
      assert.ok(topic.name, "Topic must have name");
    }
  }
  
  // Test Semester 2
  const sem2Path = path.join(repoRoot, "assets/data/curriculum/p2/semester 2.json");
  assert.ok(fs.existsSync(sem2Path), "semester 2.json must exist");
  
  const sem2 = JSON.parse(fs.readFileSync(sem2Path, "utf8"));
  assert.equal(sem2.grade, "P2");
  assert.equal(sem2.month, "Semester 2");
  assert.ok(Array.isArray(sem2.subjects), "subjects must be array");
  assert.ok(sem2.subjects.length >= 8, "Must have at least 8 subjects");
  
  const subjectNames2 = sem2.subjects.map(s => s.name);
  for (const req of required) {
    assert.ok(subjectNames2.includes(req), `Missing subject in Semester 2: ${req}`);
  }
  
  for (const subj of sem2.subjects) {
    assert.ok(Array.isArray(subj.topics), `Subject ${subj.name} must have topics array`);
    assert.ok(subj.topics.length >= 3, `Subject ${subj.name} must have at least 3 topics`);
  }
}