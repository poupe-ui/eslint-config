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

export const rules: Rules = {
  '@stylistic/arrow-parens': 'error',
  '@stylistic/brace-style': ['error', '1tbs'],
  '@stylistic/indent': ['error', 2],
  '@stylistic/quotes': ['error', 'single'],
  '@stylistic/semi': ['error', 'always'],
  'unicorn/no-array-for-each': 'error',
  'unicorn/no-useless-undefined': 'off',
  'unicorn/prevent-abbreviations': [
    'error',
    {
      allowList: {
        attr: true,
        attrs: true,
        env: true,
        err: true,
        fn: true,
        i: true,
        msg: true,
        opt: true,
        opts: true,
        pkg: true,
        param: true,
        params: true,
        prop: true,
        props: true,
        vars: true,
      },
      replacements: {
        attr: false,
        attrs: false,
        env: false,
        err: false,
        fn: false,
        i: false,
        msg: false,
        opt: false,
        opts: false,
        pkg: false,
        param: false,
        params: false,
        prop: false,
        props: false,
        vars: false,
      },
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
