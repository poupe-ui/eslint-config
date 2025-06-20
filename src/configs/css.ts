import css from '@eslint/css';
import { tailwindSyntax } from '@eslint/css/syntax';

import type {
  Linter,
} from '../core/types';

const { configs: cssConfigs } = css;

export const cssRecommended: Linter.Config = {
  name: 'poupe/css',
  files: ['**/*.css'],
  plugins: {
    css,
  },
  language: 'css/css',
  languageOptions: {
    parserOptions: {
      customSyntax: tailwindSyntax,
    },
  },
  rules: {
    ...cssConfigs.recommended.rules,
  },
};
