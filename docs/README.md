# Teacher's Pet — Documentation Hub

Welcome to the Teacher's Pet documentation. This project is a static HTML/JS application for generating student comments with AI-powered templates.

## 🚀 Quick Start

| Audience | Start Here |
|----------|------------|
| **Users (Teachers)** | [Navigation Flow](#navigation-flow) → Generate reports in 5 steps |
| **Developers** | [Architecture Index](ARCHITECTURE_INDEX.md) → [Contributing](#contributing) |
| **AI Agents** | [.github/copilot-instructions.md](../.github/copilot-instructions.md) |

---

## 📖 Documentation Index

### Architecture & Status
| Document | Description |
|----------|-------------|
| [ARCHITECTURE_INDEX.md](ARCHITECTURE_INDEX.md) | High-level architecture, data flow, module map |
| [PROJECT_STATUS.md](PROJECT_STATUS.md) | Current implementation status, agent dashboard |
| [PRODUCTION_REFACTOR_2024.md](PRODUCTION_REFACTOR_2024.md) | 2024 refactor details, performance patterns |

### Features & Curriculum
| Document | Description |
|----------|-------------|
| [curriculum-data.md](curriculum-data.md) | Legacy K1 August curriculum (markdown format) |
| [PVT-STUDENT-IMPLEMENTATION.md](PVT-STUDENT-IMPLEMENTATION.md) | PVT student support documentation |
| [K1-DECEMBER-IMPLEMENTATION.md](K1-DECEMBER-IMPLEMENTATION.md) | K1 December curriculum implementation |
| [K1-JANUARY-TESTING-GUIDE.md](K1-JANUARY-TESTING-GUIDE.md) | Testing guide for K1 January curriculum |

### Historical / Archive
| Document | Description |
|----------|-------------|
| [archive/MULTI-GRADE-IMPLEMENTATION-PLAN.md](archive/MULTI-GRADE-IMPLEMENTATION-PLAN.md) | Original multi-grade architecture plan (superseded) |
| [DATA-INTEGRATION-AUDIT-2025-11-21.md](DATA-INTEGRATION-AUDIT-2025-11-21.md) | Historical data integration audit |

### Plans (Archived)
| Document | Description |
|----------|-------------|
| [plans/.archive/2026-06-12-p2-ieap-design.md](plans/.archive/2026-06-12-p2-ieap-design.md) | P2 IEAP design spec (completed) |
| [plans/.archive/2026-06-12-p2-ieap-implementation.md](plans/.archive/2026-06-12-p2-ieap-implementation.md) | P2 IEAP implementation plan (completed) |
| [plans/2026-06-13-perf-optimization-design.md](plans/2026-06-13-perf-optimization-design.md) | Performance optimization design (completed) |

### Project Management
| Document | Description |
|----------|-------------|
| [jobcard.md](jobcard.md) | Massive changelog / development log (73k lines) |
| [DOCUMENTATION_AUDIT_2026-06-13.md](DOCUMENTATION_AUDIT_2026-06-13.md) | This repo's documentation audit report |

---

## 🧭 Navigation Flow

```
index.html (Landing)
    ↓
grade-selection.html (K1 / K2 / P2 / PVT)
    ↓
month-selection.html (Month/Semester) — OR — semester-selection.html (P2 only)
    ↓
student-information.html (Student details)
    ↓
Subjects.html / p2-subjects.html (Topic selection)
    ↓
Generate Comments → Review → Copy/Export
```

**Key pages:**
- `index.html` — Welcome, start flow
- `grade-selection.html` — Choose grade level
- `month-selection.html` — Choose month (K1/K2) or semester (P2)
- `student-information.html` — Student name, gender, rating, strengths/weaknesses
- `Subjects.html` — K1/K2 topic selection
- `p2-subjects.html` — P2 IEAP topic selection with ratings

---

## 🏗️ Architecture Overview

### Core Modules
```
assets/js/
├── controllers/       # Page controllers (app, launcher, student-info, subjects, P2)
├── engine/            # Comment generation core
│   ├── core.js       # EnhancedCommentEngine (orchestrator)
│   ├── processor.js  # Data normalization, grouping
│   ├── templates.js  # Male/female template strings
│   ├── utils.js      # Pure utility functions
│   └── types.d.ts    # TypeScript type definitions
├── data/
│   └── engine-data.js # Descriptor pools, verb pools, performance maps
├── curriculum/        # JSON curriculum loader + data
├── state/
│   └── store.js       # Reactive Proxy store (localStorage sync)
├── utils/             # UI, performance, error handling
└── synonym-manager.js # Word variation system
```

### Data Flow
1. **Wizard pages** → write to `app.sessionData` (reactive store)
2. **Generate click** → `OptimizedCommentGenerator.generateComments(sessionData)`
3. **Engine** → `EnhancedCommentEngine` → `TeachersPetProcessor` → `TeachersPetTemplates`
4. **Synonym replacement** → `SynonymManager.replaceOverused()`
5. **Output** → Male/female comment objects with word counts

---

## 🧪 Testing

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests
npm run test:integration

# Performance benchmark
npm run test:perf

# E2E all pages
npm run e2e:testall

# Lint
npm run lint

# Verify (lint + link check)
npm run verify
```

Test pages in `tests/`:
- Unit tests in `tests/unit/` (13 files)
- Integration tests in `tests/integration/`
- Performance benchmark in `tests/perf/engine-benchmark.js`
- Manual test pages in `tests/*.html`

---

## 📦 Contributing

1. **Read** [ARCHITECTURE_INDEX.md](ARCHITECTURE_INDEX.md) and [.github/copilot-instructions.md](../.github/copilot-instructions.md)
2. **Follow** coding standards: ES modules, strict mode, JSDoc for public APIs
3. **Test** — `npm test` must pass before PR
4. **Lint** — `npm run lint` must pass

### Adding New Curriculum (Developer Guide)
1. Add JSON to `assets/data/curriculum/{grade}/{month}.json`
2. Follow schema in `assets/data/curriculum/README.md` (to be created)
3. Test with `npm test` and manual wizard flow

---

## 🔗 Key References

| Reference | Link |
|-----------|------|
| Copilot Instructions | [.github/copilot-instructions.md](../.github/copilot-instructions.md) |
| Contributing Guide | [.github/CONTRIBUTING.md](../.github/CONTRIBUTING.md) |
| Project Status | [PROJECT_STATUS.md](PROJECT_STATUS.md) |
| Architecture Index | [ARCHITECTURE_INDEX.md](ARCHITECTURE_INDEX.md) |
| Documentation Audit | [DOCUMENTATION_AUDIT_2026-06-13.md](DOCUMENTATION_AUDIT_2026-06-13.md) |
| Production Refactor (2024) | [PRODUCTION_REFACTOR_2024.md](PRODUCTION_REFACTOR_2024.md) |

---

## 📝 Project Name Standardization

**Standardized as: "Teacher's Pet"** (with apostrophe)

Used consistently across:
- `README.md`, `package.json`, `ARCHITECTURE_INDEX.md`, `PROJECT_STATUS.md`
- `.github/copilot-instructions.md`, `PRODUCTION_REFACTOR_2024.md`

---

*Last updated: June 17, 2025 — Documentation audit hygiene pass complete*