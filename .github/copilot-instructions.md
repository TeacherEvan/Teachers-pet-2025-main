# Teachers Pet – Agent Guide

## ⚠️ CRITICAL: MCP TOOL USAGE REQUIREMENTS ⚠️
**DO NOT "WING IT" - USE YOUR DAMN MCP TOOLS FIRST!**

Before implementing ANY complex feature, algorithm, or system:

1. **MANDATORY: Use MCP Context7** to fetch up-to-date documentation and best practices:
   - `mcp_context7_resolve-library-id` to find relevant libraries
   - `mcp_context7_get-library-docs` to get authoritative implementation patterns
   - Example: For synonym systems, word tracking, NLP - GET THE DOCS FIRST!

2. **MANDATORY: Use fetch_webpage** to research from authoritative sources:
   - MDN for JavaScript/DOM patterns
   - GitHub repos for real-world implementations
   - Stack Overflow for common pitfalls

3. **MANDATORY: Use mcp_sequentialthi_sequentialthinking** for complex problem-solving:
   - Break down the problem systematically
   - Question your assumptions
   - Revise approach based on research findings

4. **MANDATORY: Use manage_todo_list** to track multi-step work:
   - Create task list BEFORE coding
   - Mark tasks in-progress and completed individually
   - Don't batch completions - update as you go

**If you skip these tools and implement broken code, you've failed the task.**
**Research FIRST, implement SECOND, validate THIRD.**

## Non-Negotiables
- Confirm scope with the user before coding; log every task at the top of `jobcard.md` and record new files in `Index.md`.
- Never claim access to unseen files; follow ASCII-only edits unless the existing file uses extended characters.
- This is a static HTML/CSS/JS site—do not add build tooling, servers, or external APIs without explicit approval.

## Architecture & Flow
- Wizard path: `index.html` → `grade-selection.html` → `month-selection.html` → `student-information.html` → `Subjects.html`.
- `TeachersPetApp` (`assets/js/app.js`) is the main controller. It bootstraps per page, manages navigation and animations, validates forms, and stores in-memory `sessionData`.

Important nuance: `OptimizedCommentGenerator` and the comment engines (Enhanced / Premium) read from `localStorage.studentData` and DOM elements; keep in-memory `sessionData` and `localStorage` synced when making changes.
- `startOverWithAnimation()` clears storage, resets `sessionData`, and redirects to `index.html`; keep behaviour intact.

## State & Persistence
- Treat `TeachersPetApp.sessionData` as the in-memory source of truth. To generate comments reliably, ensure persistent values are also set in `localStorage.studentData` (the comment generator reads localStorage).
- Stored keys (`studentName`, `gender`, `overallAttributes`, `strengths`, `weaknesses`, subjects/topic selections) feed `OptimizedCommentGenerator.collectSessionData()` and `EnhancedCommentEngine.processSessionData()`.
- Avoid introducing new storage keys or backend calls—everything must remain client-side.

## Curriculum & Subjects
- `CurriculumLoader` (`assets/js/curriculum/curriculum-loader.js`) dynamically injects `/assets/js/curriculum/{grade}/{month}.js`. When adding months/grades, add a new JS file under `/assets/js/curriculum/{grade}/` and update `getAvailableMonths()` and the `availableList` lookup inside the loader.

Example: add `/assets/js/curriculum/k2/november.js` and add `'K2': ['November']` in `getAvailableMonths()` to enable it.
- K1 (August, November) and K2 (November) datasets live under `assets/js/curriculum`; mirror topic changes in the matching `curriculum-*.md` documents.
- `Subjects.html` builds collapsible sections from the loaded curriculum; preserve dropdown hints and bulk-select helpers.

