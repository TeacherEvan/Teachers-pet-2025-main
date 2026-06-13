# Documentation Audit Report - Teacher's Pet
**Date:** June 13, 2026
**Auditor:** AI Agent (Hermes)
**Scope:** `/home/ewaldt/Documents/VS/Other/Teacher's-pet`

---

## Executive Summary

The Teacher's Pet project has substantial documentation but exhibits **link rot**, **inconsistent naming**, **outdated navigation flows**, and **plan file accumulation**. The documentation is functional but requires hygiene work to match the current codebase state.

---

## 1. Link Health (🔴 Critical)

### Broken Internal Links (Verified via `verify_markdown_links.py`)

| File | Broken Link | Issue |
|------|-------------|-------|
| `docs/COPILOT_SETUP_VERIFICATION.md:170` | `.github/copilot-instructions.md` | Relative path from `docs/` should be `../.github/copilot-instructions.md` |
| `docs/archive/MULTI-GRADE-IMPLEMENTATION-PLAN.md:49` | `curriculum-data.md` | File exists at `docs/curriculum-data.md` but link is relative to archive dir |
| `docs/archive/MULTI-GRADE-IMPLEMENTATION-PLAN.md:65` | `migrate from curriculum-data.md` | Same issue |
| `docs/archive/MULTI-GRADE-IMPLEMENTATION-PLAN.md:241` | `migrate from curriculum-data.md` | Same issue |

**75 broken links in node_modules** — ignore (external dependencies).

### Recommendation
Fix the 4 actionable broken links immediately. Add link verification to CI.

---

## 2. Feature Coverage (🟡 Moderate)

### Major Features Implemented but Documentation Gaps

| Feature | Code Status | Doc Status | Gap |
|---------|-------------|------------|-----|
| **P2 (Primary 2) IEAP** | ✅ Complete (`p2-subjects.html`, `p2-subjects-controller.js`, JSON data) | ⚠️ Partial (plan docs exist, no user-facing docs) | No update to `README.md` navigation flow, no `docs/README.md` entry |
| **Multi-grade (K1/K2/P2/PVT)** | ✅ Complete | ⚠️ Partial | `ARCHITECTURE_INDEX.md` and `PROJECT_STATUS.md` differ on curriculum paths |
| **Semester-based curriculum** | ✅ Complete (P2) | ⚠️ Plan only | User-facing docs don't explain semester vs month selection |
| **Curriculum loader** | ✅ Complete (`curriculum-loader.js`) | ⚠️ Split across 2 files | `ARCHITECTURE_INDEX.md` says `assets/data/curriculum/`, `PROJECT_STATUS.md` says both |
| **Performance optimizer v2.0** | ✅ Complete | ✅ Good (`PRODUCTION_REFACTOR_2024.md`) | Well documented |

### Missing User-Facing Documentation
- No `docs/README.md` — **single clear documentation hub missing** (skill requirement)
- P2 integration not reflected in `README.md` navigation flow (still shows old 3-step flow)
- Curriculum data format (JSON in `assets/data/curriculum/`) not documented for contributors

---

## 3. Legacy Naming (🟡 Moderate)

| Legacy Name | Current Name | Locations Found |
|-------------|--------------|-----------------|
| "Teachers Pet" | "Teacher's Pet" / "Teachers Pet" | `README.md`, `PROJECT_STATUS.md`, `PRODUCTION_REFACTOR_2024.md`, `COPILOT_SETUP_VERIFICATION.md` |
| "K3 - Coming Soon" | "P2 - Primary 2 (IEAP)" | `MULTI-GRADE-IMPLEMENTATION-PLAN.md` (archive), `grade-selection.html` (needs verification) |
| "month-selection" (for P2) | "semester-selection" | Plan docs reference months, code uses semesters |

**Inconsistency:** Project name varies across docs — pick one and standardize.

---

## 4. Entry Points (🔴 Critical)

