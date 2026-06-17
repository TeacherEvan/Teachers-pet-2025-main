# Investigation Report: Teachers Pet 2025

**Generated:** 2025-06-17
**Phase:** 3 — Root Cause & Reproduction
**Scope:** CRITICAL & HIGH findings from review_findings.md

---

## Issue 1: Dual `optimized-comment-generator.js` Files (CRITICAL)

### Finding Recap
Two files with significant divergence:
- **Root:** `optimized-comment-generator.js` (444 lines) — imports from `./assets/js/engine/...`, duplicates 4 utility methods (62 extra lines)
- **Assets:** `assets/js/optimized-comment-generator.js` (391 lines) — imports from `./engine/...`, uses `TeachersPetUtils`

### Reproduction

**Test HTML files (load ROOT version via classic script tag):**
- `tests/test-student-name.html:98` — `<script src="optimized-comment-generator.js"></script>`
- `tests/test-rating-issue.html:109` — `<script src="optimized-comment-generator.js"></script>`
- `tests/test-all-subjects-audit.html:359` — `<script src="optimized-comment-generator.js"></script>`

**Production HTML files (ES modules from `assets/js/`):**
- `index.html:277` — `import { TeachersPetApp } from './assets/js/controllers/app-controller.js';` (no direct import of optimized-comment-generator)
- `p2-subjects.html:39` — `import { P2SubjectsController } from "./assets/js/controllers/p2-subjects-controller.js";`

**Controllers (dynamic import resolves to ROOT):**
- `base-subjects-controller.js:97` — `await import("../optimized-comment-generator.js")` → from `assets/js/controllers/` → `assets/optimized-comment-generator.js` (ROOT)
- `subjects-controller.js:97` — same path
- `p2-subjects-controller.js:217` — same path

### Root Cause
**Vite resolves `../optimized-comment-generator.js` from `assets/js/controllers/` to the ROOT file** (one level up from `assets/`), NOT to `assets/js/optimized-comment-generator.js`.

The test HTML files explicitly load the ROOT file via `<script src="optimized-comment-generator.js">` (relative to test file location in `tests/` → resolves to ROOT).

### Behavioral Differences
| Feature | ROOT Version | Assets Version |
|---------|--------------|----------------|
| Imports | `./assets/js/engine/core.js` | `./engine/core.js` |
| Utils | Duplicates `getPronounSet`, `getPerformanceDescriptor`, `processTextList`, `naturalJoin` | Uses `TeachersPetUtils` |
| Exports | `export { TeachersPetUtils }` (re-export) | No re-export |
| Singleton | `window.commentGenerator = new OptimizedCommentGenerator()` | No global assignment |

### Impact
- **Tests use different code than production** — test results may not reflect actual app behavior
- **Production controllers load ROOT version** — but `app-controller.js` doesn't use it directly; only controllers do
- **Root version has `window.commentGenerator`** — templates.js:269 checks `window.synonymManager` but not commentGenerator
- **Inconsistent utility behavior** — Root duplicates logic that could drift from `TeachersPetUtils`

### Fix Design
**Option A (Recommended):** Delete ROOT `optimized-comment-generator.js`, update all dynamic imports to `./optimized-comment-generator.js` (from `assets/js/controllers/` → `assets/js/`), update test HTML files to use ES module import from `../assets/js/optimized-comment-generator.js`.

**Option B:** Delete Assets version, update imports in controllers to `../../optimized-comment-generator.js` (messy), keep test HTML as-is.

**Decision:** Option A — Assets version is cleaner (uses shared `TeachersPetUtils`), follows project structure, and is the intended module.

### Migration Steps
1. Delete `/optimized-comment-generator.js` (ROOT)
2. Update 3 controllers: `../optimized-comment-generator.js` → `./optimized-comment-generator.js`
3. Update 3 test HTML files: `<script src="optimized-comment-generator.js">` → ES module import from `../assets/js/optimized-comment-generator.js`
4. Verify `window.commentGenerator` usage — templates.js doesn't use it; only root version created it. Remove if unused.

### Test Plan
- Run `npm test` — all 16 suites should pass
- Open test HTML files in browser — verify comment generation works
- Check browser console for `window.commentGenerator` references

