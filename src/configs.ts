import type {
  TypedFlatConfig,
  Rules,
} from './types';

import pkg1 from '@stylistic/eslint-plugin';
import pkg2 from 'eslint-plugin-vue';

export const { configs: stylisticConfigs } = pkg1;
export const { configs: vueConfigs } = pkg2;

export const files = [
  '**/*.{js,mjs,cjs}',
  '**/*.ts',
  '**/*.vue',
];

export const rules = {
  '@stylistic/brace-style': ['error', '1tbs'],
  '@stylistic/indent': ['error', 2],
  '@stylistic/quotes': ['error', 'single'],
  '@stylistic/semi': ['error', 'always'],
  'vue/multi-word-component-names': 'off',
};

export const poupeConfigs: TypedFlatConfig[] = [
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
    rules: rules as Rules,
  },
];
