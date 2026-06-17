# P2-IEAP Implementation Plan

**Status:** ✅ **Archived — Implemented & Verified** (June 2025)



> **For implementer:** Use TDD throughout. Write failing test first. Watch it fail. Then implement.

**Goal:** Add P2 (Primary 2 / IEAP) as a new grade level after K2 with two-semester Thai curriculum, 8 subjects, and full comment generation integration.

**Architecture:** Data-driven extension of existing multi-grade system. New grade "P2" added to grade selection, month selection shows semesters, curriculum loader handles semester-based JSON files, engine-data.js extended with 8 subjects + Thai keyword mappings.

**Tech Stack:** Vanilla ES6 modules, localStorage for session data, static JSON curriculum files, existing comment generation pipeline (EnhancedCommentEngine)

---

### Task 1: Add P2 to engine-data.js (Subject Capitalization + Topic Mapping)

**Files:**
- Modify: `assets/js/data/engine-data.js`
- Test: `tests/unit/engine-data-p2.test.js` (new)

**Step 1: Write the failing test**
```javascript
// tests/unit/engine-data-p2.test.js
import assert from "node:assert/strict";
import { TeachersPetData } from "../../assets/js/data/engine-data.js";

export async function runTests() {
  // Test subject capitalization for P2 subjects
  const cap = TeachersPetData.grammarRules.subjectCapitalization;
  
  assert.equal(cap["thai language"], "Thai Language");
  assert.equal(cap["mathematics"], "Mathematics");
  assert.equal(cap["science"], "Science");
  assert.equal(cap["social studies"], "Social Studies");
  assert.equal(cap["english"], "English");
  assert.equal(cap["arts"], "Arts");
  assert.equal(cap["health physical education"], "Health & Physical Education");
  assert.equal(cap["computing"], "Computing");

  // Test subjectTopicMap has P2 subjects with Thai keywords
  const map = TeachersPetData.subjectTopicMap;
  
  assert.ok(map["Thai Language"], "Thai Language missing from subjectTopicMap");
  assert.ok(map["Mathematics"], "Mathematics missing from subjectTopicMap");
  assert.ok(map["Science"], "Science missing from subjectTopicMap");
  assert.ok(map["Social Studies"], "Social Studies missing from subjectTopicMap");
  assert.ok(map["English"], "English missing from subjectTopicMap");
  assert.ok(map["Arts"], "Arts missing from subjectTopicMap");
  assert.ok(map["Health & Physical Education"], "Health & PE missing from subjectTopicMap");
  assert.ok(map["Computing"], "Computing missing from subjectTopicMap");

  // Verify Thai keywords exist
  assert.ok(map["Thai Language"].includes("อ่าน"), "Thai keyword 'อ่าน' missing");
  assert.ok(map["Thai Language"].includes("read"), "English keyword 'read' missing");
  assert.ok(map["Science"].includes("ทดลอง"), "Thai keyword 'ทดลอง' missing");
  assert.ok(map["Health & Physical Education"].includes("สุขภาพ"), "Thai keyword 'สุขภาพ' missing");
}
```

**Step 2: Run test — confirm it fails**
```bash
node tests/unit/engine-data-p2.test.js
# Expected: Assertion errors - properties missing
```

**Step 3: Write minimal implementation**
Add to `assets/js/data/engine-data.js`:
- 8 entries to `grammarRules.subjectCapitalization`
- 8 entries to `subjectTopicMap` with Thai/English keyword arrays

**Step 4: Run test — confirm it passes**
```bash
node tests/unit/engine-data-p2.test.js
# Expected: PASS
```

**Step 5: Commit**
```bash
git add assets/js/data/engine-data.js tests/unit/engine-data-p2.test.js
git commit -m "feat: Add P2-IEAP subjects to engine-data.js capitalization and topic mapping"
```

---

### Task 2: Create P2 Curriculum JSON Files

