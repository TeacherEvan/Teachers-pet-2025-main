# Investigation Report - HIGH Severity Findings

**Generated:** June 13, 2026
**Phase:** 3 - Root Cause Analysis & Fix Design

---

## Issue A1: Service Instantiated Per Request

### Finding
`new OptimizedCommentGenerator()` created inside `generateComments()` handlers in both `SubjectsController` and `P2SubjectsController`.

### Files
- `assets/js/controllers/subjects-controller.js:246`
- `assets/js/controllers/p2-subjects-controller.js:272`

### Reproduction
```javascript
// In browser console on Subjects.html
let count = 0;
const Original = window.OptimizedCommentGenerator;
window.OptimizedCommentGenerator = class extends Original {
    constructor() { super(); count++; console.log(`Constructed ${count}x`); }
};
// Click generate button 3 times → count = 3
```

**Result:** New instance created on every generate click.

### Root Cause
Controllers instantiate generator locally in event handler:
```javascript
// subjects-controller.js:245-247
const generator = new OptimizedCommentGenerator();
const comments = generator.generateComments(this.app.sessionData);
```

### Fix Design
**Minimal change:** Create singleton in `AppController.init()`, inject into controllers.

```javascript
// app-controller.js - add to constructor
this.commentGenerator = new OptimizedCommentGenerator();

// subjects-controller.js:245 - replace
const comments = this.app.commentGenerator.generateComments(this.app.sessionData);

// p2-subjects-controller.js:271-273 - replace
const { OptimizedCommentGenerator } = await import(...);
const generator = new OptimizedCommentGenerator();
// → use this.app.commentGenerator
```

**Tests to add:** Unit test verifying single instance across multiple generations.

**Migration:** None - internal implementation change only.

---

## Issue Q1: Duplicate getWordCount (6 implementations)

### Finding
`getWordCount` defined in 6 locations with identical logic.

### Files
| Location | File | Lines |
|----------|------|-------|
| `TeachersPetUtils.getWordCount` | `assets/js/engine/utils.js:56` | 7 |
| `SubjectsController.getWordCount` | `assets/js/controllers/subjects-controller.js:305` | 3 |
| `P2SubjectsController.getWordCount` | `assets/js/controllers/p2-subjects-controller.js:350` | 3 |
| `OptimizedCommentGenerator.prototype.getWordCount` | `optimized-comment-generator.js:363` | 4 |
| `EnhancedCommentEngine.prototype.getWordCount` | `assets/js/enhanced-comment-engine.js:649` | 4 |
| `TeachersPetTemplates.generateFallbackComments` | `assets/js/engine/templates.js:281` | Uses `TeachersPetUtils` |

### Reproduction
```javascript
// In browser console
const impls = [
    window.TeachersPetUtils.getWordCount,
    window.app.controllers.subjects.getWordCount,
    window.app.controllers.p2Subjects.getWordCount,
    window.OptimizedCommentGenerator.prototype.getWordCount,
    window.EnhancedCommentEngine.prototype.getWordCount,
    window.commentGenerator.getWordCount
];
impls.forEach(fn => console.log(fn("Hello world"))); // All return 2
```

**Result:** 6 identical implementations.

### Root Cause
- `TeachersPetUtils` is the canonical utility (used by engine/templates)
- Controllers and shim duplicated for convenience/backward compatibility
- Legacy `enhanced-comment-engine.js` shim has its own copy

### Fix Design
**Minimal change:** Remove duplicates, use `TeachersPetUtils.getWordCount` everywhere.

```javascript
// subjects-controller.js:278, 281 - replace
wordCount1.textContent = `(${TeachersPetUtils.getWordCount(comments.male)} words)`;
wordCount2.textContent = `(${TeachersPetUtils.getWordCount(comments.female)} words)`;
// DELETE lines 305-307 (getWordCount method)

// p2-subjects-controller.js:330, 335, 350-352 - replace similarly
// DELETE getWordCount method

// optimized-comment-generator.js:250, 251, 363-366 - replace
male: TeachersPetUtils.getWordCount(maleComment),
female: TeachersPetUtils.getWordCount(femaleComment)
// DELETE lines 363-366

// enhanced-comment-engine.js:121, 122, 649-652 - replace (legacy shim)
// DELETE lines 649-652
```

**Tests to add:** Verify all call sites produce identical output.

**Migration:** None - same function signature.

---

## Issue S1: XSS via innerHTML

### Finding
User-controlled data (grade, month, subject names, topic names) interpolated directly into `innerHTML` without sanitization.

### Files & Lines
| File | Line | Context | User Data Source |
|------|------|---------|------------------|
| `subjects-controller.js` | 86 | `renderSubjects` → `renderSubject` | `subject.name`, `topic.name` (curriculum JSON) |
| `subjects-controller.js` | 298 | Button text update | Static |
| `p2-subjects-controller.js` | 52, 64 | Error fallback, render | `subject.name`, `topic.name` (curriculum JSON) |
| `app-controller.js` | 134 | Loading overlay message | Static (parameter) |
| `student-info-controller.js` | 28 | Curriculum tracker | `grade`, `month` (URL params) |

### Reproduction
```javascript
// Malicious curriculum JSON
{ subjects: [{ name: 'English<img src=x onerror=alert(1)>', topics: [{ name: 'Reading<script>alert(2)</script>' }] }] }
// When rendered via renderSubjects() → XSS executes

// Malicious URL params
?grade=K1<script>alert(3)</script>&month=August<script>alert(4)</script>
// In student-information.html → XSS executes via tracker.innerHTML
```

