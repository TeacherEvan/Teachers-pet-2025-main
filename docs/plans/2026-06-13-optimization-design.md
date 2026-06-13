# Design Document: Codebase Optimization (7 Tasks)
**Date:** June 13, 2026
**Status:** Approved for Implementation
**Based on:** OPTIMIZATION_AUDIT_2026-06-13.md

---

## 1. Architecture Overview

Optimize the Teacher's Pet codebase for performance and maintainability without changing features or visuals. The codebase is a vanilla ES-module static site with 21 JS files, 3 CSS files, and excellent test coverage (31 suites passing).

**Current State:**
- Core Web Vitals: LCP 372ms, FCP 372ms, CLS 0, TTFB 3.7ms ✅
- Bundle: ~21 JS modules, no build step, no external deps
- Tests: 31 suites pass, ESLint clean, verification passes

**Target State:**
- 15-25% bundle reduction
- 30-50% runtime improvement for comment generation
- Zero console.log in production
- Zero dead code (legacy shims removed)
- Zero duplication between controller files

---

## 2. Task Breakdown (7 Tasks)

### Task 1: Remove Legacy Shim
**Files:** `enhanced-comment-engine.js` (root), `assets/js/enhanced-comment-engine.js`
**Type:** Dead Code Elimination
**Current:** Two shim files (~5KB gzipped) loaded on Subjects.html, `verify.js` warns "Deprecated"
**Action:** Delete both files, ensure no imports reference them
**Risk:** Low — verify script confirms shim contract, no imports found in audit
**Success:** `npm run verify` shows no shim warnings, all tests pass

### Task 2: Deduplicate Controllers via Base Class
**Files:** `assets/js/controllers/subjects-controller.js` (329 lines), `p2-subjects-controller.js` (440 lines)
**New File:** `assets/js/controllers/base-subjects-controller.js`
**Type:** Dead Code Elimination / Refactoring
**Current:** ~70% duplicate logic:
- `escapeHtml()` — identical
- `renderSubjects()` / `createSubjectElement()` / `createTopicElement()` — same pattern
- `bindSubjectEvents()` / `setupSubjectInteractions()` — same accordion/checkbox logic
- `updateSelectionSummary()` / `updateGenerateButton()` — same
- `loadSessionDataFromURL()` / `loadAndRenderCurriculum()` — same flow
**Action:** Create `BaseSubjectsController` with shared logic; extend for P2-specifics (Thai names, star ratings, bilingual)
**Risk:** Medium — requires careful refactoring, well-tested
**Success:** Both controller unit tests pass, integration tests pass, manual E2E passes

### Task 3: Silence Production Console.log
**Files:** `assets/js/engine/core.js`, `assets/js/engine/processor.js`, `assets/js/synonym-manager.js`
**Type:** Cleanup
**Current:** `verify.js` warns about console.log in 3 files
**Action:** Ensure all logging uses `debugLog` helper (guarded by `window.__TP_DEBUG__ === true`); remove bare `console.log/error/warn`
**Risk:** Zero
**Success:** `npm run verify` shows no console.log warnings, all tests pass

### Task 4: Optimize SynonymManager.replaceOverused()
**File:** `assets/js/synonym-manager.js` (360 lines)
**Type:** Algorithmic Improvement — O(n²) → O(n)
**Current Algorithm:**
- Extracts all words via regex
- For each unique word: iterates all synonym categories (`findSynonyms`)
- For each synonym: iterates all synonyms (`selectBestSynonym`)
- Creates `new RegExp()` per replacement
- Final pass: regex replace with callback per match
**Optimization:**
1. Pre-build flat `word → synonyms[]` Map on load (O(1) lookup)
2. Single-pass tokenization with position tracking
3. Batch replacements using single regex with alternation
4. Memoize `escapeRegex()` and `matchCase()` results
**Risk:** Medium — core feature, well-tested
**Success:** Integration tests pass, benchmark shows 50-70% improvement

### Task 5: Optimize groupTopicsBySubject() in Processor
**File:** `assets/js/engine/processor.js` (lines 115-162)
**Type:** Algorithmic Improvement — O(topics × subjects × keywords) → O(topics + subjects)
**Current:** Triple nested loop over topics × subjects × keywords
**Optimization:** Pre-build inverted index `keyword → subject[]` from `subjectTopicMap` at module load. Export `subjectKeywordIndex` Map.
**Risk:** Low — pure function, well-tested
**Success:** Unit tests pass, benchmark shows 60-80% improvement