---

## Issue 2: Global Window Pollution (CRITICAL)

### Finding Recap
5+ classes assigned to `window` globals across 5 files:

| Global | Defined In | Used By |
|--------|------------|---------|
| `window.performanceOptimizer` | performance-optimizer.js:613 | launcher-controller.js:24, 41 |
| `window.uiEnhancements` | ui-enhancements.js:1143 | ui-enhancements.js:441 (quick nav) |
| `window.errorBoundary` + `window.safeExecute` | error-boundary.js:340, 343 | — (no usages found) |
| `window.synonymManager` | synonym-manager.js:388 (commented) | templates.js:269 — `window.synonymManager.replaceOverused()` |
| `window.OptimizedCommentGenerator` + `window.commentGenerator` | optimized-comment-generator.js:368, 371 | templates.js:269 (checks `window.synonymManager` only), test HTML files |
| `window.startOverWithAnimation` | app-controller.js:246 + launcher-controller.js:206 (DUPLICATE) | ui-enhancements.js:446, launcher-controller.js:249 |
| `window.captureGradeMonth`, `clearAndNavigate`, `goBack`, `startOver`, `refreshReport` | student-information.html module script | — (onclick handlers in HTML) |

### Root Cause
**Historical pattern:** Early development used global assignments for cross-module communication before ES modules fully adopted. Some remains:
- `templates.js` checks `window.synonymManager` (legacy fallback)
- `launcher-controller.js` and `app-controller.js` both define `window.startOverWithAnimation`
- `ui-enhancements.js` quick nav uses `window.startOverWithAnimation`
- Test HTML files use `window.commentGenerator` and `EnhancedCommentEngine` globals

### Impact
- **Namespace collisions** — third-party scripts could overwrite
- **Testing difficulty** — globals persist between tests
- **Memory leaks** — instances never cleaned up
- **Security surface** — XSS could access app internals
- **Duplicate definition** — `startOverWithAnimation` defined twice; launcher version wins (loaded last in index.html)

### Fix Design
**Strategy:** Remove all `window.*` assignments; use ES module imports exclusively.

#### Per Global:
1. **`window.performanceOptimizer`** → Export singleton from module; import in `launcher-controller.js`
2. **`window.uiEnhancements`** → Export singleton; `ui-enhancements.js` quick nav uses local reference
3. **`window.errorBoundary` + `window.safeExecute`** → Remove (no consumers found); if needed, export `errorBoundary` instance
4. **`window.synonymManager`** → Already exported as `synonymManager` singleton; `templates.js:269` should import it (currently falls back to global)
5. **`window.OptimizedCommentGenerator` / `window.commentGenerator`** → Remove; controllers already import class; test HTML files need migration
5. **`window.startOverWithAnimation`** → Keep ONE definition in `app-controller.js` (app owns navigation); export function; `launcher-controller.js` and `ui-enhancements.js` import it
6. **`window.captureGradeMonth` etc.** → Already exported from `shared-ui.js`; student-information.html should import and assign to window ONLY for onclick handlers (or migrate onclick to addEventListener)

### Migration Steps
1. **performance-optimizer.js:** Remove `window.performanceOptimizer = ...`; add `export const performanceOptimizer = new PerformanceOptimizer();`
2. **ui-enhancements.js:** Remove `window.uiEnhancements = ...`; export singleton; quick nav uses local `startOverWithAnimation` import
3. **error-boundary.js:** Remove `window.errorBoundary` and `window.safeExecute`; export `errorBoundary` instance
4. **synonym-manager.js:** Ensure `export const synonymManager` (already line 390); remove commented global
5. **optimized-comment-generator.js (Assets):** Remove `window.OptimizedCommentGenerator` and `window.commentGenerator`
6. **app-controller.js:** Keep `startOverWithAnimation` as exported function; remove `window.` assignment
7. **launcher-controller.js:** Remove local `window.startOverWithAnimation` definition; import from `app-controller.js`
8. **templates.js:269:** Change `window.synonymManager` → import `synonymManager` from `../synonym-manager.js`
9. **Test HTML files:** Migrate to ES modules OR keep minimal globals for onclick (document migration needed)
10. **student-information.html:** Import shared-ui functions; assign to window only for inline onclick handlers (or refactor onclick to addEventListener)

