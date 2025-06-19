import type {
  Config,
  Rules,
} from '../core/types';

// @ts-expect-error - no types available
import markdownlintPlugin from 'eslint-plugin-markdownlint';
// @ts-expect-error - no types available
import markdownlintParser from 'eslint-plugin-markdownlint/parser.js';

export const markdownlintRecommended: Config = {
  name: 'markdownlint/recommended',
  files: ['**/*.md'],
  plugins: {
    markdownlint: markdownlintPlugin,
  },
  languageOptions: {
    parser: markdownlintParser,
  },
  rules: markdownlintPlugin.configs.recommended.rules,
};

export const poupeMarkdownRules: Rules = {
  // Custom markdown rule overrides can go here
  // For example:
  // 'markdownlint/md013': 'off', // Line length
};
