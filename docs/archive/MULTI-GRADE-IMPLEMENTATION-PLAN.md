# Multi-Grade, Multi-Month Curriculum Implementation Plan
**Date:** November 12, 2025  
**Status:** Pending User Approval

## Executive Summary

Transform Teachers Pet from single-curriculum (K1 August) to multi-grade, multi-month system supporting K1, K2, K3 across 12 months with scalable data architecture and seamless user experience.

---

## Current vs. Proposed Architecture

### Current Flow (3 Steps)
```
1. index.html (Welcome)
   ↓
2. student-information.html (Student Info)
   ↓
3. Subjects.html (K1 August subjects - hardcoded)
   ↓
4. Comment Generation
```

### Proposed Flow (5 Steps)
```
1. index.html (Welcome)
   ↓
2. grade-selection.html (K1/K2/K3) ← ALREADY EXISTS
   ↓
3. month-selection.html (Jan-Dec) ← NEW PAGE
   ↓
4. student-information.html (Student Info - unchanged)
   ↓
5. Subjects.html (Dynamic - loads based on grade+month)
   ↓
6. Comment Generation
```

---

## Best Practices Analysis

### 1. Data Architecture (Recommended Approach)

**Option A: Modular JS Files (RECOMMENDED)**
```
assets/js/curriculum/
├── k1/
│   ├── august.js      (current data — already exists in curriculum data)
│   ├── september.js   (empty — coming soon)
│   ├── october.js     (empty — coming soon)
│   └── ...
├── k2/
│   ├── august.js      (empty — coming soon)
│   └── ...
└── k3/
    ├── august.js      (empty — coming soon)
    └── ...
```

**Benefits:**
- ✅ Easy to add new months incrementally
- ✅ Smaller file sizes (lazy load only needed curriculum)
- ✅ Clear organization by grade/month
- ✅ Simple to migrate from curriculum data

**File Structure Example:**
```javascript
// assets/js/curriculum/k1/august.js
window.CurriculumData = window.CurriculumData || {};
window.CurriculumData.K1 = window.CurriculumData.K1 || {};
window.CurriculumData.K1.August = {
  subjects: [
    {
      id: 'english',
      name: 'English',
      topics: [
        { id: 'english_letters', name: 'Draw lines to match letters' },
        { id: 'english_trace', name: 'Trace letters from dot' },
        // ... all topics from curriculum data
      ]
    },
    // ... all other subjects
  ]
};
```

**Option B: Single Large JSON (NOT RECOMMENDED)**
- ❌ Large file size (loads all data at once)
- ❌ Harder to maintain as curriculum grows
- ✅ Simpler initial setup

**Decision:** Use Option A (Modular JS Files)

---

### 2. State Management Updates

**Current sessionData:**
```javascript
this.sessionData = {
  grade: '',              // Already exists!
  studentName: '',
  gender: '',
  overallRating: 5,
  strengths: '',
  weaknesses: '',
  subjects: [],
  topicRatings: {}
};
```

**Proposed sessionData (ADD month property):**
```javascript
this.sessionData = {
  grade: '',              // Set in grade-selection.html
  month: '',              // NEW - Set in month-selection.html
  studentName: '',
  gender: '',
  overallRating: 5,
  strengths: '',
  weaknesses: '',
  subjects: [],
  topicRatings: {}
};
```

**Validation Flow:**
- `grade-selection.html`: Saves `sessionData.grade` → navigates to month-selection
- `month-selection.html`: Validates grade exists → saves `sessionData.month` → navigates to student-info
- `student-information.html`: Validates grade+month exist → continues as before
- `Subjects.html`: Loads curriculum from `CurriculumData[grade][month]`

---

### 3. Navigation & URL Strategy

**URL Parameter Passing (for page refresh recovery):**
```
grade-selection.html
  ↓ saves grade to sessionData + localStorage
month-selection.html?grade=K1
  ↓ saves month to sessionData + localStorage
student-information.html?grade=K1&month=August
  ↓ validates data exists
Subjects.html?grade=K1&month=August&studentName=John&gender=male&...
  ↓ loads curriculum dynamically
```

