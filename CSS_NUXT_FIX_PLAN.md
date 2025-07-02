# Plan: Fix CSS Support for Nuxt with @nuxt/eslint v1.5.0

## Problem Analysis

### Current Situation

1. **Nuxt pre-loads plugins** like `@stylistic` for JavaScript/TypeScript
   files through `createConfigForNuxt`
2. **Our CSS configuration** doesn't include these plugins since we only
   load `@eslint/css`
3. **The processCSSConfigs function** adds a configuration that disables
   JavaScript rules for CSS files
4. **ESLint error**: "Could not find plugin '@stylistic'" when rules
   reference it for CSS files

### Root Cause

- Nuxt configurations include rules like `@stylistic/arrow-parens` that
  apply globally
- When our CSS config is processed, it inherits these rules but doesn't
  have the plugin loaded
- ESLint's flat config requires plugins to be available in the same
  configuration object where their rules are used

## Solution Options

### Option 1: Smart Plugin Detection in processCSSConfigs (Recommended)

Make `processCSSConfigs` smarter by:

1. Detecting which plugins are referenced in rules across all configurations
2. Ensuring those plugins are loaded in the CSS-specific configuration
3. Then disabling their JavaScript-specific rules

**Pros:**

- Automatic and works with any Nuxt version
- No manual plugin management needed
- Handles future plugin additions

**Cons:**

- More complex implementation
- Need to maintain plugin imports

### Option 2: Explicit Plugin Loading for Nuxt

Modify the Nuxt-specific configurations to explicitly load all plugins
that Nuxt uses:

1. Import and include `@stylistic`, `regexp`, etc. in CSS configs for Nuxt
2. Keep the existing rule disabling logic

**Pros:**

- Simpler implementation
- Clear what's happening

**Cons:**

- Need to track what plugins Nuxt uses
- May break with Nuxt updates

### Option 3: Filter Out Plugin Rules Without Loading

Instead of trying to disable rules, filter them out entirely from CSS configurations:

1. Process configs to remove any rules that would apply to CSS files
2. Don't add them in the first place

**Pros:**

- No plugin loading needed
- Cleaner approach

**Cons:**

- May interfere with Nuxt's config merging
- Could miss legitimate CSS rules

## Recommended Implementation (Option 1)

### Step 1: Update css-filter.ts

```typescript
// Add plugin imports at the top
import stylisticPlugin from '@stylistic/eslint-plugin';
import regexpPlugin from 'eslint-plugin-regexp';
// ... other plugins that Nuxt might use

// Update processCSSConfigs function
export function processCSSConfigs(configs: Config[]): Config[] {
  // 1. Analyze all configs to find referenced plugins
  const referencedPlugins = new Set<string>();
  const rulesToDisable = new Set<string>();

  for (const config of configs) {
    if (config.rules) {
      for (const ruleName of Object.keys(config.rules)) {
        const { pluginName } = splitRuleName(ruleName);
        if (pluginName) {
          referencedPlugins.add(pluginName);
        }
      }
    }
    analyzeConfigForCSSRules(config, rulesToDisable);
  }

  // 2. Build plugins object for CSS config
  const cssPlugins: Record<string, any> = {};

  // Map of known plugins
  const pluginMap: Record<string, any> = {
    '@stylistic': stylisticPlugin,
    'regexp': regexpPlugin,
    'unicorn': unicornPlugin,
    // Add more as needed
  };

  for (const pluginName of referencedPlugins) {
    if (pluginMap[pluginName]) {
      cssPlugins[pluginName] = pluginMap[pluginName];
    }
  }

  // 3. Create CSS-specific config with plugins and disabled rules
  return [
    ...configs,
    {
      name: 'poupe/css-disable-js-rules',
      files: ['**/*.css'],
      plugins: cssPlugins, // Include all referenced plugins
      rules: Object.fromEntries(
        Array.from(rulesToDisable).map(rule => [rule, 'off'])
      ),
    },
  ];
}
```

### Step 2: Update Dependencies

Ensure we have all plugins that Nuxt might use:

