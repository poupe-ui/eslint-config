import {
  poupeJsonConfigs,
  poupePerfectionistConfigs,
  poupeStylisticConfigs,
  poupeUnicornConfigs,
  poupeVueConfigs,
} from './configs/index';
import {
  type Config,
} from './core';

export {
  eslintRecommended,
  markdownlintRecommended,
  poupeCSSConfigs,
  stylisticRecommended,
  tsdocRecommended,
  tseslintRecommended,
  unicornRecommended,

  vueRecommended,
  vueSetupConfig,
} from './configs/index';

// poupeConfigs
export const poupeConfigs: Config[] = [
  ...poupeJsonConfigs,
  ...poupePerfectionistConfigs,
  ...poupeStylisticConfigs,
  ...poupeUnicornConfigs,
  ...poupeVueConfigs,
];
