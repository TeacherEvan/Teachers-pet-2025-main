import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");

export async function runTests() {
  const rootEnginePath = path.join(repoRoot, "enhanced-comment-engine.js");
  const rootEngineSource = fs.readFileSync(rootEnginePath, "utf8");
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  const originalSessionStorage = globalThis.sessionStorage;
  const originalFetch = globalThis.fetch;
  const originalConsoleLog = console.log;

  assert.match(rootEngineSource, /Legacy compatibility shim/);
  assert.match(
    rootEngineSource,
    /import\("\.\/assets\/js\/engine\/core\.js"\)/,
  );
  assert.doesNotMatch(rootEngineSource, /class EnhancedCommentEngine/);
  assert.equal(
    fs.existsSync(path.join(repoRoot, "refactored-comment-engine.js")),
    false,
  );

  try {
    globalThis.window = {};
    globalThis.document = {
      addEventListener() {},
    };
    globalThis.sessionStorage = {
      getItem() {
        return null;
      },
      setItem() {},
    };
    globalThis.fetch = async () => ({
      ok: true,
      async json() {
        return {
          adjectives: {},
          verbs: {},
          adverbs: {},
          educational_terms: {},
          phrases: {},
        };
      },
    });

    const shimUrl = `${pathToFileURL(rootEnginePath).href}?compat-shim`;
    await import(shimUrl);
    await new Promise((resolve) => setTimeout(resolve, 0));

    assert.equal(typeof globalThis.window.EnhancedCommentEngine, "function");

    const moduleUrl = `${pathToFileURL(
      path.join(repoRoot, "optimized-comment-generator.js"),
    ).href}?compat-test`;
    const { OptimizedCommentGenerator } = await import(moduleUrl);
    const validationFallbackGenerator = new OptimizedCommentGenerator();
    const comments = await validationFallbackGenerator.generateComments(undefined);

    const fallbackModeGenerator = new OptimizedCommentGenerator();
    fallbackModeGenerator.fallbackMode = true;
    const partialComments = await fallbackModeGenerator.generateComments({
      studentName: "Ava",
    });
    const fallbackArrayComments = await fallbackModeGenerator.generateComments({
      studentName: "Ava",
      gender: "she",
      strengths: ["focus", "teamwork"],
      weaknesses: ["patience", "turn taking"],
    });

    const engineFailureGenerator = new OptimizedCommentGenerator();
    engineFailureGenerator.engine = {
      async generateComments() {
        throw new Error("boom");
      },
    };
    const engineFailureComments = await engineFailureGenerator.generateComments({
      studentName: "Ava",
      gender: "she",
    });

    let engineInput;
    const contractGenerator = new OptimizedCommentGenerator();
    contractGenerator.engine = {
      async generateComments(data) {
        engineInput = data;
        return {
          male: "ok",
          female: "ok",
          wordCount: { male: 1, female: 1 },
        };
      },
    };
    await contractGenerator.generateComments({
      studentName: "Ava",
      gender: "she",
      strengths: ["focus", "teamwork"],
      weaknesses: ["patience"],
    });

    const logCalls = [];
    const manualTestGenerator = new OptimizedCommentGenerator();
    console.log = (...args) => {
      logCalls.push(args);
    };
    const testGenerationResult = await manualTestGenerator.testGeneration();
    const testResultLog = logCalls.find(
      (entry) => entry[0] === "Test result:",
    );

    assert.equal(typeof comments.male, "string");
    assert.equal(typeof comments.female, "string");
    assert.equal(typeof comments.wordCount.male, "number");
    assert.equal(typeof comments.wordCount.female, "number");
    assert.match(comments.male, /Student/);
    assert.equal(typeof partialComments.male, "string");
    assert.equal(typeof partialComments.female, "string");
    assert.equal(typeof partialComments.wordCount.male, "number");
    assert.equal(typeof partialComments.wordCount.female, "number");
    assert.match(partialComments.male, /Ava/);
    assert.match(fallbackArrayComments.male, /focus and teamwork/);
    assert.match(fallbackArrayComments.male, /patience and turn taking/);
    assert.match(fallbackArrayComments.female, /focus and teamwork/);
    assert.match(fallbackArrayComments.female, /patience and turn taking/);
    assert.equal(typeof engineFailureComments.male, "string");
    assert.equal(typeof engineFailureComments.female, "string");
    assert.equal(typeof engineFailureComments.wordCount.male, "number");
    assert.equal(typeof engineFailureComments.wordCount.female, "number");
    assert.match(engineFailureComments.male, /Ava/);
    assert.deepEqual(engineInput.strengths, ["focus", "teamwork"]);
    assert.deepEqual(engineInput.weaknesses, ["patience"]);
    assert.equal(typeof testGenerationResult.male, "string");
    assert.ok(testResultLog);
    assert.equal(typeof testResultLog[1]?.then, "undefined");
  } finally {
    console.log = originalConsoleLog;
    globalThis.window = originalWindow;
    globalThis.document = originalDocument;
    globalThis.sessionStorage = originalSessionStorage;
    globalThis.fetch = originalFetch;
  }
}