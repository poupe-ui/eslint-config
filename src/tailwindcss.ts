import { Linter } from 'eslint';

import tailwindPlugin from 'eslint-plugin-tailwindcss';

const configs = tailwindPlugin.configs as {
  'flat/recommended': Linter.Config,
}

export const tailwindConfigs = {
  recommended: configs['flat/recommended'],
}
