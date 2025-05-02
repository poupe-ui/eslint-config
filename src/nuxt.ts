import {
  type Config,
  withoutRules,
} from './core/index';

import {
  files,
  rules,
  tsdocRecommended,
  unicornRecommended,
} from './configs';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { plugins: _unicornPlugins, ...unicornConfig } = unicornRecommended;

const sharedNuxtRules: Config[] = [
  tsdocRecommended,
  {
    name: 'poupe/files',
    files,
  },
  {
    name: 'poupe/rules',
    rules,
  },
];

/** rules for nuxt projects */
export const forNuxt = (...userConfigs: Config[]): Config[] => [
  unicornRecommended,
  ...sharedNuxtRules,
  ...userConfigs,
];

/** rules for nuxt modules */
const rulesForModules = withoutRules(unicornConfig.rules,
  /** disabled because it's not supported by the version of the unicorn plugin already loaded */
  'unicorn/no-unnecessary-array-flat-depth',
);

export const forNuxtModules = (...userConfigs: Config[]): Config[] => [
  {
    ...unicornConfig,
    rules: rulesForModules,
  },
  ...sharedNuxtRules,
  ...userConfigs,
];
