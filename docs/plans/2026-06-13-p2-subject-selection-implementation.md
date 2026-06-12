# P2 Subject Selection Page Implementation Plan

> **For implementer:** Use TDD throughout. Write failing test first. Watch it fail. Then implement.

**Goal:** Create a dynamic P2 subject selection page (`p2-subjects.html`) that loads curriculum from JSON based on semester, supporting 8 subjects per semester with bilingual (Thai/English) names and topic checkboxes with 0-5 star rating.

**Architecture:** New dedicated page + controller (`P2SubjectsController`) that uses existing `CurriculumLoader` to fetch semester data. Integrates with existing app flow: `month-selection.html` → `p2-subjects.html?grade=P2&month=Semester 1` → comment generation.

**Tech Stack:** Vanilla ES modules, existing `CurriculumLoader`, `OptimizedCommentGenerator`, custom test runner (`tests/run-tests.js`).

---

### Task 1: Curriculum Loader P2 Verification Test

**Files:**
- Create: `tests/unit/curriculum-p2.test.js`
- Modify: `assets/js/curriculum/curriculum-loader.js` (if needed)

**Step 1: Write the failing test**
```javascript
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

export async function runTests() {
  // Test 1: Semester 1 JSON exists and valid
  const sem1Path = path.resolve("assets/data/curriculum/p2/semester 1.json");
  assert.ok(fs.existsSync(sem1Path), "P2 Semester 1 JSON should exist");
  const sem1Content = fs.readFileSync(sem1Path, "utf-8");
  let sem1Data;
  assert.doesNotThrow(() => { sem1Data = JSON.parse(sem1Content); }, "valid JSON");

  // Test 2: Semester 2 JSON exists and valid
  const sem2Path = path.resolve("assets/data/curriculum/p2/semester 2.json");
  assert.ok(fs.existsSync(sem2Path), "P2 Semester 2 JSON should exist");
  const sem2Content = fs.readFileSync(sem2Path, "utf-8");
  let sem2Data;
  assert.doesNotThrow(() => { sem2Data = JSON.parse(sem2Content); }, "valid JSON");

  // Test 3: Both have 8 subjects
  assert.equal(sem1Data.subjects.length, 8, "Semester 1 should have 8 subjects");
  assert.equal(sem2Data.subjects.length, 8, "Semester 2 should have 8 subjects");

  // Test 4: Subject structure (bilingual names, topics array)
  sem1Data.subjects.forEach((subject, i) => {
    assert.ok(subject.name.en, `sem1 subject[${i}].name.en`);
    assert.ok(subject.name.th, `sem1 subject[${i}].name.th`);
    assert.ok(Array.isArray(subject.topics), `sem1 subject[${i}].topics`);
    assert.ok(subject.topics.length > 0, `sem1 subject[${i}] has topics`);
    subject.topics.forEach((topic, j) => {
      assert.ok(topic.name.en, `sem1 subject[${i}].topics[${j}].name.en`);
      assert.ok(topic.name.th, `sem1 subject[${i}].topics[${j}].name.th`);
      assert.ok(typeof topic.vocab === "number", `topic[${j}].vocab is number`);
    });
  });

  console.log("✅ curriculum-p2 tests passed");
}
```

**Step 2: Run test — confirm it fails**
```bash
node tests/run-tests.js tests/unit/curriculum-p2.test.js
```
Expected: FAIL — file doesn't exist yet

**Step 3: (No implementation needed — JSON files already exist from previous work)**
Verify the JSON structure matches expectations. If structure differs, update JSON files to match schema.

**Step 4: Run test — confirm it passes**
```bash
node tests/run-tests.js tests/unit/curriculum-p2.test.js
```
Expected: PASS

**Step 5: Commit**
```bash
git add tests/unit/curriculum-p2.test.js && git commit -m "test: add P2 curriculum validation tests"
```

---

