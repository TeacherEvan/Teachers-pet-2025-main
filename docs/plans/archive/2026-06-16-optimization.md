# Optimization Plan - Teachers Pet 2025
Date: 2026-06-16

## Current Metrics (Baseline)

### Bundle Sizes (gzipped)
| File | Size (KB) |
|------|-----------|
| optimized-comment-generator-BHp-YwrI.js | 12.15 |
| index-wYCvyBMY.js | 10.36 |
| app-controller-CYMDAftW.js | 9.47 |
| ui-enhancements-DH6UPYS1.js | ~12 (est) |
| performance-optimizer-DyZfavu1.js | ~8 (est) |
| **Total** | **~52 KB** |

### Runtime Performance
| Metric | Value |
|--------|-------|
| Processor (1000 iter) | 11.91 ms |
| Templates (200 iter) | 5.20 ms |

---

## Prioritization Matrix

| Task | Impact | Effort | Priority |
|------|--------|--------|----------|
| Remove duplicate utils in optimized-comment-generator.js | High | Low | Do First |
| Optimize synonym-manager.js regex/memoization | High | Low | Do First |
| Improve processor.js keyword index caching | Medium | Low | Do First |
| Lazy load ui-enhancements.js | Medium | Medium | Plan |
| Lazy load performance-optimizer.js | Medium | Medium | Plan |
| Code splitting for non-critical chunks | Low | Medium | If Time |

---

## Task Details

### Task 1: optimized-comment-generator.js - Remove Duplicate Utilities
**Files:** `assets/js/optimized-comment-generator.js`
**Metric:** Bundle size / Runtime
**Current:** 37.50 KB (12.15 KB gzipped)
**Target:** ~25 KB (~8 KB gzipped) - 33% reduction
**Risk:** Low - functions are identical to TeachersPetUtils

**Step 1: Baseline Test**
```bash
npm test && npm run test:perf
```

**Step 2: Implement**
Remove duplicate methods: `naturalJoin`, `processTextArray`, `getWordCount`, `getPronounSet`, `getPerformanceDescriptor`, `processTextList`
Import from `./engine/utils.js` instead

**Step 3: Verify**
```bash
npm test && npm run build && npm run test:perf
```

**Step 4: Commit**
`git add assets/js/optimized-comment-generator.js && git commit -m "perf: remove duplicate utils from optimized-comment-generator"`

---

### Task 2: synonym-manager.js - Improve Regex and Memoization
**Files:** `assets/js/synonym-manager.js`
**Metric:** Runtime (replaceOverused called on every comment generation)
**Current:** Multiple regex compilations per word
**Target:** Single regex compilation via enhanced memoization
**Risk:** Low - internal optimization only

**Step 1: Baseline Test**
```bash
npm test
```

**Step 2: Implement**
- Memoize the word-boundary regex pattern per normalized word
- Combine escapeRegex + matchCase caches (already done)
- Avoid creating new RegExp objects in hot path

**Step 3: Verify**
```bash
npm test && npm run test:perf
```

**Step 4: Commit**
`git add assets/js/synonym-manager.js && git commit -m "perf: optimize synonym-manager regex memoization"`

---

### Task 3: processor.js - Improve Keyword Index Caching
**Files:** `assets/js/engine/processor.js`
**Metric:** Runtime (groupTopicsBySubject called per generation)
**Current:** Builds custom index on first use with JSON.stringify cache key (slow)
**Target:** O(1) cache lookup with stable key generation
**Risk:** Low - caching logic only

**Step 1: Baseline Test**
```bash
npm test && npm run test:perf
```

**Step 2: Implement**
- Replace JSON.stringify cache key with simpler hash (e.g., subject count + keyword count)
- Pre-build index for all standard data maps at module load
- Use WeakMap for engine-data-specific caches

**Step 3: Verify**
```bash
npm test && npm run test:perf
```

**Step 4: Commit**
`git add assets/js/engine/processor.js && git commit -m "perf: optimize keyword index caching in processor"`

---

### Task 4: Lazy Load ui-enhancements.js
**Files:** `assets/js/utils/ui-enhancements.js`, `vite.config.js`
**Metric:** Bundle size (initial load)
**Current:** 36.24 KB in critical path
**Target:** Move to separate chunk loaded on demand
**Risk:** Medium - requires testing UI interactions

**Step 1: Baseline Test**
```bash
npm test && npm run build
```

**Step 2: Implement**
- Convert ui-enhancements to entry point with dynamic import
- Load after DOMContentLoaded in app-controller.js
- Update vite.config.js for manual chunk

**Step 3: Verify**
```bash
npm test && npm run build
```

**Step 4: Commit**
`git add assets/js/utils/ui-enhancements.js vite.config.js assets/js/controllers/app-controller.js && git commit -m "perf: lazy load ui-enhancements"`

---

### Task 5: Lazy Load performance-optimizer.js
**Files:** `assets/js/utils/performance-optimizer.js`, `vite.config.js`
**Metric:** Bundle size (initial load)
**Current:** 23.81 KB in critical path
**Target:** Load on idle callback
**Risk:** Low - monitoring only, non-critical

**Step 1: Baseline Test**
```bash
npm test && npm run build
```

**Step 2: Implement**
- Load via requestIdleCallback in app-controller.js
- Already designed for this pattern

**Step 3: Verify**
```bash
npm test && npm run build
```

**Step 4: Commit**
`git add assets/js/utils/performance-optimizer.js vite.config.js assets/js/controllers/app-controller.js && git commit -m "perf: lazy load performance-optimizer"`

---

## Completion Checklist
- [ ] All tests pass (`npm test`)
- [ ] Verification passes (`npm run verify`)
- [ ] Metrics improved (documented before/after)
- [ ] No visual/functionality regression
- [ ] Commit history shows atomic, descriptive commits
- [ ] Optimization report updated with results
- [ ] Handoff to documentation-maintenance invoked

---

## Expected Results

| Metric | Before | After (Est) | Improvement |
|--------|--------|-------------|-------------|
| Total gzipped JS | ~52 KB | ~35 KB | ~33% |
| Initial chunk (index) | 37 KB | ~15 KB | ~60% |
| Processor (1000 iter) | 11.91 ms | ~8 ms | ~33% |
| Template (200 iter) | 5.20 ms | ~4 ms | ~23% |