### Task 6: Dynamic Import for Comment Engine
**Files:** `assets/js/controllers/app-controller.js`, `optimized-comment-generator.js`, `SubjectsController`, `P2SubjectsController`
**Type:** Bundle Splitting (Dynamic Import)
**Current:** Comment engine (`core.js`, `processor.js`, `templates.js`, `utils.js`, `synonym-manager.js`, `engine-data.js`) loaded upfront on Subjects.html
**Action:** Load comment engine only when "Generate Comments" clicked:
```javascript
async generateComments() {
  const { OptimizedCommentGenerator } = await import('../../optimized-comment-generator.js');
  const generator = new OptimizedCommentGenerator();
  return generator.generateComments(this.sessionData);
}
```
**Risk:** Low — single entry point, no visual change
**Success:** Initial bundle reduced ~25KB, all tests pass, manual generation works

### Task 7: Lazy-Load ui-enhancements.js
**Files:** `Subjects.html` (lines 17-18), `assets/js/utils/performance-optimizer.js` (or new idle loader)
**Type:** Lazy Loading
**Current:** `ui-enhancements.js` (38KB, 1149 lines) preloaded via `<link rel="preload">`
**Action:** 
- Keep `performance-optimizer.js` preload (Core Web Vitals monitoring)
- Remove `ui-enhancements.js` preload from Subjects.html
- Load via `requestIdleCallback` after page interactive
**Risk:** Low — progressive enhancement
**Success:** Lighthouse FCP unchanged or improved, all tests pass

### Task 8: CSS Containment (Bonus)
**Files:** `Subjects.html` (inline styles), `assets/css/components.css`
**Type:** CSS Containment
**Action:** Add `contain: layout paint style` to `.subject-section` and `.subject-topics`
**Risk:** Zero — CSS-only
**Success:** DevTools Performance shows reduced layout recalculation

---

## 3. Constraints (Hard Gates)

| Constraint | Enforcement |
|------------|-------------|
| NO feature changes | Verify: identical UI/behavior before/after |
| NO visual changes | Verify: no CSS/HTML/string modifications |
| Tests pass before/after each task | `npm test` + `npm run e2e:testall` |
| Verification passes | `npm run verify` |
| Metrics improve or stay same | `npm run test:perf` + bundle size check |

---

## 4. Testing Strategy

| Task | Baseline Tests | Regression Tests |
|------|----------------|------------------|
| 1 (Shim) | All 31 suites | verify.js, Subjects.html load |
| 2 (Controllers) | unit/subjects-controller, unit/p2-subjects-controller, integration/p2-full-flow | E2E manual checklist |
| 3 (Console) | All suites | verify.js |
| 4 (Synonyms) | integration/engine-pipeline, unit/processor, unit/templates | Benchmark comparison |
| 5 (Processor) | unit/processor.test.js | Benchmark comparison |
| 6 (Dynamic Import) | All controller tests | Manual generate flow, bundle size |
| 7 (Lazy Load) | All suites | Lighthouse CI, FCP metric |

---

## 5. Execution Approach

**Mode:** Subagent-driven (per superpowers skill)
**Per Task:**
1. Spawn implementer subagent with task spec + full plan context
2. Wait for completion
3. Spawn spec-reviewer → confirms code matches spec
4. Spawn code-quality reviewer → approves quality
5. Fix issues if any, re-review
6. Mark done, commit with descriptive message
7. Final overall reviewer → handoff to documentation-maintenance

**TDD Enforcement:** Each subagent must write failing test first (if not exists), then implement, then verify green.

**Timeout Mitigation:** Tasks designed as single-file or 1-3 related functions. If subagent times out, fix directly in parent session.

---

## 6. Success Criteria (Overall)

- [ ] All 31 test suites pass
- [ ] `npm run verify` passes with zero warnings
- [ ] Bundle size reduced ≥15%
- [ ] Comment generation benchmark improved ≥30%
- [ ] Zero console.log in production build
- [ ] Zero dead code (shims removed)
- [ ] Zero duplication between controller files
- [ ] documentation-maintenance auto-handoff completes

---

## 7. Rollback Plan

If any task causes regression:
1. `git revert <commit>` for that task
2. Tests must pass
3. Document failure in plan for future reference

---

*Design approved for implementation. Next: writing-plans phase.*