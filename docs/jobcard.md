# Teachers Pet - Development Job Card

## ⚠️ CRITICAL RULE FOR ALL AGENTS ⚠️
**STOP WINGING IT - USE YOUR MCP TOOLS OR YOUR CODE WILL BE BROKEN!**

Before implementing ANY feature:
1. ✅ Use `mcp_context7_resolve-library-id` + `mcp_context7_get-library-docs` for research
2. ✅ Use `fetch_webpage` to study MDN, GitHub repos, and authoritative sources
3. ✅ Use `mcp_sequentialthi_sequentialthinking` to break down complex problems
4. ✅ Use `manage_todo_list` to track progress systematically

**Lesson Learned 2025-11-13:** The synonym system was initially broken because the agent didn't research proper word tracking algorithms. After using MCP tools (Context7, MDN fetch), the correct Map-based approach was found and implemented successfully. DON'T REPEAT THIS MISTAKE!

---

## Recent Work (Newest First)

### 2025-11-21: Fix Critical 404 Error - app.js File Path Correction
**Agent:** GitHub Copilot
**MCP Tools Used:** ✅ mcp_sequentialthi_sequentialthinking, manage_todo_list

**Problem:** Browser console showing 404 error for `assets/js/app.js` on all pages, preventing application initialization. Error appeared in deployed version (Vercel) and confirmed in Firefox developer tools.

**Root Cause:** 
HTML files referenced `assets/js/app.js` but actual file was renamed/moved to `assets/js/controllers/app-controller.js` during refactoring. This caused:
- Failed script loading (404 HTTP status)
- Broken `TeachersPetApp` initialization
- Potential wizard flow interruptions

**Fix (7 files updated):**
1. **index.html** - Updated preload href
2. **grade-selection.html** - Updated preload href
3. **month-selection.html** - Updated preload href AND script src (2 references)
4. **student-information.html** - Updated preload href
5. **Subjects.html** - Updated preload href
6. **.github/copilot-instructions.md** - Updated documentation references (2 locations: State Management section and Key Files & Patterns section)

**Changes:** Replaced all `assets/js/app.js` references with `assets/js/controllers/app-controller.js`

**Non-Issues Identified:** 
- CSS warnings about `-moz-` prefixes, `orphans`, `widows`, `text-size-adjust` - All from Vercel's feedback widget (third-party), not our code
- "Ruleset ignored due to bad selector" errors - Also from Vercel injected styles at `teachers-pet-2025-main.vercel.app:1:*`

**Testing:** Verify no 404 errors in browser console after deployment, confirm TeachersPetApp loads successfully

**Files Modified:** 5 HTML files, 1 documentation file
**Performance Impact:** Eliminates failed HTTP request on every page load

### 2025-11-18: Curriculum Persistence Fix - Grade/Month Lost on Back Navigation
**Agent:** GitHub Copilot
**MCP Tools Used:** ✅ Subagent for comprehensive flow research

**Problem:** When users clicked "Back to Student Info" from Subjects page, the selected grade/month curriculum was lost. On next forward navigation, system defaulted to K1/August instead of user's actual selection (e.g., K2/November).

**Root Cause:**
1. `assets/js/app.js` `submitStudentInfo()` only passed student fields (name, gender, rating) in URL to Subjects.html, NOT grade/month
2. `missing-functions.js` `goBack()` navigated to student-information.html without query params, dropping curriculum context
3. `Subjects.html` curriculum loader had no localStorage fallback when URL params missing

**Fix (4 touchpoints):**
1. **assets/js/app.js** `submitStudentInfo()`: Read grade/month from localStorage.studentData, mirror into sessionData, include in Subjects URL params
2. **missing-functions.js** `goBack()`: Preserve grade/month when navigating back (localStorage → URL fallback pattern)
3. **Subjects.html** curriculum loader: Add localStorage.studentData fallback before defaulting to K1/August
4. **student-information.html** + **assets/js/app.js** `initStudentInfo()`: Show "Current: K2 · November" tracker pill with "Change" link

