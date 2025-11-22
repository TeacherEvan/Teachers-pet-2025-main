# Teachers Pet - Project Status & Agent Dashboard

**Last Updated:** November 22, 2025
**Status:** Stable / Maintenance Mode

## 1. Project Overview
**Teachers Pet** is a static HTML/CSS/JS web application designed to help teachers generate personalized student report comments. It uses a wizard-style interface to collect student data, subject ratings, and specific topics, then generates a natural-language paragraph.

### Key Constraints
- **No Backend:** Runs entirely in the browser (client-side).
- **No Build Step:** Pure HTML/JS.
- **Persistence:** Uses `localStorage` to persist state between pages.

## 2. Architecture

### Wizard Flow
1. `index.html` (Landing)
2. `grade-selection.html` (Select Grade: K1, K2, etc.)
3. `month-selection.html` (Select Month: August, November, etc.)
4. `student-information.html` (Name, Gender, Attributes)
5. `Subjects.html` (Dynamic Subject/Topic Selection)
6. `Subjects.html` (Generation & Output)

### State Management (Dual-Layer)
The application maintains state in two places which **MUST** be kept in sync:
1. **In-Memory:** `TeachersPetApp.sessionData` (managed by `assets/js/controllers/app-controller.js`)
2. **Persistence:** `localStorage.studentData` (used for page navigation and comment generation)

### Comment Generation Engine
- **Primary Engine:** `assets/js/enhanced-comment-engine.js`
- **Wrapper:** `optimized-comment-generator.js`
- **Logic:**
  - Maps selected topics to sentences.
  - Uses `synonym-manager.js` to avoid repetition.
  - Applies gender-specific templates.
  - **Rule:** Grade/Month is used for *curriculum selection* only, not mentioned in the final text.

### Curriculum System
- **Loader:** `assets/js/curriculum/curriculum-loader.js`
- **Data:** Stored in `assets/js/curriculum/{grade}/{month}.js`
- **Structure:** `window.CurriculumData.{Grade}.{Month}`

## 3. Key Files Map

| File | Purpose |
|------|---------|
| `assets/js/enhanced-comment-engine.js` | **CORE LOGIC.** The brain of the comment generator. |
| `optimized-comment-generator.js` | Bridge between UI and Engine. Handles initialization. |
| `assets/js/controllers/app-controller.js` | Manages wizard navigation and session state. |
| `Subjects.html` | Main UI for subject selection and comment display. |
| `assets/data/synonyms.json` | Vocabulary database for variation. |
| `docs/jobcard.md` | Chronological log of tasks and fixes. |
| `.github/copilot-instructions.md` | Detailed rules for the AI Agent. |

## 4. Testing & Validation

### Critical Test Pages

| Page | Purpose |
|------|---------|
| `test-all-subjects-audit.html` | **Comprehensive Audit.** Checks all subjects/topics across grades. |
| `test-data-integrity.html` | Verifies no fake data is injected. |
| `test-student-name.html` | Verifies basic name/gender flow. |
| `test-topic-only-selection.html` | Verifies topic inference logic. |

### Manual Testing
Open the browser console (F12) and run:
```javascript
window.testCommentGeneration()
```

## 5. Current Known Issues / Watchlist
- **Sync Issues:** If `sessionData` and `localStorage` drift, the wizard breaks. Always update both.
- **Curriculum Persistence:** Ensure `grade` and `month` are passed in URL or correctly retrieved from storage when navigating back/forward.
- **Static Deployment:** Clipboard API features require HTTPS (secure context).

## 6. Agent Workflow (How to work on this project)
1. **Read `docs/jobcard.md`** for the latest context.
2. **Check `docs/PROJECT_STATUS.md`** (this file) for architecture.
3. **Use MCP Tools** to research before coding.
4. **Update Documentation** after changes.
5. **Run Tests** using the test pages provided.
