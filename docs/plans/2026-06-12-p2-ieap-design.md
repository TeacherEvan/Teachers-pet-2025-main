# Design Document: P2-IEAP (Primary 2) Addition

**Date:** 2026-06-12  
**Author:** Teacher Evan  
**Status:** Approved for Implementation

---

## 1. Overview

Add **P2 (Primary 2 / Prathom 2)** with **IEAP (Intensive English Academic Program)** Thai curriculum as the next grade level after K2, replacing the "K3 - Coming Soon" placeholder.

- **Target Age:** 7-8 years old (Grade 2 equivalent)
- **Curriculum System:** Thai two-semester academic calendar
- **Program:** IEAP - Intensive English Academic Program

---

## 2. Positioning in Grade Selection

| Current | New |
|---|---|
| K1 - Kindergarten 1 | K1 - Kindergarten 1 |
| K2 - Kindergarten 2 | K2 - Kindergarten 2 |
| K3 - Coming Soon | **P2 - Primary 2 (IEAP)** |
| PVT - Private Student | PVT - Private Student |

**Flow:** `index.html → grade-selection.html (K1/K2/P2/PVT) → month-selection.html → student-information.html → Subjects.html → comments`

**P2 skips month-selection** (like PVT) and goes directly to student-information, OR uses semester selection. Decision: **P2 uses semester selection** (Semester 1 / Semester 2) on month-selection page.

---

## 3. Curriculum Structure: Two Semesters

Following Thai academic calendar:

| Semester | Months | Label in UI |
|---|---|---|
| **Semester 1** | May – September | "Semester 1 (May–Sep)" |
| **Semester 2** | November – March | "Semester 2 (Nov–Mar)" |

Note: October is typically a break month in Thai schools.

---

## 4. Subjects (8 Core)

| # | Subject (English) | Subject (Thai) | Capitalization Key |
|---|---|---|---|
| 1 | Thai Language | ภาษาไทย | `thai language` |
| 2 | Mathematics | คณิตศาสตร์ | `mathematics` |
| 3 | Science | วิทยาศาสตร์ | `science` |
| 4 | Social Studies | สังคมศึกษา | `social studies` |
| 5 | English | ภาษาอังกฤษ | `english` |
| 6 | Arts | ศิลปะ | `arts` |
| 7 | Health & Physical Education | สุขศึกษา | `health physical education` |
| 8 | Computing | คอมพิวเตอร์ | `computing` |

**Capitalization mapping** added to `engine-data.js` → `grammarRules.subjectCapitalization`.

---

## 5. Topic-to-Subject Mapping (subjectTopicMap)

Added to `engine-data.js` for comment generation context awareness.

| Subject | Keywords (Thai + English) |
|---|---|
| Thai Language | `อ่าน`, `เขียน`, `สระ`, `พยัญชนะ`, `คำ`, `ประโยค`, `วรรณคดี`, `read`, `write`, `vowel`, `consonant`, `word`, `sentence`, `literature` |
| Mathematics | `คณิต`, `บวก`, `ลบ`, `คูณ`, `หาร`, `เศษส่วน`, `ทศนิยม`, `add`, `subtract`, `multiply`, `divide`, `fraction`, `decimal` |
| Science | `ทดลอง`, `สิ่งมีชีวิต`, `พลังงาน`, `โลก`, `ดาวอาทิตย์`, `experiment`, `living`, `energy`, `earth`, `sun`, `plant`, `animal` |
| Social Studies | `ประวัติ`, `ภูมิศาสตร์`, `ผู้บริหาร`, `ไทย`, `ASEAN`, `history`, `geography`, `government`, `thailand`, `community` |
| English | `conversation`, `reading`, `writing`, `phonics`, `vocabulary`, `grammar`, `story`, `song`, `สนทนา`, `อ่าน`, `คำศัพท์` |
| Arts | `วาด`, `ระบาย`, `งานฝีมือ`, `ดนตรี`, `draw`, `paint`, `craft`, `music`, `color`, `design` |
| Health & PE | `สุขภาพ`, `กิน`, `ออกกำลังกาย`, `ทำความสะอาด`, `health`, `exercise`, `nutrition`, `hygiene`, `clean`, `sport` |
| Computing | `คอมพิวเตอร์`, `โปรแกรม`, `เขียนโค้ด`, `อินเทอร์เน็ต`, `computer`, `program`, `code`, `internet`, `digital`, `typing` |

