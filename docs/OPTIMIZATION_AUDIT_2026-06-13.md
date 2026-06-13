# Codebase Optimization Audit Report - Teacher's Pet
**Date:** June 13, 2026
**Auditor:** AI Agent (Hermes)
**Skill:** code-optimization v1.0.0
**Baseline:** All tests pass, ESLint clean, verification passes

---

## Executive Summary

The codebase is well-structured with modern ES modules, good test coverage (31 test suites), and production-grade performance optimizations already in place (Core Web Vitals: LCP 372ms, FCP 372ms, CLS 0). 

**Key Optimization Opportunities Identified:** 8 items across 4 categories with estimated **15-25% bundle reduction** and **30-50% runtime improvement** for comment generation.

---

## Phase 1: Analysis & Profiling Results

### Static Analysis
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| JS Files (ES Modules) | 21 | - | ✅ Modular |
| Largest JS File | ui-enhancements.js (1149 lines, ~38KB) | <50KB | ✅ |
| CSS Files | 3 (main, components, micro-interactions) | - | ✅ |
| External Dependencies | 0 (vanilla JS) | - | ✅ |
| Console.log in production | 3 files flagged | 0 | 🟡 Warning |

### Runtime Performance (Baseline)
| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Engine Benchmark (Processor) | 1000 iter / 10.56ms | - | ✅ Good |
| Engine Benchmark (Templates) | 200 iter / 7.26ms | - | ✅ Good |
| LCP | 372ms | <2500ms | ✅ Excellent |
| FCP | 372ms | <1800ms | ✅ Excellent |
| CLS | 0 | <0.1 | ✅ Perfect |
| TTFB | 3.7ms | <600ms | ✅ Excellent |

---

## Phase 2: Prioritized Optimization Plan

### 🟢 HIGH IMPACT / LOW EFFORT (Do First)

#### 1. Remove Legacy Shim & Dead Code
**Files:** `enhanced-comment-engine.js` (root), `assets/js/enhanced-comment-engine.js`
**Type:** Dead Code Elimination
**Current:** 2 shim files (~5KB gzipped) loaded on Subjects.html
**Issue:** `verify.js` warns: "Deprecated: enhanced-comment-engine.js is a legacy shim"
**Action:** Remove both shim files, update any remaining references to use `assets/js/engine/core.js`
**Risk:** Low — verify script already confirms shim contract
**Estimated Savings:** ~5KB bundle, eliminates console.warn on every page load

#### 2. Deduplicate Controller Logic (SubjectsController & P2SubjectsController)
**Files:** `assets/js/controllers/subjects-controller.js` (329 lines), `p2-subjects-controller.js` (440 lines)
**Type:** Dead Code Elimination / Algorithmic Improvement
**Issue:** ~70% duplicate logic:
- `escapeHtml()` — identical
- `renderSubjects()` / `createSubjectElement()` / `createTopicElement()` — same pattern
- `bindSubjectEvents()` / `setupSubjectInteractions()` — same accordion/checkbox logic
- `updateSelectionSummary()` / `updateGenerateButton()` — same
- `loadSessionDataFromURL()` / `loadAndRenderCurriculum()` — same flow
**Action:** Create `BaseSubjectsController` base class, extend for P2-specifics (Thai names, star ratings, bilingual)
**Risk:** Medium — requires careful refactoring, but tests cover both
**Estimated Savings:** ~400 lines deduplicated, easier maintenance

#### 3. Remove Console.log from Production Code
**Files:** `assets/js/engine/core.js`, `assets/js/engine/processor.js`, `assets/js/synonym-manager.js`
**Type:** Cleanup
**Issue:** `verify.js` warns about console.log in 3 files
**Action:** Wrap all `console.log/debugLog` calls in `if (window.__TP_DEBUG__ === true)` guard (already has `debugLog` helper, just needs consistent usage)
**Risk:** Zero
**Estimated Savings:** Eliminates runtime overhead in production

---

### 🟡 HIGH IMPACT / MEDIUM EFFORT (Plan)

#### 4. Optimize SynonymManager.replaceOverused() Algorithm
**File:** `assets/js/synonym-manager.js` (360 lines)
**Type:** Algorithmic Improvement — O(n²) → O(n)
**Current Algorithm:**
```javascript
// For each word in text: regex match → iterate all words → find synonyms → replace via regex
// Multiple passes over text, creates new RegExp per replacement
```
**Issues:**
- `text.match(/\b[\w']+\b/g)` — extracts ALL words
- For each unique word: `findSynonyms()` iterates all categories (O(categories))
- `selectBestSynonym()` iterates all synonyms (O(synonyms))
- `replaceOverused()` creates `new RegExp()` per replacement inside loop
- Final pass: regex replace with callback for each match
**Optimization:**
1. Pre-build flat `word → synonyms[]` Map on load (O(1) lookup)
2. Single-pass tokenization with index tracking
3. Batch replacements using single regex with alternation
4. Memoize `escapeRegex()` and `matchCase()` results
**Risk:** Medium — core feature, but well-tested
**Estimated Savings:** 50-70% faster for long comments (100+ words)

