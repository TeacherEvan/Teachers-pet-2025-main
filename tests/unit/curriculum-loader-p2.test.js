// tests/unit/curriculum-loader-p2.test.js
import assert from "node:assert/strict";
import CurriculumLoader from "../../assets/js/curriculum/curriculum-loader.js";

export async function runTests() {
  // Test availableMonths includes P2 semesters
  const loader = new CurriculumLoader();

  const p2Months = loader.getAvailableMonths("P2");
  assert.deepEqual(p2Months, ["Semester 1", "Semester 2"]);

  // Test isAvailable for P2
  assert.equal(loader.isAvailable("P2", "Semester 1"), true);
  assert.equal(loader.isAvailable("P2", "Semester 2"), true);
  assert.equal(loader.isAvailable("P2", "August"), false);
  assert.equal(loader.isAvailable("P2", "Invalid"), false);
  
  // Ensure existing grades still work
  assert.deepEqual(loader.getAvailableMonths("K1"), ["August", "November", "December", "January"]);
  assert.equal(loader.isAvailable("K1", "August"), true);
  assert.equal(loader.isAvailable("K2", "November"), true);
  assert.equal(loader.isAvailable("PVT", "General"), true);
}