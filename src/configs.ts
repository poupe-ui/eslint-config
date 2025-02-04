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
      replacements: {
        attr: false,
        attrs: false,
        env: {
          environment: false,
        },
        err: {
          error: false,
        },
        fn: {
          function: false,
        },
        i: {
          index: false,
        },
        msg: {
          message: false,
        },
        opt: {
          option: false,
        },
        opts: {
          options: false,
        },
        pkg: {
          package: false,
        },
        param: {
          parameter: false,
        },
        params: {
          parameters: false,
        },
        prop: {
          property: false,
        },
        props: {
          properties: false,
        },
        vars: {
          variables: false,
        },
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