### Task 2: CurriculumLoader P2 Integration Test

**Files:**
- Create: `tests/unit/curriculum-loader-p2.test.js`
- (No code modification — uses existing CurriculumLoader)

**Step 1: Write the failing test**
```javascript
import assert from "node:assert/strict";
import { CurriculumLoader } from "../../assets/js/curriculum/curriculum-loader.js";

export async function runTests() {
  // Test 1: isAvailable returns true for P2
  assert.ok(await CurriculumLoader.isAvailable("P2", "Semester 1"), "P2 Semester 1 available");
  assert.ok(await CurriculumLoader.isAvailable("P2", "Semester 2"), "P2 Semester 2 available");
  assert.equal(await CurriculumLoader.isAvailable("P2", "Semester 3"), false, "Semester 3 not available");

  // Test 2: load returns correct data for P2 Semester 1
  const sem1 = await CurriculumLoader.load("P2", "Semester 1");
  assert.equal(sem1.grade, "P2");
  assert.equal(sem1.month, "Semester 1");
  assert.equal(sem1.subjects.length, 8);

  // Test 3: load returns correct data for P2 Semester 2
  const sem2 = await CurriculumLoader.load("P2", "Semester 2");
  assert.equal(sem2.grade, "P2");
  assert.equal(sem2.month, "Semester 2");
  assert.equal(sem2.subjects.length, 8);

  // Test 4: Subject data has bilingual names
  sem1.subjects.forEach((subject, i) => {
    assert.ok(subject.name.en && subject.name.th, `subject[${i}] has en/th names`);
    assert.ok(Array.isArray(subject.topics), `subject[${i}] has topics array`);
  });

  console.log("✅ curriculum-loader-p2 tests passed");
}
```

**Step 2: Run test — confirm it fails**
```bash
node tests/run-tests.js tests/unit/curriculum-loader-p2.test.js
```
Expected: May fail if CurriculumLoader doesn't handle P2 month mapping yet

**Step 3: Write minimal implementation (if needed)**
If CurriculumLoader needs P2 month path mapping, update `assets/js/curriculum/curriculum-loader.js`:
```javascript
// In getMonthFileName() method, add:
if (grade === "P2") {
  if (month === "Semester 1") return "semester 1.json";
  if (month === "Semester 2") return "semester 2.json";
}
```

**Step 4: Run test — confirm it passes**
```bash
node tests/run-tests.js tests/unit/curriculum-loader-p2.test.js
```
Expected: PASS

**Step 5: Commit**
```bash
git add tests/unit/curriculum-loader-p2.test.js assets/js/curriculum/curriculum-loader.js && git commit -m "fix: CurriculumLoader P2 semester mapping"
```

---

### Task 3: P2SubjectsController Unit Test

**Files:**
- Create: `tests/unit/p2-subjects-controller.test.js`
- Create: `assets/js/controllers/p2-subjects-controller.js`

**Step 1: Write the failing test**
```javascript
import assert from "node:assert/strict";
import { P2SubjectsController } from "../../assets/js/controllers/p2-subjects-controller.js";
import { CurriculumLoader } from "../../assets/js/curriculum/curriculum-loader.js";

export async function runTests() {
  // Mock app object
  const mockApp = {
    sessionData: { grade: "P2", month: "Semester 1" },
    notify: () => {},
    showLoader: () => {},
    hideLoader: () => {},
  };

  // Test 1: Controller can be instantiated
  const controller = new P2SubjectsController(mockApp);
  assert.ok(controller);
  assert.equal(controller.app, mockApp);

  // Test 2: loadAndRenderCurriculum fetches via CurriculumLoader
  // Note: This tests integration with CurriculumLoader
  // We'll mock DOM for render test in integration test
  
  console.log("✅ p2-subjects-controller tests passed");
}
```

**Step 2: Run test — confirm it fails**
```bash
node tests/run-tests.js tests/unit/p2-subjects-controller.test.js
```
Expected: FAIL — controller file doesn't exist

