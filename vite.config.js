import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'assets',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        index: 'index.html',
        'grade-selection': 'grade-selection.html',
        'month-selection': 'month-selection.html',
        'student-information': 'student-information.html',
        Subjects: 'Subjects.html',
        'p2-subjects': 'p2-subjects.html',
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  plugins: [],
});