# Teachers Pet – Agent Guide

## ⚠️ CRITICAL: RESEARCH BEFORE IMPLEMENTATION ⚠️
**NEVER "wing it" - ALWAYS research first using MCP tools!**

Before implementing ANY complex feature, algorithm, or system:

1. **Use MCP Context7** for authoritative documentation:
   ```
   mcp_context7_resolve-library-id → mcp_context7_get-library-docs
   ```
   Example: Synonym systems, word tracking, DOM manipulation, sessionStorage patterns

2. **Use fetch_webpage** for authoritative sources (MDN, GitHub repos, Stack Overflow)

3. **Use mcp_sequentialthi_sequentialthinking** for complex problem-solving:
   - Break problems into steps
   - Question assumptions
   - Revise based on findings

4. **Use manage_todo_list** for multi-step work:
   - Create task list BEFORE coding
   - Mark in-progress/completed individually
   - Never batch completions

**Lesson from 2025-11-13:** Synonym manager initially broke because agent didn't research proper tracking algorithms. After using MCP tools, correct Map-based approach was found. Don't repeat this mistake.

**Research FIRST, implement SECOND, validate THIRD.**

## Project Structure & Constraints

**Static HTML/CSS/JS Application** - No build tools, no servers, no external APIs without approval.

### Wizard Flow
```
index.html → grade-selection.html → month-selection.html → 
student-information.html → Subjects.html → Generated Comments
```

### State Management (Dual-Layer System)
- **In-Memory:** `TeachersPetApp.sessionData` (assets/js/controllers/app-controller.js) - source of truth during session
- **Persistence:** `localStorage.studentData` - read by comment generators
- **CRITICAL:** Keep both in sync! Comment engines read from localStorage, not sessionData

Common keys: `studentName`, `gender`, `grade`, `month`, `overallAttributes`, `strengths`, `weaknesses`, `subjects`, `topicRatings`

### Reset Flow
`startOverWithAnimation()` clears storage, resets sessionData, redirects to index.html - preserve this behavior.

### Deployment
Static-only (GitHub Pages, Netlify, Vercel). Works from filesystem. Some features (clipboard) require HTTPS/secure context.


## Curriculum & Subjects

### Dynamic Loading System
`CurriculumLoader` (`assets/js/curriculum/curriculum-loader.js`) injects curriculum from:
```
/assets/js/curriculum/{grade}/{month}.js
```

**Current Datasets:**
- K1: August, November
- K2: November

### Adding New Curriculum
1. Create `/assets/js/curriculum/{grade}/{month}.js` with proper structure:
   ```javascript
   window.CurriculumData = window.CurriculumData || {};
   window.CurriculumData.K1 = window.CurriculumData.K1 || {};
   window.CurriculumData.K1.August = {
     subjects: [/* ... */]
   };
   ```

2. Update `getAvailableMonths()` in curriculum-loader.js:
   ```javascript
   'K2': ['November', 'December']  // Add December
   ```

3. Update `availableList` lookup in the loader

4. Mirror topic changes in matching `curriculum-*.md` docs

### Subject Rendering
`Subjects.html` builds collapsible sections from loaded curriculum. Preserve:
- Dropdown hints
- Bulk-select helpers
- Keyboard accessibility


## Comment Generation Architecture

### Engine Cascade
```
OptimizedCommentGenerator → EnhancedCommentEngine → PremiumCommentEngine (fallback)
```

**Primary Files:**
- `assets/js/enhanced-comment-engine.js` - **SINGLE SOURCE OF TRUTH** for generation logic
- `optimized-comment-generator.js` - compatibility bridge, initialization wrapper
- `assets/js/comment-engine.js` - legacy/premium fallback
- `assets/js/synonym-manager.js` - intelligent word variation (prevents overuse)
- `assets/data/synonyms.json` - 100+ words across 5 categories
- `missing-functions.js` - handlers for Subjects.html, includes `ensureCommentGeneration()`

