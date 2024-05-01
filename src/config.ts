import type {
  MainConfig,
  TypedFlatConfig,
  PropType,
} from './types';

import { default as unjsPreset } from 'eslint-config-unjs';
import stylistic from '@stylistic/eslint-plugin';

export const files = [
  '**/*.{ts,js,mjs,cjs}',
];

export const rules = {
  '@stylistic/indent': ['error', 2],
  '@stylistic/quotes': ['error', 'single'],
  '@stylistic/semi': ['error', 'always'],
};

export const defineConfig = (mainConfig?: MainConfig, ...userConfigs: TypedFlatConfig[]) => unjsPreset(mainConfig,
  stylistic.configs['recommended-flat'],
  {
    name: '@poupe/eslint-config',
    files,
    rules: rules as PropType<TypedFlatConfig, 'rules'>,
  },
  ...userConfigs,
);
