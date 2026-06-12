// tests/integration/p2-full-flow.test.js
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { TeachersPetProcessor } from "../../assets/js/engine/processor.js";
import { TeachersPetData } from "../../assets/js/data/engine-data.js";

export async function runTests() {
  const repoRoot = path.resolve(process.cwd());
  
  // 1. Processor handles P2 session data
  const sessionData = {
    studentName: "สมชาย ใจดี",
    gender: "male",
    overallRating: 8,
    grade: "P2",
    month: "Semester 1",
    subjects: ["Thai Language", "Mathematics", "Science"],
    topicRatings: { "Reading: Short Stories": 8, "Addition within 100": 7 },
    strengths: "Thai reading, math calculation",
    weaknesses: "English conversation"
  };
  
  const processed = TeachersPetProcessor.processSessionData(sessionData, TeachersPetData);
  assert.equal(processed.name, "สมชาย ใจดี");
  assert.equal(processed.grade, "P2");
  assert.equal(processed.month, "Semester 1");
  assert.ok(processed.subjects.includes("Thai Language"));
  assert.ok(processed.subjects.includes("Mathematics"));
  
  // 2. Subject topic mapping works for P2 subjects
  const thaiTopics = processed.topicsBySubject["Thai Language"];
  assert.ok(Array.isArray(thaiTopics));
  
  // 3. Curriculum data loads correctly (read directly for test)
  const sem1Path = path.join(repoRoot, "assets/data/curriculum/p2/semester 1.json");
  const sem1 = JSON.parse(fs.readFileSync(sem1Path, "utf8"));
  assert.equal(sem1.grade, "P2");
  assert.equal(sem1.month, "Semester 1");
  assert.ok(sem1.subjects.length >= 8);
  
  // 4. Test Semester 2 as well
  const sem2Path = path.join(repoRoot, "assets/data/curriculum/p2/semester 2.json");
  const sem2 = JSON.parse(fs.readFileSync(sem2Path, "utf8"));
  assert.equal(sem2.grade, "P2");
  assert.equal(sem2.month, "Semester 2");
  assert.ok(sem2.subjects.length >= 8);
  
  // 5. Verify specific P2 subjects exist in curriculum
  const subjectNames = sem1.subjects.map(s => s.name);
  const required = ["Thai Language", "Mathematics", "Science", "Social Studies", "English", "Arts", "Health & Physical Education", "Computing"];
  for (const req of required) {
    assert.ok(subjectNames.includes(req), `Missing subject in curriculum: ${req}`);
  }
  
  // 6. Verify topic keywords work for P2 subjects
  const mathTopics = processed.topicsBySubject["Mathematics"];
  assert.ok(Array.isArray(mathTopics));
  
  // 7. Test with female student
  const sessionDataFemale = {
    studentName: "สมหญิง รักดี",
    gender: "female",
    overallRating: 7,
    grade: "P2",
    month: "Semester 2",
    subjects: ["English", "Arts", "Computing"],
    topicRatings: { "Conversation: Greetings": 7, "Thai Crafts": 8 },
    strengths: "creative arts, English speaking",
    weaknesses: "math word problems"
  };
  
  const processedFemale = TeachersPetProcessor.processSessionData(sessionDataFemale, TeachersPetData);
  assert.equal(processedFemale.pronoun_subject, "She");
  assert.equal(processedFemale.pronoun_possessive, "her");
  assert.ok(processedFemale.subjects.includes("English"));
}