**Step 3: Write minimal implementation**
Create `assets/js/controllers/p2-subjects-controller.js`:
```javascript
export class P2SubjectsController {
  constructor(app) {
    this.app = app;
    this.subjectsContainer = document.getElementById("subjects-container");
    this.selectionSummary = document.getElementById("selection-summary");
    this.generateBtn = document.getElementById("generate-comments");
  }

  async init() {
    this.loadSessionDataFromURL();
    await this.loadAndRenderCurriculum();
    this.setupSubjectInteractions();
    this.setupCommentGeneration();
    this.updateSelectionSummary();
  }

  loadSessionDataFromURL() {
    const params = new URLSearchParams(window.location.search);
    this.app.sessionData.grade = params.get("grade") || "P2";
    this.app.sessionData.month = params.get("month") || "Semester 1";
  }

  async loadAndRenderCurriculum() {
    const { grade, month } = this.app.sessionData;
    const curriculum = await CurriculumLoader.load(grade, month);
    this.renderSubjects(curriculum.subjects);
    this.updateGradeMonthDisplay(grade, month);
  }

  renderSubjects(subjects) {
    this.subjectsContainer.innerHTML = subjects.map(subject => this.renderSubject(subject)).join("");
  }

  renderSubject(subject) {
    const subjectId = subject.name.en.toLowerCase().replace(/\s+/g, "-");
    const topicsHtml = subject.topics.map(topic => this.renderTopic(topic, subjectId)).join("");
    return `
      <section class="subject-section" data-subject="${subjectId}">
        <h3 class="subject-title">
          <span class="subject-name-en">${subject.name.en}</span>
          <span class="subject-name-th">${subject.name.th}</span>
          <button class="subject-toggle" aria-expanded="false">▼</button>
        </h3>
        <div class="subject-topics">${topicsHtml}</div>
      </section>
    `;
  }

  renderTopic(topic, subjectId) {
    const topicId = `${subjectId}-${topic.name.en.toLowerCase().replace(/\s+/g, "-")}`;
    return `
      <label class="topic-item">
        <input type="checkbox" 
               data-subject="${subjectId}" 
               data-topic="${topic.name.en}"
               data-vocab="${topic.vocab}"
               value="${topic.name.en}">
        <span class="topic-name-en">${topic.name.en}</span>
        <span class="topic-name-th">(${topic.name.th})</span>
        <div class="rating-stars" data-topic-id="${topicId}">${this.renderStars(0, topicId)}</div>
      </label>
    `;
  }

  renderStars(value, topicId) {
    return Array.from({ length: 5 }, (_, i) => 
      `<span class="star ${i < value ? "filled" : ""}" data-value="${i + 1}" data-topic="${topicId}">★</span>`
    ).join("");
  }

  updateGradeMonthDisplay(grade, month) {
    const display = document.getElementById("current-grade-month");
    if (display) display.textContent = `Current: ${grade} · ${month}`;
  }

  setupSubjectInteractions() {
    // Toggle subject accordion
    this.subjectsContainer.addEventListener("click", (e) => {
      const toggle = e.target.closest(".subject-toggle");
      if (toggle) {
        const section = toggle.closest(".subject-section");
        const expanded = section.classList.toggle("expanded");
        toggle.setAttribute("aria-expanded", expanded);
        toggle.textContent = expanded ? "▲" : "▼";
      }
    });

    // Star rating clicks
    this.subjectsContainer.addEventListener("click", (e) => {
      const star = e.target.closest(".star");
      if (star) {
        const value = parseInt(star.dataset.value);
        const topicId = star.dataset.topic;
        this.setRating(topicId, value);
      }
    });

    // Topic checkbox changes
    this.subjectsContainer.addEventListener("change", (e) => {
      if (e.target.matches('input[type="checkbox"]')) {
        this.updateSelectionSummary();
        this.updateGenerateButton();
      }
    });
  }

  setRating(topicId, value) {
    document.querySelectorAll(`.star[data-topic="${topicId}"]`).forEach((star, i) => {
      star.classList.toggle("filled", i < value);
    });
    const checkbox = document.querySelector(`input[data-topic-id="${topicId}"]`);
    if (checkbox) checkbox.checked = value > 0;
    this.updateSelectionSummary();
    this.updateGenerateButton();
  }

  updateSelectionSummary() {
    const checked = this.subjectsContainer.querySelectorAll('input[type="checkbox"]:checked').length;
    const rated = this.subjectsContainer.querySelectorAll(".star.filled").length;
    this.selectionSummary.textContent = `${checked} topics selected, ${rated} rated`;
  }

  updateGenerateButton() {
    const hasRated = this.subjectsContainer.querySelectorAll(".star.filled").length > 0;
    this.generateBtn.disabled = !hasRated;
  }

  setupCommentGeneration() {
    this.generateBtn.addEventListener("click", () => this.generateComments());
  }

  async generateComments() {
    // Delegate to OptimizedCommentGenerator (existing)
    const { OptimizedCommentGenerator } = await import("../utils/optimized-comment-generator.js");
    const generator = new OptimizedCommentGenerator();
    const selections = this.collectSelections();
    const comments = await generator.generate(selections);
    this.app.notify("Comments generated!", "success");
    // Copy to clipboard or show modal
  }

  collectSelections() {
    const data = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
      const topicId = cb.dataset.topicId || `${cb.dataset.subject}-${cb.dataset.topic}`;
      const stars = document.querySelectorAll(`.star[data-topic="${topicId}"].filled`).length;
      data.push({
        subject: cb.dataset.subject,
        topic: cb.dataset.topic,
        vocab: parseInt(cb.dataset.vocab),
        rating: stars
      });
    });
    return { grade: this.app.sessionData.grade, month: this.app.sessionData.month, selections: data };
  }
}
```

