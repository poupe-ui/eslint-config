import css from '@eslint/css';
import { tailwindSyntax } from '@eslint/css/syntax';
import unicornPlugin from 'eslint-plugin-unicorn';
import stylisticPlugin from '@stylistic/eslint-plugin';

import type {
  Linter,
  Rules,
} from '../core/types';

import { tailwindV4Syntax } from './tailwind-v4-syntax';
import { eslintRecommended } from './eslint';
import { unicornRecommended, poupeUnicornRules } from './unicorn';
import { stylisticRecommended, poupeStylisticRules } from './stylistic';

const { configs: cssConfigs } = css;

// Helper function for safe console warnings
function warn(message: string): void {
  if (typeof console !== 'undefined' && typeof console.warn === 'function') {
    console.warn(`[@poupe/eslint-config] ${message}`);
  }
}

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

// Configuration for which plugin rules to keep/disable for CSS files
interface PluginRuleConfig {
  // Plugin name for prefixing rules
  pluginName: string
  // Rules to always keep enabled (without plugin prefix)
  alwaysKeepRules: Set<string>
  // Rules to always disable (without plugin prefix)
  alwaysDisableRules: Set<string>
  // Rule patterns to keep enabled (RegExp, tested against rule name without prefix)
  alwaysKeepPatterns: RegExp[]
  // Rule patterns to disable (RegExp, tested against rule name without prefix)
  alwaysDisablePatterns: RegExp[]
}

// Factory function to create PluginRuleConfig
function createPluginConfig(
  pluginName: string,
  keepRules?: string[],
  disableRules?: string[],
  keepPatterns?: RegExp[],
  disablePatterns?: RegExp[],
): PluginRuleConfig {
  return {
    pluginName,
    alwaysKeepRules: new Set(keepRules ?? []),
    alwaysDisableRules: new Set(disableRules ?? []),
    alwaysKeepPatterns: keepPatterns ?? [],
    alwaysDisablePatterns: disablePatterns ?? [],
  };
}

// Helper function to split rule name into plugin and rule parts
function splitRuleName(ruleName: string): { pluginName: string; rulePart: string } {
  const slashIndex = ruleName.indexOf('/');
  if (slashIndex === -1) {
    return { pluginName: '', rulePart: ruleName };
  }
  return {
    pluginName: ruleName.slice(0, slashIndex),
    rulePart: ruleName.slice(slashIndex + 1),
  };
}

// 1. Plugins to always keep (all rules work with CSS)
const ALWAYS_KEEP_PLUGINS = new Set([
  'css',
  'jsonc',
  'markdown',
]);

// 2. Plugins to always disable (no rules work with CSS)
const ALWAYS_DISABLE_PLUGINS = new Set([
  '', // Core ESLint rules
  '@typescript-eslint',
  'vue',
  'tsdoc',
]);