**Testing:** 
- Select K2 November → fill student info → continue to Subjects → verify K2 Nov loads
- Click "Back to Student Info" → verify URL has `?grade=K2&month=November`
- Continue forward → verify K2 Nov persists (not reset to K1 Aug)
- Click "Change" link → verify navigates to month-selection with K2 pre-selected

**Files Modified:** `assets/js/app.js`, `missing-functions.js`, `Subjects.html`, `student-information.html`
**Documentation:** `docs/CURRICULUM-PERSISTENCE-FIX.md`

### 2025-11-17: CRITICAL FIX #2 - Incorrect Subject-Topic Keyword Mappings (K1 November)
**Agent:** GitHub Copilot
**MCP Tools Used:** ✅ mcp_sequentialthi_sequentialthinking for diagnosis

**Problem:** Topics mapped to WRONG subjects - "Thai fried wontons" appearing under English instead of Cooking, "Snakes and ladders" appearing under Cooking instead of Physical Education.

**Root Cause:**
Keyword maps (`subjectTopicMap`) missing K1 November curriculum-specific terms:
- Cooking had ["look chop", "sugar", "bean"...] but NO "thai"/"wonton" keywords
- PE had ["football", "balance"...] but NO "snakes"/"ladders"/"trampoline" keywords
- Arts missing "ring craft", "banana painting", "fathers day" keywords

**Fix:**
- Updated `assets/js/enhanced-comment-engine.js` subjectTopicMap:
  - **Cooking:** Added thai, fried, wonton, wontons, minced, egg, oil, carrot, seasoning
  - **Physical Education:** Added snakes, ladders, trampoline, balancing, game, rubber, shape, dice, step, straw, jumping
  - **Arts:** Added ring craft, pig, banana, painting, stem, paper bag, fathers, father's day, card, flower
  - **Science:** Added surface tension, parachute, float, sink, walking water
  - **Puppet Show:** Added hare, tortoise, dog, reflection

- Mirrored updates in `missing-functions.js` topicToSubjectMap
- Synced root `enhanced-comment-engine.js` copy

**Testing:** Select specific subjects only, verify comments mention ONLY those subjects with correct topics.

### 2025-11-17: CRITICAL FIX - Remove Fake Default Subjects
**Agent:** GitHub Copilot
**MCP Tools Used:** ✅ User feedback analysis

**Problem:** Comments were referencing subjects and topics that the teacher DID NOT select. User reported: "Now its referencing stuff I DID NOT SELECT!"

**Root Cause:** 
1. When NO subjects/topics were selected, `missing-functions.js` injected FAKE default subjects: "General Learning" and "Social Development" with fake topics like "classroom_participation" and "peer_interaction".
2. This caused comments to mention content the teacher never ticked.

**Fix:**
- **REMOVED** the fake default injection completely (lines ~241-248 in `missing-functions.js`).
- **REPLACED** with strict validation: if nothing is selected, show alert and abort generation.
- Added enhanced logging to show exact checkbox IDs and values being collected.
- Added validation to skip checkboxes with empty/null values.

**Changes:**
- `missing-functions.js` → removed fake subject injection, added strict validation and detailed logging
- `assets/js/enhanced-comment-engine.js` → added warning logging for orphaned topics
- `enhanced-comment-engine.js` (root) → synced from assets

**Test File Created:**
- `test-data-integrity.html` → Comprehensive 4-test suite to verify no fake data injection

**Expected Behavior:**
- If teacher selects NO subjects/topics → Alert: "Please select at least one subject or topic before generating comments."
- If teacher selects subjects/topics → Comments ONLY mention those exact selections, nothing else.

**Validation:**
- Open `Subjects.html`, select ONLY Arts and Physical Education topics → Generate → Comments should ONLY mention Arts and PE, nothing else.
- Try generating with nothing selected → Should get alert and refuse to generate.

---

### 2025-11-17: Subject mentions not appearing (K1 November phonics)
**Agent:** GitHub Copilot
**MCP Tools Used:** ✅ mcp_context7_resolve-library-id, ✅ mcp_context7_get-library-docs (MDN localStorage/querySelectorAll), ✅ manage_todo_list, ✅ mcp_memory_add_observations