### File Sync Pattern
After editing `assets/js/enhanced-comment-engine.js`, sync root copy:
```powershell
Copy-Item "assets/js/enhanced-comment-engine.js" "enhanced-comment-engine.js" -Force
```

### Making Changes

**Subject/Topic Keywords** → Edit `subjectTopicMap` in enhanced-comment-engine.js
```javascript
"Physical Education": ["football", "balance", "snakes", "ladders", "trampoline"]
```

**Capitalization Rules** → Edit `grammarRules.subjectCapitalization`
```javascript
"physical education": "Physical Education"
```

**Templates** → Edit `generate...` functions (male/female styles)

**Synonyms** → Edit `assets/data/synonyms.json`:
```json
{
  "adjectives": {
    "excellent": ["superb", "impressive", "stellar"]
  }
}
```

**Topic-to-Subject Inference** → Edit `topicToSubjectMap` in `missing-functions.js` (must match engine's `subjectTopicMap`)

### Data Integrity Rules (2025-11-17)
- **NEVER inject fake subjects/topics** - Only use teacher's actual selections
- `missing-functions.js` validates and REJECTS if nothing selected (shows alert)
- Engine logs warnings for orphaned topics
- All checkbox collections must verify `value` is not empty/null
- Test with `test-data-integrity.html`

### Generation Requirements
- Mention EVERY selected subject/topic
- Start with student name
- End with encouragement
- Target ~100 words
- Synonym manager auto-swaps overused words (threshold: 2 uses)


## UI Conventions

- **Design System:** Glassmorphism styling with design tokens in `assets/css/main.css` and `assets/css/components.css`
- **Quick fixes:** Use `styles/inline-fixes.css` only for exceptional overrides
- **Accessibility:** 
  - Collapsible headers must be keyboard operable
  - Maintain visible focus states on all interactive elements
  - Preserve ARIA attributes and semantic HTML


## Testing & Debug

### Quick Validation
1. **Full wizard test:** Open `Subjects.html`, complete flow, verify all subjects/topics appear in console logs
2. **Name flow:** `test-student-name.html` - verify student name appears in output
3. **Topic inference:** `test-topic-only-selection.html` - validate topics without subject checkboxes
4. **Data integrity:** `test-data-integrity.html` - ensure no fake data injection
5. **Complete audit:** `test-all-subjects-audit.html` - **NEW: Comprehensive cross-grade/month testing**
   - Quick Audit: 5 critical test cases (Cooking, Physical Education, I.Q isolation)
   - Full Audit: 50+ tests covering ALL 34 subjects across K1 August (13), K1 November (11), K2 November (10)
   - Automated violation detection with visual pass/fail indicators

### Console Debugging
Open Developer Tools (F12), watch for:
- `✅ Collected session data:` - from OptimizedCommentGenerator
- `🎯 Enhanced Engine: Processing session data` - from EnhancedCommentEngine
- `📚 SynonymManager:` - word replacement logs

### Manual Testing
```javascript
// From browser console
window.commentGenerator.generateFromStorage()
window.testCommentGeneration()
```

### State Inspection
Check both storage layers are synced:
```javascript
console.log(TeachersPetApp.sessionData)      // In-memory
console.log(localStorage.studentData)         // Persistence
```


## Deployment & Workflow

### Hosting
Static-only deployment (GitHub Pages, Netlify, Vercel). Works from filesystem but clipboard API requires HTTPS/secure context.

### Documentation
Log all changes in:
- `jobcard.md` - Task entries (newest first)
- `Index.md` - New file creation log
- Relevant `*-SUMMARY.md` files for significant features

### Collaboration Rules
1. **Confirm scope** before implementing behavior changes
2. **Isolated changes** - fix bugs in place, avoid architectural rewrites
3. **QA instructions** - specify test page and example data for verification


## Key Files & Patterns (Quick Reference)
- `assets/js/controllers/app-controller.js` — application controller and wizard routing; `TeachersPetApp.sessionData` is in-memory state.
- `optimized-comment-generator.js` — initializes Enhanced/Premium engines and provides `generateFromStorage()` and `testCommentGeneration()` helpers.
- `assets/js/enhanced-comment-engine.js` — main comment generation logic: `subjectTopicMap`, `grammarRules`, and templates for male/female output.
- `assets/js/curriculum/curriculum-loader.js` — dynamic curriculum loader and availability list for grades/months.
- `assets/js/curriculum/{grade}/{month}.js` — curriculum definitions (subject/topic structure) used by `Subjects.html`.
- `Subjects.html` — dynamic subject/topic rendering; ensures all selected subjects are included in generated comments.
- `test-student-name.html` and `test-topic-only-selection.html` — go-to browser test pages for common regressions.

## Collaboration & PR Rules
- Before implementing behavior changes or adding features, confirm scope with the product owner and add an entry in `jobcard.md` (newest first). Log new files in `Index.md`.
- Keep changes isolated: fix bugs in place, prefer edits to `assets/js/` files, and avoid introducing new server-side dependencies.
- Include short instructions for QA reviewing: which test page to open and example student data that should regenerate consistent comments.

## Performance Optimization Patterns (2025-11-17)

### DOM Query Caching
**Problem:** Redundant `querySelectorAll()` calls in tight loops (3x slower performance)

**Solution:** Cache queries before loops
```javascript
// ❌ Before - queries DOM 3 times
document.querySelectorAll('.checkbox').forEach(cb => {
  document.querySelectorAll('.checkbox').forEach(/* ... */);
});

// ✅ After - queries once, 3x faster
const checkboxes = document.querySelectorAll('.checkbox');
checkboxes.forEach(cb => { /* ... */ });
```

**Applied in:** `Subjects.html` (saveSelections, loadSelections, updateSelectionCount), `missing-functions.js` (ensureCommentGeneration, DOMContentLoaded)

### Debouncing Pattern
**Problem:** UI lag from rapid event firing (checkbox clicks update counter 10+ times/second)

**Solution:** 150ms debounce with `setTimeout`
```javascript
let debounceTimeout;
function debouncedUpdate() {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    // Actual update logic
  }, 150);
}
```

**Applied in:** `Subjects.html` (debouncedUpdateSelectionCount)

### Storage Namespace Pattern
**Problem:** Scattered localStorage operations (2-6 separate setItem/getItem calls)

**Solution:** `TeachersPetStorage` utility with batch methods
```javascript
const storage = TeachersPetStorage.namespace('subjects');
storage.setAll({ key1: val1, key2: val2 }); // 1 batch operation
const data = storage.getAll(['key1', 'key2']); // 1 batch retrieval
```

**Methods:** `get(key)`, `set(key, value)`, `setAll(object)`, `getAll(keys)`, `transact(fn)`

**Applied in:** `Subjects.html` (backward compatible with legacy keys)

### Performance Gains
- **DOM Operations:** 3x faster (caching eliminates redundant scans)
- **localStorage I/O:** 50% reduction (batch operations)
- **UI Responsiveness:** Smoother (debounced updates)

## Common Pitfalls to Avoid

1. **Storage Desync:** Always update BOTH `TeachersPetApp.sessionData` and `localStorage.studentData` when changing state
2. **Fake Data Injection:** Never generate default subjects/topics - only use teacher's actual selections
3. **Keyword Mismatches:** Keep `subjectTopicMap` (enhanced-comment-engine.js) and `topicToSubjectMap` (missing-functions.js) in sync
4. **File Sync:** After editing `assets/js/enhanced-comment-engine.js`, sync root copy with PowerShell command
5. **Missing Curriculum Update:** When adding subjects/topics, update BOTH the curriculum JS file AND the `subjectTopicMap`
6. **Skipping Research:** Always use MCP tools before implementing complex features (2025-11-13 lesson learned)
7. **Redundant DOM Queries:** Cache `querySelectorAll()` results when used multiple times - saves 66% query overhead
8. **Scattered Storage Calls:** Use `TeachersPetStorage.namespace()` batch methods instead of multiple setItem/getItem calls

---

*Last updated: 2025-11-17*
*For questions or clarifications, refer to `jobcard.md` for recent change context.*
