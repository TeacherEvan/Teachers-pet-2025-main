// tests/unit/engine-data-p2.test.js
import assert from "node:assert/strict";
import { TeachersPetData } from "../../assets/js/data/engine-data.js";

export async function runTests() {
  // Test subject capitalization for P2 subjects
  const cap = TeachersPetData.grammarRules.subjectCapitalization;

  assert.equal(cap["thai language"], "Thai Language");
  assert.equal(cap["mathematics"], "Mathematics");
  assert.equal(cap["science"], "Science");
  assert.equal(cap["social studies"], "Social Studies");
  assert.equal(cap["english"], "English");
  assert.equal(cap["arts"], "Arts");
  assert.equal(cap["health physical education"], "Health & Physical Education");
  assert.equal(cap["computing"], "Computing");

  // Test subjectTopicMap has P2 subjects with Thai keywords
  const map = TeachersPetData.subjectTopicMap;

  assert.ok(map["Thai Language"], "Thai Language missing from subjectTopicMap");
  assert.ok(map["Mathematics"], "Mathematics missing from subjectTopicMap");
  assert.ok(map["Science"], "Science missing from subjectTopicMap");
  assert.ok(map["Social Studies"], "Social Studies missing from subjectTopicMap");
  assert.ok(map["English"], "English missing from subjectTopicMap");
  assert.ok(map["Arts"], "Arts missing from subjectTopicMap");
  assert.ok(map["Health & Physical Education"], "Health & PE missing from subjectTopicMap");
  assert.ok(map["Computing"], "Computing missing from subjectTopicMap");

  // Verify Thai keywords exist
  assert.ok(map["Thai Language"].includes("อ่าน"), "Thai keyword 'อ่าน' missing");
  assert.ok(map["Thai Language"].includes("read"), "English keyword 'read' missing");
  assert.ok(map["Science"].includes("ทดลอง"), "Thai keyword 'ทดลอง' missing");
  assert.ok(map["Health & Physical Education"].includes("สุขภาพ"), "Thai keyword 'สุขภาพ' missing");
}