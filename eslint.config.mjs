import globals from 'globals';

// @ts-check
import { defineConfig } from './dist/index.mjs';

export default defineConfig(
  {
    ignores: [
      'examples/**',
    ],
  },
  {
    files: ['test/**/*.mjs'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['CHANGELOG.md'],
    rules: {
      'markdownlint/md024': ['error', { siblings_only: true }], // Allow duplicate headings across sections
    },
  },
);
