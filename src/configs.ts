import {
  poupeStylisticRules,
  poupeUnicornRules,
  poupeVueRules,
} from './configs/index';
import {
  type Config,
  type Rules,
} from './core';

export {
  cssRecommended,
  eslintRecommended,
  jsoncRecommended,
  markdownlintRecommended,
  perfectionistRecommended,
  stylisticRecommended,
  tsdocRecommended,
  tseslintRecommended,
  unicornRecommended,
  vueRecommended,
} from './configs/index';

// poupeConfigs
export const files: string[] = [
  '**/*.{js,mjs,cjs}',
  '**/*.ts',
  '**/*.vue',
];

export const rules: Rules = {
  ...poupeStylisticRules,
  ...poupeUnicornRules,
  ...poupeVueRules,
};

export const poupeConfigs: Config[] = [
  {
    name: 'poupe/vue-ts',
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['vue'],
        sourceType: 'module',
      },
    },
  },
  {
    name: 'poupe/files',
    files,
  },
  {
    name: 'poupe/rules',
    rules: rules,
  },
];
