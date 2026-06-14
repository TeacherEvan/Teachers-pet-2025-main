# Teachers Pet - Performance Optimization Design

**Date:** 2026-06-13  
**Status:** Approved - Ready for Planning  
**Branch:** `perf/optimization-phase-1`

---

## Scope

Five quick-win optimizations from audit (Phase 1 - Do First):

| # | Task | Effort | Impact |
|---|------|--------|--------|
| 1 | Add Vite for bundling | Medium | 50% fewer requests, dev server |
| 2 | Lazy-load synonyms.json in SynonymManager | Low | Defer 19KB until needed |
| 3 | Remove mythology-effects.js + fix comment-engine.js preload | Low | -11KB, fix warning |
| 4 | Deduplicate debugLog into shared util | Low | -50 lines, consistent debugging |
| 5 | Controller lazy initialization in app-controller.js | Low | -75% controller overhead |

---

## Design Decisions (Approved)

### 1. Build System: Vite
- **Why**: Multi-page HTML + ES modules native, dev server, `vite-bundle-analyzer` ready
- **Config**: `vite.config.js` with `build.rollupOptions.input` for each HTML entry
- **Dev**: `vite` command for dev server, `vite build` for production

### 2. SynonymManager Lazy-Load
- **Current**: `loadSynonymData()` called inside `replaceOverused()` - already lazy
- **Change**: Ensure fetch does NOT happen on import (constructor only initializes empty state)
- **No API change** - callers unchanged

### 3. Dead Code Removal
- **Delete**: `/assets/js/mythology-effects.js` (only loaded in student-information.html)
- **Fix**: Remove `<link rel="preload" href="assets/js/comment-engine.js">` from index.html (file doesn't exist)
- **Verify**: No other references to either

### 4. Debug Log Utility
- **New file**: `/assets/js/utils/debug.js`
```js
export function createDebugLog(prefix = '') {
  return (emoji, message, ...args) => {
    if (typeof window !== 'undefined' && window.__TP_DEBUG__ === true) {
      console.log(`${prefix}${emoji} ${message}`, ...args);
    }
  };
}
export const debugLog = createDebugLog();
```
- **Migrate**: `core.js`, `processor.js`, `synonym-manager.js` → import `debugLog` from utils/debug.js
- **synonym-manager.js**: Keep `debugLogSynonym` wrapper or rename to use shared with prefix

### 5. Controller Lazy-Init
- **Pattern**: ES6 getter with nullish coalescing
```js
get launcher() { return this._launcher ??= new LauncherController(this); }
get studentInfo() { return this._studentInfo ??= new StudentInfoController(this); }
get subjects() { return this._subjects ??= new SubjectsController(this); }
get p2Subjects() { return this._p2Subjects ??= new P2SubjectsController(this); }
```
- **Init**: Switch on `this.currentPage` calls `this.launcher.init()` etc. - only constructs accessed one
- **Backwards compatible**: `this.controllers.launcher.init()` still works if accessed via getters

---

## Migration Notes

### Vite Entry Points
HTML files stay as entry points. Vite config:
```js
input: {
  index: 'index.html',
  'grade-selection': 'grade-selection.html',
  'month-selection': 'month-selection.html',
  'student-information': 'student-information.html',
  Subjects: 'Subjects.html',
  'p2-subjects': 'p2-subjects.html',
}
```

### Module Imports
- All `<script type="module">` imports work unchanged
- `defer` scripts become module imports or stay as-is
- CSS `@import` in HTML <style> → move to JS imports or keep (Vite handles)

### Test Commands
- `npm test` - unchanged (Node-based, no Vite)
- Add `npm run dev` → `vite`
- Add `npm run build` → `vite build`
- Add `npm run preview` → `vite preview`

---

## Out of Scope (Future Phases)

- Template compilation (Task 6)
- Curriculum lazy loading (Task 7)
- CSS bundling (Task 8)
- Web Worker for comment generation (Task 9)

---

## Acceptance Criteria

1. `npm run dev` starts Vite dev server, all 6 pages load
2. `npm run build` produces optimized bundles in `dist/`
3. `npm test` passes (24/24)
4. `npm run lint` passes (0 errors)
5. `npm run test:perf` shows no regression
6. Network tab: Initial JS requests reduced from 8+ to 2-3 per page
7. synonyms.json NOT loaded until `replaceOverused()` called
8. mythology-effects.js gone, no console errors
9. debugLog calls work identically, single source of truth
10. Only 1 controller instantiated per page load