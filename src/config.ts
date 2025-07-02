import {
  cssRecommended,

  eslintRecommended,
  jsoncRecommended,
  markdownlintRecommended,
  perfectionistRecommended,
  poupeConfigs,
  stylisticRecommended,
  tsdocRecommended,
  tseslintRecommended,
  unicornRecommended,
  vueRecommended,
} from './configs';
import { processCSSConfigs } from './configs/css-filter';
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
    tsdocRecommended,
    unicornRecommended,
    perfectionistRecommended,
    stylisticRecommended,
    markdownlintRecommended,
    vueRecommended,
    poupeConfigs,
    cssRecommended, // CSS configs need to come after JS configs to override rules
    jsoncRecommended, // Move JSON config after others to ensure it takes precedence
    userConfigs,
  );

  return processCSSConfigs(configs);
}
