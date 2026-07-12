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
  optimizeDeps: {
    include: [
      'engine/core.js',
      'engine/processor.js',
      'engine/templates.js',
      'engine/utils.js',
      'data/engine-data.js',
      'synonym-manager.js',
      'utils/debug.js',
    ],
  },
  plugins: [],
});