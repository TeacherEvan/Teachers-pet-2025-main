# P2 Subject Selection Page Design

**Status:** ✅ **Archived — Implemented & Verified** (June 2025)



## Context
- **Project:** Teachers Pet - Report generation for Thai schools
- **Current state:** `Subjects.html` has hardcoded K1/K2 subjects (13 subjects with ~50 topics)
- **P2 Curriculum:** 2 semesters × 8 subjects each = 16 subjects, ~60 topics total
- **Data source:** `assets/data/curriculum/p2/semester 1.json` and `semester 2.json` (already created)

## Problem Statement
P2 (Primary 2 IEAP) uses a semester-based curriculum with different subjects than K1/K2. The current `Subjects.html` is hardcoded for K1/K2 subjects and doesn't support:
- Dynamic subject loading based on selected semester
- Thai language subject names with English fallbacks
- 8 subjects per semester (vs 13 for K1/K2)
- Different topic structures per semester

## Design Goals
1. **Dynamic loading** - Subjects/topics loaded from curriculum JSON based on grade (P2) + month (Semester 1/2)
2. **Consistent UX** - Same expandable accordion UI as K1/K2 for familiarity
3. **Thai/English support** - Subject names and topics in Thai with English translations
4. **Reusable architecture** - Easy to extend for P3, P4, etc.
5. **Backward compatibility** - K1/K2 continue using existing `Subjects.html`

---

## Approach Options

### Option A: New Dedicated Page `p2-subjects.html` (Recommended)
- **Pros:** Clean separation, optimized for P2's 8-subject structure, easier to maintain
- **Cons:** New file to maintain, need to handle navigation from month-selection
- **Trade-off:** Slight duplication of UI code but clearer separation of concerns

### Option B: Modify `Subjects.html` with Dynamic Detection
- **Pros:** Single source of truth for subject selection UI
- **Cons:** Complex conditional logic, harder to test, K1/K2/P2 divergence grows
- **Trade-off:** DRY but increased complexity

### Option C: Separate Pages Per Semester
- **Pros:** Simplest implementation
- **Cons:** 3+ subject pages to maintain, doesn't scale
- **Trade-off:** Not recommended

**Recommendation: Option A** - Create `p2-subjects.html` that dynamically loads curriculum based on URL params (`?grade=P2&month=Semester 1`)

---

## Architecture

### Components

```
┌─────────────────────────────────────────────────────┐
│                   p2-subjects.html                   │
│  (Entry point - loads P2SubjectsController)         │
└──────────────────────────┬──────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│              P2SubjectsController                    │
│  (Extends/uses SubjectsController logic)            │
│  - loadSessionDataFromURL()                         │
│  - loadCurriculum() → CurriculumLoader               │
│  - renderSubjects()                                 │
│  - setupSubjectInteractions()                       │
│  - updateSelectionSummary()                         │
│  - setupCommentGeneration()                         │
└──────────────────────────┬──────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│              CurriculumLoader                        │
│  (assets/js/curriculum/curriculum-loader.js)        │
│  - load(grade, month) → fetch JSON                  │
│  - isAvailable(grade, month)                        │
│  - getAvailableMonths(grade)                        │
└──────────────────────────┬──────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│              JSON Data Files                         │
│  - assets/data/curriculum/p2/semester 1.json        │
│  - assets/data/curriculum/p2/semester 2.json        │
└─────────────────────────────────────────────────────┘
```

### Data Flow
1. User selects P2 + Semester 1/2 on `month-selection.html`
2. Navigates to `p2-subjects.html?grade=P2&month=Semester 1`
3. `P2SubjectsController.init()` called
4. Loads session data from URL params
5. Calls `CurriculumLoader.load('P2', 'Semester 1')`
6. Renders subjects/topics dynamically into DOM
7. User checks subjects/topics, rates 0-5
8. Generates comments via `OptimizedCommentGenerator`

---

## Subject Taxonomy (P2)

### Semester 1 Subjects (8)
| Subject (EN) | Subject (TH) | Topics | Vocab |
|--------------|--------------|--------|-------|
| Thai Language | ไทย | 5 | 10 |
| Mathematics | คณิตศาสตร์ | 5 | 10 |
| Science | วิทยาศาสตร์ | 5 | 10 |
| Social Studies | สังคมศึกษา | 5 | 11 |
| English | อังกฤษ | 5 | 16 |
| Arts | ศิลปะ | 5 | 10 |
| Health & PE | สุขศึกษา | 5 | 13 |
| Computing | คอมพิวเตอร์ | 5 | 10 |

