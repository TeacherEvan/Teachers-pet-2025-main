# Codebase Optimization Implementation Plan

> **For implementer:** Use TDD throughout. Write failing test first. Watch it fail. Then implement.

**Goal:** Optimize Teacher's Pet codebase for performance and maintainability without changing features or visuals — 7 tasks targeting 15-25% bundle reduction, 30-50% runtime improvement, zero production console.log, zero dead code, zero controller duplication.

**Architecture:** Vanilla ES modules, custom test runner (`tests/run-tests.js`), no build step. Tasks follow: remove dead code → deduplicate → clean up → algorithmic improvements → lazy loading. Each task isolated, verified independently.

**Tech Stack:** ES2022 modules, Node.js test runner, ESLint flat config, verify.js pipeline.

---

### Task 1: Remove Legacy Shim

**Files:**
- Delete: `enhanced-comment-engine.js` (root)
- Delete: `assets/js/enhanced-comment-engine.js`
- Test: `scripts/verify.js` (verifies shim contract)

**Step 1: Verify no imports reference the shim**
```bash
grep -r "enhanced-comment-engine" --include="*.js" --include="*.html" . | grep -v "node_modules" | grep -v ".git"
```
Expected: Only references in verify.js and README/docs (documentation only)

**Step 2: Run baseline tests**
```bash
npm test
```
Expected: All 31 suites pass

**Step 3: Delete both shim files**
```bash
rm enhanced-comment-engine.js
rm assets/js/enhanced-comment-engine.js
```

**Step 4: Run tests — confirm pass**
```bash
npm test
```
Expected: All 31 suites pass

**Step 5: Run verify — confirm no shim warnings**
```bash
npm run verify
```
Expected: `[SUCCESS] Root enhanced-comment-engine.js shim contract verified.` → replaced with `[INFO] No legacy shim detected.` or similar; no "Deprecated" warning

**Step 6: Commit**
```bash
git add -A && git commit -m "perf: remove legacy enhanced-comment-engine shim (5KB)"
```

---

### Task 2: Deduplicate Controllers via Base Class

**Files:**
- Create: `assets/js/controllers/base-subjects-controller.js`
- Modify: `assets/js/controllers/subjects-controller.js`
- Modify: `assets/js/controllers/p2-subjects-controller.js`
- Test: `tests/unit/subjects-controller.test.js` (exists)
- Test: `tests/unit/p2-subjects-controller.test.js` (exists)
- Test: `tests/integration/p2-full-flow.test.js` (exists)

**Step 1: Run baseline controller tests**
```bash
node tests/run-tests.js --filter subjects-controller
node tests/run-tests.js --filter p2-subjects-controller
```
Expected: Both pass

**Step 2: Create BaseSubjectsController with shared logic**

Extract these identical/near-identical methods:
- `escapeHtml(text)` — identical
- `loadSessionDataFromURL()` / `loadSessionDataFromURL()` — same pattern (merge to base with virtual method for grade/month defaults)
- `loadAndRenderCurriculum()` / `loadAndRenderCurriculum()` — same flow
- `renderSubjects()` / `renderSubjects()` — same pattern
- `createSubjectElement()` — same structure, different HTML template (base provides template method)
- `createTopicElement()` — different (P2 has Thai names, stars) → base provides hook
- `bindSubjectEvents()` / `setupSubjectInteractions()` — same accordion logic, different selectors → base provides hook
- `setupBulkActions()` / (none in P2) — base empty, override in SubjectsController
- `updateSelectionSummary()` / `updateSelectionSummary()` — same
- `updateGenerateButton()` (P2 only) → base empty, override
- `setupCommentGeneration()` / `setupCommentGeneration()` — same
- `generateComments()` / `generateComments()` — same pattern, different display → base template method
- `displayComments()` / `displayComments()` — different HTML → base template method

**Base Class Template:**
```javascript
import CurriculumLoader from "../curriculum/curriculum-loader.js";
import { TeachersPetUtils } from "../engine/utils.js";

export class BaseSubjectsController {
  constructor(app) {
    this.app = app;
    this.curriculumLoader = new CurriculumLoader();
    this.subjectsContainer = null;
    this.selectionSummary = null;
    this.generateBtn = null;
    this.gradeMonthDisplay = null;
  }

  async init() {
    this.cacheElements();
    this.loadSessionDataFromURL();
    await this.loadAndRenderCurriculum();
    this.setupSubjectInteractions();
    this.setupBulkActions();
    this.setupCommentGeneration();
    this.updateSelectionSummary();
    this.updateGenerateButton();
  }

  // Override in subclasses
  cacheElements() { throw new Error("cacheElements() must be implemented"); }
  getGradeMonthDefaults() { return { grade: "", month: "" }; }
  getSubjectTemplate() { throw new Error("getSubjectTemplate() must be implemented"); }
  getTopicTemplate() { throw new Error("getTopicTemplate() must be implemented"); }
  getSubjectSelector() { return ".subject-section"; }
  getTopicSelector() { return ".topic-checkbox"; }

  // Shared implementations below...
}
```

