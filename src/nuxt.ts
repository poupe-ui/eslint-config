import {
  type Config,
  type InfiniteDepthConfigWithExtends,

  withConfig,
  withoutRules,
} from './core/index';

import {
  files,
  rules,

  // cssRecommended, // TODO: CSS support disabled - see sharedNuxtRules comment
  jsoncRecommended,
  markdownlintRecommended,
  tsdocRecommended,
  unicornRecommended,
} from './configs';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { plugins: _unicornPlugins, ...unicornConfig } = unicornRecommended;

const sharedNuxtRules: InfiniteDepthConfigWithExtends = [
  // TODO: CSS support is temporarily disabled for Nuxt configurations
  // @nuxt/eslint-config (used by @nuxt/eslint) applies JavaScript/TypeScript
  // rules globally without file restrictions. Their regexp and @stylistic
  // plugin rules attempt to parse CSS files as JavaScript, causing TypeScript
  // AST errors. This needs to be fixed upstream in @nuxt/eslint-config/flat.
  // See: https://github.com/poupe-ui/eslint-config/issues/138
  // cssRecommended,
  tsdocRecommended,
  markdownlintRecommended,
  {
    name: 'poupe/files',
    files,
  },
  {
    name: 'poupe/rules',
    rules,
  },
  jsoncRecommended, // Move JSON config after others to ensure it takes precedence
];

/** rules for nuxt projects */
export const forNuxt = (...userConfigs: InfiniteDepthConfigWithExtends[]): Config[] => withConfig(
  unicornRecommended,
  sharedNuxtRules,
  userConfigs,
);

/** rules for nuxt modules */
const rulesForModules = withoutRules(unicornConfig.rules,
  /** disabled because they are not supported by the version of the unicorn plugin already loaded */
  'unicorn/no-unnecessary-array-flat-depth',
  'unicorn/no-unnecessary-array-splice-count',
  'unicorn/no-unnecessary-slice-end',
  'unicorn/prefer-single-call',
);

export const forNuxtModules = (...userConfigs: InfiniteDepthConfigWithExtends[]): Config[] => withConfig(
  {
    ...unicornConfig,
    rules: rulesForModules,
  },
  sharedNuxtRules,
  userConfigs,
);
