import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

export async function runTests() {
  // Test 1: Semester 1 JSON exists and valid
  const sem1Path = path.resolve("assets/data/curriculum/p2/semester 1.json");
  assert.ok(fs.existsSync(sem1Path), "P2 Semester 1 JSON should exist");
  const sem1Content = fs.readFileSync(sem1Path, "utf-8");
  let sem1Data;
  assert.doesNotThrow(() => { sem1Data = JSON.parse(sem1Content); }, "valid JSON");

  // Test 2: Semester 2 JSON exists and valid
  const sem2Path = path.resolve("assets/data/curriculum/p2/semester 2.json");
  assert.ok(fs.existsSync(sem2Path), "P2 Semester 2 JSON should exist");
  const sem2Content = fs.readFileSync(sem2Path, "utf-8");
  let sem2Data;
  assert.doesNotThrow(() => { sem2Data = JSON.parse(sem2Content); }, "valid JSON");

  // Test 3: Both have 8 subjects
  assert.equal(sem1Data.subjects.length, 8, "Semester 1 should have 8 subjects");
  assert.equal(sem2Data.subjects.length, 8, "Semester 2 should have 8 subjects");

  // Test 4: Subject structure (id, name, topics array, vocabulary string)
  [sem1Data, sem2Data].forEach((data, semesterIndex) => {
    data.subjects.forEach((subject, i) => {
      assert.ok(subject.id, `sem${semesterIndex+1} subject[${i}].id`);
      assert.ok(subject.name, `sem${semesterIndex+1} subject[${i}].name`);
      assert.ok(Array.isArray(subject.topics), `sem${semesterIndex+1} subject[${i}].topics`);
      assert.ok(subject.topics.length > 0, `sem${semesterIndex+1} subject[${i}] has topics`);
      assert.ok(typeof subject.vocabulary === "string", `sem${semesterIndex+1} subject[${i}].vocabulary is string`);
      
      subject.topics.forEach((topic, j) => {
        assert.ok(topic.id, `sem${semesterIndex+1} subject[${i}].topics[${j}].id`);
        assert.ok(topic.name, `sem${semesterIndex+1} subject[${i}].topics[${j}].name`);
        // Topic name contains both English and Thai in parentheses format
        assert.ok(topic.name.includes("(") && topic.name.includes(")"), 
          `sem${semesterIndex+1} subject[${i}].topics[${j}] name has Thai in parentheses`);
      });
    });
  });

  // Test 5: Subject names match expected P2 subjects
  const expectedSubjects = ["Thai Language", "Mathematics", "Science", "Social Studies", "English", "Arts", "Health & Physical Education", "Computing"];
  expectedSubjects.forEach(expected => {
    const sem1Names = sem1Data.subjects.map(s => s.name);
    const sem2Names = sem2Data.subjects.map(s => s.name);
    assert.ok(sem1Names.includes(expected), `Semester 1 contains ${expected}`);
    assert.ok(sem2Names.includes(expected), `Semester 2 contains ${expected}`);
  });

  console.log("✅ curriculum-p2 tests passed");
}