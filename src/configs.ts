import {
  poupeJsonConfigs,
  poupePerfectionistConfig,
  poupeStylisticConfig,
  poupeUnicornConfigs,
  poupeVueConfig,
} from './configs/index';
import {
  type Config,
} from './core';

export {
  eslintRecommended,
  markdownlintRecommended,
  poupeCSSConfig,
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
  poupePerfectionistConfig,
  poupeStylisticConfig,
  ...poupeUnicornConfigs,
  poupeVueConfig,
];
