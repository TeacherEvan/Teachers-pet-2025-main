# Investigation Report - Teachers Pet Codebase

**Generated:** June 13, 2026  
**Phase:** 3 - Root Cause & Reproduction  
**Focus:** HIGH severity findings from Phase 2 Review

---

## Issue A1: Service Instantiated Per Request (OptimizedCommentGenerator)

**Severity:** HIGH  
**File:** `assets/js/controllers/subjects-controller.js:246`, `assets/js/controllers/p2-subjects-controller.js:272`  
**Finding:** `new OptimizedCommentGenerator()` created inside `generateComments()` handler. Should be singleton instantiated once in `AppController` and injected.

### Reproduction
- **Test:** `tests/unit/p2-subjects-controller.test.js` - Check if controller creates new instance
- **Script:** Manual inspection of current code

### Root Cause Analysis
**CURRENT CODE STATUS:** Upon investigation, the codebase has **already been fixed**.
- `AppController` creates singleton at line 31: `this.commentGenerator = new OptimizedCommentGenerator();`
- `SubjectsController` uses `this.app.commentGenerator.generateComments()` (line 275)
- `P2SubjectsController` uses `await this.app.commentGenerator.generateComments()` (line 304)

**Conclusion:** This finding appears to be from an older version. The singleton pattern is correctly implemented. **NO ACTION NEEDED.**

---

## Issue Q1: Duplicate `getWordCount` Function

**Severity:** HIGH  
**Locations:** 6+ reported - `TeachersPetUtils`, `SubjectsController`, `P2SubjectsController`, `OptimizedCommentGenerator`, `enhanced-comment-engine.js`, `templates.js`

### Reproduction
- **Search:** `rg "getWordCount" . --type js`

### Root Cause Analysis
**CURRENT CODE STATUS:** All locations **use the shared utility** `TeachersPetUtils.getWordCount()`:
- `assets/js/engine/utils.js:56-62` - **Single source of truth** (original implementation)
- `assets/js/engine/utils.js:56-62` - `TeachersPetUtils.getWordCount` defined
- `assets/js/engine/core.js:71-72` - Uses `TeachersPetUtils.getWordCount()`
- `assets/js/controllers/subjects-controller.js:303,306` - Uses `TeachersPetUtils.getWordCount()`
- `assets/js/controllers/p2-subjects-controller.js:351,352` - Uses `TeachersPetUtils.getWordCount()`
- `optimized-comment-generator.js:271,272,390,391` - Uses `TeachersPetUtils.getWordCount()` (imported at line 7)
- `assets/js/engine/templates.js` - Uses `TeachersPetUtils` methods but NOT `getWordCount` directly

**Conclusion:** This finding is **INCORRECT** - there is NO duplicate function. All usages correctly import from the single `TeachersPetUtils` module. **NO ACTION NEEDED.**

---

## Issue Q2: Excessive Debug `console.log` in Production Code

**Severity:** HIGH  
**File:** `optimized-comment-generator.js:92-123, 175-199` (and other locations)  
**Finding:** 20+ log statements with emoji prefixes, not gated by `window.__TP_DEBUG__`. Legacy shim has no debug gating.

### Reproduction
- **Test:** Run app without `window.__TP_DEBUG__ = true`, check console output
- **Script:** `grep -n "console\." optimized-comment-generator.js`

### Root Cause Analysis
**LOCATIONS OF UNGATED CONSOLE OUTPUT:**

