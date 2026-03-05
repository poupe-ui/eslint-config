import {
  markdownlintRecommended,
  poupeCSSConfigs,

  poupeConfigs,
  tsdocRecommended,
  unicornRecommended,
} from './configs';
import {
  processCSSConfigs,
} from './configs/css-filter';
import {
  type Config,
  type InfiniteDepthConfigWithExtends,

  withConfig,
} from './core';

const sharedNuxtConfigs: InfiniteDepthConfigWithExtends = [
  poupeCSSConfigs,

  unicornRecommended,
  tsdocRecommended,
  markdownlintRecommended,

  poupeConfigs,
];

/** rules for nuxt projects */
export const forNuxt = (...userConfigs: InfiniteDepthConfigWithExtends[]): Config[] => {
  const configs = withConfig(
    sharedNuxtConfigs,
    ...userConfigs,
  );

  return processCSSConfigs(configs);
};

/** rules for nuxt modules */
export const forNuxtModules = forNuxt;