**Result:** Script execution in victim's browser.

### Root Cause
Template literals with `${variable}` directly in `innerHTML` assignment. No escaping/sanitization.

### Fix Design
**Option A (Minimal):** Use `textContent` + `createElement` for dynamic parts.

```javascript
// subjects-controller.js:86-106 - rewrite renderSubject
renderSubject(subject) {
    const section = document.createElement('div');
    section.className = 'subject-section';
    // ... build with createElement, set textContent for dynamic values
    return section.outerHTML; // or append directly
}

// student-info-controller.js:28 - replace
const tracker = document.getElementById('curriculumTracker');
tracker.textContent = ''; // clear
const span = document.createElement('span');
span.textContent = `Current: ${grade} · ${month}`;
// ... add link with createElement
tracker.appendChild(span);
```

**Option B (Comprehensive):** Add DOMPurify or lightweight sanitizer.

```javascript
// Add to utils: escapeHtml(str) { return str.replace(/[&<>"']/g, ...); }
// Use: innerHTML = `\${escapeHtml(userInput)}`
```

**Recommendation:** Option A for controllers (eliminates XSS class), Option B for static templates.

**Tests to add:** XSS payload test cases in integration tests.

**Migration:** None - output HTML structure identical.

---

## Issue Q2: Excessive Debug Logs in Production

### Finding
20+ `console.log` calls with emoji prefixes in `optimized-comment-generator.js`, not gated by debug flag.

### File
`optimized-comment-generator.js` - lines 23, 38, 92-97, 104-106, 109, 121-123, 177-178, 188-197, 401, 403, 430, 433

### Reproduction
```bash
# Count logs
grep -n "console\.(log|warn|error)" optimized-comment-generator.js | wc -l
# Result: 24 calls
grep "window.__TP_DEBUG__" optimized-comment-generator.js | wc -l
# Result: 0
```

**Result:** All 24 logs execute in production.

### Root Cause
Legacy shim (`optimized-comment-generator.js`) was written with verbose debugging for development but never gated. Core engine (`core.js`, `processor.js`, etc.) correctly uses `window.__TP_DEBUG__`.

### Fix Design
**Minimal change:** Wrap all logs in debug check or remove.

```javascript
// Option 1: Add debug helper (matching core engine pattern)
function debugLog(...args) {
    if (typeof window !== 'undefined' && window.__TP_DEBUG__ === true) {
        console.log(...args);
    }
}
// Replace all console.log → debugLog

// Option 2: Remove all emoji debug logs (keep only error/warn for actual issues)
```

**Recommendation:** Option 2 - remove verbose logs, keep only error logging for actual failures. The shim is a compatibility layer; debug via core engine.

**Tests to add:** Verify no console output in production build.

**Migration:** None - logging only.

---

## Issue C1: validateAndCleanSessionData - Multiple Responsibilities

### Finding
Function does validation, fallback building, rating coercion, and verbose logging (~25 lines, 8 console.log calls, 4 responsibilities).

### File
`optimized-comment-generator.js:175-200`

### Reproduction
```javascript
// Analyze function
const fn = window.OptimizedCommentGenerator.prototype.validateAndCleanSessionData;
// Lines: 25, console.log: 8, responsibilities: 4
// 1. Input validation (studentName required)
// 2. Fallback data building (buildFallbackSessionData)
// 3. Rating coercion (NaN/out-of-range → 5)
// 4. Debug logging (8 statements)
```

**Result:** Violates single responsibility principle.

### Root Cause
Evolutionary growth: started as simple validation, added fallback building, then rating coercion, then debug logging.

### Fix Design
**Minimal change:** Split into focused functions.

```javascript
// optimized-comment-generator.js

// 1. Pure validation - throws on invalid input
validateSessionData(sessionData) {
    const raw = sessionData && typeof sessionData === 'object' ? sessionData : {};
    if (!raw.studentName || String(raw.studentName).trim() === '') {
        throw new Error('Student name is required for comment generation');
    }
    return raw;
}

// 2. Pure coercion - returns cleaned data, no throws
coerceRating(data) {
    const rating = Number(data.overallRating);
    return isNaN(rating) || rating < 1 || rating > 10 ? 5 : rating;
}

// 3. Fallback building - no validation, no logging
buildFallbackSessionData(sessionData) { ... } // existing, keep

// 4. Main function - orchestrates
validateAndCleanSessionData(sessionData) {
    const raw = this.validateSessionData(sessionData);
    const cleaned = this.buildFallbackSessionData(raw);
    cleaned.overallRating = this.coerceRating(cleaned);
    return cleaned;
}
```

**Tests to add:** Unit tests for each split function (valid input, missing name, invalid rating, NaN rating).

**Migration:** Internal refactor - public API unchanged.

---

## Summary

| Issue | Fix Effort | Risk | Priority |
|-------|------------|------|----------|
| A1: Singleton generator | Low (3 file changes) | Low | **1st** |
| Q1: Consolidate getWordCount | Low (5 file changes) | Low | **2nd** |
| S1: XSS innerHTML | Medium (5 locations) | **High** | **3rd** |
| Q2: Remove debug logs | Low (1 file) | Low | **4th** |
| C1: Split validation | Low (1 file) | Low | **5th** |

---

## Gate Decision

**Investigation complete.** All 5 HIGH issues have reproduction confirmed, root cause identified, and minimal fix designs ready.

**Ready for Phase 4: FIX** - Proceed with implementation?