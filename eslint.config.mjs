// @ts-check
import { defineConfig } from './dist/index.mjs';
import globals from 'globals';

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
);
