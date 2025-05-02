import type { Linter, ESLint } from '../core/types';

import tsdocPlugin from 'eslint-plugin-tsdoc';

export const tsdocRecommended: Linter.Config = {
  name: 'poupe/tsdoc-recommended',
  plugins: {
    tsdoc: tsdocPlugin as unknown as ESLint.Plugin,
  },
  rules: {
    'tsdoc/syntax': 'error',
  },
};
