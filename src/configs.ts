import { Linter } from 'eslint';

import type {
  Config,
  Rules,
} from './core';

import jsPlugin from '@eslint/js';
import stylisticPlugin from '@stylistic/eslint-plugin';
import tsdocPlugin from 'eslint-plugin-tsdoc';
import unicornPlugin from 'eslint-plugin-unicorn';
import vuePlugin from 'eslint-plugin-vue';

export const { configs: eslintConfigs } = jsPlugin;
export const { configs: stylisticConfigs } = stylisticPlugin;
export const { configs: unicornConfigs } = unicornPlugin;
export const { configs: vueConfigs } = vuePlugin;

const tsdocRecommended: Linter.Config = {
  name: 'poupe/tsdoc-recommended',
  plugins: {
    tsdoc: tsdocPlugin,
  },
  rules: {
    'tsdoc/syntax': 'error',
  },
};

export const tsdocConfigs = {
  recommended: tsdocRecommended,
};

export { configs as tseslintConfigs } from 'typescript-eslint';

// poupeConfigs
export const files = [
  '**/*.{js,mjs,cjs}',
  '**/*.ts',
  '**/*.vue',
];

import { allowList, replacements } from './abbrev';

export const rules: Rules = {
  '@stylistic/arrow-parens': 'error',
  '@stylistic/brace-style': ['error', '1tbs'],
  '@stylistic/indent': ['error', 2],
  '@stylistic/quotes': ['error', 'single'],
  '@stylistic/semi': ['error', 'always'],
  '@stylistic/member-delimiter-style': ['error', {
    multiline: { delimiter: 'none' },
  }],
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
  'vue/multi-word-component-names': 'off',
};

export const poupeConfigs: Config[] = [
  {
    name: 'poupe/vue-ts',
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['vue'],
        sourceType: 'module',
      },
    },
  },
  {
    name: 'poupe/files',
    files,
  },
  {
    name: 'poupe/rules',
    rules: rules,
  },
];
