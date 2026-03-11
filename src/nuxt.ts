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

/**
 * @deprecated Use `withPoupe` from `@poupe/eslint-config` instead. Will be removed in 0.9.
 */
export const forNuxt = (...userConfigs: InfiniteDepthConfigWithExtends[]): Config[] => {
  const configs = withConfig(
    sharedNuxtConfigs,
    ...userConfigs,
  );

  return processCSSConfigs(configs);
};

/**
 * @deprecated Use `withPoupe` from `@poupe/eslint-config` instead. Will be removed in 0.9.
 */
export const forNuxtModules = forNuxt;