**Files:**
- Create: `assets/data/curriculum/p2/semester1.json`
- Create: `assets/data/curriculum/p2/semester2.json`
- Test: `tests/unit/p2-curriculum-data.test.js` (new)

**Step 1: Write the failing test**
```javascript
// tests/unit/p2-curriculum-data.test.js
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

export async function runTests() {
  const repoRoot = path.resolve(process.cwd());
  
  // Test Semester 1 exists and has correct structure
  const sem1Path = path.join(repoRoot, "assets/data/curriculum/p2/semester1.json");
  assert.ok(fs.existsSync(sem1Path), "semester1.json must exist");
  
  const sem1 = JSON.parse(fs.readFileSync(sem1Path, "utf8"));
  assert.equal(sem1.grade, "P2");
  assert.equal(sem1.month, "Semester 1");
  assert.ok(Array.isArray(sem1.subjects), "subjects must be array");
  assert.ok(sem1.subjects.length >= 8, "Must have at least 8 subjects");
  
  // Verify all 8 subjects present
  const subjectNames = sem1.subjects.map(s => s.name);
  const required = ["Thai Language", "Mathematics", "Science", "Social Studies", "English", "Arts", "Health & Physical Education", "Computing"];
  for (const req of required) {
    assert.ok(subjectNames.includes(req), `Missing subject: ${req}`);
  }
  
  // Each subject has topics
  for (const subj of sem1.subjects) {
    assert.ok(Array.isArray(subj.topics), `Subject ${subj.name} must have topics array`);
    assert.ok(subj.topics.length >= 3, `Subject ${subj.name} must have at least 3 topics`);
    for (const topic of subj.topics) {
      assert.ok(topic.id, "Topic must have id");
      assert.ok(topic.name, "Topic must have name");
    }
  }
  
  // Test Semester 2
  const sem2Path = path.join(repoRoot, "assets/data/curriculum/p2/semester2.json");
  assert.ok(fs.existsSync(sem2Path), "semester2.json must exist");
  
  const sem2 = JSON.parse(fs.readFileSync(sem2Path, "utf8"));
  assert.equal(sem2.grade, "P2");
  assert.equal(sem2.month, "Semester 2");
  assert.ok(Array.isArray(sem2.subjects), "subjects must be array");
  assert.ok(sem2.subjects.length >= 8, "Must have at least 8 subjects");
}
```

**Step 2: Run test — confirm it fails**
```bash
node tests/unit/p2-curriculum-data.test.js
# Expected: Files don't exist
```

**Step 3: Write minimal implementation**
Create both JSON files with:
- grade: "P2"
- month: "Semester 1" / "Semester 2"
- subjects array with 8 subjects, each with 3-5 topics
- Topic names aligned with Thai P2 curriculum standards

**Step 4: Run test — confirm it passes**
```bash
node tests/unit/p2-curriculum-data.test.js
# Expected: PASS
```

**Step 5: Commit**
```bash
git add assets/data/curriculum/p2/ tests/unit/p2-curriculum-data.test.js
git commit -m "feat: Add P2-IEAP Semester 1 and Semester 2 curriculum JSON files"
```

---

### Task 3: Update curriculum-loader.js for P2 Semesters

**Files:**
- Modify: `assets/js/curriculum/curriculum-loader.js`
- Test: `tests/unit/curriculum-loader-p2.test.js` (new)

**Step 1: Write the failing test**
```javascript
// tests/unit/curriculum-loader-p2.test.js
import assert from "node:assert/strict";
import { CurriculumLoader } from "../../assets/js/curriculum/curriculum-loader.js";

export async function runTests() {
  // Test availableMonths includes P2 semesters
  const loader = new CurriculumLoader();
  
  const p2Months = loader.getAvailableMonths("P2");
  assert.deepEqual(p2Months, ["Semester 1", "Semester 2"]);
  
  // Test isAvailable for P2
  assert.equal(loader.isAvailable("P2", "Semester 1"), true);
  assert.equal(loader.isAvailable("P2", "Semester 2"), true);
  assert.equal(loader.isAvailable("P2", "August"), false);
  assert.equal(loader.isAvailable("P2", "Invalid"), false);
}
```