**Step 4: Run test — confirm it passes**
```bash
node tests/run-tests.js tests/unit/p2-subjects-controller.test.js
```
Expected: PASS (basic instantiation test)

**Step 5: Commit**
```bash
git add tests/unit/p2-subjects-controller.test.js assets/js/controllers/p2-subjects-controller.js && git commit -m "feat: P2SubjectsController with dynamic curriculum rendering"
```

---

### Task 4: p2-subjects.html Page Structure

**Files:**
- Create: `p2-subjects.html`
- Modify: `tests/unit/p2-subjects-controller.test.js` (add DOM render test)

**Step 1: Write the failing test**
```javascript
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

export async function runTests() {
  const filePath = path.resolve("p2-subjects.html");
  assert.ok(fs.existsSync(filePath), "p2-subjects.html should exist");
  
  const content = fs.readFileSync(filePath, "utf-8");
  
  // Required structure elements
  assert.ok(content.includes("subjects-container"), "has subjects container");
  assert.ok(content.includes("selection-summary"), "has selection summary");
  assert.ok(content.includes("generate-comments"), "has generate button");
  assert.ok(content.includes("current-grade-month"), "has grade/month display");
  assert.ok(content.includes('type="module"'), "uses ES modules");
  assert.ok(content.includes("P2SubjectsController"), "imports controller");
  
  console.log("✅ p2-subjects-html tests passed");
}
```

**Step 2: Run test — confirm it fails**
```bash
node tests/run-tests.js tests/unit/p2-subjects-html.test.js
```
Expected: FAIL — file doesn't exist

