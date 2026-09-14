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

  // Test 3: generateComments must import OptimizedCommentGenerator dynamically
  // (regression: P2 override referenced the class without importing it -> ReferenceError at runtime)
  const fs = await import("node:fs");
  const source = fs.readFileSync(new URL("../../assets/js/controllers/p2-subjects-controller.js", import.meta.url), "utf-8");
  assert.ok(
    source.includes('await import("../optimized-comment-generator.js")'),
    "P2 generateComments must dynamically import OptimizedCommentGenerator"
  );
  // Ensure no bare constructor call survives without a destructuring import on the same path
  const genBlock = source.slice(source.indexOf("async generateComments"));
  assert.ok(
    genBlock.includes('const { OptimizedCommentGenerator } = await import'),
    "generateComments block must destructure OptimizedCommentGenerator from the dynamic import"
  );

  console.log("✅ p2-subjects-controller tests passed");
}