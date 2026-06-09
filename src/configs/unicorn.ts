import unicornPlugin from 'eslint-plugin-unicorn';

import {
  type Config,
  type Rules,

  GLOB_SRC,
  GLOB_VUE,
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
  abbreviations.map((s) => [s, true]),
);

const replacements = Object.fromEntries(
  abbreviations.filter((s) => !(omitReplacementList.has(s))).map((s) => [s, false]),
);

// Poupe Rules
const poupeUnicornFilenameRules: Rules = {
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
};

const poupeUnicornRules: Rules = {
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

// Source and Vue files share the prevent-abbreviations scope; extension
// primitives reuse this so their blocks stay aligned with the preset.
const poupeUnicornFiles = [GLOB_SRC, GLOB_VUE];

export const poupeUnicornConfigs: Config[] = [
  {
    name: 'poupe/unicorn-filename',
    rules: poupeUnicornFilenameRules,
  }, {
    name: 'poupe/unicorn',
    files: poupeUnicornFiles,
    rules: poupeUnicornRules,
  },
];

/**
 * Extends `unicorn/prevent-abbreviations` with additional allowed tokens.
 *
 * Each token is whitelisted (`allowList`) and has any upstream substring
 * replacement neutralised (`replacements`), then merged over Poupe's base
 * options. ESLint replaces a rule's options wholesale rather than merging
 * them, so the returned block re-declares the rule with the *complete*
 * combined configuration — Poupe's defaults plus the new tokens.
 *
 * Append it after the preset (e.g. as a `defineConfig` user config) to
 * allow project-specific proper-noun identifiers (`Doc`, `Dir`, …) whose
 * substrings collide with the upstream abbreviation map, without losing
 * Poupe's own allowances.
 *
 * @param tokens - Identifiers to allow (e.g. `['doc', 'docs', 'dir']`)
 * @returns A config block re-emitting `unicorn/prevent-abbreviations`
 */
export function withAbbreviations(tokens: readonly string[]): Config {
  const allowed = Object.fromEntries(tokens.map((s) => [s, true]));
  const neutralised = Object.fromEntries(tokens.map((s) => [s, false]));

  return {
    name: 'poupe/unicorn-abbreviations',
    files: poupeUnicornFiles,
    rules: {
      'unicorn/prevent-abbreviations': [
        'error',
        {
          allowList: { ...allowList, ...allowed },
          replacements: { ...replacements, ...neutralised },
        },
      ],
    },
  };
}