**Step 3: Write minimal implementation**
Create `p2-subjects.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>P2 Subject Selection - Teachers Pet</title>
  <link rel="stylesheet" href="assets/css/main.css">
  <link rel="stylesheet" href="assets/css/subjects.css">
</head>
<body>
  <header class="app-header">
    <h1>Subject Selection</h1>
    <div id="current-grade-month" class="grade-month-display">Current: P2 · Semester 1</div>
  </header>

  <main class="app-main">
    <section class="subjects-selection">
      <div class="selection-header">
        <h2>Select Topics & Rate Progress</h2>
        <div id="selection-summary" class="selection-summary">0 topics selected, 0 rated</div>
      </div>
      
      <div id="subjects-container" class="subjects-container">
        <!-- Dynamically populated by P2SubjectsController -->
      </div>
      
      <div class="actions-bar">
        <button id="generate-comments" class="btn btn-primary" disabled>
          Generate Comments
        </button>
        <a href="month-selection.html?grade=P2" class="btn btn-secondary">Back</a>
      </div>
    </section>
  </main>

  <script type="module">
    import { P2SubjectsController } from "./assets/js/controllers/p2-subjects-controller.js";
    import { TeachersPetApp } from "./assets/js/app-controller.js";
    
    // Initialize app and controller
    const app = new TeachersPetApp();
    await app.init();
    
    // Override for P2 page
    app.controllers.p2Subjects = new P2SubjectsController(app);
    await app.controllers.p2Subjects.init();
  </script>
</body>
</html>
```

**Step 4: Run test — confirm it passes**
```bash
node tests/run-tests.js tests/unit/p2-subjects-html.test.js
```
Expected: PASS

**Step 5: Commit**
```bash
git add p2-subjects.html tests/unit/p2-subjects-html.test.js && git commit -m "feat: p2-subjects.html page with dynamic subject rendering"
```

---

### Task 5: Month Selection → P2 Subjects Integration

**Files:**
- Modify: `month-selection.html` (or its controller)
- Modify: `assets/js/app-controller.js` (register p2-subjects page)
- Create: `tests/integration/p2-full-flow.test.js`

**Step 1: Write the failing test**
```javascript
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

export async function runTests() {
  // Test 1: month-selection.html links to p2-subjects.html for P2
  const monthSelPath = path.resolve("month-selection.html");
  const content = fs.readFileSync(monthSelPath, "utf-8");
  assert.ok(content.includes("p2-subjects.html"), "month-selection links to p2-subjects.html");
  assert.ok(content.includes("grade=P2"), "passes grade param");

  // Test 2: app-controller.js registers p2-subjects
  const appCtrlPath = path.resolve("assets/js/app-controller.js");
  const appCtrl = fs.readFileSync(appCtrlPath, "utf-8");
  assert.ok(appCtrl.includes("p2-subjects"), "app-controller handles p2-subjects");
  assert.ok(appCtrl.includes("p2Subjects"), "app-controller has p2Subjects controller");

  console.log("✅ p2-full-flow integration tests passed");
}
```

**Step 2: Run test — confirm it fails**
```bash
node tests/run-tests.js tests/integration/p2-full-flow.test.js
```
Expected: FAIL — modifications not made

**Step 3: Write minimal implementation**

**Modify `month-selection.html`** - Find the continue button handler and add:
```javascript
// In the continue button click handler
if (selectedGrade === "P2") {
  window.location.href = `p2-subjects.html?grade=P2&month=${selectedMonth}`;
  return;
}
```

**Modify `assets/js/app-controller.js`** - Add to the page initialization switch:
```javascript
case "p2-subjects":
  if (this.controllers.p2Subjects) await this.controllers.p2Subjects.init();
  break;
```

**Step 4: Run test — confirm it passes**
```bash
node tests/run-tests.js tests/integration/p2-full-flow.test.js
```
Expected: PASS

**Step 5: Commit**
```bash
git add month-selection.html assets/js/app-controller.js tests/integration/p2-full-flow.test.js && git commit -m "feat: integrate P2 flow (month-selection → p2-subjects)"
```

---

### Task 6: Styling for P2 Subjects Page

