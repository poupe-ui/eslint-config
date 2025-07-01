import {
  type Config,
  type InfiniteDepthConfigWithExtends,

  withConfig,
  withoutPlugin,
  withoutRules,
} from './core/index';

import {
  files,
  rules,

  cssRecommended,
  jsoncRecommended,
  markdownlintRecommended,
  tsdocRecommended,
  unicornRecommended,
} from './configs';

import { processCSSConfigs } from './configs/css-filter';

const sharedNuxtRules: InfiniteDepthConfigWithExtends = [
  cssRecommended,
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
export const forNuxt = (...userConfigs: InfiniteDepthConfigWithExtends[]): Config[] => {
  const configs = withConfig(
    unicornRecommended,
    sharedNuxtRules,
    userConfigs,
  );

  return processCSSConfigs(configs);
};

/** rules for nuxt modules */
const [unicornConfig] = withoutPlugin('unicorn', unicornRecommended);

const rulesForModules = withoutRules(unicornConfig.rules,
  /** disabled because they are not supported by the version of the unicorn plugin already loaded */
  'unicorn/no-unnecessary-array-flat-depth',
  'unicorn/no-unnecessary-array-splice-count',
  'unicorn/no-unnecessary-slice-end',
  'unicorn/prefer-single-call',
);

export const forNuxtModules = (...userConfigs: InfiniteDepthConfigWithExtends[]): Config[] => {
  const configs = withConfig(
    {
      ...unicornConfig,
      rules: rulesForModules,
    },
    sharedNuxtRules,
    userConfigs,
  );

  return processCSSConfigs(configs);
};
