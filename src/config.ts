import {
  eslintRecommended,
  markdownlintRecommended,
  poupeConfigs,
  poupeCSSConfig,
  stylisticRecommended,
  tsdocRecommended,
  tseslintRecommended,

  unicornRecommended,
  vueRecommended,
  vueSetupConfig,
} from './configs';
import {
  processCSSConfigs,
} from './configs/css-filter';
import {
  type Config,
  type InfiniteDepthConfigWithExtends,

  withConfig,
} from './core';

export { withConfig } from './core';

export function defineConfig(...userConfigs: InfiniteDepthConfigWithExtends[]): Config[] {
  const configs = withConfig(
    {
      ignores: [
        '**/dist',
        '**/node_modules',
      ],
    },

    eslintRecommended,
    tseslintRecommended,

    markdownlintRecommended,
    stylisticRecommended,
    tsdocRecommended,
    unicornRecommended,
    vueRecommended,

    vueSetupConfig,

    poupeConfigs,
    poupeCSSConfig,
    userConfigs,
  );

  return processCSSConfigs(configs);
}