**Problem:** Final comments were not referencing selected subjects when only phonics topics (e.g., “Nancy Nurse”, “Oscar Octopus”) were ticked.

**Root Cause:** Subject inference and topic grouping lacked keywords for K1 November English phonics topics, and there was no mapping for “Conversation 3”. When the parent subject checkbox wasn’t checked, no subjects reached the engine, so the subject section was omitted.

**Fix:**
- Expanded `subjectTopicMap` in `assets/js/enhanced-comment-engine.js` to include phonics keywords and added mapping for `Conversation 3`.
- Mirrored the same keywords in `topicToSubjectMap` within `missing-functions.js` (used by `inferSubjectsFromTopics`).
- Synced the root copy `enhanced-comment-engine.js`.

**Expected Result:** Selecting phonics-only English topics now infers the English subject, groups those topics, and comments explicitly mention English and sampled topics.

**QA:** Open `Subjects.html` → select English phonics items (without checking the English header) → Generate Comments → verify comments include “English” and topic mentions.

### 2025-11-13: Synonym Manager Fix & MCP Tool Integration
**Agent:** GitHub Copilot
**MCP Tools Used:** ✅ mcp_context7_resolve-library-id, ✅ mcp_context7_get-library-docs, ✅ fetch_webpage (MDN Map docs), ✅ mcp_sequentialthi_sequentialthinking, ✅ manage_todo_list

**Problem:** Initial synonym system implementation was broken - words weren't being tracked or replaced.

**Root Cause:** Agent "winged it" without researching proper algorithms. The `replaceOverused()` method incremented usage counts AFTER checking thresholds, so words never reached the threshold to trigger replacement.

**Solution (Using MCP Tools):**
- Used Context7 to research wink-nlp library patterns for word tracking
- Fetched MDN documentation on JavaScript Map() for O(1) lookup performance
- Applied sequential thinking to redesign the algorithm:
  1. Check CURRENT usage counts against threshold
  2. Identify words to replace
  3. Make replacements with case preservation
  4. THEN increment usage counts for final text
- Added comprehensive console logging at every step for debugging

**Changes:**
- Completely rewrote `replaceOverused()` method in `assets/js/synonym-manager.js`
- Fixed duplicate script tag in `Subjects.html` (enhanced-comment-engine.js was loaded twice)
- Usage tracking now works correctly: words used ≥2 times get replaced with least-used synonyms

**Testing:**
- Run: Open `Subjects.html` in browser, generate multiple comments
- Expected: Console shows `🔍 📊 📝 🔄` logs, words rotate after 2nd use
- Reset counts: `window.synonymManager.resetUsageCounts()` in console

---

### 2025-11-13: Synonym Manager & Enhanced Teacher Personalities (INITIAL - BROKEN)
**Agent:** GitHub Copilot
**MCP Tools Used:** ❌ NONE - This is why it broke!

**Changes:**
- **Synonym Manager System:**
  - Created `assets/js/synonym-manager.js` with intelligent word variation tracking.
  - Created `assets/data/synonyms.json` with 100+ professional synonyms across 5 categories (adjectives, verbs, adverbs, educational_terms, phrases).
  - Integrated async synonym replacement into `EnhancedCommentEngine` and `PremiumCommentEngine`.
  - Tracks word usage in sessionStorage; replaces words used ≥2 times with least-used synonyms.
  - Preserves capitalization (Title Case, UPPERCASE, lowercase).
  - Added script tag to `Subjects.html` to load synonym-manager.js before engines.
  - Updated `OptimizedCommentGenerator` and `missing-functions.js` to support async generation.

- **Enhanced Teacher Personality Differentiation:**
  - **Male voice:** Added 4 new templates per section (opening, strengths, weaknesses, conclusion). Uses formal, structured, metrics-focused, achievement-oriented language ("demonstrated competencies", "measurable proficiency", "systematic approach").
  - **Female voice:** Added 4 new templates per section. Uses warm, nurturing, relationship-focused, emotionally supportive language ("blossomed beautifully", "touching hearts", "radiates joy", "nurturing atmosphere").
  - Doubled template variety from 4 to 8 options per section for each voice.

