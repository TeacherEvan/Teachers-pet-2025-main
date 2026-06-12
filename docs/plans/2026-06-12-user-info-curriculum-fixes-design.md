# Design Document: User Info Window Enhancement & Curriculum Data Fixes

**Date:** 2026-06-12  
**Branch:** main  
**Author:** Evan

---

## Problem Statement

### Current Issues

1. **Curriculum Data Missing/Inconsistent**
   - Only `December.txt` exists for K1 and K2 in `assets/js/curriculum/k1/` and `k2/`
   - Month selection UI expects: K1→[August, November, December, January], K2→[November, December, January], P2→[Semester 1, Semester 2], PVT→[General]
   - Curriculum loader expects `.json` files but only `.txt` files exist
   - No P2 or PVT curriculum files at all

2. **Duplicate Curriculum Tracker Code**
   - `studentInfoController.init()` creates tracker
   - Inline script in `student-information.html` also creates tracker (`updateCurriculumTracker()`)
   - Both read from URL params/localStorage and write to same DOM element

3. **Progress Tracking Not Initialized**
   - `studentInfoController.setupProgressTracking()` exists but is never called in `init()`
   - Progress bar stays at 0% even when form is filled

4. **Auto-Save UX Could Be Better**
   - Auto-save indicators show "Saved" but no visual feedback during saving
   - No debouncing on rapid input changes

---

## Design Goals

1. **Fix curriculum data** - Create proper JSON curriculum files matching UI expectations
2. **Eliminate code duplication** - Single source of truth for curriculum tracker
3. **Fix progress tracking** - Call `setupProgressTracking()` in controller init
4. **Improve auto-save UX** - Add debouncing, visual saving state

---

## Approach Options

### Curriculum Data Fix

**Option A: Convert existing .txt to JSON + Create missing files (Recommended)**
- Convert K1/December.txt and K2/December.txt to JSON format
- Create new JSON files for K1-August, K1-November, K1-January, K2-November, K2-January
- Create P2-Semester 1, P2-Semester 2, PVT-General JSON files
- Match structure expected by `CurriculumLoader` (subjects array with topics)

**Option B: Change loader to parse .txt files**
- More complex, requires fragile text parsing
- Not maintainable

**Option C: Hardcode curriculum in engine-data.js**
- Loses flexibility of file-based curriculum
- Increases bundle size

**Recommendation: Option A** - Clean, maintainable, matches existing architecture

### Duplicate Tracker Fix

**Option A: Move all tracker logic to controller (Recommended)**
- Remove inline `updateCurriculumTracker()` from HTML
- Enhance `studentInfoController.init()` to handle all cases
- Single source of truth

**Option B: Keep inline script, remove from controller**
- Controller would not handle tracker
- Less consistent with architecture

**Recommendation: Option A** - Consistent with controller pattern

### Progress Tracking Fix

Simple fix: Add `this.setupProgressTracking()` call in `init()` after `setupFormValidation()`

### Auto-Save UX Improvement

**Option A: Add debouncing + saving state indicator (Recommended)**
- Debounce auto-save to 300ms
- Show "Saving..." during save, "Saved" after success
- Keep existing localStorage/sessionStorage sync

---

## Technical Design

### 1. Curriculum JSON Schema

```json
{
  "grade": "K1",
  "month": "August",
  "subjects": [
    {
      "name": "English",
      "topics": ["Trace letter A", "Match letter to picture", "Vocabulary: Ant, Bee, Cat"],
      "description": "Focus on basic letter recognition and tracing"
    },
    {
      "name": "Mathematics",
      "topics": ["Count 1-5", "Trace numbers 1-5", "Match numbers to quantity"],
      "description": "Early numeracy foundations"
    }
    // ... more subjects
  ]
}
```

### 2. Curriculum Files to Create

| Grade | Month/Period | File |
|-------|-------------|------|
| K1 | August | `assets/data/curriculum/k1/august.json` |
| K1 | November | `assets/data/curriculum/k1/november.json` |
| K1 | December | `assets/data/curriculum/k1/december.json` (convert from .txt) |
| K1 | January | `assets/data/curriculum/k1/january.json` |
| K2 | November | `assets/data/curriculum/k2/november.json` |
| K2 | December | `assets/data/curriculum/k2/december.json` (convert from .txt) |
| K2 | January | `assets/data/curriculum/k2/january.json` |
| P2 | Semester 1 | `assets/data/curriculum/p2/semester1.json` |
| P2 | Semester 2 | `assets/data/curriculum/p2/semester2.json` |
| PVT | General | `assets/data/curriculum/pvt/general.json` |

