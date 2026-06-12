import assert from "node:assert/strict";
import { P2SubjectsController } from "../../assets/js/controllers/p2-subjects-controller.js";

export async function runTests() {
  // Mock app object
  const mockApp = {
    sessionData: { grade: "P2", month: "Semester 1" },
    notify: () => {},
    showLoader: () => {},
    hideLoader: () => {},
  };

  // Test 1: Controller can be instantiated
  const controller = new P2SubjectsController(mockApp);
  assert.ok(controller);
  assert.equal(controller.app, mockApp);

  // Test 2: Controller has required methods
  assert.ok(typeof controller.init === "function", "has init method");
  assert.ok(typeof controller.loadSessionDataFromURL === "function", "has loadSessionDataFromURL");
  assert.ok(typeof controller.loadAndRenderCurriculum === "function", "has loadAndRenderCurriculum");
  assert.ok(typeof controller.renderSubjects === "function", "has renderSubjects");
  assert.ok(typeof controller.setupSubjectInteractions === "function", "has setupSubjectInteractions");
  assert.ok(typeof controller.updateSelectionSummary === "function", "has updateSelectionSummary");

  console.log("✅ p2-subjects-controller tests passed");
}