**Step 2: Run test — confirm it fails**
```bash
node tests/unit/curriculum-loader-p2.test.js
# Expected: Assertion errors - P2 not in availableMonths
```

**Step 3: Write minimal implementation**
In `curriculum-loader.js`:
- Add P2 to `availableList` in `isAvailable()` and `getAvailableMonths()`
- `P2: ["Semester 1", "Semester 2"]`

**Step 4: Run test — confirm it passes**
```bash
node tests/unit/curriculum-loader-p2.test.js
# Expected: PASS
```

**Step 5: Commit**
```bash
git add assets/js/curriculum/curriculum-loader.js tests/unit/curriculum-loader-p2.test.js
git commit -m "feat: Update curriculum-loader.js for P2 semesters"
```

---

### Task 4: Update grade-selection.html for P2

**Files:**
- Modify: `grade-selection.html`
- Test: `tests/unit/grade-selection-p2.test.js` (new, using DOM stub)

**Step 1: Write the failing test**
```javascript
// tests/unit/grade-selection-p2.test.js
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");

export async function runTests() {
  const html = fs.readFileSync(path.join(repoRoot, "grade-selection.html"), "utf8");
  
  // P2 option exists in select
  assert.ok(html.includes('value="P2"'), 'P2 option must exist in grade select');
  assert.ok(html.includes('P2 - Primary 2 (IEAP)'), 'P2 label must be correct');
  
  // K3 option removed
  assert.ok(!html.includes('value="K3"'), 'K3 option should be removed');
  assert.ok(!html.includes('Kindergarten 3'), 'K3 reference should be removed');
  
  // P2 info box exists
  assert.ok(html.includes('id="p2Info"'), 'P2 info box must exist');
  assert.ok(html.includes('Primary 2'), 'P2 info must mention Primary 2');
  assert.ok(html.includes('IEAP'), 'P2 info must mention IEAP');
  
  // Continue button enables for P2
  assert.ok(html.includes("'P2'"), 'Continue logic must include P2');
}
```

**Step 2: Run test — confirm it fails**
```bash
node tests/unit/grade-selection-p2.test.js
# Expected: Assertion errors - P2 not in HTML
```

**Step 3: Write minimal implementation**
In `grade-selection.html`:
1. Replace `<option value="K3">K3 - Kindergarten 3 (Coming Soon)</option>` with `<option value="P2">P2 - Primary 2 (IEAP)</option>`
2. Replace K3 info box (`k3Info`) with P2 info box (`p2Info`) describing Primary 2 IEAP
3. Update `updateContinueButton()` to enable for P2
4. Update navigation to go to `month-selection.html?grade=P2`

**Step 4: Run test — confirm it passes**
```bash
node tests/unit/grade-selection-p2.test.js
# Expected: PASS
```

**Step 5: Commit**
```bash
git add grade-selection.html tests/unit/grade-selection-p2.test.js
git commit -m "feat: Update grade-selection.html for P2-IEAP"
```

---

### Task 5: Update month-selection.html for P2 Semesters

**Files:**
- Modify: `month-selection.html`
- Test: `tests/unit/month-selection-p2.test.js` (new)

**Step 1: Write the failing test**
```javascript
// tests/unit/month-selection-p2.test.js
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");

export async function runTests() {
  const html = fs.readFileSync(path.join(repoRoot, "month-selection.html"), "utf8");
  
  // availableMonths config includes P2
  assert.ok(html.includes("'P2':"), 'availableMonths must include P2');
  assert.ok(html.includes("Semester 1"), 'availableMonths P2 must have Semester 1');
  assert.ok(html.includes("Semester 2"), 'availableMonths P2 must have Semester 2');
  
  // Grade display shows P2 correctly
  assert.ok(html.includes('Primary 2'), 'gradeDisplay logic must handle P2');
  assert.ok(html.includes('IEAP'), 'gradeDisplay must show IEAP for P2');
}
```