**app.js Updates:**
```javascript
getCurrentPage() {
  const path = window.location.pathname;
  if (path.includes('grade-selection')) return 'grade-selection';
  if (path.includes('month-selection')) return 'month-selection'; // NEW
  if (path.includes('student-information')) return 'student-info';
  if (path.includes('Subjects')) return 'subjects';
  return 'launcher';
}

initMonthSelection() {  // NEW METHOD
  console.log('Initializing month selection page');
  this.loadGradeFromStorage();
  // Month selection logic handled in page's inline JS
}

loadGradeFromStorage() {  // NEW METHOD
  const params = new URLSearchParams(window.location.search);
  if (params.has('grade')) {
    this.sessionData.grade = params.get('grade');
  } else {
    // Try localStorage fallback
    const saved = localStorage.getItem('studentData');
    if (saved) {
      const data = JSON.parse(saved);
      this.sessionData.grade = data.grade || '';
      this.sessionData.month = data.month || '';
    }
  }
}
```

---

### 4. Empty State Handling

**"Coming Soon" Logic:**

**Month Selection Page:**
```javascript
const availableMonths = {
  'K1': ['August'], // Only August available for K1
  'K2': [],         // Nothing available yet
  'K3': []          // Nothing available yet
};

function isMonthAvailable(grade, month) {
  return availableMonths[grade]?.includes(month) || false;
}

// In dropdown change handler:
if (!isMonthAvailable(selectedGrade, selectedMonth)) {
  alert(`${selectedGrade} ${selectedMonth} curriculum is coming soon. Currently only K1 August is available.`);
  continueBtn.disabled = true;
} else {
  continueBtn.disabled = false;
}
```

**Visual Indicators:**
```html
<option value="August">August</option>
<option value="September" disabled>September (Coming Soon)</option>
<option value="October" disabled>October (Coming Soon)</option>
<!-- etc. -->
```

---

## Implementation Steps (Detailed)

### Step 1: Create month-selection.html
**File:** `month-selection.html`  
**Design:** Match grade-selection.html glassmorphism style  
**Features:**
- Month dropdown (January - December)
- Grade context display (e.g., "Selected Grade: K1")
- Back button → grade-selection.html
- Continue button → student-information.html (disabled if month unavailable)
- Coming soon badges/alerts for disabled months

### Step 2: Create Curriculum Data Files
**Files to create:**
```
assets/js/curriculum/
├── curriculum-loader.js  (dynamic loader utility)
├── k1/
│   └── august.js         (migrate from curriculum data)
```

**Migration from curriculum data:**
- Convert markdown format to JavaScript object structure
- Preserve all subject IDs, names, topics, activities, vocabulary
- Ensure compatibility with existing PremiumCommentEngine and EnhancedCommentEngine

### Step 3: Update app.js
**Changes:**
1. Add `month: ''` to `sessionData` object (line ~7)
2. Update `getCurrentPage()` to detect 'month-selection' (line ~24)
3. Add `initMonthSelection()` method (after initGradeSelection, line ~206)
4. Update `init()` switch statement to call initMonthSelection

### Step 4: Update index.html
**Change:** 
```html
<!-- OLD -->
<a href="student-information.html" class="btn-primary">Get Started</a>

<!-- NEW -->
<a href="grade-selection.html" class="btn-primary">Get Started</a>
```

### Step 5: Make Subjects.html Dynamic
**Changes:**
1. Remove hardcoded subjects HTML
2. Add curriculum loader script: `<script src="assets/js/curriculum/curriculum-loader.js"></script>`
3. Load curriculum file dynamically based on sessionData.grade and sessionData.month
4. Generate subjects HTML from loaded curriculum data
5. Fallback message if curriculum file missing

