import {
  cssRecommended, // Testing with @nuxt/eslint v1.5.0
  files,
  jsoncRecommended,

  markdownlintRecommended,
  perfectionistRecommended,
  rules,
  tsdocRecommended,
  unicornRecommended,
} from './configs';
import {
  type Config,
  type InfiniteDepthConfigWithExtends,

  withConfig,
  withoutPlugin,
  withoutRules,
} from './core/index';

const sharedNuxtRules: InfiniteDepthConfigWithExtends = [
  // Testing CSS support with @nuxt/eslint v1.5.0
  cssRecommended,
  perfectionistRecommended,
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
const [unicornConfig] = withoutPlugin('unicorn', unicornRecommended);

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