**Step 2: Run test — confirm it fails**
```bash
node tests/unit/month-selection-p2.test.js
# Expected: Assertion errors - P2 not in config
```

**Step 3: Write minimal implementation**
In `month-selection.html`:
1. Add P2 to `availableMonths` object: `P2: ["Semester 1", "Semester 2"]`
2. Update `gradeDisplay` logic to show "P2 - Primary 2 (IEAP)"
3. Add semester options to HTML select (or ensure JS adds them dynamically)
4. Save selected semester to localStorage

**Step 4: Run test — confirm it passes**
```bash
node tests/unit/month-selection-p2.test.js
# Expected: PASS
```

**Step 5: Commit**
```bash
git add month-selection.html tests/unit/month-selection-p2.test.js
git commit -m "feat: Update month-selection.html for P2 semesters"
```

---

### Task 6: Integration Test - Full P2 Flow

**Files:**
- Create: `tests/integration/p2-full-flow.test.js` (new)

**Step 1: Write the failing test**
```javascript
// tests/integration/p2-full-flow.test.js
import assert from "node:assert/strict";
import { TeachersPetProcessor } from "../../assets/js/engine/processor.js";
import { TeachersPetData } from "../../assets/js/data/engine-data.js";
import { CurriculumLoader } from "../../assets/js/curriculum/curriculum-loader.js";

export async function runTests() {
  // 1. Processor handles P2 session data
  const sessionData = {
    studentName: "สมชาย ใจดี",
    gender: "male",
    overallRating: 8,
    grade: "P2",
    month: "Semester 1",
    subjects: ["Thai Language", "Mathematics", "Science"],
    topicRatings: { "Reading: Short Stories": 8, "Addition within 100": 7 },
    strengths: "Thai reading, math calculation",
    weaknesses: "English conversation"
  };
  
  const processed = TeachersPetProcessor.processSessionData(sessionData, TeachersPetData);
  assert.equal(processed.name, "สมชาย ใจดี");
  assert.equal(processed.grade, "P2");
  assert.equal(processed.month, "Semester 1");
  assert.ok(processed.subjects.includes("Thai Language"));
  assert.ok(processed.subjects.includes("Mathematics"));
  
  // 2. Subject topic mapping works for P2 subjects
  const thaiTopics = processed.topicsBySubject["Thai Language"];
  assert.ok(Array.isArray(thaiTopics));
  
  // 3. Curriculum loader loads P2 semester
  const loader = new CurriculumLoader();
  const curriculum = await loader.load("P2", "Semester 1");
  assert.equal(curriculum.grade, "P2");
  assert.equal(curriculum.month, "Semester 1");
  assert.ok(curriculum.subjects.length >= 8);
}
```

**Step 2: Run test — confirm it fails**
```bash
node tests/integration/p2-full-flow.test.js
# Expected: Various failures depending on implementation state
```

**Step 3: Write minimal implementation**
Ensure all previous tasks are complete. This test validates the full pipeline.

**Step 4: Run test — confirm it passes**
```bash
node tests/integration/p2-full-flow.test.js
# Expected: PASS
```

**Step 5: Commit**
```bash
git add tests/integration/p2-full-flow.test.js
git commit -m "test: Add P2-IEAP full integration test"
```

---

### Task 7: Run Full Verification

**Commands:**
```bash
npm run lint
npm test
npm run verify
```

**Expected:** All pass with P2 included.

**Commit:**
```bash
git commit -am "chore: Verify P2-IEAP implementation complete"
```

---

## Execution Handoff

Plan saved to `docs/plans/2026-06-12-p2-ieap-implementation.md`. Two execution options:

1. **Subagent-Driven** — I dispatch a fresh sub-agent per task, review between tasks
2. **Manual** — You run the tasks yourself

Which approach?