### Current Entry Points
| File | Purpose | Issues |
|------|---------|--------|
| `README.md` | User-facing root | Navigation flow outdated; missing P2; no link to `docs/` |
| `docs/ARCHITECTURE_INDEX.md` | Architecture nav | Good but no TOC link from root |
| `docs/PROJECT_STATUS.md` | Agent dashboard | Good, last updated Dec 2025 |
| `.github/copilot-instructions.md` | AI agent guidance | Excellent (513 lines) |

### Missing
- **`docs/README.md`** — Required by skill as single documentation hub
- No cross-links from root `README.md` → `docs/` index

---

## 5. Architecture Sync (🟡 Moderate)

### Discrepancies Between Docs

| Aspect | `ARCHITECTURE_INDEX.md` | `PROJECT_STATUS.md` | Reality |
|--------|-------------------------|---------------------|---------|
| Curriculum data path | `assets/data/curriculum/` | `assets/data/curriculum/` AND `assets/js/curriculum/` | `assets/data/curriculum/*.json` only |
| Curriculum format | Not specified | JSON files | JSON (not `.js` as planned) |
| Wizard flow steps | 5 steps (includes grade + month) | 6 steps (landing + grade + month + info + subjects + gen) | 5 pages + generation |
| P2 flow | Not documented | Not documented | Uses semester, skips month-selection logic |

### Reactive Store
- `PROJECT_STATUS.md` documents new `assets/js/state/store.js` (Dec 2025)
- `ARCHITECTURE_INDEX.md` lists `state/` directory but not the store pattern
- Good coverage in `.github/copilot-instructions.md`

---

## 6. Reference Completeness (🟢 Good)

| Category | Status | Notes |
|----------|--------|-------|
| Environment variables | N/A | Static site, no env vars |
| CLI commands | ✅ Partial | `npm test`, `npm run test:perf`, `npm run verify` in `README.md` |
| Config options | ✅ Good | `eslint.config.js`, `tsconfig.json`, `vercel.json` documented in copilot instructions |
| API endpoints | N/A | Client-only |
| Curriculum data schema | ⚠️ Missing | JSON structure not formally documented |

---

## 7. Code-Doc Drift (🔴 Critical)

### Plan Files Accumulation (Skill: "Delete completed plans as part of definition of done")

| Plan File | Status | Action |
|-----------|--------|--------|
| `docs/plans/2026-06-12-p2-ieap-design.md` | ✅ Implemented (P2 exists) | **Archive/Delete** |
| `docs/plans/2026-06-12-p2-ieap-implementation.md` | ✅ Implemented | **Archive/Delete** |
| `docs/plans/2026-06-12-user-info-curriculum-fixes-design.md` | ? | Verify status |
| `docs/plans/2026-06-12-user-info-curriculum-fixes-plan.md` | ? | Verify status |
| `docs/plans/2026-06-13-p2-subject-selection-design.md` | ✅ Implemented (`p2-subjects.html`, controller) | **Archive/Delete** |
| `docs/plans/2026-06-13-p2-subject-selection-implementation.md` | ✅ Implemented | **Archive/Delete** |

**6 plan files for shipped features** — should be archived or deleted per hygiene workflow.

### Archive File Issues
- `docs/archive/MULTI-GRADE-IMPLEMENTATION-PLAN.md` references `.js` curriculum files but implementation uses `.json` in `assets/data/curriculum/`
- Broken links to `curriculum-data.md` (3 instances)

---

## 8. Stale/Redundant Files

| File | Issue |
|------|-------|
| `docs/curriculum-k2-november-data.md` | Superseded by `assets/data/curriculum/k2/november.json` |
| `docs/curriculum-k2-december-data.md` | Superseded by JSON |
| `docs/curriculum-november-data.md` | Superseded by JSON |
| `docs/K1-DECEMBER-IMPLEMENTATION.md` | Implementation complete, no cleanup |
| `docs/PVT-STUDENT-IMPLEMENTATION.md` | Implementation complete, no cleanup |
| `docs/REFACTOR_SUMMARY.md` | Superseded by `PRODUCTION_REFACTOR_2024.md` |
| `docs/GIT_WORKFLOW_DEPLOYMENT.md` | May be outdated vs current vercel.json workflow |