### 3. Controller Changes

**studentInfoController.js:**
- Remove duplicate tracker code (lines 7-31)
- Enhance init() to:
  1. Load grade/month from URL params or localStorage
  2. Update curriculum tracker with XSS-safe escaping
  3. Call `setupFormValidation()`
  4. Call `setupProgressTracking()` (NEW)
  5. Call `initSlider()`
  6. Call `setupNavigationButtons()`

### 4. HTML Changes

**student-information.html:**
- Remove inline `updateCurriculumTracker()` function (lines 1044-1069)
- Remove inline script calls to it
- Keep curriculum tracker div (`#curriculumTracker`) - controller populates it

---

## Data Mapping: .txt → JSON

### K1 December (from existing .txt)
Subjects:
- English: Trace letters, match letters to pictures, vocabulary A-T
- Mathematics: Write numbers 1-7, draw circles, trace 6, color
- I.Q: Objects/animals, directions (above, front/back), size matching, wings
- Phonics: Letters R, S, Rev Q/R/S, T, U
- Science: Mixing colors, bottle diver, air pressure, air rocket
- Conversation 1: Colors, family, abilities, playground
- Conversation 3: Food actions, weather
- Arts: Butterfly squish painting, sponge painting, new year card, origami house
- Physical Education: Hopscotch, ball race, dart ball, cart racing
- Puppet Show: Ants & Grasshopper, Lion & Mouse

### K2 December (from existing .txt)
Subjects:
- Mathematics: Counting 1-50, subtraction/addition, trace/write 1-20
- I.Q: Wet/dry, underneath, emotions, loud/quiet, inside/outside, hot/cold, size sequencing
- Social: Community helpers, traffic rules, earth materials, New Year/Songkran, food pyramid
- English: Lowercase letters m-z, draw lines, trace, circle, match upper/lower
- Phonics: Letters R, S, T, U sounds
- Science: Water and air pressure experiment
- Conversation 1: Colors, family, abilities, playground, actions
- Conversation 3: Sunny day items, appliances (TV, microwave, toaster)
- Arts: Leaf painting, fancy mask, Santa mobile, new year card, watercolor squish
- Physical Education: Zigzag running, ring toss, relay race, color sorting
- Puppet Show: Weeping Tree, Sick Bear
- Cooking: Crispy Puffed Pork balls

---

## Implementation Plan (Phase 2)

### Task 1: Create Curriculum JSON Files
- Convert K1 December .txt → JSON
- Convert K2 December .txt → JSON  
- Create K1 August JSON (from grade-selection.html description + K1 patterns)
- Create K1 November JSON
- Create K1 January JSON
- Create K2 November JSON
- Create K2 January JSON
- Create P2 Semester 1 JSON (from month-selection.html description)
- Create P2 Semester 2 JSON (from month-selection.html description)
- Create PVT General JSON (from grade-selection.html description)

### Task 2: Fix StudentInfoController
- Remove duplicate tracker code from init()
- Add `setupProgressTracking()` call in init()
- Ensure single tracker update with proper escaping

### Task 3: Clean Up student-information.html
- Remove inline `updateCurriculumTracker()` function
- Remove auto-call of that function
- Keep curriculum tracker div

### Task 4: Improve Auto-Save UX
- Add debouncing (300ms)
- Add "Saving..." state indicator
- Keep existing localStorage/sessionStorage sync

### Task 5: Verify & Test
- Run existing tests
- Verify curriculum loads for all grade/month combos
- Verify progress bar works
- Verify tracker updates correctly

---

## Testing Strategy

1. **Unit Tests** - Verify curriculum loader works with new JSON files
2. **Integration Tests** - Test full flow: grade selection → month selection → student info → subjects
3. **Manual Verification** - Check each grade/month loads correct subjects in UI

---

## Success Criteria

- [ ] All 10 curriculum JSON files exist and load without errors
- [ ] Curriculum tracker shows correct grade/month without duplication
- [ ] Progress bar updates as user fills form
- [ ] Auto-save shows "Saving..." → "Saved" with debouncing
- [ ] All existing tests pass
- [ ] No XSS vulnerabilities in tracker output

---

## Out of Scope

- Changing the subject/topic structure in engine-data.js
- Adding new grades beyond K1, K2, P2, PVT
- Modifying comment generation engine
- Visual redesign of the form (keeping current layout)

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Missing curriculum breaks report generation | Use fallback "General" curriculum if file missing |
| JSON parsing errors | Validate JSON structure before saving |
| Controller init order issues | Ensure DOM ready before controller initializes |
| Auto-save race conditions | Use single debounced save function |