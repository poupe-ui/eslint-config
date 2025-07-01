import type { Config, ESLint } from '../core';

import tsdocPlugin from 'eslint-plugin-tsdoc';

export const tsdocRecommended: Config = {
  name: 'poupe/tsdoc-recommended',
  plugins: {
    tsdoc: tsdocPlugin as unknown as ESLint.Plugin,
  },
  rules: {
    'tsdoc/syntax': 'error',
  },
};
