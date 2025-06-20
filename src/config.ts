import {
  type Config,
  poupeConfigs,

  eslintRecommended,
  jsoncRecommended,
  markdownlintRecommended,
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
  markdownlintRecommended,
  ...vueRecommended,
  ...poupeConfigs,
  ...jsoncRecommended, // Move JSON config after others to ensure it takes precedence
  ...userConfigs,
);