**Example:**
```javascript
// In Subjects.html <script> section
async function loadCurriculum() {
  const grade = app.sessionData.grade || 'K1';
  const month = app.sessionData.month || 'August';
  
  try {
    // Dynamically load curriculum file
    const script = document.createElement('script');
    script.src = `assets/js/curriculum/${grade.toLowerCase()}/${month.toLowerCase()}.js`;
    script.onerror = () => {
      showComingSoonMessage(grade, month);
    };
    script.onload = () => {
      renderSubjects(window.CurriculumData[grade][month]);
    };
    document.head.appendChild(script);
  } catch (error) {
    console.error('Error loading curriculum:', error);
    showComingSoonMessage(grade, month);
  }
}

function renderSubjects(curriculumData) {
  const container = document.getElementById('subjectsContainer');
  curriculumData.subjects.forEach(subject => {
    // Generate subject HTML with dropdowns
    // Same structure as current Subjects.html
  });
}

function showComingSoonMessage(grade, month) {
  alert(`Curriculum for ${grade} ${month} is not yet available. Please go back and select a different grade/month combination.`);
}
```

### Step 6: Update grade-selection.html
**Change continue button to navigate to month-selection.html:**
```javascript
// OLD
window.location.href = 'student-information.html';

// NEW
window.location.href = `month-selection.html?grade=${selectedGrade}`;
```

### Step 7: Update Comment Engines
**Files:** 
- `assets/js/comment-engine.js` (PremiumCommentEngine)
- `assets/js/enhanced-comment-engine.js` (EnhancedCommentEngine)
- `enhanced-comment-engine.js` (root copy)

**Change:** Update `subjectCapitalization` object when new subjects added to new months
- Monitor for new subject names in future curriculum files
- Ensure proper capitalization in generated comments

### Step 8: Testing
**Test scenarios:**
1. ✅ K1 August (should work - existing data)
2. ❌ K1 September (should show "coming soon")
3. ❌ K2 August (should show "coming soon")
4. ✅ Navigation backward/forward preserves selections
5. ✅ Page refresh doesn't lose grade/month selection
6. ✅ Comment generation includes grade/month in context
7. ✅ Mobile responsive on all new pages

### Step 9: Documentation Updates
**Files to update:**
1. `.github/copilot-instructions.md` - Update application flow diagram
2. `Index.md` - Log new files (month-selection.html, curriculum files)
3. `README.md` - Update navigation flow section
4. Create `jobcard.md` entry with implementation notes
5. Create `MULTI-GRADE-MIGRATION-SUMMARY.md` with before/after comparison

---

## Data Migration Strategy

### Current Curriculum Data Location
**File:** `curriculum-data.md` (K1 August subjects)

### Migration Process
```
curriculum-data.md (markdown)
  ↓ manual conversion
assets/js/curriculum/k1/august.js (JavaScript object)
```

**Conversion Template:**
```javascript
// Convert this (markdown):
## English
**Activities:**
- Draw lines to match the letter with the correct picture
- Trace the letter starting from the dot

// To this (JavaScript):
{
  id: 'english',
  name: 'English',
  topics: [
    { id: 'english_match', name: 'Draw lines to match the letter with the correct picture' },
    { id: 'english_trace', name: 'Trace the letter starting from the dot' }
  ]
}
```

---

## Scalability Plan

### Adding New Curriculum (Future)

**Process:**
1. Create new file: `assets/js/curriculum/k1/september.js`
2. Copy structure from `august.js`
3. Update subject/topic data
4. Update `availableMonths` object in month-selection.html:
   ```javascript
   const availableMonths = {
     'K1': ['August', 'September'], // ← Add new month
     'K2': [],
     'K3': []
   };
   ```
5. Test with existing flow (no other changes needed!)

**Timeline Estimates:**
- K1 complete (12 months): ~12-15 hours
- K2 complete (12 months): ~12-15 hours  
- K3 complete (12 months): ~12-15 hours

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Breaking existing K1 August functionality | Medium | High | Keep backup, test thoroughly before deployment |
| Users confused by new navigation | Low | Medium | Clear progress indicators, back buttons |
| Large curriculum files slow performance | Low | Low | Lazy loading, only load needed month |
| Comment engines break with new subjects | Medium | High | Update subjectCapitalization, test with each new curriculum |
| localStorage conflicts with grade/month | Low | Medium | Add versioning to stored data structure |

---

## UI/UX Mockup (month-selection.html)

