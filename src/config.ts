import type {
  TypedFlatConfig,
  PropType,
} from './types';

import { vueRecommended } from './vue';

import { default as unjsPreset } from 'eslint-config-unjs';
import stylistic from '@stylistic/eslint-plugin';

export const files = [
  '**/*.{js,mjs,cjs}',
  '**/*.ts',
  '**/*.vue',
];

export const rules = {
  '@stylistic/brace-style': ['error', '1tbs'],
  '@stylistic/indent': ['error', 2],
  '@stylistic/quotes': ['error', 'single'],
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
    rules: rules as PropType<TypedFlatConfig, 'rules'>,
  },
];

export const defineConfig = (...userConfigs: TypedFlatConfig[]) => {
  return unjsPreset({},
    ...vueRecommended,
    stylistic.configs['recommended-flat'],
    ...configs,
    ...userConfigs,
  );
};
