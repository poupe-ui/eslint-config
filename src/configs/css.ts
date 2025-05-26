import css from '@eslint/css';
import { tailwindSyntax } from '@eslint/css/syntax';

import type {
  Config,
} from '../core/types';

const { configs: cssConfigs } = css;

export const cssRecommended: Config = {
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
