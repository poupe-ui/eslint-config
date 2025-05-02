import {
  type Config,

  files,
  rules,
  tsdocRecommended,
  unicornRecommended,
} from './configs';

const { plugins: unicornPlugins, ...unicornConfig } = unicornRecommended;

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
  {
    plugins: unicornPlugins,
  },
  unicornConfig,
  ...sharedNuxtRules,
  ...userConfigs,
];

/** rules for nuxt modules */
export const forNuxtModules = (...userConfigs: Config[]): Config[] => [
  ...sharedNuxtRules,
  ...userConfigs,
];
