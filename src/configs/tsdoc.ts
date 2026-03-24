import tsdocPlugin from 'eslint-plugin-tsdoc';

import type { Config, Plugin } from '../core';

export const tsdocRecommended: Config = {
  name: 'poupe/tsdoc-recommended',
  plugins: {
    tsdoc: tsdocPlugin as unknown as Plugin,
  },
  rules: {
    'tsdoc/syntax': 'error',
  },
};
