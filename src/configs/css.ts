import css, { type CSSLanguageOptions } from '@eslint/css';
import { tailwindSyntax } from '@eslint/css/syntax';

import {
  type Config,
  type Rules,
  withConfig,
} from '../core';
import { getJavaScriptRulesToDisable } from './css-filter';
import { tailwindV4Syntax } from './tailwind-v4-syntax';

type SyntaxConfig = NonNullable<CSSLanguageOptions['customSyntax']>;

const { configs: cssConfigs } = css;

// Poupe-specific CSS rules
export const poupeCssRules: Rules = {
  // Tailwind CSS v4 compatibility
  'css/no-invalid-at-rules': 'off', // Allow Tailwind @ rules
  'css/no-parsing-errors': 'off', // Allow Tailwind modifiers syntax

  // CSS best practices (when @eslint/css adds more rules)
  // Future rules could include:
  // - 'css/color-format': ['error', 'lowercase'] // Enforce lowercase hex
  // - 'css/property-order': ['error', 'alphabetical'] // Property ordering
  // - 'css/quote-style': ['error', 'double'] // Prefer double quotes in CSS
  // - 'css/unit-no-unknown': 'error' // Disallow unknown units
  // - 'css/declaration-block-no-duplicate-properties': 'error'
};

// Merge the base tailwindSyntax with our v4 extensions
const extendedTailwindSyntax: Partial<SyntaxConfig> = {
  ...tailwindSyntax,
  atrules: {
    ...tailwindSyntax.atrules,
    ...tailwindV4Syntax.atrules,
  },
};

const languageOptions = {
  tolerant: true, // Enable tolerant mode for Tailwind CSS compatibility
  customSyntax: extendedTailwindSyntax,
};

export const cssRecommended: Config[] = withConfig(
  {
    name: 'poupe/css',
    files: ['**/*.css'],
    plugins: {
      css,
    },
    language: 'css/css',
    languageOptions: languageOptions as Config['languageOptions'],
    rules: {
      ...cssConfigs.recommended.rules,
      ...poupeCssRules,
    },
  },
  {
    name: 'poupe/css-disable-js-rules',
    files: ['**/*.css'],
    rules: getJavaScriptRulesToDisable(),
  },
);
