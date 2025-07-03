import {
  markdownlintRecommended,
  // poupeCSSConfig, // TODO: CSS support disabled - see sharedNuxtRules comment

  poupeConfigs,
  tsdocRecommended,
  unicornRecommended,
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
  // @nuxt/eslint-config (used by @nuxt/eslint) applies JavaScript/TypeScript
  // rules globally without file restrictions. Their regexp and @stylistic
  // plugin rules attempt to parse CSS files as JavaScript, causing TypeScript
  // AST errors. This needs to be fixed upstream in @nuxt/eslint-config/flat.
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
  const configs = withoutPlugin('unicorn', ...forNuxt(...userConfigs));
  return configs.map(c => removeUnsupportedRulesForModules(c));
};