**Step 3: Refactor SubjectsController to extend BaseSubjectsController**

Override:
- `cacheElements()` — existing IDs
- `getGradeMonthDefaults()` — `{ grade: "K1", month: "August" }`
- `getSubjectTemplate()` — current accordion HTML
- `getTopicTemplate()` — current checkbox HTML
- `getSubjectSelector()` — `.subject-section`
- `getTopicSelector()` — `.topic-checkbox`
- `setupBulkActions()` — keep existing (no-op in base)

**Step 4: Refactor P2SubjectsController to extend BaseSubjectsController**

Override:
- `cacheElements()` — existing P2 IDs
- `getGradeMonthDefaults()` — `{ grade: "P2", month: "Semester 1" }`
- `getSubjectTemplate()` — bilingual subject header
- `getTopicTemplate()` — bilingual topic + star ratings
- `getSubjectSelector()` — `.subject-section`
- `getTopicSelector()` — `.topic-checkbox`
- `setupSubjectInteractions()` — add star rating handlers (call base then add)
- `updateGenerateButton()` — P2 logic (rated > 0)

**Step 5: Run controller tests — confirm pass**
```bash
node tests/run-tests.js --filter subjects-controller
node tests/run-tests.js --filter p2-subjects-controller
```
Expected: Both pass

**Step 6: Run integration tests**
```bash
node tests/run-tests.js --filter p2-full-flow
```
Expected: Pass

**Step 7: Run full test suite**
```bash
npm test
```
Expected: All 31 suites pass

**Step 8: Run E2E verification**
```bash
npm run e2e:testall
```
Expected: All steps pass

**Step 9: Commit**
```bash
git add -A && git commit -m "refactor: deduplicate SubjectsController/P2SubjectsController via BaseSubjectsController (~400 lines)"
```

---

### Task 3: Silence Production Console.log

**Files:**
- Modify: `assets/js/engine/core.js`
- Modify: `assets/js/engine/processor.js`
- Modify: `assets/js/synonym-manager.js`

**Step 1: Run verify to see current warnings**
```bash
npm run verify
```
Expected: 3 warnings about console.log in core.js, processor.js, synonym-manager.js

**Step 2: Fix core.js**
- Line 33: `console.error('❌ TeachersPetData not loaded! ...')` → wrap in debugLog or remove (data load failure is fatal, keep but guard)
- Ensure all logging uses `debugLog` helper (already defined at line 15)

**Step 3: Fix processor.js**
- Line 32: `console.error("❌ Missing student name in session data!")` → wrap in debugLog
- Line 37: `console.error("❌ Engine data missing or incomplete")` → wrap in debugLog
- Lines 154-156: `debugLog` already used correctly

**Step 4: Fix synonym-manager.js**
- Lines 44, 55, 63, 75, 81, 99, 112, 132, 154, 175, 209, 210, 229, 238-239, 251, 254, 259, 270, 291 — all use `debugLogSynonym` helper correctly
- Check for any bare `console.log/error/warn` not using helper

**Step 5: Run verify — confirm zero console.log warnings**
```bash
npm run verify
```
Expected: No "Console.log detected" warnings

**Step 6: Run tests**
```bash
npm test
```
Expected: All 31 suites pass

**Step 7: Commit**
```bash
git add -A && git commit -m "perf: silence production console.log in engine modules"
```

---

### Task 4: Optimize SynonymManager.replaceOverused()

**Files:**
- Modify: `assets/js/synonym-manager.js`
- Test: `tests/unit/synonym-manager.test.js` (may need to create)

**Step 1: Create benchmark test**
```bash
# Add to tests/unit/synonym-manager.test.js or create new benchmark
```

**Step 2: Run baseline benchmark**
```javascript
// In console or test: measure replaceOverused() on 200-word comment
// Record time
```

**Step 3: Implement optimizations in synonym-manager.js**

