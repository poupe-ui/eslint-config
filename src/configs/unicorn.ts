import type {
  Rules,
} from '../core/types';

import unicornPlugin from 'eslint-plugin-unicorn';

const { configs: unicornConfigs } = unicornPlugin;

export const unicornRecommended = unicornConfigs.recommended;

// unicorn/prevent-abbreviations
const abbreviations = [
  'attr',
  'attrs',
  'env',
  'err',
  'fn',
  'i',
  'msg',
  'opt',
  'opts',
  'pkg',
  'param',
  'params',
  'prop',
  'props',
  'utils',
  'vars',
] as const;

const omitReplacementList = new Set(['i']);

const allowList = Object.fromEntries(
  abbreviations.map(s => [s, true]),
);

const replacements = Object.fromEntries(
  abbreviations.filter(s => !(omitReplacementList.has(s))).map(s => [s, false]),
);

// Poupe Rules
export const poupeUnicornRules: Rules = {
  'unicorn/filename-case': [
    'error',
    {
      case: 'kebabCase',
      ignore: [
        // Allow all-caps .md files with - and _ delimiters
        // (README.md, AGENT.md, PLAN.md, CODE_OF_CONDUCT.md, etc.)
        String.raw`^[A-Z][A-Z\-_]*\.md$`,
      ],
    },
  ],
  'unicorn/no-array-for-each': 'error',
  'unicorn/no-named-default': 'off',
  'unicorn/no-useless-undefined': 'off',
  'unicorn/prevent-abbreviations': [
    'error',
    {
      allowList,
      replacements,
    },
  ],
  'unicorn/switch-case-braces': 'off',
};