```json
{
  "dependencies": {
    "eslint-plugin-regexp": "^2.x.x",
    // ... other plugins
  }
}
```

### Step 3: Test with Nuxt Examples

1. Build the package with updated code
2. Test with playground-nuxt
3. Test with playground-nuxt-module
4. Verify CSS files are linted correctly

### Step 4: Handle Edge Cases

- Plugins that don't exist in our deps
- Dynamic plugin loading
- Performance considerations

## Alternative Minimal Fix (Quick Solution)

If we need a quick fix for v0.7.11:

```typescript
// In css.ts, add for Nuxt configs only:
export const cssRecommendedForNuxt: Config[] = [
  {
    name: 'poupe/css',
    files: ['**/*.css'],
    language: 'css/css',
    languageOptions: {
      customSyntax: extendedTailwindSyntax,
    },
    plugins: {
      css: pluginCSS,
      '@stylistic': stylisticPlugin, // Add this
      // Add other plugins Nuxt uses
    },
    rules: {
      ...pluginCSS.configs.recommended.rules,
      ...poupeRules,
      // Disable all stylistic rules for CSS
      ...Object.fromEntries(
        Object.keys(stylisticPlugin.rules).map(rule => [`@stylistic/${rule}`, 'off'])
      ),
    },
  },
];
```

## Current Status (2025-07-02)

### Branch: test/nuxt-css-rules-v1.5.0

### What We've Done

1. Created `processCSSConfigs` helper in `src/configs/css-filter.ts` that:
   - For Nuxt contexts, injects plugins needed for CSS files
   - Places this config FIRST in the returned array
   - Adds a config at the end to disable JS-specific rules for CSS files

2. Updated `src/nuxt.ts` to:
   - Use `withoutPlugin('unicorn', unicornRecommended)` for non-CSS files
   - Call `processCSSConfigs(configs, 'nuxt')` to handle CSS properly
   - Same pattern for both `forNuxt` and `forNuxtModules`

3. Updated both playground examples to use @nuxt/eslint v1.5.0

### Key Implementation Details

```typescript
// In forNuxt:
const [unicornWithoutPlugin] = withoutPlugin('unicorn', unicornRecommended);
const configs = withConfig(
  unicornWithoutPlugin,  // No plugin to avoid conflicts
  sharedNuxtRules,
  userConfigs,
);
return processCSSConfigs(configs, 'nuxt');  // Adds plugins for CSS

// In processCSSConfigs for Nuxt:
return [
  cssPluginsConfig,      // First: @stylistic and unicorn for CSS files
  ...configs,            // Then: our configs
  disableJsRulesConfig,  // Last: disable JS rules for CSS
];
```

### Key Findings

- Nuxt's configs come before ours when using `withNuxt(...forNuxt())`
- Empirically, Nuxt doesn't provide @stylistic and unicorn plugins for CSS files
- We must avoid plugin conflicts by using `withoutPlugin` for non-CSS configs
- Then inject the plugins specifically for CSS files

### Files Modified

- `src/nuxt.ts` - Updated forNuxt and forNuxtModules
- `src/configs/css-filter.ts` - Refactored processCSSConfigs
- `src/configs/css.ts` - Removed getJavaScriptRulesToDisable import
- `examples/playground-nuxt-module/package.json` - Updated @nuxt/eslint to ^1.5.0
- `pnpm-lock.yaml` - Updated dependencies

### Next Steps After /clear

1. Run `pnpm -F playground-nuxt lint:fix` to test
2. Run `pnpm -F playground-nuxt-module lint:fix` to test
3. Fix any remaining issues
4. Run `pnpm lint:all` to ensure everything works
5. Commit changes and create PR

## Timeline

1. **Immediate (v0.7.13)**: Ship processCSSConfigs fix for Nuxt
2. **Next minor (v0.8.0)**: Consider more robust plugin detection
3. **Future**: Consider proposing upstream fix to @nuxt/eslint-config

## Testing Strategy

1. Create test cases with various Nuxt configurations
2. Ensure CSS files are properly linted without errors
3. Verify JavaScript rules don't apply to CSS files
4. Test with both Nuxt app and module examples
5. Performance testing with large projects
