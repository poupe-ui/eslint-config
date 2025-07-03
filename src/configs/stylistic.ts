import stylisticPlugin from '@stylistic/eslint-plugin';

import {
  type Config,
  type Rules,

  GLOB_SRC,
  GLOB_VUE,
} from '../core';

export const stylisticRecommended = stylisticPlugin.configs.recommended;

const poupeStylisticRules: Rules = {
  '@stylistic/arrow-parens': 'error',
  '@stylistic/brace-style': ['error', '1tbs'],
  '@stylistic/indent': ['error', 2],
  '@stylistic/quotes': ['error', 'single'],
  '@stylistic/semi': ['error', 'always'],
  '@stylistic/member-delimiter-style': ['error', {
    multiline: { delimiter: 'none' },
  }],
  '@stylistic/operator-linebreak': ['error', 'after', {
    overrides: {},
  }],
};

export const poupeStylisticConfig: Config = {
  name: 'poupe/stylistic',
  files: [GLOB_SRC, GLOB_VUE],
  rules: poupeStylisticRules,
};