**3a: Pre-build flat synonym Map in `loadSynonymData()`**
```javascript
// After loading synonymData, build:
this.synonymFlatMap = new Map();
for (const [category, words] of Object.entries(this.synonymData)) {
  for (const [word, synonyms] of Object.entries(words)) {
    this.synonymFlatMap.set(word.toLowerCase(), synonyms);
  }
}
```

**3b: Change `findSynonyms(word)` to O(1) Map lookup**
```javascript
findSynonyms(word) {
  return this.synonymFlatMap.get(word.toLowerCase().trim()) || [];
}
```

**3c: Single-pass tokenization with position tracking**
```javascript
async replaceOverused(text, threshold = 2) {
  // Tokenize with positions: [{word, normalized, start, end}, ...]
  const tokens = [];
  const regex = /\b[\w']+\b/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const normalized = match[0].toLowerCase().trim();
    if (normalized.length >= 4) {
      tokens.push({ word: match[0], normalized, start: match.index, end: match.index + match[0].length });
    }
  }
  // ... rest uses tokens array
}
```

**3d: Batch replacements — collect all, then single replace pass**
```javascript
// Build replacements Map
const replacements = new Map();
for (const token of tokens) {
  if (!replacements.has(token.normalized) && this.shouldReplace(token.normalized)) {
    const synonyms = this.findSynonyms(token.normalized);
    if (synonyms.length > 0) {
      const best = this.selectBestSynonym(token.normalized, synonyms);
      if (best && best.toLowerCase() !== token.normalized) {
        replacements.set(token.normalized, best);
      }
    }
  }
}

// Apply all replacements in single pass (right-to-left to preserve indices)
let result = text;
const sortedReplacements = Array.from(replacements.entries())
  .sort((a, b) => {
    // Find rightmost occurrence for each
    const aPos = text.lastIndexOf(a[0]);
    const bPos = text.lastIndexOf(b[0]);
    return bPos - aPos;
  });

for (const [original, replacement] of sortedReplacements) {
  const regex = new RegExp(`\\b${this.escapeRegex(original)}\\b`, 'gi');
  result = result.replace(regex, (match) => this.matchCase(match, replacement));
}
```

**3e: Memoize `escapeRegex` and `matchCase`**
```javascript
// Add caches
this.escapeRegexCache = new Map();
this.matchCaseCache = new Map();

escapeRegex(str) {
  if (this.escapeRegexCache.has(str)) return this.escapeRegexCache.get(str);
  const result = str.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
  this.escapeRegexCache.set(str, result);
  return result;
}

matchCase(original, replacement) {
  const key = original + '|' + replacement;
  if (this.matchCaseCache.has(key)) return this.matchCaseCache.get(key);
  // ... existing logic
  this.matchCaseCache.set(key, result);
  return result;
}
```

**Step 4: Run tests**
```bash
npm test
```
Expected: All suites pass

**Step 5: Run benchmark — confirm 50-70% improvement**
```bash
npm run test:perf
```
Expected: Significant improvement on synonym replacement

**Step 6: Run verify**
```bash
npm run verify
```
Expected: Pass

**Step 7: Commit**
```bash
git add -A && git commit -m "perf: optimize SynonymManager.replaceOverused O(n²)→O(n) via flat Map + single-pass"
```

---

### Task 5: Optimize groupTopicsBySubject() with Inverted Index

**Files:**
- Modify: `assets/js/engine/processor.js`
- Modify: `assets/js/data/engine-data.js` (export index)
- Test: `tests/unit/processor.test.js`

**Step 1: Run baseline processor tests**
```bash
node tests/run-tests.js --filter processor
```
Expected: Pass

**Step 2: Add inverted index to engine-data.js**
```javascript
// At bottom of engine-data.js, after subjectTopicMap:
export const TeachersPetKeywordIndex = (() => {
  const index = new Map();
  for (const [subject, keywords] of Object.entries(TeachersPetData.subjectTopicMap)) {
    for (const keyword of keywords) {
      const normalized = keyword.toLowerCase();
      if (!index.has(normalized)) {
        index.set(normalized, new Set());
      }
      index.get(normalized).add(subject);
    }
  }
  // Convert Sets to Arrays for easier iteration
  const result = new Map();
  for (const [keyword, subjects] of index) {
    result.set(keyword, Array.from(subjects));
  }
  return result;
})();
```