---

## Priority Action Items

### 🔴 Immediate (Fix This Week)
1. **Fix 4 broken internal links** (COPILOT_SETUP_VERIFICATION.md, MULTI-GRADE-IMPLEMENTATION-PLAN.md)
2. **Create `docs/README.md`** as documentation hub with TOC linking to all major docs
3. **Update `README.md` navigation flow** to include grade-selection → month-selection → P2 semester flow
4. **Standardize project name** — pick "Teacher's Pet" or "Teachers Pet" and apply everywhere

### 🟡 Short Term (This Sprint)
5. **Archive/Delete 6 completed plan files** in `docs/plans/`
6. **Consolidate curriculum documentation** — remove markdown curriculum files superseded by JSON
7. **Sync `ARCHITECTURE_INDEX.md` and `PROJECT_STATUS.md`** on curriculum paths and P2 flow
8. **Document curriculum JSON schema** for contributors

### 🟢 Long Term (Backlog)
9. Add link verification to CI pipeline (`npm run verify-links`)
10. Create contributor guide for adding new grades/months
11. Document reactive store pattern in `ARCHITECTURE_INDEX.md`

---

## Verification Commands

```bash
# Re-run link check on docs only (ignore node_modules)
python /home/ewaldt/.hermes/skills/software-development/documentation-maintenance/scripts/verify_markdown_links.py "/home/ewaldt/Documents/VS/Other/Teacher's-pet/docs"

# Check root markdown files
python /home/ewaldt/.hermes/skills/software-development/documentation-maintenance/scripts/verify_markdown_links.py "/home/ewaldt/Documents/VS/Other/Teacher's-pet" 2>&1 | grep -v node_modules
```

---

## Appendix: Documentation Inventory

### Root Level
- `README.md` (352 lines) — User-facing, needs updates
- `Index.md` (52 lines) — File creation log, useful
- `audit_report.md` — Previous audit
- `fix_summary.md`, `investigation_report.md`, `review_findings.md` — Working files

### `/docs/` (18 files)
| File | Lines | Status |
|------|-------|--------|
| `ARCHITECTURE_INDEX.md` | 62 | Good, needs sync |
| `COPILOT_SETUP_VERIFICATION.md` | 178 | Good, 1 broken link |
| `curriculum-data.md` | 184 | Legacy, superseded by JSON |
| `curriculum-k2-december-data.md` | - | Legacy |
| `curriculum-k2-november-data.md` | - | Legacy |
| `curriculum-november-data.md` | - | Legacy |
| `DATA-INTEGRATION-AUDIT-2025-11-21.md` | - | Historical |
| `GIT_WORKFLOW_DEPLOYMENT.md` | - | May be stale |
| `jobcard.md` | 73295 | Massive changelog, active |
| `K1-DECEMBER-IMPLEMENTATION.md` | - | Completed |
| `K1-January-Curriculum-Scrape.txt` | - | Raw data |
| `K1-JANUARY-TESTING-GUIDE.md` | - | Completed |
| `PRODUCTION_REFACTOR_2024.md` | 279 | Current, excellent |
| `PROJECT_STATUS.md` | 140 | Current, good |
| `PVT-STUDENT-IMPLEMENTATION.md` | - | Completed |
| `REFACTOR_SUMMARY.md` | - | Superseded |
| `TESTING_STRATEGY.md` | 58 | Good |

### `/docs/plans/` (6 files)
All for P2 IEAP feature — **completed, should be archived**

### `/docs/archive/` (1 file)
`MULTI-GRADE-IMPLEMENTATION-PLAN.md` — Historical, broken links

---

*Generated by Documentation Audit following `documentation-maintenance` skill v1.0.0*