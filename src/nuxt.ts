import { Linter } from 'eslint';
import { files, rules } from './configs';

type Config = Linter.Config;

const sharedNuxtRules: Config[] = [
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
  ...sharedNuxtRules,
  ...userConfigs,
];

/** rules for nuxt modules */
export const forNuxtModules = (...userConfigs: Config[]) => [
  ...sharedNuxtRules,
  ...userConfigs,
];
