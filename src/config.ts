import {
  type Config,
  poupeConfigs,

  cssRecommended,
  eslintRecommended,
  stylisticRecommended,
  tsdocRecommended,
  tseslintRecommended,
  unicornRecommended,
  vueRecommended,
} from './configs';

import { config as withConfigs } from 'typescript-eslint';

export const defineConfig = (...userConfigs: Config[]): Config[] => withConfigs(
  {
    ignores: [
      '**/dist',
      '**/node_modules',
    ],
  },
  cssRecommended,
  eslintRecommended,
  tseslintRecommended,
  tsdocRecommended,
  unicornRecommended,
  stylisticRecommended,
  ...vueRecommended,
  ...poupeConfigs,
  ...userConfigs,
);
