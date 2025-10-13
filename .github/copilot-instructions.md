# Teachers Pet - AI Agent Instructions

## Project Overview
A **static web application** (no backend/server) for kindergarten teachers to generate AI-powered student report comments. Pure HTML/CSS/JS running directly from filesystem with localStorage for persistence.

## Critical Development Rules (READ FIRST)
From `RULES.mdc` - **VIOLATION LOGS EXIST**:
- **NEVER implement features before clarifying requirements** - Ask first, code second
- **NEVER assume user wants immediate implementation** - Get explicit confirmation
- **NO feature enhancements without approval** - If improving, REPLACE don't add parallel features
- **NEVER pretend to read files you can't access** - State limitations immediately
- **Log all work in `jobcard.md`** - New entries at top (newest first), track work/notes/suggestions
- **Log new files in `Index.md`** - Columns: date, agent, file, status (active/deleted)

## Architecture & Data Flow

### Application Flow (3-Page Wizard)
```
index.html (launcher) → student-information.html → Subjects.html (generates comments)
```

### State Management
- **In-memory first**: `TeachersPetApp.sessionData` object holds active session
- **LocalStorage fallback**: Used for cross-page persistence only
- **SessionStorage backup**: Fallback when localStorage fails
- **No backend/database**: Everything runs client-side

### Core Classes
- **`TeachersPetApp`** (`assets/js/app.js`): Page-specific initialization, form handling, navigation
  - `getCurrentPage()` determines context (launcher/student-info/subjects)
  - `sessionData` object: `{studentName, gender, overallRating, strengths, weaknesses, subjects[], topicRatings{}}`
  
- **`PremiumCommentEngine`** (`assets/js/comment-engine.js`): AI comment generation
  - Dual teacher personas: `male` (formal/structured) vs `female` (warm/nurturing)
  - Performance mapping: 1-10 ratings → descriptive language levels
  - Grammar rules: Pronoun conjugation system (he/she/they)
  - Template-based generation with natural language joining

## Comment Generation System

### Key Algorithm Details
- **Target**: Exactly 100-word comments
- **Input Integration**: Name, gender, strengths, weaknesses, overall rating (1-10), subjects, topic ratings
- **Dual Output**: Generates both male and female teacher style simultaneously
- **Structure**: Opening → Strengths → Subjects → Topics → Weaknesses → Behavior → Social → Conclusion
- **Grammar**: Dynamic pronoun substitution with proper conjugation (see `grammarRules.pronouns`)

### Critical Rules (from `RULES.mdc`)
- AI comments **MUST start with student's name**
- AI comments **MUST end with positive/encouraging note**
- **SHOULD incorporate specific subject performance data**

### Performance Map Example
```javascript
10: "exceptional", "outstanding mastery", "exemplary engagement"
5: "satisfactory", "appropriate developmental progress", "willing participation"
1: "emerging", "initial learning exploration", "benefits from guidance"
```

## Design System

### Glassmorphism Theme
- **Background**: Space/Milky Way theme with animated star field (`body::before` twinkle animation)
- **Container Transparency**: 30% transparent (`rgba(255, 255, 255, 0.3)`)
- **Text**: White with shadows for contrast against space background
- **CSS Variables**: See `:root` in `assets/css/main.css` for complete design tokens
- **Cross-browser**: Vendor prefixes (`-webkit-backdrop-filter`) for Safari compatibility

### Animation System
- Loading screen fade transitions (`fade-out`, `fade-in` classes)
- Particle floating effects (`.particles-container`)
- Slider interactions (only on overall rating - topic sliders removed)
- Collapsible dropdowns (subject-based topic organization)

## File Organization

### Entry Points
- **`index.html`**: Launcher with "Start New Report" and "Fresh Start" cards
- **`student-information.html`**: Student data input form (name, gender, rating, strengths/weaknesses)
- **`Subjects.html`**: Subject/topic selection + comment generation button
  - **Current subjects** (as of Oct 2025): English, Mathematics, I.Q, Social Studies, Science, Cooking, Conversation 1, Conversation 2, Arts, Physical Education, Puppet Show, Super Safari, Story Time
  - **Removed subjects**: Phonics (merged into English), Conversation 3 (replaced by Conversation 2)

### Assets
- `assets/css/main.css`: Core design system, variables, glassmorphism
- `assets/css/components.css`: Reusable UI components
- `assets/js/app.js`: Application controller, form validation, navigation
- `assets/js/comment-engine.js`: Comment generation engine
  - Update `subjectCapitalization` object when adding new subjects

### Reference Documents
- `curriculum-data.md`: Current kindergarten curriculum with all marking points (Oct 2025)
- `curriculum-update-plan.md`: Implementation plan for curriculum changes

### Debug/Test Files
- `test-*.html`: Testing harnesses (localStorage, comments, etc.)
- `debug-*.html`: Debugging tools
- `*-monitor.js`: Development utilities

## Common Workflows

### Adding New Features
1. **Get user approval** (check RULES.mdc violations)
2. Update `jobcard.md` with plan at top
3. If new file, log in `Index.md`
4. Implement and test in multiple browsers
5. Document changes in jobcard.md

### Debugging Comment Generation
- Check `Subjects.html` line ~797 region (past syntax error location)
- Verify `PremiumCommentEngine` instantiation
- Inspect `sessionData` object in console
- Test with `test-fixed-comments.html` for isolated testing

### Fixing UI Issues
- Maintain 30% transparency on all `.container` elements
- Ensure white text with shadows on space backgrounds
- Test star animation performance (`twinkle` keyframes)
- Verify glassmorphism works in Safari (`-webkit-backdrop-filter`)

### Storage Debugging
Use `localstorage-monitor.js` or check:
```javascript
localStorage.getItem('studentData')
sessionStorage.getItem('studentData')
```

## Browser Compatibility
- **Target**: Chrome, Edge, Firefox, Safari, Opera, IE9+
- **Strategy**: Progressive enhancement with vendor prefixes
- **Fallbacks**: Included for Clipboard API, backdrop-filter, etc.
- **Testing**: Multi-browser validation required for UI changes

## Deployment
- **Primary**: Direct filesystem access (double-click HTML files)
- **Sharing**: GitHub Pages, Netlify, Vercel
- **⚠️ AVOID**: localhost:3000 (documented in README as problematic)
- **Local server**: Use Python `http.server` or VS Code Live Server on port 8080

## Project History Insights
- **October 13, 2025**: Major curriculum update - replaced old subjects with current kindergarten standards
  - **Removed**: Phonics (merged into English), Conversation 3
  - **Added**: Cooking, Conversation 2, Puppet Show, Super Safari (19 activities), Story Time
  - **Updated**: All subject topics aligned to new marking points from curriculum screenshot
- **July 2, 2025**: Fixed critical bug - extra `}` on line 797 broke generateComments()
- **June 27, 2025**: UI consistency fixes, collapsible dropdown system
- **Key Fix**: Topics now hidden by default, only show when parent subject checked
- **Optimization**: Removed all topic rating sliders except student overall rating

## Conventions
- **No localStorage dependencies in core logic** - use in-memory `sessionData` first
- **Gender-neutral support**: Includes "they" pronouns with proper conjugation
- **Word count targeting**: Algorithm optimized for ~100 words (check `generateStyleComment()`)
- **Template randomization**: Uses `Math.random()` to select from template arrays
- **Natural language joining**: Custom `naturalJoin()` with Oxford comma support
