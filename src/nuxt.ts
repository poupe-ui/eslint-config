import {
  markdownlintRecommended,
  // poupeCSSConfigs, // TODO: CSS support disabled - see sharedNuxtConfigs comment

  poupeConfigs,
  tsdocRecommended,
  unicornRecommended,
} from './configs';
import {
  type Config,
  type InfiniteDepthConfigWithExtends,

  withConfig,
} from './core';

const sharedNuxtConfigs: InfiniteDepthConfigWithExtends = [
  // TODO: CSS support is temporarily disabled for Nuxt configurations
  // While `@nuxt/eslint` v1.5.0+ adds file restrictions to its configs, there
  // may still be edge cases where JavaScript/TypeScript rules leak to CSS files.
  // Re-enable once we confirm all CSS parsing issues are resolved.
  // See: https://github.com/poupe-ui/eslint-config/issues/138
  // poupeCSSConfigs,

  unicornRecommended,
  tsdocRecommended,
  markdownlintRecommended,

  poupeConfigs,
];

/** rules for nuxt projects */
export const forNuxt = (...userConfigs: InfiniteDepthConfigWithExtends[]): Config[] => withConfig(
  sharedNuxtConfigs,
  ...userConfigs,
);

/** rules for nuxt modules */
export const forNuxtModules = forNuxt;