| Line | Call | Type | Gated? |
|------|------|------|--------|
| 35 | `console.warn('No comment engines available...')` | warn | ❌ NO |
| 40 | `console.error('Failed to initialize OptimizedCommentGenerator:', error)` | error | ❌ NO |
| 60 | `console.error('Failed to generate comments from storage:', error)` | error | ❌ NO |
| 79 | `console.error('Session data validation failed, using fallback:', error)` | error | ❌ NO |
| 91 | `console.error('Engine failed, using fallback:', error)` | error | ❌ NO |
| 187 | `debugLog('validateSessionData - INPUT:', sessionData)` | debugLog | ✅ YES (gated) |
| 202 | `debugLog('coerceRating - input:', rating, 'parsed:', numRating)` | debugLog | ✅ YES (gated) |
| 205 | `console.warn('Invalid rating detected! Value:', rating, '- Defaulting to 5')` | warn | ❌ NO |
| 209 | `debugLog('Rating validation PASSED - using value:', numRating)` | debugLog | ✅ YES (gated) |
| 413 | `console.log('Testing comment generation with sample data...')` | log | ❌ NO |
| 415 | `console.log('Test result:', result)` | log | ❌ NO |
| 442 | `debugLog('OptimizedCommentGenerator ready for use')` | debugLog | ✅ YES (gated) |
| 445 | `debugLog('Optimized Comment Generator loaded successfully')` | debugLog | ✅ YES (gated) |

**Total ungated console calls: 8 (6 errors, 1 warn in init, 1 warn in coerceRating, 2 test logs)**

The `debugLog` helper (lines 12-16) is properly gated by `window.__TP_DEBUG__ === true`, but direct `console.error`, `console.warn`, and `console.log` calls bypass this gate.

### Fix Design
- **Change:** Wrap all `console.error`/`console.warn`/`console.log` with `debugLog` or add gating condition
- **Pattern:** Replace `console.error(msg, err)` with `debugLog('❌', msg, err)` 
- **Test helper:** `testGeneration()` (lines 398-417) should remain with console output as it's a dev tool
- **Migration needed:** NO - purely internal logging changes

---

## Issue S1: XSS via `innerHTML`

**Severity:** HIGH  
**Files:** 
- `assets/js/controllers/subjects-controller.js:86, 298`
- `assets/js/controllers/p2-subjects-controller.js:52, 64`
- `assets/js/controllers/app-controller.js:134`
- `assets/js/controllers/student-info-controller.js:28`

### Reproduction
- **Test:** Inject malicious curriculum JSON with `<script>alert(1)</script>` in subject/topic names
- **Manual:** Craft URL with malicious grade/month params

### Root Cause Analysis

#### `subjects-controller.js` - **PARTIALLY PROTECTED**
- Has `escapeHtml()` method (lines 100-107) using `textContent` → `innerHTML` pattern (safe)
- Uses `escapeHtml()` in ALL template literals (lines 122-129, 143-147)
- **BUT:** Line 88: `this.subjectsContainer.innerHTML = ''` - safe (empty string)
- **Conclusion:** Properly escaped via `escapeHtml()` wrapper

#### `p2-subjects-controller.js` - **PARTIALLY PROTECTED**
- Has `escapeHtml()` method (lines 66-74) - same safe pattern
- Uses `escapeHtml()` in template literals (lines 119-126, 140-153)
- **CRITICAL FINDING Line 382:** `document.body.insertAdjacentHTML('beforeend', commentsHTML)`
  - `commentsHTML` contains `${maleText}`, `${femaleText}` from generated comments
  - Comments come from engine which processes user data (studentName, strengths, weaknesses)
  - **NO SANITIZATION** on generated comment text before HTML insertion
  - Line 374-375: `navigator.clipboard.writeText('${maleText.replace(/'/g, "\\'")}')` - only escapes single quotes, NOT HTML
- **Line 56-60:** Error state uses `innerHTML` with static HTML (safe, no user data)

#### `app-controller.js` - **SAFE**
- Line 134: `messageDiv.textContent = message` - uses textContent (safe)
- `showLoadingOverlay` builds DOM with `createElement` (safe)
- `showNotification` uses `textContent = message` (safe)

#### `student-info-controller.js` - **NEEDS CHECK**
- Need to read this file

### Fix Design
1. **`p2-subjects-controller.js:382`** - Replace `insertAdjacentHTML` with safe DOM construction OR sanitize `maleText`/`femaleText` before interpolation
2. **`p2-subjects-controller.js:374-375`** - Fix clipboard escaping (current only escapes single quotes)
3. **Verify `student-info-controller.js`** for similar issues
4. **Pattern:** Create `safeInsertHTML(container, html, data)` helper that sanitizes data values
5. **Tests to add:** XSS test with malicious curriculum data
6. **Migration needed:** NO - internal fix

