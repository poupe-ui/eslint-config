import css, { type CSSLanguageOptions } from '@eslint/css';
import { tailwind4 } from 'tailwind-csstree';

import {
  type Config,
  type Rules,

  GLOB_CSS,
} from '../core';

type SyntaxConfig = NonNullable<CSSLanguageOptions['customSyntax']>;

const { configs: cssConfigs } = css;

// Poupe-specific CSS rules
export const poupeCssRules: Rules = {
  // Tailwind CSS v4: customSyntax covers at-rule names but prelude
  // validation still rejects complex patterns (modifiers, arbitrary values)
  'css/no-invalid-at-rules': 'off',

  // CSS nesting (&) is widely supported across all major browsers
  'css/use-baseline': ['error', { allowSelectors: ['nesting'] }],
};

// tailwind-csstree covers all Tailwind v4 at-rules:
//   @apply, @import, @config, @theme, @source,
//   @utility, @variant, @custom-variant, @plugin, @reference
//
// We extend with @tailwind for legacy v3 compatibility
const customSyntax: Partial<SyntaxConfig> = {
  ...tailwind4,
  atrules: {
    ...tailwind4.atrules,
    tailwind: {
      prelude: 'base | components | utilities | variants',
    },
  },
};

const languageOptions: CSSLanguageOptions = {
  tolerant: true, // Enable tolerant mode for Tailwind CSS compatibility
  customSyntax: customSyntax as SyntaxConfig,
};

export const poupeCSSConfigs: Config[] = [{
  name: 'poupe/css',
  files: [GLOB_CSS],
  plugins: {
    css,
  },
  language: 'css/css',
  languageOptions: languageOptions as Config['languageOptions'],
  rules: {
    ...cssConfigs.recommended.rules,
    ...poupeCssRules,
  },
}];