### Semester 2 Subjects (8)
| Subject (EN) | Subject (TH) | Topics | Vocab |
|--------------|--------------|--------|-------|
| Thai Language | ไทย | 5 | 10 |
| Mathematics | คณิตศาสตร์ | 5 | 12 |
| Science | วิทยาศาสตร์ | 5 | 14 |
| Social Studies | สังคมศึกษา | 5 | 13 |
| English | อังกฤษ | 5 | 16 |
| Arts | ศิลปะ | 5 | 10 |
| Health & PE | สุขศึกษา | 5 | 14 |
| Computing | คอมพิวเตอร์ | 5 | 10 |

---

## UI/UX Specification

### Layout (Same as Subjects.html for consistency)
- **Header:** Grade/Month tracker (e.g., "Current: P2 · Semester 1 [Change]")
- **Progress:** Selection summary (X subjects selected, Y rated)
- **Subjects:** Expandable accordion sections (one per subject)
- **Topics:** Checkbox list with 0-5 star rating per topic
- **Actions:** "Generate Comments" button (enabled when ≥1 topic rated)

### Key Differences from K1/K2
1. **Subject names:** Display as "Thai Language (ไทย)" - bilingual
2. **Fewer subjects:** 8 vs 13 → more vertical space per subject
3. **Topic language:** Topics in Thai with English in parentheses
4. **Semester badge:** Show "Semester 1 (May–Sep)" in header

---

## Technical Implementation

### Files to Create
1. `p2-subjects.html` - Main page
2. `assets/js/controllers/p2-subjects-controller.js` - Controller
3. Update `assets/js/controllers/app-controller.js` - Register new page
4. Update `month-selection.html` - Link P2 to p2-subjects.html

### Files to Modify
1. `assets/js/curriculum/curriculum-loader.js` - Add P2 semester mapping
2. `package.json` - Add p2-subjects to build (if applicable)

### Controller Methods
```javascript
class P2SubjectsController {
  constructor(app) { this.app = app; }
  
  async init() {
    this.loadSessionDataFromURL();
    await this.loadAndRenderCurriculum();
    this.setupSubjectInteractions();
    this.setupCommentGeneration();
    this.updateSelectionSummary();
  }
  
  async loadAndRenderCurriculum() {
    const { grade, month } = this.app.sessionData;
    const curriculum = await CurriculumLoader.load(grade, month);
    this.renderSubjects(curriculum.subjects);
  }
  
  renderSubjects(subjects) {
    // Generate HTML for each subject with bilingual name
    // Create topic checkboxes with 0-5 rating stars
  }
  
  // ... rest same as SubjectsController
}
```

---

## Integration Points

### Month Selection → P2 Subjects
Update `month-selection.html` continue button handler:
```javascript
if (selectedGrade === 'P2') {
  window.location.href = `p2-subjects.html?grade=P2&month=${selectedMonth}`;
}
```

### App Controller Registration
```javascript
// In app-controller.js init()
case 'p2-subjects':
  if (this.controllers.p2Subjects) this.controllers.p2Subjects.init();
  break;
```

---

## Error Handling
| Scenario | Handling |
|----------|----------|
| Curriculum JSON not found | Show notification, redirect to month-selection |
| Network error loading JSON | Retry once, then show error with "Try Again" |
| Invalid grade/month params | Redirect to grade-selection |
| No subjects selected | Disable generate button, show warning |

---

## Testing Strategy
1. **Unit tests** - Controller methods (loadCurriculum, renderSubjects)
2. **Integration test** - Full flow: month-selection → p2-subjects → comments
3. **Manual verification** - Both semesters render correctly, Thai text displays
4. **Regression** - K1/K2 Subjects.html unchanged

---

## Success Criteria
- [ ] P2 Semester 1 loads 8 subjects with correct topics
- [ ] P2 Semester 2 loads 8 subjects with correct topics  
- [ ] Bilingual subject names display correctly
- [ ] Topic checkboxes + 0-5 rating work
- [ ] Comment generation works with P2 data
- [ ] K1/K2 Subjects.html unaffected
- [ ] All existing tests pass

---

## Out of Scope
- P3/P4 curriculum (future work)
- Offline/cached curriculum loading
- Subject reordering/drag-drop
- Bulk select all topics (removed per UX request)

---

## Timeline Estimate
| Task | Effort |
|------|--------|
| Create p2-subjects.html | 2h |
| Create P2SubjectsController | 2h |
| Integrate with app-controller + month-selection | 1h |
| Testing & bug fixes | 1h |
| **Total** | **~6h** |