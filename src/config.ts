import type { TypedFlatConfig, Rules } from './types';

import { default as unjsPreset } from 'eslint-config-unjs';
import { vueConfigs } from './vue';
import { stylisticConfigs } from './stylistic';

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

export const configs: TypedFlatConfig[] = [
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

export const defineConfig = (...userConfigs: TypedFlatConfig[]) => {
  return unjsPreset({
    ignores: [
      '**/dist',
      '**/node_modules',
    ],
  },
  ...vueConfigs['flat/recommended'],
  stylisticConfigs['recommended-flat'],
  ...configs,
  ...userConfigs,
  );
};
