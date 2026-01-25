# Architecture & Navigation Index

## Purpose

This index explains how the codebase is organized, highlights the canonical modules, and provides fast navigation for contributors.

## Core Directories

### assets/js/

- controllers/ — wizard flow and session orchestration (app state entrypoints).
- engine/ — modular comment generation pipeline (core + processor + templates + utils).
- state/ — persistent store and state helpers (source of truth for UI + storage sync).
- ui/ — UI-specific behavior (Subjects UI, interactions, render helpers).
- utils/ — shared utilities (performance, UI enhancements, error boundary).
- data/ — engine data modules used by the comment engine.

### assets/data/

- curriculum/ — curriculum JSON datasets by grade/month.
- synonyms.json — synonym database used by `SynonymManager`.

### docs/

- PROJECT_STATUS.md — architecture overview and current status.
- jobcard.md — chronological change log.
- TESTING_STRATEGY.md — test coverage, gaps, and execution.

### tests/

- unit/ — Node-based unit tests for core, processor, templates, and utils.
- integration/ — Node-based integration tests across engine pipeline.
- perf/ — targeted performance benchmarks (not part of CI by default).

## Canonical Sources

- Comment engine (modular): assets/js/engine/core.js
- Engine data: assets/js/data/engine-data.js
- Curriculum loader: assets/js/curriculum/curriculum-loader.js

## Legacy Compatibility Shims

The following files exist for backward compatibility with classic scripts:

- enhanced-comment-engine.js (root)
- assets/js/enhanced-comment-engine.js

These are thin shims that dynamically load the modular engine. Prefer importing assets/js/engine/core.js directly.

## Naming Conventions

- Files: kebab-case for HTML/CSS/JS (e.g., enhanced-comment-engine.js)
- Modules: PascalCase for classes (e.g., `EnhancedCommentEngine`)
- Functions: camelCase (e.g., `generateComments()`)
- Constants: UPPER_SNAKE_CASE

## Quick Navigation

- Wizard flow: index.html → grade-selection.html → month-selection.html → student-information.html → Subjects.html
- Comment engine entry: optimized-comment-generator.js
- Subjects UI: assets/js/ui/subjects-ui.js
- Curriculum data: assets/data/curriculum/
