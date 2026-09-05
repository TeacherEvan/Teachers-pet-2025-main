# Teachers Pet - Performance Optimization Implementation Plan

**Date:** 2026-06-13  
**Design:** `docs/plans/2026-06-13-perf-optimization-design.md`  
**Branch:** `perf/optimization-phase-1`

---

## Task Breakdown

Each task: Write test → Watch fail → Implement → Watch pass → Commit

---

### Task 1: Add Vite + Multi-Page Config

**Files:** `package.json`, `vite.config.js`, `index.html` (and 5 other HTML files)

**Test:** `npm run build` produces `dist/` with separate chunks per page

**Steps:**
1. Add Vite dependencies: `vite`, `@vitejs/plugin-legacy` (optional, for older browsers)
2. Create `vite.config.js` with multi-page input config
3. Update `package.json` scripts: `dev`, `build`, `preview`
4. Remove `preload` links from HTML files (Vite handles)
5. Move inline `<style>` critical CSS to JS imports or keep (Vite extracts)
6. Test: `npm run dev` → all pages load; `npm run build` → dist/ works

**Commit:** `build: add Vite multi-page bundling`

---

### Task 2: Fix SynonymManager Lazy Load (Ensure No Import-Time Fetch)

**Files:** `assets/js/synonym-manager.js`

**Test:** Verify `fetch('assets/data/synonyms.json')` NOT called on module import

**Steps:**
1. Add test: Import SynonymManager, spy on fetch, assert not called
2. Verify constructor only sets `this.synonymData = null`, `this.initialized = false`
3. `loadSynonymData()` already does the fetch - ensure it's not called in constructor
4. Current code looks correct - just add verification test

**Commit:** `perf: verify synonyms.json lazy-load on first use`

---

### Task 3: Remove mythology-effects.js + Fix comment-engine.js Preload

**Files:** `student-information.html`, `index.html`, DELETE `assets/js/mythology-effects.js`

**Test:** No 404 for mythology-effects.js, no console error for comment-engine.js preload

**Steps:**
1. Remove `<script src="assets/js/mythology-effects.js">` from `student-information.html`
2. Remove `<link rel="preload" href="assets/js/comment-engine.js" as="script">` from `index.html`
3. Delete `assets/js/mythology-effects.js`
4. Verify no other references: `grep -r mythology-effects`, `grep -r comment-engine.js`
5. Test: Load student-information.html and index.html, no console errors

**Commit:** `cleanup: remove unused mythology-effects.js and broken preload`

---

### Task 4: Deduplicate debugLog into Shared Util

**Files:** 
- NEW: `assets/js/utils/debug.js`
- MODIFY: `assets/js/engine/core.js`
- MODIFY: `assets/js/engine/processor.js`
- MODIFY: `assets/js/synonym-manager.js`

**Test:** Import debugLog from utils/debug.js, verify output matches old behavior

**Steps:**
1. Create `assets/js/utils/debug.js` with `createDebugLog(prefix)` factory
2. Export `debugLog` (no prefix) and `createDebugLog`
3. In `core.js`: Remove local `debugLog` function, import `{ debugLog } from '../utils/debug.js'`
4. In `processor.js`: Same - import shared debugLog
5. In `synonym-manager.js`: Replace `debugLogSynonym` with `createDebugLog('📚 ')` or import and wrap
6. Test: Set `window.__TP_DEBUG__ = true`, verify logs appear with correct emojis

**Commit:** `refactor: deduplicate debugLog into shared utils/debug.js`

---

### Task 5: Controller Lazy Initialization in app-controller.js

**Files:** `assets/js/controllers/app-controller.js`

**Test:** Verify only 1 controller instantiated per page (add console.log or spy)

**Steps:**
1. Change `this.controllers = {}` to private `_launcher`, `_studentInfo`, etc.
2. Add getters:
```js
get launcher() { return this._launcher ??= new LauncherController(this); }
get studentInfo() { return this._studentInfo ??= new StudentInfoController(this); }
get subjects() { return this._subjects ??= new SubjectsController(this); }
get p2Subjects() { return this._p2Subjects ??= new P2SubjectsController(this); }
```
3. In `init()`: Use `this.launcher.init()` etc. instead of `this.controllers.launcher.init()`
4. Keep `this.controllers` as compatibility proxy if any external code accesses it
5. Test: Load each page, verify only relevant controller logs "initialized"

**Commit:** `perf: lazy-initialize controllers per page`

---

## Execution Order

```
1. Task 3 (cleanup) - Independent, quick win
2. Task 4 (debug util) - Independent, enables clean imports for others
3. Task 2 (synonym lazy) - Independent verification
4. Task 5 (controller lazy) - Independent
5. Task 1 (Vite) - Touches build, do last to avoid reconfiguring during other tasks
```

---

## Verification Gates (Run After Each Task)

```bash
npm test          # All 24 tests pass
npm run lint      # 0 errors
npm run test:perf # No regression (processor ≤8ms, templates ≤6ms)
```

---

## Final Verification (All Tasks Done)

```bash
npm run build     # Vite builds dist/
npm run preview   # Preview production build
# Manual: Open each page, check Network tab for request count
```