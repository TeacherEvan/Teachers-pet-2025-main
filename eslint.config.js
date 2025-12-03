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
        SubjectsController: "writable"
      }
    },
    rules: {
      "no-unused-vars": "warn"
    },
    files: ["**/*.js"],
    ignores: ["node_modules/**", ".git/**"]
  }
];
