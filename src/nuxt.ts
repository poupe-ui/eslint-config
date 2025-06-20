import {
  type Linter,
  withoutRules,
} from './core/index';

import {
  type ResolvableFlatConfig,
} from 'eslint-flat-config-utils';

import {
  files,
  rules,
  cssRecommended,
  jsoncRecommended,
  markdownlintRecommended,
  tsdocRecommended,
  unicornRecommended,
} from './configs';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { plugins: _unicornPlugins, ...unicornConfig } = unicornRecommended;

const sharedNuxtRules: Linter.Config[] = [
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
  ...jsoncRecommended, // Move JSON config after others to ensure it takes precedence
];

/** rules for nuxt projects */
export const forNuxt = (...userConfigs: Linter.Config[]): Linter.Config[] => [
  unicornRecommended,
  ...sharedNuxtRules,
  ...userConfigs,
];

/** rules for nuxt modules */
const rulesForModules = withoutRules(unicornConfig.rules,
  /** disabled because they are not supported by the version of the unicorn plugin already loaded */
  'unicorn/no-unnecessary-array-flat-depth',
  'unicorn/no-unnecessary-array-splice-count',
  'unicorn/no-unnecessary-slice-end',
  'unicorn/prefer-single-call',
);

export const forNuxtModules = (...userConfigs: ResolvableFlatConfig[]): ResolvableFlatConfig[] => [
  {
    ...unicornConfig,
    rules: rulesForModules,
  },
  ...sharedNuxtRules,
  ...userConfigs,
];
