import css from '@eslint/css';
import { tailwind4 } from 'tailwind-csstree';

import {
  type Config,
  type Rules,

  GLOB_CSS,
} from '../core';

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
// We extend with @tailwind for legacy v3 compatibility.
//
// tailwind-csstree 0.1.5 changed tailwind4 from Partial<SyntaxConfig>
// to SyntaxExtensionCallback (requires @eslint/css >= 1.0.0).
type SyntaxExtensionCallback = typeof tailwind4;

const customSyntax: SyntaxExtensionCallback = (previous, assign) => {
  const tw = tailwind4(previous, assign);
  return {
    ...tw,
    atrules: {
      ...tw.atrules,
      tailwind: {
        prelude: 'base | components | utilities | variants',
      },
    },
  };
};

export const poupeCSSConfigs: Config[] = [{
  name: 'poupe/css',
  files: [GLOB_CSS],
  plugins: {
    css,
  },
  language: 'css/css',
  languageOptions: { tolerant: true, customSyntax } as Config['languageOptions'],
  rules: {
    ...cssConfigs.recommended.rules,
    ...poupeCssRules,
  },
}];
