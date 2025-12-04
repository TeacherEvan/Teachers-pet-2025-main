import globals from "globals";

export default [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        ...globals.browser,
        ...globals.es2021,
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        console: "readonly",
        alert: "readonly",
        TeachersPetApp: "writable",
        CurriculumLoader: "writable",
        PremiumCommentEngine: "writable",
        EnhancedCommentEngine: "writable",
        OptimizedCommentGenerator: "writable",
        SynonymManager: "writable",
        LauncherController: "writable",
        StudentInfoController: "writable",
        SubjectsController: "writable",
        PerformanceOptimizer: "writable",
        UIEnhancer: "writable",
        ErrorBoundary: "writable"
      }
    },
    rules: {
      "no-unused-vars": ["warn", { 
        "varsIgnorePattern": "^(LauncherController|StudentInfoController|SubjectsController|goBack|startOver|refreshReport|toggleSubject|handleSubjectCheck|ensureCommentGeneration|selectComment|copySelectedComment|exportReport)$",
        "argsIgnorePattern": "^(e|err|_|subject)$"
      }]
    },
    files: ["**/*.js"],
    ignores: ["node_modules/**", ".git/**", "eslint.config.js"]
  },
  {
    // Special config for ES modules (scripts directory)
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2021
      }
    },
    rules: {
      "no-unused-vars": "warn"
    },
    files: ["scripts/**/*.js"]
  }
];