---

## 6. Curriculum Data Files

### New Directory Structure
```
assets/data/curriculum/
├── k1/
├── k2/
├── p2/                    ← NEW
│   ├── semester1.json     ← Semester 1 (May–Sep)
│   └── semester2.json     ← Semester 2 (Nov–Mar)
├── pvt/
```

### Schema (consistent with existing curriculum JSON)

```json
{
  "grade": "P2",
  "month": "Semester 1",
  "subjects": [
    {
      "id": "thai-language",
      "name": "Thai Language",
      "topics": [
        { "id": "thai_reading_1", "name": "Reading: Short Stories" },
        { "id": "thai_writing_1", "name": "Writing: Sentences" },
        { "id": "thai_vowels", "name": "Vowels: สระอะ-อำ" }
      ]
    },
    ...
  ]
}
```

**Sample data** will cover all 8 subjects with 3-5 topics each per semester.

---

## 7. File Changes Required

### 7.1 `grade-selection.html`
- Replace K3 option with P2: `<option value="P2">P2 - Primary 2 (IEAP)</option>`
- Replace K3 info box with P2 info box (Thai/English description)
- Enable Continue button for P2 (navigate to month-selection.html?grade=P2)

### 7.2 `month-selection.html`
- Detect P2 grade from URL/localStorage
- Show semester options: "Semester 1 (May–Sep)", "Semester 2 (Nov–Mar)"
- Disable month options for P2 (only semesters enabled)
- Update grade display: "P2 - Primary 2 (IEAP)"
- Save selected semester to localStorage as `month` value

### 7.3 `assets/js/curriculum/curriculum-loader.js`
- Add P2 to `availableMonths`: `{ P2: ["Semester 1", "Semester 2"] }`
- Add P2 to `isAvailable()` and `getAvailableMonths()`
- Path construction: `assets/data/curriculum/p2/semester1.json` (lowercase)
- Handle semester-based loading (same as monthly)

### 7.4 `assets/js/data/engine-data.js`
- Add 8 subject capitalizations to `grammarRules.subjectCapitalization`
- Add `subjectTopicMap` entries for all 8 subjects with Thai/English keywords
- Ensure pronouns work (reuse existing `he`/`she`/`they`)

### 7.5 New: `assets/data/curriculum/p2/semester1.json`
- 8 subjects, ~3-5 topics each
- Realistic P2 Semester 1 content (Thai curriculum aligned)

### 7.6 New: `assets/data/curriculum/p2/semester2.json`
- 8 subjects, ~3-5 topics each  
- Realistic P2 Semester 2 content (Thai curriculum aligned)

---

## 8. Comment Generation Integration

- `EnhancedCommentEngine` (core) uses `TeachersPetProcessor` → `engine-data.js`
- New subject mappings automatically picked up for comment generation
- Strengths/weaknesses/topics flow through existing pipeline
- No changes needed to comment engine logic — data-driven

---

## 9. Testing Strategy

| Test | Description |
|---|---|
| Grade Selection | P2 appears, info box shows, Continue enabled |
| Month Selection | P2 shows semester options, disables month options |
| Curriculum Load | semester1.json / semester2.json load correctly |
| Subject Display | All 8 subjects render in Subjects.html |
| Topic Selection | Topics selectable, mapped to correct subjects |
| Comment Generation | Generates comments mentioning P2 subjects/topics |
| Integration | Full flow: grade → semester → student-info → subjects → comments |

---

## 10. Rollout Plan

1. **Phase 1**: Data files + engine-data.js (foundation)
2. **Phase 2**: grade-selection.html + month-selection.html (UI)
3. **Phase 3**: curriculum-loader.js (loading logic)
4. **Phase 4**: Sample curriculum JSON files
5. **Phase 5**: Integration testing + verification

---

## 11. Open Questions (Resolved)

| Question | Decision |
|---|---|
| Positioning | Replace K3 as next after K2 |
| Structure | Two semesters (Thai calendar) |
| Subjects | 8 standard Thai primary subjects |
| Topic Mapping | Thai + English keywords added |
| Data Source | Create sample JSON (refinable later) |

---

**Approved for Implementation** ✅