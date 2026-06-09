// @ts-check
import { defineConfig } from './dist/index.mjs';

export default defineConfig(
  {
    ignores: [
      '.claude/**/memory',
      'examples/**',
    ],
  },
  {
    files: ['CHANGELOG.md'],
    rules: {
      'markdownlint/md024': ['error', { siblings_only: true }], // Allow duplicate headings across sections
    },
  },
);
