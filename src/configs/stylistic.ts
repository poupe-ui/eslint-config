import type {
  Rules,
} from '../core/types';

import stylisticPlugin from '@stylistic/eslint-plugin';

export const stylisticRecommended = stylisticPlugin.configs.recommended;

export const poupeStylisticRules: Rules = {
  '@stylistic/arrow-parens': 'error',
  '@stylistic/brace-style': ['error', '1tbs'],
  '@stylistic/indent': ['error', 2],
  '@stylistic/quotes': ['error', 'single'],
  '@stylistic/semi': ['error', 'always'],
  '@stylistic/member-delimiter-style': ['error', {
    multiline: { delimiter: 'none' },
  }],
};