### Test Plan
- Run `npm test` — all suites pass
- Load each HTML page in browser — verify no console errors
- Verify `window` object has no app-specific globals (except minimal for inline handlers)
- Check quick nav (Ctrl+K) works → calls `startOverWithAnimation`
- Verify synonym replacement works in templates (imported, not global)

---

## Issue 3: Dynamic Import in Hot Path (HIGH)

### Finding Recap
3 controllers use `await import("../optimized-comment-generator.js")` inside `generateComments()` called on every click.

### Root Cause
**Lazy loading attempt** — but module is already loaded at app init via controller imports. Dynamic import adds ~1-5ms overhead per click (module resolution cache hit).

### Fix Design
**Hoist import to module top-level:**
```javascript
// At top of each controller file
import { OptimizedCommentGenerator } from "../optimized-comment-generator.js";
```
Then use `new OptimizedCommentGenerator()` directly in `generateComments()`.

### Migration Steps
1. `base-subjects-controller.js` — add import, remove dynamic import in `generateComments()`
2. `subjects-controller.js` — same
3. `p2-subjects-controller.js` — same (uses different method name but same pattern)

### Test Plan
- Run tests — verify comment generation still works
- Manual test: click "Generate Comments" multiple times — no errors

---

## Issue 4: Duplicate `escapeHtml` (HIGH)

### Finding Recap
3 identical implementations:
- `base-subjects-controller.js:98-103`
- `student-info-controller.js:49-54`
- `error-boundary.js:306-311`

### Root Cause
**Copy-paste** during controller creation. `p2-subjects-controller.js` inherits from base; `subjects-controller.js` inline in templates.

### Fix Design
**Extract to `assets/js/utils/security.js`:**
```javascript
export function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
```
Import in all 3 locations.

### Migration Steps
1. Create `assets/js/utils/security.js`
2. Update `base-subjects-controller.js`, `student-info-controller.js`, `error-boundary.js` to import
3. `subjects-controller.js` and `p2-subjects-controller.js` already use `this.escapeHtml()` from base — no change needed
4. `student-info-controller.js` uses its own — replace with import

### Test Plan
- Run tests — verify XSS protection still works
- Manual test: enter `<script>alert(1)</script>` in form fields — should render as text

---

## Issue 5: localStorage No Validation (HIGH)

### Finding Recap
Multiple controllers read `localStorage.getItem('studentData')` → `JSON.parse()` with no schema validation.

### Root Cause
**Trust assumption** — only app writes to this key. But corrupted data, manual edits, or cross-tab issues can break app.

### Fix Design
**Add validation in `createPersistentStore` (store.js):**
```javascript
const sessionSchema = {
  studentName: 'string',
  gender: 'string',
  overallRating: 'number',
  grade: 'string',
  month: 'string',
  subjects: 'array',
  topicRatings: 'object',
  strengths: 'string',
  weaknesses: 'string'
};

function validateSessionData(data) {
  if (!data || typeof data !== 'object') return false;
  for (const [key, type] of Object.entries(sessionSchema)) {
    if (key in data && typeof data[key] !== type) return false;
  }
  return true;
}
```
Use in `createPersistentStore` load step; fallback to initialState if invalid.

### Migration Steps
1. Update `assets/js/state/store.js` with validation
2. Test with corrupted localStorage — should reset to defaults gracefully

### Test Plan
- Manually corrupt localStorage: `localStorage.setItem('studentData', 'invalid json')` — app should not crash
- `localStorage.setItem('studentData', '{"studentName": 123}')` — should fallback to initialState

---

## Gate Decision

**Investigation Complete.** Ready for **Phase 4: FIX** on all 5 issues.

### Fix Order (Dependency-Aware)
1. **Issue 1 (Dual generator)** — Foundation; affects which code runs
2. **Issue 2 (Window globals)** — Architecture cleanup; enables pure ES modules
3. **Issue 3 (Dynamic imports)** — Quick win after #1 (paths may change)
4. **Issue 4 (escapeHtml)** — Independent; shared utility
5. **Issue 5 (localStorage validation)** — Independent; store.js

**Proceed with Phase 4?**