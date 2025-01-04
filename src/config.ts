import {
  eslintConfigs,
  poupeConfigs,
  stylisticConfigs,
  tsdocConfigs,
  tseslintConfigs,
  unicornConfigs,
  vueConfigs,
} from './configs';

import {
  type Config,
  withConfigs,
} from './core';

export const defineConfig = (...userConfigs: Config[]): Config[] => withConfigs(
  {
    ignores: [
      '**/dist',
      '**/node_modules',
    ],
  },
  eslintConfigs.recommended,
  ...tseslintConfigs.recommended,
  tsdocConfigs.recommended,
  unicornConfigs['flat/recommended'],
  stylisticConfigs['recommended-flat'],
  ...vueConfigs['flat/recommended'],
  ...poupeConfigs,
  ...userConfigs,
);
