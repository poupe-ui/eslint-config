import {
  eslintRecommended,
  markdownlintRecommended,
  poupeConfigs,
  poupeCSSConfigs,
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

export { reconcilePlugins, withConfig } from './core';
export * from './core/globs';

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
    poupeCSSConfigs,
    userConfigs,
  );

  return processCSSConfigs(configs);
}
