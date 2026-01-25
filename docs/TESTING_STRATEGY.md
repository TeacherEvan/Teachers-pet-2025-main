# Testing Strategy

## Goals

- Ensure comment generation is deterministic and complete for all selected subjects/topics.
- Prevent regressions in data integrity (no fake subjects/topics).
- Validate core utilities, processors, and templates in isolation.
- Keep performance within current Core Web Vitals targets.

## Current Test Types

### Unit Tests (Node)

- tests/unit/ — utilities, processor normalization, template output structure.

### Integration Tests (Node)

- tests/integration/ — end-to-end pipeline using `TeachersPetProcessor` + `TeachersPetTemplates`.

### Browser Tests (HTML)

- tests/test-all-subjects-audit.html
- tests/test-data-integrity.html
- tests/test-student-name.html
- tests/test-topic-only-selection.html
- tests/test-rating-issue.html

### Performance Benchmarks

- tests/perf/engine-benchmark.js

## Coverage Gaps

- UI interactions (Subjects UI keyboard navigation and bulk selection).
- Storage sync edge cases (back/forward flow, reset behavior).
- Synonym loading failures and fallback behavior.
- Curriculum loader error handling for missing JSON.

## Recommended TDD Loop

1. Add/extend a test in unit or integration suite.
2. Implement minimal change to satisfy the test.
3. Refactor for clarity and remove duplication.
4. Re-run tests and validate in browser test pages.

## How To Run

- Unit + Integration: `npm test`
- Unit only: `node tests/run-tests.js --unit`
- Integration only: `node tests/run-tests.js --integration`
- Performance: `npm run test:perf`

## CI/CD Guidance (Static Site)

- Run `npm run verify` on pull requests.
- Run `npm test` on pull requests.
- Optionally run `npm run test:perf` on a nightly schedule (not on every PR).
