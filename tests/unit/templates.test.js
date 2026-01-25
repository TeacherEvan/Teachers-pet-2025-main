import assert from "node:assert/strict";
import { TeachersPetTemplates } from "../../assets/js/engine/templates.js";

export async function runTests() {
  const data = {
    name: "Jamie",
    level: "strong",
    descriptor: "steady progress",
    verb: "learned well",
    adverb: "steadily",
    subjects: ["Mathematics"],
    topicsBySubject: {
      Mathematics: ["addition with counters"],
    },
    strengths: ["focus"],
    weaknesses: ["patience"],
    pronoun_subject: "He",
    pronoun_subject_lower: "he",
    pronoun_object: "him",
    pronoun_possessive: "his",
    pronoun_possessive_cap: "His",
    pronoun_verb: "is",
    pronoun_isAre: "is",
  };

  const male = await TeachersPetTemplates.generateStyleComment("male", data);
  assert.ok(male.includes("Jamie"));
  assert.ok(male.includes("Mathematics"));

  const female = await TeachersPetTemplates.generateStyleComment(
    "female",
    data,
  );
  assert.ok(female.includes("Jamie"));
  assert.ok(female.includes("Mathematics"));
}