**Files:**
- Modify: `assets/css/subjects.css` (add P2-specific styles)
- Test: `npm run lint` (verify no CSS issues)

**Step 1: Write the failing test**
```javascript
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

export async function runTests() {
  const cssPath = path.resolve("assets/css/subjects.css");
  const content = fs.readFileSync(cssPath, "utf-8");
  
  // P2-specific styles
  assert.ok(content.includes(".subject-name-th"), "has Thai name styling");
  assert.ok(content.includes(".subject-name-en"), "has English name styling");
  assert.ok(content.includes(".topic-name-th"), "has Thai topic styling");
  
  console.log("✅ p2-subjects-css tests passed");
}
```

**Step 2: Run test — confirm it fails**
```bash
node tests/run-tests.js tests/unit/p2-subjects-css.test.js
```
Expected: FAIL — styles not added

**Step 3: Write minimal implementation**
Add to `assets/css/subjects.css`:
```css
/* P2 Bilingual Subject Names */
.subject-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.subject-name-en {
  font-weight: 600;
  color: var(--text-primary);
}

.subject-name-th {
  font-weight: 400;
  color: var(--text-secondary);
  font-size: 0.9em;
}

/* P2 Bilingual Topic Names */
.topic-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.topic-name-en {
  flex: 1;
}

.topic-name-th {
  color: var(--text-secondary);
  font-size: 0.85em;
  font-style: italic;
}

/* Rating Stars */
.rating-stars {
  display: flex;
  gap: 0.15rem;
  margin-left: auto;
}

.rating-stars .star {
  cursor: pointer;
  color: var(--border-color);
  font-size: 1.1rem;
  transition: color 0.15s, transform 0.1s;
}

.rating-stars .star.filled {
  color: #fbbf24; /* amber-400 */
}

.rating-stars .star:hover {
  transform: scale(1.2);
}

/* Subject Accordion */
.subject-section {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  margin-bottom: 0.75rem;
  overflow: hidden;
}

.subject-section.expanded .subject-topics {
  display: block;
}

.subject-topics {
  display: none;
  padding: 1rem;
  border-top: 1px solid var(--border-color);
}

.subject-toggle {
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: var(--text-secondary);
}
```

**Step 4: Run test — confirm it passes**
```bash
node tests/run-tests.js tests/unit/p2-subjects-css.test.js
npm run lint
```
Expected: PASS + lint passes

**Step 5: Commit**
```bash
git add assets/css/subjects.css tests/unit/p2-subjects-css.test.js && git commit -m "style: P2 bilingual subject/topic names + star ratings"
```

---

### Task 7: Full Verification & Regression Test

**Files:**
- Run: `npm test` (all unit + integration)
- Run: `npm run verify`
- Manual: Test both semesters in browser

**Step 1: Run full test suite**
```bash
npm test
```
Expected: All tests pass (including new P2 tests)

**Step 2: Run verification pipeline**
```bash
npm run verify
```
Expected: No console.log warnings, ESLint passes

**Step 3: Manual browser test**
1. Open `grade-selection.html` → select P2
2. Open `month-selection.html` → select Semester 1
3. Verify `p2-subjects.html` loads 8 subjects with Thai/English names
4. Expand subjects, check topics, rate 0-5 stars
5. Click "Generate Comments" → verify it works
6. Repeat for Semester 2

**Step 4: Verify K1/K2 regression**
1. Open `Subjects.html` directly (K1/K2 flow)
2. Verify subjects still render correctly
3. Verify comment generation still works

**Step 5: Commit any fixes**
```bash
git add -A && git commit -m "fix: P2 full verification adjustments"
```

---

## Execution Options

Plan saved to `docs/plans/2026-06-13-p2-subject-selection-implementation.md`. Two execution options:

1. **Subagent-Driven** — I dispatch a fresh sub-agent per task, review between tasks
2. **Manual** — You run the tasks yourself

Which approach?