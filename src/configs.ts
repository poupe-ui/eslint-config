import type {
  Config,
  Rules,
} from './core';

import stylisticPlugin from '@stylistic/eslint-plugin';
import vuePlugin from 'eslint-plugin-vue';
import unicornPlugin from 'eslint-plugin-unicorn';

export const { configs: stylisticConfigs } = stylisticPlugin;
export const { configs: vueConfigs } = vuePlugin;
export const { configs: unicornConfigs } = unicornPlugin;

export { configs as eslintConfigs } from '@eslint/js';
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