**Step 3: Refactor `groupTopicsBySubject()` in processor.js**
```javascript
import { TeachersPetKeywordIndex } from "../data/engine-data.js";

groupTopicsBySubject: function (subjects, topicRatings, subjectTopicMap) {
  const grouped = {};
  const orphanedTopics = [];
  const topicList = Object.keys(topicRatings);
  const subjectSet = new Set(subjects); // O(1) lookup
  const keywordIndex = TeachersPetKeywordIndex; // Pre-built

  // Initialize groups
  subjects.forEach((subject) => { grouped[subject] = []; });

  topicList.forEach((topic) => {
    const topicLower = topic.toLowerCase();
    let assigned = false;

    // Extract keywords from topic (split by space, filter length >= 3)
    const topicKeywords = topicLower.split(/\s+/).filter(k => k.length >= 3);

    // Check each keyword against index
    for (const keyword of topicKeywords) {
      const matchingSubjects = keywordIndex.get(keyword);
      if (matchingSubjects) {
        for (const subject of matchingSubjects) {
          if (subjectSet.has(subject)) {
            grouped[subject].push(topic);
            assigned = true;
            break;
          }
        }
        if (assigned) break;
      }
    }

    // Fallback: subject name matching (existing logic)
    if (!assigned) {
      for (const subject of subjects) {
        if (topicLower.includes(subject.toLowerCase())) {
          grouped[subject].push(topic);
          assigned = true;
          break;
        }
      }
    }

    if (!assigned) {
      debugLog(`⚠️ Topic "${topic}" could not be matched to any subject - ORPHANED TOPIC`);
      orphanedTopics.push(topic);
    }
  });

  return { grouped, orphanedTopics };
}
```

**Step 4: Run processor tests**
```bash
node tests/run-tests.js --filter processor
```
Expected: Pass

**Step 5: Run full test suite**
```bash
npm test
```
Expected: All 31 suites pass

**Step 6: Run benchmark**
```bash
npm run test:perf
```
Expected: 60-80% improvement on topic grouping

**Step 7: Commit**
```bash
git add -A && git commit -m "perf: optimize groupTopicsBySubject with inverted keyword index"
```

---

### Task 6: Dynamic Import for Comment Engine

**Files:**
- Modify: `assets/js/controllers/app-controller.js`
- Modify: `assets/js/controllers/subjects-controller.js`
- Modify: `assets/js/controllers/p2-subjects-controller.js`
- Test: All controller tests, integration tests

**Step 1: Run baseline tests**
```bash
npm test
```
Expected: All pass

**Step 2: Modify app-controller.js — lazy getter for commentGenerator**
```javascript
// Remove: this.commentGenerator = new OptimizedCommentGenerator();
// Add lazy getter:
get commentGenerator() {
  if (!this._commentGenerator) {
    // Dynamic import will be handled by controllers
    this._commentGenerator = null; // placeholder, controllers import directly
  }
  return this._commentGenerator;
}
```

**Step 3: Modify SubjectsController.generateComments()**
```javascript
async generateComments() {
  if (this.app.sessionData.subjects.length === 0) {
    this.app.showNotification('Please select at least one subject before generating comments.', 'warning');
    return;
  }

  this.app.showLoadingOverlay('Generating premium comments...');

  try {
    // Dynamic import - only loads comment engine when needed
    const { OptimizedCommentGenerator } = await import('../../optimized-comment-generator.js');
    const generator = new OptimizedCommentGenerator();
    const comments = generator.generateComments(this.app.sessionData);
    this.displayComments(comments);
  } catch (error) {
    console.error('Comment generation failed:', error);
    this.app.showNotification('Failed to generate comments. Please try again.', 'error');
  } finally {
    this.app.hideLoadingOverlay();
  }
}
```

**Step 4: Modify P2SubjectsController.generateComments() similarly**
```javascript
async generateComments() {
  if (this.app.sessionData.subjects.length === 0) {
    if (this.app.notify) this.app.notify("Please select at least one topic before generating comments.", "warning");
    return;
  }

  if (this.app.showLoader) this.app.showLoader("Generating comments...");

  try {
    const { OptimizedCommentGenerator } = await import('../../optimized-comment-generator.js');
    const generator = new OptimizedCommentGenerator();
    const selections = this.collectSelections();
    const comments = await generator.generateComments(selections);

    if (this.app.notify) this.app.notify("Comments generated successfully!", "success");
    this.displayComments(comments);
  } catch (error) {
    console.error("Comment generation failed:", error);
    if (this.app.notify) this.app.notify("Failed to generate comments. Please try again.", "error");
  } finally {
    if (this.app.hideLoader) this.app.hideLoader();
  }
}
```

