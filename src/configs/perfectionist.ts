import perfectionist from 'eslint-plugin-perfectionist';

import {
  type Config,
  type Rules,
  withConfig,
} from '../core';

// Perfectionist rules for import/export sorting
export const poupePerfectionistRules: Rules = {
  'perfectionist/sort-imports': [
    'error',
    {
      type: 'natural',
      order: 'asc',
      ignoreCase: true,
      internalPattern: ['^~/.+', '^@/.+', String.raw`^\.\./.+`, String.raw`^\./.+`],
      newlinesBetween: 'always',
      maxLineLength: undefined,
      groups: [
        'type',
        ['builtin', 'external'],
        'internal-type',
        'internal',
        ['parent-type', 'sibling-type', 'index-type'],
        ['parent', 'sibling', 'index'],
        'object',
        'unknown',
      ],
      customGroups: {
        type: {
          react: 'react',
          vue: 'vue',
        },
        value: {
          react: ['react', 'react-*'],
          vue: ['vue', 'vue-*', '@vue/*'],
        },
      },
      environment: 'node',
    },
  ],
  'perfectionist/sort-exports': [
    'error',
    {
      type: 'natural',
      order: 'asc',
      ignoreCase: true,
    },
  ],
  'perfectionist/sort-named-imports': [
    'error',
    {
      type: 'natural',
      order: 'asc',
      ignoreCase: true,
      ignoreAlias: false,
      specialCharacters: 'keep',
      groupKind: 'mixed',
    },
  ],
  'perfectionist/sort-named-exports': [
    'error',
    {
      type: 'natural',
      order: 'asc',
      ignoreCase: true,
      groupKind: 'mixed',
    },
  ],
};

export const perfectionistRecommended: Config[] = withConfig({
  name: 'poupe/perfectionist',
  files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx,vue}'],
  plugins: {
    perfectionist,
  },
  rules: poupePerfectionistRules,
});
