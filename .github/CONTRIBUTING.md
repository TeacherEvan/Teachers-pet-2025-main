# Contributing to Teachers Pet

Thank you for your interest in contributing to Teachers Pet! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### First Time Contributors

**Important:** You'll need to [fork this repository](https://github.com/TeacherEvan/Teachers-pet-2025-main/fork) before making changes. This creates your own copy where you can work freely.

1. **Read the Documentation**
   - Start with `.github/copilot-instructions.md` for technical overview
   - Review `docs/PROJECT_STATUS.md` for architecture details
   - Check `docs/jobcard.md` for recent changes

2. **Set Up Your Environment**
   ```bash
   # Fork the repository on GitHub, then clone YOUR fork
   git clone https://github.com/YOUR-USERNAME/Teachers-pet-2025-main.git
   cd Teachers-pet-2025-main
   
   # Add upstream remote to track original repository
   git remote add upstream https://github.com/TeacherEvan/Teachers-pet-2025-main.git
   
   # Install dependencies (for linting)
   npm install
   
   # Run locally
   python -m http.server 8080
   # or
   npx http-server -p 8080
   ```

3. **Test Your Setup**
   - Open `http://localhost:8080/index.html`
   - Complete the wizard flow
   - Check browser console for errors

## 📝 Making Changes

### Before You Start
- Check existing issues and PRs to avoid duplicates
- For major changes, open an issue first to discuss
- Read the coding standards in `.github/copilot-instructions.md`

### Development Workflow
1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make Your Changes**
   - Follow the coding standards (see below)
   - Keep changes focused and minimal
   - Test thoroughly using test pages

3. **Test Your Changes**
   - Run the full wizard flow
   - Test with relevant `test-*.html` pages
   - Run linting: `npm run lint`
   - Check browser console for errors

4. **Update Documentation**
   - Add entry to `docs/jobcard.md` (newest first)
   - Update `docs/PROJECT_STATUS.md` if architecture changes
   - Update relevant curriculum docs if adding subjects/topics

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Brief description of changes"
   ```

6. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   - Create a pull request on GitHub
   - Describe what you changed and why
   - Reference any related issues

## 🎨 Coding Standards

### JavaScript
- Use ES6+ features (const/let, arrow functions, template literals)
- Avoid global variables - use modules or namespaces
- Cache DOM queries before loops
- Debounce frequent event handlers (150ms)
- Use batch operations for localStorage

### File Organization
- Core logic: `/assets/js/`
- Styles: `/assets/css/`
- Data: `/assets/data/`
- Tests: Root directory (`test-*.html`)
- Documentation: `/docs/`

### Naming Conventions
- **Functions:** `camelCase` (e.g., `generateComment`)
- **Classes:** `PascalCase` (e.g., `EnhancedCommentEngine`)
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `MAX_ATTEMPTS`)
- **Files:** `kebab-case.js` (e.g., `enhanced-comment-engine.js`)

### Comments
- Use JSDoc for public functions
- Explain "why" not "what"
- Add warnings for critical constraints
- Document magic numbers

## 🧪 Testing

### Required Tests
Before submitting a PR, test with:
- Full wizard flow (start from `index.html`)
- Relevant `test-*.html` pages
- Browser console (check for errors/warnings)
- Multiple browsers if possible

### Test Pages
- `test-all-subjects-audit.html` - Comprehensive subject testing
- `test-data-integrity.html` - Data validation
- `test-student-name.html` - Name/gender flow
- `test-topic-only-selection.html` - Topic inference

### Console Testing
```javascript
// Test comment generation
window.testCommentGeneration()

// Check performance
window.performanceOptimizer.logPerformanceReport()

// Inspect state
console.log(TeachersPetApp.sessionData)
console.log(localStorage.studentData)
```

## 🐛 Reporting Bugs

When reporting bugs, include:
1. **Description:** Clear description of the issue
2. **Steps to Reproduce:** Detailed steps to recreate the bug
3. **Expected Behavior:** What should happen
4. **Actual Behavior:** What actually happens
5. **Browser/OS:** Your browser and operating system
6. **Console Errors:** Any errors from browser console
7. **Screenshots:** If applicable

## 💡 Suggesting Enhancements

When suggesting enhancements:
1. **Use Case:** Describe the problem you're trying to solve
2. **Proposed Solution:** Your suggested approach
3. **Alternatives:** Other approaches you considered
4. **Compatibility:** How it fits with existing features

## 📋 Checklist Before Submitting PR

- [ ] Code follows project coding standards
- [ ] All tests pass (wizard flow + relevant test pages)
- [ ] Linting passes (`npm run lint`)
- [ ] Documentation updated (`jobcard.md`, relevant docs)
- [ ] Browser console shows no new errors
- [ ] Changes are minimal and focused
- [ ] Commit messages are clear and descriptive

## ⚠️ Important Notes

### State Management
- Always update BOTH `TeachersPetApp.sessionData` AND `localStorage.studentData`
- Never inject fake data - only use teacher's actual selections
- Keep storage layers in sync

### File Sync
After editing `assets/js/enhanced-comment-engine.js`, sync root copy:
```powershell
Copy-Item "assets/js/enhanced-comment-engine.js" "enhanced-comment-engine.js" -Force
```

### Keyword Mapping
Keep these in sync:
- `subjectTopicMap` in `enhanced-comment-engine.js`
- `topicToSubjectMap` in `missing-functions.js`

## 🎯 Project Constraints

Remember:
- **No backend** - client-side only
- **No build tools** - pure HTML/CSS/JS
- **No external APIs** - self-contained
- **Static deployment** - GitHub Pages, Netlify, Vercel

## 📚 Resources

- [Project Status](../docs/PROJECT_STATUS.md) - Architecture overview
- [Job Card](../docs/jobcard.md) - Recent changes
- [Copilot Instructions](copilot-instructions.md) - Detailed technical guide
- [README](../README.md) - User documentation

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## 📞 Questions?

- Check documentation first
- Review existing issues and PRs
- Open a new issue if needed
- Be specific and provide context

---

Thank you for contributing to Teachers Pet! 🎓✨
