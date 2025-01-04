import type {
  Config,
  Rules,
} from './core';

import jsPlugin from '@eslint/js';
import stylisticPlugin from '@stylistic/eslint-plugin';
import unicornPlugin from 'eslint-plugin-unicorn';
import vuePlugin from 'eslint-plugin-vue';

export const { configs: eslintConfigs } = jsPlugin;
export const { configs: stylisticConfigs } = stylisticPlugin;
export const { configs: unicornConfigs } = unicornPlugin;
export const { configs: vueConfigs } = vuePlugin;

export { configs as tseslintConfigs } from 'typescript-eslint';

// poupeConfigs
export const files = [
  '**/*.{js,mjs,cjs}',
  '**/*.ts',
  '**/*.vue',
];

export const rules: Rules = {
  '@stylistic/brace-style': ['error', '1tbs'],
  '@stylistic/indent': ['error', 2],
  '@stylistic/quotes': ['error', 'single'],
  '@stylistic/semi': ['error', 'always'],
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
