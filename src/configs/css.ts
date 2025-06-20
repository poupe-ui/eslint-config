import css from '@eslint/css';
import { tailwindSyntax } from '@eslint/css/syntax';

import type {
  Linter,
} from '../core/types';

import { tailwindV4Syntax } from './tailwind-v4-syntax';
import { eslintRecommended } from './eslint';
import { unicornRecommended, poupeUnicornRules } from './unicorn';
import { stylisticRecommended, poupeStylisticRules } from './stylistic';

const { configs: cssConfigs } = css;

// 1. Plugins to always keep (all rules work with CSS)
const ALWAYS_KEEP_PLUGINS = new Set([
  'css',
  'jsonc',
  'markdown',
]);

// 2. Plugins to always disable (no rules work with CSS)
const ALWAYS_DISABLE_PLUGINS = new Set([
  '', // Core ESLint rules
  'unicorn',
  '@typescript-eslint',
  'vue',
  'tsdoc',
]);

// 3. Plugins with specific rules to disable
const PLUGIN_RULES_TO_DISABLE = new Map<string, Set<string>>([
  ['@stylistic', new Set([
    '@stylistic/indent',
    '@stylistic/semi',
    '@stylistic/comma-dangle',
    '@stylistic/brace-style',
    '@stylistic/object-curly-spacing',
    '@stylistic/no-extra-semi',
  ])],
]);

// 4. Plugins with patterns to disable
const PLUGIN_PATTERNS_TO_DISABLE = new Map<string, RegExp[]>([
  ['@stylistic', [
    /function/,
    /arrow/,
    /member/,
    /type-/,
    /jsx/,
    /template/,
    /generator/,
  ]],
]);

// Analyze a config and add JavaScript-specific rules to the Set
function analyzeConfigForJSRules(
  config: Linter.Config | Record<string, unknown>,
  rulesToDisable: Set<string>,
  unknownPlugins: Set<string>,
): void {
  const rules = 'rules' in config ? config.rules : config;
  if (!rules) return;

  for (const [ruleName, ruleValue] of Object.entries(rules)) {
    // Skip if already disabled
    if (ruleValue === 'off' || ruleValue === 0) continue;

    // Get the plugin name
    const pluginName = ruleName.includes('/') ? ruleName.split('/')[0] : '';

    // 1. Skip if it's a plugin we always keep
    if (ALWAYS_KEEP_PLUGINS.has(pluginName)) continue;

    // 2. Disable if it's a plugin we always disable
    if (ALWAYS_DISABLE_PLUGINS.has(pluginName)) {
      rulesToDisable.add(ruleName);
      continue;
    }

    // 3. Check specific rules to disable
    const specificRules = PLUGIN_RULES_TO_DISABLE.get(pluginName);
    if (specificRules?.has(ruleName)) {
      rulesToDisable.add(ruleName);
      continue;
    }

    // 4. Check patterns to disable
    const patterns = PLUGIN_PATTERNS_TO_DISABLE.get(pluginName);
    if (patterns?.some(pattern => pattern.test(ruleName))) {
      rulesToDisable.add(ruleName);
      continue;
    }

    // If not handled by any of the above, it's an unknown plugin
    // For safety, disable unknown plugin rules for CSS files
    if (pluginName && !ALWAYS_KEEP_PLUGINS.has(pluginName) && !ALWAYS_DISABLE_PLUGINS.has(pluginName)
      && !PLUGIN_RULES_TO_DISABLE.has(pluginName) && !PLUGIN_PATTERNS_TO_DISABLE.has(pluginName)) {
      // Unknown plugin - disable for CSS files
      unknownPlugins.add(pluginName);
      rulesToDisable.add(ruleName);
    }
  }
}

// Get all JavaScript-specific rules that should be disabled for CSS files
function getJavaScriptRulesToDisable(): Record<string, 'off'> {
  const rulesToDisable = new Set<string>();
  const unknownPlugins = new Set<string>();

  // Configs to analyze
  const configs = [
    eslintRecommended,
    unicornRecommended,
    stylisticRecommended,
    poupeUnicornRules,
    poupeStylisticRules,
  ];

  // Analyze each config
  for (const config of configs) {
    analyzeConfigForJSRules(config, rulesToDisable, unknownPlugins);
  }

  // Warn about unknown plugins
  if (unknownPlugins.size > 0) {
    console.warn(`[@poupe/eslint-config] Unknown plugins detected in CSS config: ${[...unknownPlugins].join(', ')}. These rules will be disabled for CSS files.`);
  }

  // Convert Set to object with 'off' values
  const result: Record<string, 'off'> = {};
  for (const rule of rulesToDisable) {
    result[rule] = 'off';
  }

  return result;
}

// Merge the base tailwindSyntax with our v4 extensions
const extendedTailwindSyntax = {
  ...tailwindSyntax,
  atrules: {
    ...tailwindSyntax.atrules,
    ...tailwindV4Syntax.atrules,
  },
};

export const cssRecommended: Linter.Config[] = [
  {
    name: 'poupe/css',
    files: ['**/*.css'],
    plugins: {
      css,
    },
    language: 'css/css',
    languageOptions: {
      // Set tolerant mode to allow recoverable parsing errors
      tolerant: true,
      parserOptions: {
        customSyntax: extendedTailwindSyntax,
      },
    },
    rules: {
      ...cssConfigs.recommended.rules,
      // Disable rules that conflict with Tailwind CSS v4 syntax
      'css/no-invalid-at-rules': 'off',
      // For now, disable parsing errors to allow Tailwind modifiers
      'css/no-parsing-errors': 'off',
    },
  },
  // Separate config to disable JavaScript rules for CSS files
  // This needs to be separate to ensure it applies after all other configs
  {
    name: 'poupe/css-disable-js-rules',
    files: ['**/*.css'],
    rules: getJavaScriptRulesToDisable(),
  },
];