- **Code Cleanup:**
  - Removed unused bulk action functions: `selectAll`, `clearAll`, `debugToggleSubjects`, `expandAllSubjects`, `collapseAllSubjects` from `missing-functions.js` and `Subjects.html`.

**Files Created:**
- `assets/js/synonym-manager.js`
- `assets/data/synonyms.json`

**Files Modified:**
- `assets/js/enhanced-comment-engine.js` — async generation, synonym integration, 32 new templates
- `assets/js/comment-engine.js` — async generation, synonym integration
- `optimized-comment-generator.js` — async support
- `missing-functions.js` — async support, removed unused functions
- `Subjects.html` — synonym-manager script tag, removed unused functions
- `enhanced-comment-engine.js` (root) — synced from assets/js

**Testing:**
- Generate multiple comments in one session to verify synonym rotation.
- Compare male vs female comments to confirm distinct personalities.
- Console logs show synonym replacements: `🔄 SynonymManager: Replacing "word"...`
- Test command: `window.synonymManager.exportState()` to view usage statistics.
- Reset command: `window.synonymManager.resetUsageCounts()`

**Notes:**
- Synonym manager uses sessionStorage (resets on browser close).
- Both engines now return Promises; all callers updated to use `await`.
- Male/female voices now sound significantly more distinct and authentic.

### 2025-11-13: Refreshed AI Agent Instructions
**Agent:** GitHub Copilot

**Changes:**
- Replaced `.github/copilot-instructions.md` with a concise 20-50 line guide focused on current architecture, workflows, and testing assets.
- Highlighted mandatory jobcard/Index logging, curriculum loader usage, comment engine sync steps, and available browser-based test harnesses.
- Called out glassmorphism UI conventions and deployment constraints to keep assistants aligned with project norms.

### 2025-11-13: Documentation updates — README & Dev Quick Start
**Agent:** GitHub Copilot

**Changes:**
- Updated `README.md` to use `index.html` as the primary entry point and added a Developer Quick Start section (local server commands, console helpers, and testing pages).
- Added quick developer tests to `COMMENT-INTEGRATION-SUMMARY.md` and kept test commands in README.

**Notes:**
- Sync `assets/js/enhanced-comment-engine.js` to `enhanced-comment-engine.js` after edits for legacy test pages using the PowerShell command included in README.

### 2025-11-13: Documentation audit & small fixes
**Agent:** GitHub Copilot

**Changes:**
- Standardized project title to `Teachers Pet` in README and key doc files.
- Replaced `Play.html` references in README and developer guidance with `index.html`.
- Removed duplicate `index.html` entry in README file structure and updated File Structure to match actual layout.
- Refactored Developer Quick Start section to simplify nested lists and added debug/test commands.
- Updated `.qoder` docs to mention `Teachers Pet` consistently.

**Notes:**
- Left historical references to `Play.html` in project design docs where used intentionally as a transition note.

### 2025-11-13: UI cleanup - remove bulk action toolbar
**Agent:** GitHub Copilot

**Changes:**
- Removed the bulk action toolbar (Select All / Clear All / Debug Toggle / Expand All / Collapse All) from `Subjects.html` to simplify UX per feedback.
- Left supporting JS functions intact (selectAll/clearAll/debugToggleSubjects/expandAllSubjects/collapseAllSubjects) in case they are re-introduced or used in automated tests.

**Notes:**
- `missing-functions.js` still contains `selectAll()` and `clearAll()` for compatibility; we may remove these helper functions if you want them gone.

**Notes:**
- No functional application code changed; documentation update only.

### 2025-11-13: Added Popup Acknowledgment Message
**Agent:** GitHub Copilot

**Changes:**
- Added modal overlay with acknowledgment message to `student-information.html`
**Modal Content:**
- Warning text with pulsating red effect: "*COMMENTS ARE NOT GENERATED USING AI. PLEASE REVIEW YOUR COMMENTS!"
- Information text: "*The more boxes you tick, the larger the comments. Sangsom School report only requires 75 - 80 words. Tick/select lightly."
- Tip text in green italic: "**Tip - leave strengths and weaknesses empty in the previous student information page."

