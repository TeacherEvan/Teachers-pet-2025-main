# Teachers Pet - Performance Optimization Audit

**Date:** 2026-06-13  
**Auditor:** Code Optimization Skill  
**Baseline:** All tests passing, ESLint clean

---

## Executive Summary

The Teachers Pet codebase is a well-structured static HTML/JS application for generating student comments. Current performance is good (Processor: 1000 iter in ~7.6ms, Templates: 200 iter in ~5.4ms), but several optimization opportunities exist:

| Area | Current State | Opportunity | Est. Impact |
|------|---------------|-------------|-------------|
| **Bundle Size** | ~15KB JS (engine-data), ~19KB synonyms.json | Code splitting, lazy loading | 30-40% initial load reduction |
| **Runtime** | 7.6ms/1000 proc, 5.4ms/200 templates | Memoization, algorithmic | 20-30% faster generation |
| **Memory** | Proxy-based store, full synonyms in memory | IndexedDB caching, streaming | Reduced heap pressure |
| **Network** | 5 CSS files, 8+ JS files, no bundling | Vite/esbuild bundling | 50% fewer requests |
| **Templates** | 286 lines, 8 template arrays per section | Template compilation, dedup | Smaller JS payload |

---

## Phase 1: Static Analysis Findings

### 1.1 Bundle & Dependency Analysis

**JavaScript Files (Total: ~160KB uncompressed)**
```
/assets/js/engine-data.js        15KB  (782 lines) - Static data, loads on every page
/assets/js/synonym-manager.js    14KB  (395 lines) - Loads 19KB synonyms.json on demand
/assets/js/engine/core.js         3KB   (85 lines)
/assets/js/engine/processor.js    8KB   (227 lines)
/assets/js/engine/templates.js   16KB   (286 lines)
/assets/js/engine/utils.js        3KB   (119 lines)
/assets/js/utils/performance-optimizer.js  24KB  (627 lines)
/assets/js/utils/ui-enhancements.js       36KB  (1149 lines)
/assets/js/utils/error-boundary.js        11KB  (351 lines)
/assets/js/controllers/*.js      ~25KB combined
```

**CSS Files (Total: ~53KB uncompressed)**
```
main.css                  12KB
components.css            11KB
micro-interactions.css    12KB
mythology-theme.css       12KB
subjects.css               7KB
```

**Curriculum Data (Total: ~80KB)**
```
K1: august(10KB), november(8KB), december(5KB), january(9KB)
K2: november(8KB), december(6KB), january(10KB)
P2: semester1(8KB), semester2(8KB)
PVT: general(7KB)
```

### 1.2 Code Complexity (Cyclomatic)

| File | Functions | Complexity Risk |
|------|-----------|-----------------|
| ui-enhancements.js | 40+ | **HIGH** - Quick nav, haptics, forms, shortcuts all in one class |
| synonym-manager.js | 20+ | **MEDIUM** - Tokenization, regex, memoization, sessionStorage |
| processor.js | 2 | **LOW** - groupTopicsBySubject is complex but single function |
| templates.js | 10 | **LOW** - Template selection, minimal logic |

### 1.3 Dead Code / Unused Exports

- `mythology-effects.js` - Appears unused (no imports found)
- `comment-engine.js` - Referenced in index.html preload but file doesn't exist
- `TeachersPetData` IIFE in processor.js - Pre-built index only used when `subjectTopicMap === TeachersPetData.subjectTopicMap`
- `EnhancedCommentEngine` class export commented out in core.js (lines 83-85)
- Multiple `debugLog` functions duplicated across 5 files

---

## Phase 2: Runtime Profiling Opportunities

### 2.1 Identified Bottlenecks

**1. Synonym Manager - `replaceOverused()` (O(n) but heavy regex)**
- Tokenizes entire text with regex `/\\b[\\w']+\\b/g`
- Creates RegExp per replacement with `new RegExp()`
- Replaces right-to-left to preserve indices
- **Optimization:** Pre-compile regexes, use single-pass string building

**2. Processor - `groupTopicsBySubject()`**
- Builds custom keyword index with `JSON.stringify` cache key (expensive)
- Multiple nested loops: topics × keywords × subjects
- **Optimization:** Move custom index building to init, use Map lookup only

**3. Templates - `generateStyleComment()`**
- 8 template arrays per section (male/female × 5 sections)
- `naturalJoin`, `selectRandom` called repeatedly
- **Optimization:** Pre-compute template weights, reduce object spread

