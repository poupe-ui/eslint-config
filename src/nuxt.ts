import {
  markdownlintRecommended,
  // poupeCSSConfig, // TODO: CSS support disabled - see sharedNuxtRules comment

  poupeConfigs,
  tsdocRecommended,
  unicornRecommended,
  unicornSetupConfig,
} from './configs';
import {
  type Config,
  type InfiniteDepthConfigWithExtends,

  withConfig,
  withoutPlugin,
  withoutRules,
} from './core';

const sharedNuxtConfigs: InfiniteDepthConfigWithExtends = [
  // TODO: CSS support is temporarily disabled for Nuxt configurations
  // While `@nuxt/eslint` v1.5.0+ adds file restrictions to its configs, there
  // may still be edge cases where JavaScript/TypeScript rules leak to CSS files.
  // Re-enable once we confirm all CSS parsing issues are resolved.
  // See: https://github.com/poupe-ui/eslint-config/issues/138
  // poupeCSSConfig,

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

/** rules not for nuxt modules */
const rulesNotForModules = new Set([
  /** disabled because they are not supported by the version of the unicorn plugin already loaded */
  'unicorn/no-unnecessary-array-flat-depth',
  'unicorn/no-unnecessary-array-splice-count',
  'unicorn/no-unnecessary-slice-end',
  'unicorn/prefer-single-call',
]);

const removeUnsupportedRulesForModules = (c: Config): Config => {
  if ('rules' in c && c.rules) {
    return {
      ...c,
      rules: withoutRules(c.rules, ...rulesNotForModules),
    };
  }

  return c;
};

export const forNuxtModules = (...userConfigs: InfiniteDepthConfigWithExtends[]): Config[] => {
  // Remove unicorn plugin to avoid conflicts with `@nuxt/eslint`'s own unicorn instance
  const configs = withoutPlugin('unicorn', ...forNuxt(...userConfigs));

  // Add bare unicorn plugin setup to ensure our rules can still reference it
  // This prevents "Could not find plugin 'unicorn'" errors while avoiding conflicts
  return [unicornSetupConfig, ...configs.map(c => removeUnsupportedRulesForModules(c))];
};
