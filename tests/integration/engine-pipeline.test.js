import assert from "node:assert/strict";
import { TeachersPetData } from "../../assets/js/data/engine-data.js";
import { TeachersPetProcessor } from "../../assets/js/engine/processor.js";
import { TeachersPetTemplates } from "../../assets/js/engine/templates.js";

export async function runTests() {
  const sessionData = {
    studentName: "Avery",
    gender: "He",
    overallRating: 7,
    grade: "K1",
    month: "January",
    subjects: ["Mathematics"],
    topicRatings: {
      "addition with counters": 7,
    },
    strengths: "focus, problem solving",
    weaknesses: "patience",
  };

  const processed = TeachersPetProcessor.processSessionData(
    sessionData,
    TeachersPetData,
  );
  const comment = await TeachersPetTemplates.generateStyleComment(
    "male",
    processed,
  );

  assert.ok(comment.includes("Avery"));
  assert.ok(comment.includes("Mathematics"));
  assert.ok(comment.length > 50);
}