**Technical Implementation:**
- Modal HTML structure added before closing container div
- CSS styles using glassmorphism theme (matching existing design):
  - Semi-transparent white background with backdrop-filter blur
  - Pulsating red animation for warning text (1.5s cycle)
  - Slide-down animation on display
  - Fade-in overlay background
- JavaScript functions:
  - Modified `goToSubjects()` to show modal instead of immediate navigation
  - Added `showAcknowledgmentModal()` to display modal
  - Added `acknowledgeAndProceed()` to hide modal and navigate to Subjects.html
- Modal triggered before navigation, ensuring user reads important instructions

**Visual Design:**
- Consistent with space theme background
- Warning emoji (⚠️) in title
- Green "I Understand - Continue →" button with hover effects
- Dark overlay (80% opacity) behind modal for focus

---

### 2025-11-12: Added Pulsating Gold "Click to drop down" Text to Subject Headers
**Agent:** GitHub Copilot

**Changes:**
- Added `.dropdown-hint` CSS class with pulsating gold animation
  - Font size: 11px, italic style
  - Color: #FFD700 (gold)
  - Pulsates between 60% and 100% opacity with soft glow effect
  - 2-second animation cycle
- Added `<span class="dropdown-hint">Click to drop down</span>` to all subject headers:
  - English, Mathematics, I.Q, Social Studies, Science
  - Cooking, Conversation 1, Conversation 2, Arts
  - Physical Education, Puppet Show, Super Safari, Story Time
- Updated dynamic template for K2 November curriculum subjects
- Text appears between subject label and dropdown arrow

**Visual Effect:**
- Subtle gold text that gently pulsates to draw attention
- Soft text-shadow glow effect synchronized with opacity changes
- Non-intrusive hint for user interaction

---

### 2025-11-12: Student Name Display Fix
**Agent:** GitHub Copilot

**Issue:** Generated comments not displaying student's entered name

**Debugging:**
- Added enhanced logging to `assets/js/enhanced-comment-engine.js` processSessionData()
  - Logs studentName, gender, subjects, topicRatings
  - Validates studentName exists before processing
  - Stores trimmed name in variable before returning
- Added debugging to `optimized-comment-generator.js` collectSessionData()
  - Logs raw localStorage data
  - Logs parsed studentData object
  - Logs final studentName value being used
- Synchronized root `enhanced-comment-engine.js` with assets version

**Expected Behavior:**
- Console should show student name being collected from localStorage
- Enhanced engine should validate name exists
- Comment should start with student's actual name

**Next Steps:** Test comment generation with browser console open to see data flow

---

### 2025-11-12: K2 November Curriculum Implementation
**Agent:** GitHub Copilot

**Completed:**
- Created K2 November curriculum data structure with 10 subjects
- Implemented curriculum-k2-november-data.md markdown reference file
- Created assets/js/curriculum/k2/november.js with all K2 November subjects and topics
- Enabled K2 grade in grade-selection.html (removed "Coming Soon" badge)
- Updated month-selection.html to enable November for K2
- Fixed month dropdown to dynamically enable/disable months per grade
- Updated curriculum-loader.js to support K2 November
- Added "Conversation 3" to enhanced-comment-engine.js subject capitalization

**K2 November Subjects (10 total):**
1. Mathematics
2. I.Q
3. Social Studies
4. English (includes Phonics)
5. Science
6. Conversation 1
7. Conversation 3 (NOT Conversation 2)
8. Arts
9. Physical Education
10. Puppet Show

**NOT in K2 November:** Cooking, Super Safari, Story Time, Conversation 2

**Files Modified:**
- grade-selection.html (enabled K2, updated validation)
- month-selection.html (added dynamic month filtering, enabled K2 November)
- assets/js/curriculum/curriculum-loader.js (updated availability lists)
- assets/js/enhanced-comment-engine.js (added Conversation 3)
- enhanced-comment-engine.js (root copy, added Conversation 3)
- student-information.html (fixed URL parameter passing for grade and month)
- Subjects.html (implemented dynamic curriculum rendering with DOMContentLoaded)

