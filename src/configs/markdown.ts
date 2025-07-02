// @ts-expect-error - no types available
import markdownlintPlugin from 'eslint-plugin-markdownlint';
// @ts-expect-error - no types available
import markdownlintParser from 'eslint-plugin-markdownlint/parser.js';

import type {
  Config,
  Rules,
} from '../core';

export const poupeMarkdownRules: Rules = {
  // Enforce stricter markdown formatting standards
  'markdownlint/md007': ['error', { indent: 2 }], // Unordered list indentation - 2 spaces
  'markdownlint/md013': ['error', { line_length: 80 }], // Line length - 80 chars
  'markdownlint/md041': 'off', // First line in file should be a top level heading - disabled for flexibility
};

export const markdownlintRecommended: Config = {
  name: 'markdownlint/recommended',
  files: ['**/*.md'],
  plugins: {
    markdownlint: markdownlintPlugin,
  },
  languageOptions: {
    parser: markdownlintParser,
  },
  rules: {
    ...markdownlintPlugin.configs.recommended.rules,
    ...poupeMarkdownRules,
  },
};
