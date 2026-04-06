import perfectionist from 'eslint-plugin-perfectionist';

import {
  type Config,
  type Rules,

  GLOB_SRC,
  GLOB_VUE,
} from '../core';

const poupePerfectionistRules: Rules = {
  'perfectionist/sort-imports': [
    'error',
    {
      type: 'natural',
      order: 'asc',
      ignoreCase: true,
      internalPattern: ['^~/.+', '^@/.+', String.raw`^\.\./.+`, String.raw`^\./.+`],
      newlinesBetween: 'ignore',
      newlinesInside: 'newlinesBetween',
      maxLineLength: undefined,
      partitionByNewLine: true,
      groups: [
        'type-import',
        ['value-builtin', 'value-external'],
        'type-internal',
        'value-internal',
        ['type-parent', 'type-sibling', 'type-index'],
        ['value-parent', 'value-sibling', 'value-index'],
        'ts-equals-import',
        'unknown',
      ],
      environment: 'node',
    },
  ],
  'perfectionist/sort-exports': [
    'error',
    {
      type: 'natural',
      order: 'asc',
      ignoreCase: true,
      partitionByNewLine: true,
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
      partitionByNewLine: true,
    },
  ],
  'perfectionist/sort-named-exports': [
    'error',
    {
      type: 'natural',
      order: 'asc',
      ignoreCase: true,
      partitionByNewLine: true,
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

export const poupePerfectionistConfigs: Config[] = [{
  name: 'poupe/perfectionist',
  files: [GLOB_SRC, GLOB_VUE],
  plugins: {
    perfectionist,
  },
  rules: poupePerfectionistRules,
}];
