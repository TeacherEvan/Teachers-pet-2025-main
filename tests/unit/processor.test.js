import assert from "node:assert/strict";
import { TeachersPetProcessor } from "../../assets/js/engine/processor.js";

const engineData = {
  descriptorPools: { 5: ["steady progress"] },
  verbPools: { 5: ["learned well"] },
  adverbPools: { 5: ["steadily"] },
  performanceMap: { 5: { level: "satisfactory" } },
  grammarRules: {
    pronouns: {
      he: {
        subject: "He",
        subject_lower: "he",
        object: "him",
        possessive: "his",
        possessive_cap: "His",
        verb: "is",
        isAre: "is",
      },
    },
  },
  subjectTopicMap: {
    Mathematics: ["addition", "numbers"],
  },
};

export async function runTests() {
  const sessionData = {
    studentName: "  Alex  ",
    gender: "He",
    overallRating: 0,
    subjects: ["Mathematics"],
    topicRatings: {
      "addition with counters": 5,
    },
    strengths: "focus, teamwork",
    weaknesses: "patience",
  };

  const processed = TeachersPetProcessor.processSessionData(
    sessionData,
    engineData,
  );

  assert.equal(processed.name, "Alex");
  assert.equal(processed.level, "satisfactory");
  assert.equal(processed.descriptor, "steady progress");
  assert.equal(processed.verb, "learned well");
  assert.equal(processed.adverb, "steadily");
  assert.deepEqual(processed.strengths, ["focus", "teamwork"]);
  assert.deepEqual(processed.weaknesses, ["patience"]);
  assert.deepEqual(processed.topicsBySubject.Mathematics, [
    "addition with counters",
  ]);

  const fallback = TeachersPetProcessor.groupTopicsBySubject(
    ["Mathematics"],
    { "unknown topic": 3 },
    engineData.subjectTopicMap,
  );
  assert.deepEqual(fallback.grouped.Mathematics, []);
  assert.deepEqual(fallback.orphanedTopics, ["unknown topic"]);

  assert.throws(() => {
    TeachersPetProcessor.processSessionData(
      { studentName: "   ", gender: "He" },
      engineData,
    );
  }, /Student name is required/);
}
