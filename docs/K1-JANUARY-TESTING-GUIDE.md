# K1 January Testing Guide

**Date:** 2026-01-25  
**Status:** Ready for QA Testing  
**Agent:** GitHub Copilot (Claude Sonnet 4.5)

---

## 🎯 Quick Test Instructions

### Step 1: UI Activation Test

1. Open `month-selection.html?grade=K1` in your browser
2. **Expected:** January appears as a selectable option (NOT "Coming Soon")
3. **Expected:** Clicking January enables the "Continue" button

### Step 2: Wizard Flow Test

1. Navigate through the full wizard:
   - Grade: K1
   - Month: January
   - Student: Alex (Male)
   - Overall Rating: 8
2. **Expected:** Subject selection page displays 11 K1 January subjects

### Step 3: Curriculum Display Test

Check that all 11 subjects appear:

- ✅ English (4 topics)
- ✅ Phonics (1 topic)
- ✅ Mathematics (5 topics)
- ✅ I.Q (10 topics)
- ✅ Social Studies (5 topics)
- ✅ Science (4 topics)
- ✅ Conversation 1 (7 topics)
- ✅ Conversation 3 (3 topics)
- ✅ Arts (6 topics)
- ✅ Physical Education (6 topics)
- ✅ Puppet Show (3 topics)

### Step 4: Keyword Mapping Test

Select these specific topics and verify keyword usage in generated comments:

#### Mathematics

- **Topic:** "Addition - showing the amount with their fingers"
- **Expected Keywords:** addition, add, fingers, plus, equal

#### I.Q

- **Topic:** "Circle the container that holds more (liquid)"
- **Expected Keywords:** liquid, container, circle

#### Social Studies

- **Topic:** "The benefits of healthy food"
- **Expected Keywords:** healthy, food

#### Science

- **Topic:** "Rainbow rain - Observe how food coloring drops fall through oil like rain"
- **Expected Keywords:** rainbow, rain, experiment

#### Physical Education

- **Topic:** "Bowling"
- **Expected Keywords:** bowling, ball, roll

#### Arts

- **Topic:** "Bookmark"
- **Expected Keywords:** bookmark, craft, design

### Step 5: Comment Generation Test

1. Select 3-4 subjects with ratings 7-9
2. Click "Generate Comments"
3. **Expected:** Comments mention ALL selected subjects by name
4. **Expected:** Comments include specific activity descriptions (not generic)

---

## 📊 Sample Test Data

### Test Case 1: High Achiever

```
Grade: K1
Month: January
Student: Emma (Female)
Overall: 9
Subjects:
  - Mathematics (Addition) - Rating: 9
  - I.Q (Container liquid) - Rating: 8
  - Physical Education (Bowling) - Rating: 9
```

**Expected Output:** Comment should mention addition skills, liquid container understanding, and bowling performance with excellent/impressive descriptors.

### Test Case 2: Balanced Learner

```
Grade: K1
Month: January
Student: Liam (Male)
Overall: 6
Subjects:
  - English (Match letters) - Rating: 6
  - Social Studies (Healthy food) - Rating: 7
  - Arts (Bookmark craft) - Rating: 6
```

**Expected Output:** Comment should mention letter matching, healthy food understanding, and bookmark creation with encouraging/positive descriptors.

### Test Case 3: Emerging Skills

```
Grade: K1
Month: January
Student: Sophia (Female)
Overall: 4
Subjects:
  - Mathematics (Draw circles) - Rating: 4
  - Science (Rainbow rain) - Rating: 5
  - Conversation 1 (Feelings) - Rating: 4
```

**Expected Output:** Comment should mention circle drawing, rainbow rain experiment, and conversation practice with developing/promising descriptors.

---

## ✅ Quality Checklist

After generating each comment, verify:

- [ ] Student name appears at the beginning
- [ ] Gender-appropriate pronouns used (he/his or she/her)
- [ ] ALL selected subjects mentioned by name
- [ ] Specific activities described (not "worked on Mathematics")
- [ ] Rating-appropriate descriptors (9 = impressive, 4 = developing)
- [ ] No repetitive adjectives (synonym system active)
- [ ] No mention of "K1" or "January" in the comment text
- [ ] Professional, encouraging tone throughout
- [ ] ~100 words in length

---

## 🐛 Known Issues to Watch For

### Critical Issues (Should NOT Occur)

- ❌ January showing "Coming Soon" for K1
- ❌ Generic phrases like "worked on Mathematics" instead of "practiced addition"
- ❌ Missing subjects in generated comments
- ❌ Grade/Month appearing in comment text

### Non-Critical Issues (OK)

- ⚠️ Some topics may use broader subject keywords if specific term not mapped
- ⚠️ Synonym variations may differ between male/female teachers

---

## 📝 Bug Reporting Template

If you find an issue, report using this format:

```
**Bug:** [Brief description]
**Test Case:** [Which test case from above]
**Selected Subjects:** [List subjects and ratings]
**Expected:** [What should happen]
**Actual:** [What actually happened]
**Screenshot:** [If applicable]
```

---

## 🚀 Integration Points Verified

- ✅ `month-selection.html` - Line 418 (availableMonths array)
- ✅ `assets/js/curriculum/curriculum-loader.js` - Lines 85, 101
- ✅ `assets/js/data/engine-data.js` - 80+ keywords across 9 subjects
- ✅ `assets/data/curriculum/k1/january.json` - 11 subjects, 54 topics

---

## 📚 Related Documentation

- [Project Status](./PROJECT_STATUS.md) - Architecture overview
- [Job Card](./jobcard.md) - Development history
- [K1 January Scrape](./K1-January-Curriculum-Scrape.txt) - Source data

---

**Last Updated:** 2026-01-25  
**Next Review:** After QA testing completion
