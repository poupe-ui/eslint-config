import {
  type Config,
  poupeConfigs,

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
  eslintRecommended,
  tseslintRecommended,
  tsdocRecommended,
  unicornRecommended,
  stylisticRecommended,
  ...vueRecommended,
  ...poupeConfigs,
  ...userConfigs,
);
