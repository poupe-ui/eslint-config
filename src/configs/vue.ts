import vuePlugin from 'eslint-plugin-vue';

import {
  type Config,
  type Rules,

  withConfig,
} from '../core';

const { configs: vueConfigs } = vuePlugin;

/**
 * Add file restrictions to Vue configs that don't have them.
 * Vue plugin's flat configs don't include file restrictions for their
 * rule configs, which causes Vue-specific rules to be applied to all files.
 */
function restrictVueRulesToVueFiles(config: Config): Config {
  // Skip configs that already have file restrictions
  if (config.files || config.name === 'vue/base/setup-for-vue') {
    return config;
  }

  // Add .vue file pattern to configs without file restrictions
  return {
    ...config,
    files: ['*.vue', '**/*.vue'],
  };
}

export const vueRecommended: Config[] = withConfig(
  vueConfigs['flat/recommended'].map(config => restrictVueRulesToVueFiles(config)),
);

export const poupeVueRules: Rules = {
  'vue/multi-word-component-names': 'off',
};
