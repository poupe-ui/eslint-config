import { Linter } from 'eslint';

import {
  files,
  rules,
  tsdocConfigs,
  unicornConfigs,
} from './configs';

type Config = Linter.Config;

const { plugins: unicornPlugins, ...unicornConfig } = unicornConfigs['flat/recommended'];

const sharedNuxtRules: Config[] = [
  tsdocConfigs.recommended,
  unicornConfig,
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
export const forNuxt = (...userConfigs: Config[]) => [
  {
    plugins: unicornPlugins,
  },
  ...sharedNuxtRules,
  ...userConfigs,
];

/** rules for nuxt modules */
export const forNuxtModules = (...userConfigs: Config[]) => [
  ...sharedNuxtRules,
  ...userConfigs,
];