**Files Created:**
- curriculum-k2-november-data.md
- assets/js/curriculum/k2/november.js

**Testing Status:** Ready for testing - K2 → November → subjects should show 10 subjects dynamically

---

### 2025-11-12: K1 November Curriculum Implementation
**Agent:** GitHub Copilot

**Completed:**
- Created K1 November curriculum data structure with 11 subjects
- Implemented curriculum-november-data.md markdown reference file
- Created assets/js/curriculum/k1/november.js with all K1 November subjects and topics
- Enabled November in month-selection.html for K1
- Fixed dynamic subject rendering in Subjects.html to clear hardcoded HTML
- Fixed student-information.html to pass grade and month URL parameters to Subjects.html

**K1 November Subjects (11 total):**
1. English
2. Mathematics
3. I.Q
4. Social Studies
5. Science
6. Cooking
7. Conversation 1
8. Conversation 3 (NOT Conversation 2)
9. Arts
10. Physical Education
11. Puppet Show

**NOT in K1 November:** Super Safari, Story Time, Conversation 2

**Testing Status:** ✅ Completed and verified - K1 November loads correctly with 11 subjects

---

### 2025-11-12: Multi-Grade, Multi-Month Curriculum System (Phase 1)
**Agent:** GitHub Copilot

**Completed:**
- Implemented 5-page wizard navigation flow (index → grade → month → student-info → subjects)
- Created month-selection.html for month selection page
- Created assets/js/curriculum/k1/august.js with modular curriculum data structure
- Implemented CurriculumLoader class for dynamic curriculum loading
- Updated app.js with month property and initMonthSelection() method
- Updated navigation flow throughout application
- Created ESLint configuration for ES6 support
- Created issues-tracker.json for non-critical issue documentation
- Updated VS Code settings with spell-checker words and markdown lint rules

**Files Created:**
- month-selection.html
- assets/js/curriculum/curriculum-loader.js
- assets/js/curriculum/k1/august.js
- .eslintrc.json
- issues-tracker.json
- MULTI-GRADE-IMPLEMENTATION-PLAN.md
- MULTI-GRADE-MIGRATION-SUMMARY.md

**Architecture:**
- Modular curriculum structure: `/assets/js/curriculum/{grade}/{month}.js`
- Dynamic subject rendering in Subjects.html
- Grade-month parameter passing via URL query strings
- LocalStorage/SessionStorage for state persistence

---

## Notes & Suggestions

### Current Curriculum Availability (2025-11-12)
- **K1:** August (13 subjects), November (11 subjects)
- **K2:** November (10 subjects)
- **K3:** None yet (coming soon)

### Known Differences Between Grades/Months
- **K1 August:** Has Super Safari, Story Time, Conversation 2 (13 subjects total)
- **K1 November:** Has Cooking, Conversation 3, no Super Safari/Story Time (11 subjects)
- **K2 November:** Has Conversation 3, no Cooking/Super Safari/Story Time (10 subjects)

### Future Implementation Ideas
- Add remaining K1 months (September-July)
- Add K2 August and other months
- Implement K3 curriculum
- Add curriculum editing interface for teachers
- Export curriculum to PDF or Word format
- Add curriculum comparison tool

---

## Development Guidelines (from RULES.mdc)

**CRITICAL RULES:**
1. ✅ **NEVER implement features before clarifying requirements** - Ask first, code second
2. ✅ **NEVER assume user wants immediate implementation** - Get explicit confirmation
3. ✅ **NO feature enhancements without approval** - If improving, REPLACE don't add parallel features
4. ✅ **NEVER pretend to read files you can't access** - State limitations immediately
5. ✅ **Log all work in jobcard.md** - New entries at top (newest first), track work/notes/suggestions
6. ✅ **Log new files in Index.md** - Columns: date, agent, file, status (active/deleted)

**Comment Generation Rules:**
- AI comments MUST start with student's name
- AI comments MUST end with positive/encouraging note
- AI comments MUST incorporate ALL selected subjects
- AI comments SHOULD mention specific topic activities