#### 5. Optimize groupTopicsBySubject() in Processor
**File:** `assets/js/engine/processor.js` (lines 115-162)
**Type:** Algorithmic Improvement — O(topics × subjects × keywords) → O(topics + subjects)
**Current:** Triple nested loop:
```javascript
topicList.forEach(topic => {
  subjects.forEach(subject => {
    keywords.some(keyword => topicLower.includes(keyword))
  })
})
```
**Optimization:** Pre-build inverted index `keyword → subject[]` from `subjectTopicMap` at module load. Lookup becomes O(keywords in topic) instead of O(subjects × keywords).
**Risk:** Low — pure function, well-tested
**Estimated Savings:** 60-80% faster for typical topic lists (20-50 topics)

#### 6. Dynamic Import for Comment Engine & Heavy Modules
**Files:** `assets/js/controllers/app-controller.js`, `optimized-comment-generator.js`
**Type:** Bundle Splitting (Dynamic Import)
**Current:** Comment engine (`core.js`, `processor.js`, `templates.js`, `utils.js`, `synonym-manager.js`, `engine-data.js`) loaded upfront on Subjects.html
**Action:** Load comment engine only when "Generate Comments" clicked:
```javascript
// In app-controller.js or SubjectsController
async generateComments() {
  const { OptimizedCommentGenerator } = await import('../../optimized-comment-generator.js');
  const generator = new OptimizedCommentGenerator();
  return generator.generateComments(this.sessionData);
}
```
**Risk:** Low — single entry point, no visual change
**Estimated Savings:** ~25KB deferred from initial load on Subjects.html

#### 7. Lazy-Load ui-enhancements.js & performance-optimizer.js
**File:** `Subjects.html` (lines 17-18), `performance-optimizer.js` (627 lines), `ui-enhancements.js` (1149 lines)
**Type:** Lazy Loading
**Current:** Both preloaded on Subjects.html via `<link rel="preload">`
**Issue:** `ui-enhancements.js` (38KB) handles micro-interactions, haptics, keyboard shortcuts — not critical for initial render
**Action:** 
- Keep `performance-optimizer.js` preload (monitors Core Web Vitals)
- Change `ui-enhancements.js` to load via `requestIdleCallback` or `IntersectionObserver` when user interacts
**Risk:** Low — progressive enhancement
**Estimated Savings:** ~15KB from critical path

---

### 🔵 MEDIUM IMPACT / LOW EFFORT (Do If Time)

#### 8. CSS Containment for Subject Sections
**Files:** `Subjects.html` (inline styles), `assets/css/components.css`
**Type:** CSS Containment
**Action:** Add `contain: layout paint style` to `.subject-section` and `.subject-topics` to isolate layout thrashing from accordion animations
**Risk:** Zero — CSS-only, no behavior change
**Estimated Savings:** Reduced layout recalculation on expand/collapse

#### 9. Pre-build Inverted Index for subjectTopicMap
**File:** `assets/js/data/engine-data.js`
**Type:** Algorithmic (Pre-computation)
**Action:** Export `subjectKeywordIndex` Map alongside `subjectTopicMap` for O(1) lookups in processor
**Risk:** Low — build-time only

---

## Phase 3: Implementation Tasks (TDD Enforced)

### Task 1: Remove Legacy Shim
```markdown
**Files:** enhanced-comment-engine.js, assets/js/enhanced-comment-engine.js
**Baseline Test:** npm test (all pass)
**Step 1:** Verify no imports of shim in codebase (grep)
**Step 2:** Delete both files
**Step 3:** npm test → verify all pass
**Step 4:** npm run verify → confirm no shim warnings
**Commit:** "perf: remove legacy enhanced-comment-engine shim"
```

### Task 2: Deduplicate Controllers
```markdown
**Files:** assets/js/controllers/subjects-controller.js, p2-subjects-controller.js
**New File:** assets/js/controllers/base-subjects-controller.js
**Baseline Test:** npm test (unit/p2-subjects-controller.test.js, unit/subjects-controller.test.js)
**Step 1:** Extract common methods to BaseSubjectsController
**Step 2:** Refactor SubjectsController to extend BaseSubjectsController
**Step 3:** Refactor P2SubjectsController to extend BaseSubjectsController (override createTopicElement, renderStars, etc.)
**Step 4:** npm test → verify both controller tests pass
**Step 5:** npm run e2e:testall → verify manual checklist
**Commit:** "refactor: deduplicate SubjectsController/P2SubjectsController via base class"
```

