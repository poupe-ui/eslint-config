import type {
  Rules,
  Config,
} from '../core/types';

import vuePlugin from 'eslint-plugin-vue';

const { configs: vueConfigs } = vuePlugin;

export const vueRecommended: Config[] = vueConfigs['flat/recommended'];

export const poupeVueRules: Rules = {
  'vue/multi-word-component-names': 'off',
};