// 3. Known plugins with complex rule configurations
const KNOWN_PLUGINS = new Map<string, PluginRuleConfig>([
  ['unicorn', createPluginConfig(
    'unicorn',
    // Rules that make sense for CSS files (file-agnostic rules)
    [
      'filename-case', // File naming conventions
      'no-empty-file', // Empty files are usually mistakes
    ],
    // Rules to explicitly disable
    [
      'empty-brace-spaces', // JS object braces, not CSS blocks
      'expiring-todo-comments', // TODO comments work differently in CSS
      'no-abusive-eslint-disable', // ESLint directives work differently in CSS
      'prefer-at', // Array.at() method - JS only
      'prefer-event-target', // EventTarget API - JS only
    ],
    undefined, // No keep patterns
    [
      // Disable all JavaScript-specific patterns
      /^consistent-/, // JavaScript consistency rules
      /^no-array/, // Array-specific rules
      /^no-.*-assignment/, // Assignment rules
      /^no-.*-expression/, // Expression rules
      /^no-.*-statement/, // Statement rules
      /^no-.*-recursion/, // Recursion rules
      /^no-.*-spaces/, // Space-related rules (JS-specific)
      /^no-.*-default/, // Default export/parameter rules
      /^no-console/, // Console rules
      /^no-document/, // Document API rules
      /^no-for/, // Loop rules
      /^no-hex/, // Hex escape rules (JS strings)
      /^no-invalid/, // Invalid JS constructs
      /^no-lonely/, // Control flow rules
      /^no-magic/, // Magic number/array rules
      /^no-named/, // Named export rules
      /^no-negat/, // Negation rules
      /^no-new/, // Constructor rules
      /^no-object/, // Object rules
      /^no-process/, // Process rules
      /^no-single/, // Single element rules
      /^no-static/, // Static class rules
      /^no-thenable/, // Promise rules
      /^no-this/, // This binding rules
      /^no-typeof/, // Typeof rules
      /^no-unnecessary/, // Unnecessary code rules
      /^no-unreadable/, // Readability rules (JS-specific)
      /^no-useless/, // Useless code rules
      /^no-zero/, // Zero fraction rules
      /^prefer-array/, // Array preference rules
      /^prefer-.*-method/, // Method preference rules
      /^prefer-dom/, // DOM-specific rules
      /^prefer-string/, // String method rules
      /^prefer-number/, // Number method rules
      /^prefer-object/, // Object method rules
      /^prefer-regexp/, // RegExp rules
      /^prefer-.*-event/, // Event handling rules
      /^prefer-.*-api/, // API usage rules
      /^prefer-.*-parameters/, // Parameter rules
      /^prefer-blob/, // Blob API rules
      /^prefer-code/, // Code point rules
      /^prefer-date/, // Date rules
      /^prefer-includes/, // Array includes rules
      /^prefer-global/, // Global object rules
      /^prefer-keyboard/, // Keyboard event rules
      /^prefer-logical/, // Logical operator rules
      /^prefer-math/, // Math API rules
      /^prefer-modern/, // Modern API rules
      /^prefer-native/, // Native function rules
      /^prefer-negative/, // Negative index rules
      /^prefer-node/, // Node.js rules
      /^prefer-optional/, // Optional chaining rules
      /^prefer-prototype/, // Prototype rules
      /^prefer-query/, // Query selector rules
      /^prefer-reflect/, // Reflect API rules
      /^prefer-set/, // Set rules
      /^prefer-single/, // Single call rules
      /^prefer-spread/, // Spread rules
      /^prefer-structured/, // Structured clone rules
      /^prefer-switch/, // Switch rules
      /^prefer-ternary/, // Ternary rules
      /^prefer-top/, // Top-level await rules
      /^prefer-type/, // Type error rules
      /^require-/, // Requirement rules
      /^prevent-/, // Prevention rules
      /^relative-/, // URL rules
      /catch|error|throw/, // Error handling rules
      /function|callback|async|await/, // Function-related rules
      /import|export|module/, // Module system rules
      /promise|thenable/, // Promise-related rules
      /class|prototype|this/, // OOP-related rules
      /switch|ternary|condition/, // Control flow rules
      /typeof|instanceof/, // Type checking rules
      /null|undefined/, // Null/undefined handling
      /template/, // Template literal rules
      /array|buffer/, // Array/Buffer rules
      /numeric-separators/, // Numeric separator rules
      /builtin/, // Built-in rules
      /abbreviation/, // Abbreviation rules
      /explicit-length/, // Explicit length rules
      /escape-case/, // Escape case rules
      /number-literal/, // Number literal rules
      /text-encoding/, // Text encoding rules
    ],
  )],
  ['@stylistic', createPluginConfig(
    '@stylistic',
    // Rules that make sense for CSS files
    [
      'eol-last', // Always end files with newline
      'no-trailing-spaces', // No trailing whitespace
      'no-multiple-empty-lines', // Limit consecutive empty lines
      'no-mixed-spaces-and-tabs', // Consistent indentation
      'spaced-comment', // Require space after /* in comments
      'no-tabs', // Use spaces, not tabs (CSS convention)
    ],
    // Rules to explicitly disable
    [
      'max-len', // CSS can have long lines (selectors, Tailwind classes)
      'no-multi-spaces', // CSS often aligns property values
    ],
    undefined, // No keep patterns
    [
      // Disable all JavaScript-specific patterns
      /^array-/, // Array formatting
      /^arrow-/, // Arrow function formatting
      /^block-/, // Block statement formatting
      /^brace-/, // Brace formatting
      /^comma-/, // Comma formatting (JS-specific)
      /^computed-/, // Computed property formatting
      /^dot-/, // Member access formatting
      /^function-/, // Function formatting
      /^generator-/, // Generator formatting
      /^jsx-/, // JSX formatting
      /^key-/, // Object key formatting
      /^keyword-/, // Keyword spacing
      /^lines-/, // Line-based rules (JS-specific)
      /^max-/, // Max rules (JS-specific metrics)
      /^member-/, // Member formatting
      /^new-/, // Constructor formatting
      /^object-/, // Object formatting
      /^operator-/, // Operator formatting
      /^paren/, // Parenthesis formatting
      /^quote/, // Quote formatting
      /^rest-/, // Rest parameter formatting
      /^semi/, // Semicolon rules
      /^space-/, // Space rules (JS-specific)
      /^template-/, // Template literal formatting
      /^type-/, // TypeScript type formatting
      /^wrap-/, // Wrapping rules
      /^yield-/, // Yield formatting
      /indent/, // Indentation (too JS-specific)
      /bracket/, // Bracket formatting
      /curly/, // Curly brace formatting
      /padded-blocks/, // Block padding (JS-specific)
      /no-extra-/, // Extra character rules (JS-specific)
      /no-floating/, // Number formatting
      /no-mixed-operators/, // Operator mixing (JS-specific)
      /no-whitespace/, // Whitespace before property (JS-specific)
      /multiline/, // Multiline constructs (JS-specific)
    ],
  )],
]);