## Comment Generation
 - Primary files:
	 - `assets/js/enhanced-comment-engine.js` — the enhanced engine and the **single source of truth** for generation logic.
	 - `optimized-comment-generator.js` — compatibility bridge and safe initialization wrapper; used by `app.js`.
	 - `assets/js/comment-engine.js` — legacy/premium fallback; keep behavior consistent when editing.
	 - `assets/js/synonym-manager.js` — intelligent word variation system that prevents overuse of vocabulary.
	 - `assets/data/synonyms.json` — comprehensive synonym database (100+ words across 5 categories).
	 - `missing-functions.js` — handlers for Subjects.html including `ensureCommentGeneration()` which collects form data and calls the engine.

 - Edit `assets/js/enhanced-comment-engine.js` for improvements. After changes, keep the root copy synchronized (used in some test pages):
	 - PowerShell example (run from repo root):
		 Copy-Item "assets/js/enhanced-comment-engine.js" "enhanced-comment-engine.js" -Force

 - What to change and where:
	 - Subject/topic behavior (keyword mapping): edit `subjectTopicMap` (line near top of the file).
	 - Subject capitalization rules: edit `grammarRules.subjectCapitalization`.
	 - Add or change templates for male/female styles in the `generate...` functions.
	 - Add new synonyms: edit `assets/data/synonyms.json` under appropriate category (adjectives, verbs, adverbs, educational_terms, phrases).
	 - Topic-to-subject inference: edit `topicToSubjectMap` in `missing-functions.js` (must match engine's `subjectTopicMap`).

 - **CRITICAL DATA INTEGRITY RULES (2025-11-17):**
	 - **NEVER inject fake subjects/topics** - Only reference what the teacher actually selected
	 - `missing-functions.js` validates selections and REJECTS generation if nothing is selected (shows alert)
	 - The engine logs warnings for orphaned topics that can't be matched to subjects
	 - All checkbox collections must verify `value` is not empty/null before adding to arrays
	 - Test with `test-data-integrity.html` to verify no fake data appears in comments

- The enhanced engine must mention every selected subject/topic, start with the student name, and finish on an encouraging note while targeting ~100 words.
- **Synonym Manager** automatically tracks word usage in sessionStorage and swaps overused words (threshold: 2 uses) with least-used synonyms, maintaining professional variety across multiple comment generations.
- Update `subjectTopicMap` and `grammarRules.subjectCapitalization` whenever subjects or activities change; reflect the same in `assets/js/comment-engine.js` fallback.
- `optimized-comment-generator.js` orchestrates the generation flow: Enhanced → Premium → fallback. Keep its public helpers (`generateFromStorage`, `testCommentGeneration`) stable.

## Synonym System (Word Variation)
- **Purpose:** Prevents repetitive vocabulary across multiple student reports by intelligently rotating synonyms.
- **How it works:**
  1. `SynonymManager` loads synonym data from `assets/data/synonyms.json` on first use.
  2. Tracks word usage counts in `sessionStorage` (resets when browser closes).
  3. During comment generation, replaces words used ≥2 times with least-used synonyms from the same category.
  4. Preserves original capitalization (Title Case, UPPERCASE, lowercase).
  5. Both `EnhancedCommentEngine` and `PremiumCommentEngine` call `synonymManager.replaceOverused()` after generating comments.
- **Adding synonyms:** Edit `assets/data/synonyms.json` and add words to appropriate category. Each entry is `"word": ["synonym1", "synonym2", ...]`.
- **Testing:** Generate multiple comments in one session; check console for `📚 SynonymManager:` logs showing replacements.
- **Reset usage:** Call `window.synonymManager.resetUsageCounts()` in console or close browser (clears sessionStorage).

## UI Conventions
- Maintain glassmorphism styling and tokens in `assets/css/main.css` and `assets/css/components.css`. Keep interactive elements accessible (collapsible headers keyboard-accessible, visible focus states).
- Reuse tokens from `assets/css/main.css` and `assets/css/components.css`; place quick overrides in `styles/inline-fixes.css` if absolutely necessary.
- Preserve accessibility: collapsible headers must remain keyboard operable and buttons need visible focus states.

## Testing & Debug
 - Quick checks:
	 - Open `Subjects.html` and use the wizard; generate comments to verify correctly mention all subjects and topics in the console logs.
	 - Use `test-student-name.html` to verify student name flows into comment output and confirm console logs printed from `OptimizedCommentGenerator.collectSessionData()` and `EnhancedCommentEngine.processSessionData()`.
	 - Use `test-topic-only-selection.html` to validate that topics without explicit subject selections are assigned/fallback correctly.

 - Debugging tips:
	 - Open Developer Tools (F12), watch console logs for strings like `✅ Collected session data:` or `🎯 Enhanced Engine: Processing session data`.
	 - Call the global helper from the console: `window.commentGenerator.generateFromStorage()` or `window.testCommentGeneration()` to invoke generation without clicking UI.
	 - If comments show unexpected text, check both `sessionData` (in-memory) and `localStorage.studentData` (persistence). Keep both in sync when testing.

## Deployment & Docs
 - This repository is intended to be served static-only (GitHub Pages, Netlify, Vercel). Avoid using `localhost:3000` by default — the site expects to be opened from file system or a standard static server; some features (clipboard API) may require HTTPS/secure contexts.
 - Note significant behavior changes in `COMMENT-INTEGRATION-SUMMARY.md` and `jobcard.md` or the `Index.md` so teachers, reviewers, and test harnesses stay in sync.

## Key Files & Patterns (Quick Reference)
- `assets/js/app.js` — application controller and wizard routing; `TeachersPetApp.sessionData` is in-memory state.
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

If anything is unclear or you want examples of how to extend the comment templates or curriculum, tell me which part you want clarified and I’ll expand the document with code examples.
