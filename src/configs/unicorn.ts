import unicornPlugin from 'eslint-plugin-unicorn';

import type {
  Config,
  Rules,
} from '../core';

const { configs: unicornConfigs } = unicornPlugin;

export const unicornRecommended: Config = unicornConfigs.recommended;

// unicorn/prevent-abbreviations
const abbreviations = [
  'attr',
  'attrs',
  'env',
  'err',
  'fn',
  'i',
  'j',
  'k',
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

const omitReplacementList = new Set(['i', 'j', 'k']);

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
        // Allow all-caps .md and .txt files with numbers, - and _ delimiters
        // (README.md, AGENTS.md, LICENCE.txt, CODE_OF_CONDUCT.md, etc.)
        String.raw`^[A-Z][A-Z0-9\-_]*\.(md|txt)$`,
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