**4. UI Enhancements - Quick Navigation**
- Creates DOM elements on every Ctrl+K press
- `renderQuickNavigationGroups()` rebuilds entire tree
- **Optimization:** Lazy-create overlay, cache rendered groups

### 2.2 Memory Profile Concerns

- `SynonymManager` keeps full synonyms.json (19KB) + flatMap + 2 memoization caches in memory
- `ErrorBoundary` stores up to 50 errors with full stack traces
- `PerformanceOptimizer` keeps all observers + metrics indefinitely
- `TeachersPetApp` creates all 4 controllers on every page (only 1 used)

---

## Phase 3: Prioritized Optimization Plan

### HIGH IMPACT / LOW EFFORT (Do First)

| # | Task | Files | Metric Target |
|---|------|-------|---------------|
| 1 | **Bundle JS with Vite/esbuild** - Single entry, code-split by page | package.json, vite.config.js | 8 JS files → 2-3 chunks, 50% fewer requests |
| 2 | **Lazy-load synonyms.json** - Only fetch when `replaceOverused()` called | synonym-manager.js | Defer 19KB until needed |
| 3 | **Remove unused files** - mythology-effects.js, fix comment-engine.js reference | index.html, cleanup | -11KB JS, fix preload warning |
| 4 | **Deduplicate `debugLog`** - Single shared utility module | 5 engine files | -50 lines, consistent debugging |
| 5 | **Controller lazy initialization** - Only instantiate needed controller | app-controller.js | -75% controller overhead on launcher |

### HIGH IMPACT / HIGH EFFORT (Plan)

| # | Task | Files | Metric Target |
|---|------|-------|---------------|
| 6 | **Template compilation** - Convert template arrays to tagged template functions | templates.js | Reduce 16KB → ~8KB, faster selection |
| 7 | **Curriculum lazy loading** - Dynamic import per grade/month | curriculum-loader.js | Load only needed curriculum (~10KB vs 80KB) |
| 8 | **CSS bundling & minification** - Single critical + async non-critical | main.css, components.css, etc. | 5 files → 1 critical + 1 async, 30% size reduction |
| 9 | **Web Worker for comment generation** - Offload processor/templates | core.js, new worker | Main thread free, 60fps UI |

### MEDIUM IMPACT / LOW EFFORT (Do If Time)

| # | Task | Files | Metric Target |
|---|------|-------|---------------|
| 10 | **Memoize `naturalJoin` / `processTextArray`** | utils.js | 10-15% faster template gen |
| 11 | **Precompile regex in SynonymManager** | synonym-manager.js | 20% faster replaceOverused |
| 12 | **Index curriculum data** - Build search index at build time | curriculum-loader.js, build script | O(1) topic lookups |
| 13 | **Compress synonyms.json** - Remove unused categories, gzip | synonyms.json, server config | 19KB → 5KB gzipped |

---

## Phase 4: Verification Strategy

### Baseline Metrics (Current)

```
Tests: 24/24 passing
Lint: 0 errors, 3 warnings (console.log)
Perf: Processor 7.6ms/1000, Templates 5.4ms/200
Bundle: ~160KB JS, ~53KB CSS, ~80KB curriculum data
```

### Target Metrics (Post-Optimization)

```
Tests: 24/24 passing (regression-free)
Lint: 0 errors, 0 warnings
Perf: Processor <6ms/1000, Templates <4ms/200 (-20%)
Bundle: <100KB JS (gzipped), <30KB CSS (gzipped)
Initial Load: <100ms JS parse on 3G
```

### Verification Commands

```bash
# Before each change
npm test && npm run lint && npm run test:perf

# After each change  
npm test && npm run lint && npm run test:perf

# Bundle analysis (when Vite added)
npm run build && npx vite-bundle-analyzer dist

# Lighthouse CI (when configured)
npx lhci autorun
```

---

## Implementation Order Recommendation

1. **Week 1:** Tasks 1-5 (Quick wins, ~2 days)
2. **Week 2:** Task 6 (Templates), Task 7 (Curriculum lazy load)
3. **Week 3:** Task 8 (CSS), Task 9 (Web Worker - optional)
4. **Week 4:** Tasks 10-13 (Polish), Documentation handoff

---

## Notes for Documentation Handoff

When optimization complete, update:
1. `docs/ARCHITECTURE.md` - Module boundaries, lazy-load strategy
2. `docs/PERFORMANCE.md` - Benchmark commands, targets, profiling guide
3. `CHANGELOG.md` - Performance section with before/after metrics
4. `README.md` - Build/verify commands updated for Vite