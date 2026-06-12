import assert from "node:assert/strict";
import CurriculumLoader from "../../assets/js/curriculum/curriculum-loader.js";

export async function runTests() {
  const loader = new CurriculumLoader();
  
  // Test 1: isAvailable returns true for P2
  assert.ok(loader.isAvailable("P2", "Semester 1"), "P2 Semester 1 available");
  assert.ok(loader.isAvailable("P2", "Semester 2"), "P2 Semester 2 available");
  assert.equal(loader.isAvailable("P2", "Semester 3"), false, "Semester 3 not available");
  assert.equal(loader.isAvailable("P2", "August"), false, "August not available for P2");

  // Test 2: getAvailableMonths returns correct list for P2
  const p2Months = loader.getAvailableMonths("P2");
  assert.ok(Array.isArray(p2Months), "getAvailableMonths returns array");
  assert.equal(p2Months.length, 2, "P2 has 2 semesters");
  assert.ok(p2Months.includes("Semester 1"), "includes Semester 1");
  assert.ok(p2Months.includes("Semester 2"), "includes Semester 2");

  console.log("✅ curriculum-loader-p2 tests passed");
}