```
┌─────────────────────────────────────────────┐
│              Space Background               │
│           (Glassmorphism Theme)             │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │           📅 Select Month             │ │
│  │                                       │ │
│  │   Choose the curriculum month for     │ │
│  │   K1 report generation                │ │
│  │                                       │ │
│  │   Selected Grade: K1 Kindergarten 1   │ │
│  │   ─────────────────────────────────   │ │
│  │                                       │ │
│  │   Curriculum Month: ▼                 │ │
│  │   ┌─────────────────────────────────┐ │ │
│  │   │ Choose a month...               │ │ │
│  │   │ August                          │ │ │
│  │   │ September (Coming Soon)         │ │ │
│  │   │ October (Coming Soon)           │ │ │
│  │   └─────────────────────────────────┘ │ │
│  │                                       │ │
│  │   [Info Box - August Selected]        │ │
│  │   📘 August Curriculum                │ │
│  │   Foundation month focusing on...     │ │
│  │                                       │ │
│  │  ┌─────────┐       ┌─────────────┐   │ │
│  │  │ ← Back  │       │ Continue → │   │ │
│  │  └─────────┘       └─────────────┘   │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

---

## File Checklist

### New Files to Create
- [ ] `month-selection.html` (main new page)
- [ ] `assets/js/curriculum/curriculum-loader.js` (optional utility)
- [ ] `assets/js/curriculum/k1/august.js` (migrate from curriculum data)
- [ ] `MULTI-GRADE-MIGRATION-SUMMARY.md` (documentation)
- [ ] Update `jobcard.md` (if exists) or create new entry

### Files to Modify
- [ ] `index.html` (change Start button link)
- [ ] `grade-selection.html` (change continue navigation)
- [ ] `assets/js/app.js` (add month to sessionData, add initMonthSelection)
- [ ] `Subjects.html` (make dynamic curriculum loading)
- [ ] `.github/copilot-instructions.md` (update flow diagram)
- [ ] `Index.md` (log new files)
- [ ] `README.md` (update navigation section)

### Files to Keep Synchronized
- [ ] `assets/js/enhanced-comment-engine.js` ↔️ `enhanced-comment-engine.js`

---

## Success Criteria

✅ **Must Have:**
1. User can select K1 → August → generate report (existing functionality preserved)
2. User sees "coming soon" for K1 other months, K2, K3
3. Navigation backward/forward works smoothly
4. Glassmorphism design consistent across all pages
5. No JavaScript console errors
6. Mobile responsive layout maintained

✅ **Nice to Have:**
7. Progress breadcrumbs (Step 1 of 5)
8. Smooth page transitions
9. Loading spinners when loading curriculum files
10. Help tooltips explaining grade/month selection

---

## Next Steps

**Before proceeding, I need your approval on:**

1. ✅ **Overall approach** - Linear wizard with grade → month → student info → subjects?
2. ✅ **Data architecture** - Modular JS files in `assets/js/curriculum/` folder structure?
3. ✅ **Empty state handling** - "Coming soon" messages with disabled Continue buttons?
4. ✅ **UI design** - Match existing glassmorphism theme for month-selection.html?
5. ✅ **Migration plan** - Convert curriculum-data.md to k1/august.js format?

**Questions for you:**
- Do you want progress indicators (Step 2 of 5) shown on each page?
- Should we add a "Skip to K1 August" quick link for faster access during development?
- Any specific subjects/topics you want added for K1 September as next priority?
- Should grade/month selection be editable after reaching Subjects page (edit button)?

---

## Estimated Timeline

| Phase | Duration | Description |
|-------|----------|-------------|
| Planning & Approval | 1 hour | This document review + Q&A |
| month-selection.html | 2 hours | HTML/CSS/JS matching design |
| Curriculum migration | 3 hours | Convert MD → JS, create folder structure |
| app.js updates | 1 hour | Add month property, init methods |
| Subjects.html dynamic loading | 3 hours | Replace hardcoded with dynamic |
| Testing | 2 hours | Full flow testing, bug fixes |
| Documentation | 1 hour | Update all docs |
| **Total** | **13 hours** | Complete implementation |

---

**Ready to proceed?** Please review this plan and provide feedback or approval to begin implementation. 🚀