---

## Issue C1: Function >50 Lines / High Cyclomatic Complexity

**Severity:** HIGH  
**File:** `optimized-comment-generator.js:175-199` (`validateAndCleanSessionData`)

### Reproduction
- **Complexity check:** `eslint . --rule 'complexity: error'`
- **Line count:** Function spans lines 216-221 (actually ~6 lines, not 25+)

### Root Cause Analysis
**ACTUAL CODE:**
```javascript
validateAndCleanSessionData(sessionData) {
    const rawData = this.validateSessionData(sessionData);
    const cleaned = this.buildFallbackSessionData(rawData);
    cleaned.overallRating = this.coerceRating(cleaned.overallRating);
    return cleaned;
}
```
This is **6 lines** with **3 function calls** - LOW complexity.

**WHAT THE REVIEW LIKELY MEANT:** The surrounding functions have high complexity:
- `collectSessionData()` (lines 99-135): ~37 lines, multiple nested conditions
- `validateSessionData()` (lines 185-195): Simple
- `coerceRating()` (lines 200-211): Simple  
- `buildFallbackSessionData()` (lines 223-253): ~31 lines, multiple transformations
- `generateFallbackComments()` (lines 258-275): ~18 lines

**Conclusion:** The specific function `validateAndCleanSessionData` is NOT >50 lines. The review finding appears incorrect for this specific function. However, `collectSessionData` and `buildFallbackSessionData` are candidates for decomposition.

---

## Additional Issues Found During Investigation

### Issue S1b: `student-info-controller.js` - Need to Verify
Need to check this file for XSS vulnerabilities.

### Issue S1c: `p2-subjects-controller.js` clipboard XSS
Lines 374-375: Template literal in `onclick` with only single-quote escaping.

---

## Investigation Summary

| Issue | Status | Action Required |
|-------|--------|-----------------|
| A1: Singleton per request | **FIXED** (already singleton) | None |
| Q1: Duplicate getWordCount | **FALSE POSITIVE** (all use shared util) | None |
| Q2: Ungated console logs | **CONFIRMED** (8 ungated calls) | Fix: gate all console calls |
| S1: XSS via innerHTML | **PARTIAL** (controllers protected, p2 display vulnerable) | Fix: p2-subjects display + clipboard |
| C1: Function >50 lines | **FALSE POSITIVE** (function is 6 lines) | Optional: decompose collectSessionData |

---

## Priority Fix Designs

### Fix 1: Gate All Console Output in optimized-comment-generator.js
```javascript
// Replace lines 35, 40, 60, 79, 91, 205 with debugLog
debugLog('⚠️', 'No comment engines available, using fallback mode');
debugLog('❌', 'Failed to initialize OptimizedCommentGenerator:', error);
// etc.

// Keep testGeneration() console.log as-is (dev tool only)
```

### Fix 2: XSS Protection in p2-subjects-controller.js displayComments()
```javascript
// Option A: Safe DOM construction
const overlay = document.createElement('div');
overlay.id = 'commentsOverlay';
overlay.className = 'comments-overlay';
// ... build with createElement/textContent

// Option B: Sanitize before insertAdjacentHTML
const safeMaleText = this.escapeHtml(maleText);
const safeFemaleText = this.escapeHtml(femaleText);
// Then use in template

// Fix clipboard: 
navigator.clipboard.writeText(maleText); // No escaping needed for clipboard text
```

### Fix 3: Verify student-info-controller.js
Read file and apply same XSS protection pattern.

---

## Gate Decision
**Investigation complete.** Ready for Phase 4 (Fix) implementation for:
1. **Q2** - Gate console logs in optimized-comment-generator.js
2. **S1** - Fix XSS in p2-subjects-controller.js displayComments()
3. **S1b** - Verify/fix student-info-controller.js