### Task 3: Silence Production Console.log
```markdown
**Files:** core.js, processor.js, synonym-manager.js
**Baseline Test:** npm test
**Step 1:** Ensure all console.log calls use debugLog helper
**Step 2:** Remove any bare console.log/error/warn not guarded
**Step 3:** npm test + npm run verify
**Commit:** "perf: silence production console.log in engine modules"
```

### Task 4: Optimize SynonymManager
```markdown
**File:** assets/js/synonym-manager.js
**Baseline Test:** npm test (unit/synonym-manager.test.js if exists, otherwise integration)
**Step 1:** Add benchmark test for replaceOverused()
**Step 2:** Pre-build flat synonym Map in loadSynonymData()
**Step 3:** Single-pass tokenization with position tracking
**Step 4:** Batch regex replacement
**Step 5:** npm test + benchmark comparison
**Commit:** "perf: optimize SynonymManager.replaceOverused algorithm"
```

### Task 5: Optimize groupTopicsBySubject
```markdown
**File:** assets/js/engine/processor.js
**Baseline Test:** npm test (unit/processor.test.js)
**Step 1:** Build keyword→subject index at module load
**Step 2:** Refactor groupTopicsBySubject to use index
**Step 3:** npm test
**Commit:** "perf: optimize topic grouping with inverted index"
```

### Task 6: Dynamic Import for Comment Engine
```markdown
**Files:** app-controller.js, SubjectsController, P2SubjectsController
**Baseline Test:** npm test + manual Subjects.html generate flow
**Step 1:** Move commentGenerator instantiation to lazy getter
**Step 2:** Dynamic import on first generateComments() call
**Step 3:** Add loading state during dynamic import
**Step 4:** npm test + manual verification
**Commit:** "perf: lazy-load comment engine via dynamic import"
```

### Task 7: Lazy-Load ui-enhancements
```markdown
**Files:** Subjects.html, performance-optimizer.js (or new idle loader)
**Baseline Test:** npm test + Lighthouse CI
**Step 1:** Remove ui-enhancements.js preload from Subjects.html
**Step 2:** Load via requestIdleCallback after page interactive
**Step 3:** npm test + lighthouse diff
**Commit:** "perf: defer ui-enhancements.js to idle callback"
```

---

## Phase 4: Verification Criteria

| Check | Command | Must Pass |
|-------|---------|-----------|
| All tests | `npm test` | ✅ |
| Lint | `npm run lint` | ✅ |
| Verification | `npm run verify` | ✅ |
| Performance benchmark | `npm run test:perf` | ✅ (no regression) |
| E2E manual | `npm run e2e:testall` | ✅ |
| Bundle size | `npm run build && gzip-size dist/*.js` | ✅ (decrease or equal) |

---

## Handoff Context for documentation-maintenance

**Optimization Completed:** [To be filled after implementation]

**Files Changed:** [To be filled]

**Metrics Improved:**
- Bundle size: [before] → [after]
- Comment generation time: [before] → [after]
- Console noise: eliminated

**Documentation Updates Needed:**
1. `ARCHITECTURE_INDEX.md` — Update module boundaries (base controller)
2. `PROJECT_STATUS.md` — Update performance metrics if improved
3. `README.md` — Update developer quickstart if dynamic imports change workflow
4. `docs/PRODUCTION_REFACTOR_2024.md` — Add optimization patterns used

---

## Appendix: File Size Reference

| File | Lines | Size (KB) | Priority |
|------|-------|-----------|----------|
| assets/js/utils/ui-enhancements.js | 1149 | 38 | Task 7 |
| assets/js/utils/performance-optimizer.js | 627 | 24 | Keep |
| assets/js/synonym-manager.js | 360 | 12 | Task 4 |
| assets/js/controllers/subjects-controller.js | 329 | 13 | Task 2 |
| assets/js/controllers/p2-subjects-controller.js | 440 | 16 | Task 2 |
| assets/js/engine/templates.js | 286 | 16 | Keep |
| assets/js/engine/processor.js | 163 | 5.5 | Task 5 |
| assets/js/engine/core.js | 85 | 3.3 | Task 3 |
| assets/js/data/engine-data.js | 757 | 14 | Reference |
| enhanced-comment-engine.js (root) | ~200 | 5 | Task 1 DELETE |
| assets/js/enhanced-comment-engine.js | ~200 | 5 | Task 1 DELETE |

---

*Generated following code-optimization skill v1.0.0 pipeline*