import unicornPlugin from 'eslint-plugin-unicorn';

import {
  type Config,
  type Rules,

  GLOB_SRC,
  GLOB_VUE,
} from '../core';

const { configs: unicornConfigs } = unicornPlugin;

export const unicornRecommended: Config = unicornConfigs.recommended;

/** Bare unicorn plugin setup (just the plugin, no rules) */
export const unicornSetupConfig: Config = {
  name: 'poupe/unicorn-setup',
  plugins: {
    unicorn: unicornPlugin,
  },
};

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
const poupeUnicornFilenameRules: Rules = {
  'unicorn/filename-case': [
    'error',
    {
      case: 'kebabCase',
      ignore: [
        // Allow all-caps .md files with numbers, - and _ delimiters
        // (README.md, AGENT.md, PLAN.md, CODE_OF_CONDUCT.md, MD5.md, etc.)
        String.raw`^[A-Z][A-Z0-9\-_]*\.md$`,
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

export const poupeUnicornConfigs: Config[] = [
  {
    name: 'poupe/unicorn-filename',
    rules: poupeUnicornFilenameRules,
  }, {
    name: 'poupe/unicorn',
    files: [GLOB_SRC, GLOB_VUE],
    rules: poupeUnicornRules,
  },
];