// Analyze a config and process rules for CSS files
function analyzeConfigForCSSRules(
  config: Linter.Config | Record<string, unknown>,
  rulesToDisable: Set<string>,
): void {
  const rules = 'rules' in config ? config.rules : config;
  if (!rules) return;

  for (const [ruleName, ruleValue] of Object.entries(rules)) {
    // Skip if already disabled
    if (ruleValue === 'off' || ruleValue === 0) continue;

    // Split the rule name
    const { pluginName, rulePart } = splitRuleName(ruleName);

    // 1. Skip if it's a plugin we always keep
    if (ALWAYS_KEEP_PLUGINS.has(pluginName)) continue;

    // 2. Disable if it's a plugin we always disable
    if (ALWAYS_DISABLE_PLUGINS.has(pluginName)) {
      rulesToDisable.add(ruleName);
      continue;
    }

    // 3. Check known plugins with complex configurations
    const pluginConfig = KNOWN_PLUGINS.get(pluginName);
    if (pluginConfig) {
      // Check if it's in always keep rules
      if (pluginConfig.alwaysKeepRules.has(rulePart)) {
        continue;
      }

      // Check if it's in always disable rules
      if (pluginConfig.alwaysDisableRules.has(rulePart)) {
        rulesToDisable.add(ruleName);
        continue;
      }

      // Check keep patterns
      if (pluginConfig.alwaysKeepPatterns.some(pattern => pattern.test(rulePart))) {
        continue;
      }

      // Check disable patterns
      if (pluginConfig.alwaysDisablePatterns.some(pattern => pattern.test(rulePart))) {
        rulesToDisable.add(ruleName);
        continue;
      }

      // Rule doesn't match anything - warn and add to disable set
      warn(`Unknown rule '${ruleName}' in CSS config. Adding to disable set.`);
      pluginConfig.alwaysDisableRules.add(rulePart);
      rulesToDisable.add(ruleName);
      continue;
    }

    // 4. Unknown plugin - warn and add catch-all disable
    if (pluginName) {
      warn(`Unknown plugin '${pluginName}' detected in CSS config. Adding to always disable list.`);
      ALWAYS_DISABLE_PLUGINS.add(pluginName);
      rulesToDisable.add(ruleName);
    }
  }
}

// Get all JavaScript-specific rules that should be disabled for CSS files
function getJavaScriptRulesToDisable(): Record<string, 'off'> {
  const rulesToDisable = new Set<string>();

  // 1. Process plugin rules directly
  const plugins = [
    { name: 'unicorn', plugin: unicornPlugin },
    { name: '@stylistic', plugin: stylisticPlugin },
  ];

  for (const { name, plugin } of plugins) {
    if (plugin.rules) {
      // Create a fake config with all plugin rules enabled
      const allRulesConfig = {
        rules: Object.fromEntries(
          Object.keys(plugin.rules).map(ruleName => [`${name}/${ruleName}`, 'error']),
        ),
      };
      analyzeConfigForCSSRules(allRulesConfig, rulesToDisable);
    }
  }

  // 2. Also analyze actual configs to catch core ESLint rules and any custom rules
  const configs = [
    eslintRecommended,
    unicornRecommended,
    stylisticRecommended,
    poupeUnicornRules,
    poupeStylisticRules,
    poupeCssRules,
  ];

  for (const config of configs) {
    analyzeConfigForCSSRules(config, rulesToDisable);
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
      ...poupeCssRules,
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
