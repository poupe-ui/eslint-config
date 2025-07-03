import vuePlugin from 'eslint-plugin-vue';

import {
  type Config,

  GLOB_VUE,

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
    files: [GLOB_VUE],
  };
}

export const vueSetupConfig: Config = {
  name: 'poupe/vue-setup',
  files: [GLOB_VUE],
  languageOptions: {
    parserOptions: {
      parser: '@typescript-eslint/parser',
      extraFileExtensions: ['vue'],
      sourceType: 'module',
    },
  },
};

export const vueRecommended: Config[] = withConfig(
  vueConfigs['flat/recommended'].map(config => restrictVueRulesToVueFiles(config)),
);

export const poupeVueConfig: Config = {
  name: 'poupe/vue',
  files: [GLOB_VUE],
  rules: {
    'vue/multi-word-component-names': 'off',
  },
};
