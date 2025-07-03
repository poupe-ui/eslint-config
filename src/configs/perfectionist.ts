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
      newlinesBetween: 'ignore',
      maxLineLength: undefined,
      partitionByNewLine: true,
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
      partitionByNewLine: true,
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
  'perfectionist/sort-union-types': [
    'error',
    {
      type: 'natural',
      order: 'asc',
      ignoreCase: true,
      specialCharacters: 'keep',
      partitionByComment: true,
      partitionByNewLine: false,
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