**Step 5: Run controller tests**
```bash
node tests/run-tests.js --filter subjects-controller
node tests/run-tests.js --filter p2-subjects-controller
```
Expected: Pass

**Step 6: Run integration tests**
```bash
node tests/run-tests.js --filter p2-full-flow
```
Expected: Pass

**Step 7: Run full test suite**
```bash
npm test
```
Expected: All 31 suites pass

**Step 8: Manual verification — Subjects.html generate flow works**
- Open Subjects.html in browser
- Select topics, click Generate Comments
- Verify comments generate correctly

**Step 9: Bundle size check**
```bash
# No build step, but verify Subjects.html loads without comment engine initially
# Network tab: comment engine modules should only load on Generate click
```

**Step 10: Commit**
```bash
git add -A && git commit -m "perf: lazy-load comment engine via dynamic import (~25KB deferred)"
```

---

### Task 7: Lazy-Load ui-enhancements.js

**Files:**
- Modify: `Subjects.html` (remove preload line 18)
- Modify: `assets/js/utils/performance-optimizer.js` (add idle loader) or new utility

**Step 1: Run Lighthouse CI baseline (optional)**
```bash
# npx lhci autorun or note FCP from performance-optimizer
```

**Step 2: Remove ui-enhancements.js preload from Subjects.html**
```html
<!-- REMOVE line 18: -->
<link rel="preload" href="assets/js/utils/ui-enhancements.js" as="script">
```

**Step 3: Add idle callback loader in performance-optimizer.js or inline in Subjects.html**
```javascript
// In performance-optimizer.js, add method:
scheduleUiEnhancementsLoad() {
  this.requestIdleCallback(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'assets/js/utils/ui-enhancements.js';
    document.head.appendChild(script);
  });
}
```

Then in Subjects.html module script:
```javascript
window.addEventListener('load', () => {
  if (window.performanceOptimizer) {
    window.performanceOptimizer.scheduleUiEnhancementsLoad();
  }
});
```

**Step 4: Run tests**
```bash
npm test
```
Expected: All pass (ui-enhancements tests still pass — they import directly in test)

**Step 5: Run verify**
```bash
npm run verify
```
Expected: Pass

**Step 6: Manual verification — Subjects.html loads, interactions work**
- Open Subjects.html
- Verify accordion, checkboxes, star ratings (P2) work
- DevTools Network: ui-enhancements.js loads after page interactive

**Step 7: Commit**
```bash
git add -A && git commit -m "perf: defer ui-enhancements.js to idle callback (~15KB from critical path)"
```

---

### Task 8: CSS Containment (Bonus — Do If Time)

**Files:**
- Modify: `Subjects.html` (inline styles) or `assets/css/components.css`

**Step 1: Add containment to subject sections**
```css
/* In Subjects.html <style> or components.css */
.subject-section {
  contain: layout paint style;
}

.subject-topics, .subject-content {
  contain: layout paint style;
  content-visibility: auto;
  contain-intrinsic-size: 200px;
}

.comments-overlay, .comments-container {
  contain: strict;
}
```

**Step 2: Test — no visual regression**
```bash
npm run e2e:testall
```
Expected: Pass

**Step 3: DevTools Performance — verify reduced layout shifts**
- Record performance profile
- Expand/collapse subjects
- Check Layout shifts reduced

**Step 4: Commit**
```bash
git add -A && git commit -m "perf: add CSS containment to subject sections for layout isolation"
```

---

## Verification Checklist (Run After All Tasks)

```bash
# 1. All tests pass
npm test

# 2. Lint clean
npm run lint

# 3. Verification passes
npm run verify

# 4. Performance benchmark no regression
npm run test:perf

# 5. E2E manual checklist
npm run e2e:testall

# 6. Bundle size (informational)
# No build, but network tab on Subjects.html should show:
# - Comment engine modules only on Generate click
# - ui-enhancements.js after page load
```

---

## Execution Mode

**Plan saved to:** `docs/plans/2026-06-13-optimization-plan.md`

**Two options:**

1. **Subagent-Driven** — I dispatch a fresh sub-agent per task, review between tasks
2. **Manual** — You run the tasks yourself (or use `execute_code` for mechanical multi-step tasks)

**Which approach?** (Given subagent timeout risks noted in skill, recommend `execute_code` for Tasks 1, 3, 5, 7, 8 which are mechanical; subagents for Tasks 2, 4, 6 which need design reasoning)