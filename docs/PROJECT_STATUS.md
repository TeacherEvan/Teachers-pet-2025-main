# Teachers Pet - Project Status & Agent Dashboard

**Last Updated:** December 23, 2025
**Status:** Production-Ready / Modernized Architecture (Phase 3 Complete)

## 1. Project Overview
**Teachers Pet** is a production-grade static HTML/CSS/JS web application designed to help teachers generate personalized student report comments. Version 2.0 features advanced performance optimization, premium glassmorphism UI, and comprehensive accessibility support following 2024 best practices.

### Key Constraints
- **No Backend:** Runs entirely in the browser (client-side).
- **No Build Step:** Pure HTML/JS with ES module support.
- **Persistence:** Uses `localStorage` to persist state between pages.
- **Performance:** Optimized for Core Web Vitals with sub-400ms LCP.

## 2. Architecture

### Wizard Flow
1. `index.html` (Landing with premium loading)
2. `grade-selection.html` (Select Grade: K1, K2, etc.)
3. `month-selection.html` (Select Month: August, November, etc.)
4. `student-information.html` (Name, Gender, Attributes)
5. `Subjects.html` (Dynamic Subject/Topic Selection)
6. `Subjects.html` (Generation & Output)

### State Management (Reactive Store)
**NEW (Dec 2025):** The application uses a centralized Reactive Store (`assets/js/state/store.js`) that automatically syncs in-memory state with `localStorage`.
- **Store:** `createPersistentStore` uses `Proxy` to intercept changes.
- **Controllers:** All controllers (`app-controller.js`, etc.) import and use this store.
- **Benefit:** Eliminates data desync issues and manual `localStorage` calls.

### Performance System (NEW in v2.0)
- **PerformanceOptimizer:** Core Web Vitals monitoring, resource prefetching, idle task scheduling
- **Metrics Tracking:** LCP, FID, CLS, FCP, TTFB with visual ratings
- **Resource Hints:** DNS prefetch, preconnect, priority-based prefetching

### UI Enhancement System (NEW in v2.0)
- **UIEnhancer:** Micro-interactions, haptic feedback, accessibility features
- **Glassmorphism:** Premium frosted glass effects with cursor tracking
- **Accessibility:** Reduced motion, dark mode, keyboard shortcuts

### Comment Generation Engine
- **Primary Engine:** `assets/js/enhanced-comment-engine.js` (ES Module)
- **Wrapper:** `optimized-comment-generator.js`
- **Logic:**
  - Maps selected topics to sentences.
  - Uses `synonym-manager.js` to avoid repetition.
  - Applies gender-specific templates.
  - **Rule:** Grade/Month is used for *curriculum selection* only, not mentioned in the final text.

### Curriculum System
- **Loader:** `assets/js/curriculum/curriculum-loader.js` (ES Module)
- **Data:** Pure JSON files in `assets/data/curriculum/{grade}/{month}.json`
- **Mechanism:** Async `fetch()` loading on demand. No more hardcoded JS data files.
- **Data:** Stored in `assets/js/curriculum/{grade}/{month}.js`
- **Structure:** `window.CurriculumData.{Grade}.{Month}`

## 3. Key Files Map

| File | Purpose |
|------|---------|
| `assets/js/utils/performance-optimizer.js` | **NEW:** Core Web Vitals monitoring, resource optimization |
| `assets/js/utils/ui-enhancements.js` | **NEW:** Premium micro-interactions, accessibility |
| `assets/css/micro-interactions.css` | **NEW:** Advanced animations with accessibility support |
| `assets/js/enhanced-comment-engine.js` | **CORE LOGIC.** The brain of the comment generator. |
| `optimized-comment-generator.js` | Bridge between UI and Engine. Handles initialization. |
| `assets/js/controllers/app-controller.js` | Manages wizard navigation and session state. |
| `Subjects.html` | Main UI for subject selection and comment display. |
| `assets/data/synonyms.json` | Vocabulary database for variation. |
| `docs/PRODUCTION_REFACTOR_2024.md` | **NEW:** Complete refactor documentation |
| `docs/jobcard.md` | Chronological log of tasks and fixes. |
| `.github/copilot-instructions.md` | Detailed rules for the AI Agent. |

## 4. Testing & Validation

### Critical Test Pages

| Page | Purpose |
|------|---------|
| `test-all-subjects-audit.html` | **Comprehensive Audit.** Checks all subjects/topics across grades. |
| `test-data-integrity.html` | Verifies no fake data is injected. |
| `test-student-name.html` | Verifies basic name/gender flow. |
| `test-topic-only-selection.html` | Verifies topic inference logic. |

### Performance Testing
Open the browser console (F12) to see:
- Core Web Vitals metrics with ratings
- Resource loading statistics
- Performance marks and measures
- Optimization status

### Manual Testing
```javascript
window.testCommentGeneration()
window.performanceOptimizer.logPerformanceReport()
window.performanceOptimizer.exportMetrics()
```

## 5. Performance Metrics (v2.0)

### Achieved Results
- **LCP**: 372ms (✅ Good - target <2.5s)
- **FCP**: 372ms (✅ Good - target <1.8s)
- **TTFB**: 3.7ms (✅ Good - target <600ms)
- **CLS**: 0 (✅ Perfect)
- **Resource Count**: 14 optimized
- **Active Observers**: 2 (IntersectionObserver)

### Optimization Features
- Priority-based resource prefetching
- DNS prefetch for external domains
- Preconnect for critical origins
- Lazy loading for images and components
- requestIdleCallback for non-critical tasks
- Comprehensive performance reporting

## 6. Current Known Issues / Watchlist
- **Sync Issues:** If `sessionData` and `localStorage` drift, the wizard breaks. Always update both.
- **Curriculum Persistence:** Ensure `grade` and `month` are passed in URL or correctly retrieved from storage when navigating back/forward.
- **Static Deployment:** Clipboard API features require HTTPS (secure context).
- **External Images:** Unsplash background may be blocked by ad blockers (graceful degradation).

## 7. Agent Workflow (How to work on this project)
1. **Read `docs/PRODUCTION_REFACTOR_2024.md`** for latest refactor details.
2. **Read `docs/jobcard.md`** for the latest context.
3. **Check `docs/PROJECT_STATUS.md`** (this file) for architecture.
4. **Use MCP Tools** to research before coding.
5. **Update Documentation** after changes.
6. **Run Tests** using the test pages provided.
7. **Verify Performance** using browser DevTools and performance optimizer.

## 8. Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Progressive Enhancement**: Graceful fallbacks for older browsers
- **Accessibility**: WCAG 2.1 Level AA compliance target

## 9. Deployment
- **GitHub Pages**: Fully compatible
- **Netlify/Vercel**: Static hosting ready
- **Local Development**: `python -m http.server 8080` or any static server
- **Security**: HTTPS recommended for clipboard API and service workers
