import type { TypedFlatConfig } from './types';

import { default as unjsPreset } from 'eslint-config-unjs';

import {
  poupeConfigs,
  stylisticConfigs,
  vueConfigs,
} from './configs';

export const defineConfig = (...userConfigs: TypedFlatConfig[]) => {
  return unjsPreset({
    ignores: [
      '**/dist',
      '**/node_modules',
    ],
  },
  ...vueConfigs['flat/recommended'],
  stylisticConfigs['recommended-flat'],
  ...poupeConfigs,
  ...userConfigs,
  );
};
