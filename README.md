# `@poupe/eslint-config`

Sharable ESLint configuration preset for Poupe UI projects with TypeScript,
Vue.js, and Tailwind CSS support.

✅ Includes:

* [eslint recommended rules][eslint-rules]
* [stylistic recommended formatting rules][stylistic]
* [typescript-eslint integration][typescript-eslint]
* [unicorn rules][unicorn]
* [perfectionist rules][perfectionist] for import/export and union type sorting
* [vue recommended rules][vue-rules] with TypeScript support
* [tsdoc rules][tsdoc] for TypeScript documentation
* [markdownlint rules][markdownlint] for Markdown files
* [jsonc rules][jsonc] for JSON and package.json files
* [css rules][css] for CSS files with Tailwind CSS support
* Poupe UI recommended rules

## Getting started

> [!NOTE]
> This preset uses the new [ESLint flat config][flat-config] format and
> requires ESLint v9+ and Node.js v18.20.8+.

Install dependencies:

```sh
pnpm install -D eslint typescript @poupe/eslint-config
```

Create `eslint.config.mjs` in your project root:

```js
// @ts-check
import poupeConfig from '@poupe/eslint-config';

export default poupeConfig;
```

For Nuxt.js applications (with @nuxt/eslint):

```js
// @ts-check
import { forNuxt } from '@poupe/eslint-config/nuxt';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(...forNuxt({
  rules: {
    // custom rule overrides
  },
}));
```

For Nuxt modules (with @nuxt/eslint-config):

```js
// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat';
import { forNuxtModules } from '@poupe/eslint-config/nuxt';

export default createConfigForNuxt({
  features: {
    tooling: true,    // Enables rules for module authors
    stylistic: true,  // Enables formatting rules
  },
}, ...forNuxtModules());
```

Custom configuration:

```js
// @ts-check
import { defineConfig } from '@poupe/eslint-config';

export default defineConfig({
  rules: {
    // rule overrides
  },
});
```

## CSS Support

This configuration includes advanced CSS linting with Tailwind CSS v4 syntax
support. The CSS configuration uses an intelligent filtering system that:

* Applies CSS-specific rules from `@eslint/css`
* Supports Tailwind CSS v4 syntax including theme functions and modifiers
* Automatically disables JavaScript-specific rules for CSS files
* Keeps relevant cross-language rules (like `filename-case` from unicorn)

The filtering system categorizes plugins and rules to ensure only appropriate
rules apply to CSS files. See [AGENT.md](./AGENT.md#css-configuration-system)
for implementation details.

## Supported File Types

This configuration automatically lints the following file types:

* **JavaScript**: `.js`, `.mjs`, `.cjs`
* **TypeScript**: `.ts`, `.tsx`
* **Vue.js**: `.vue` (Single File Components)
* **JSON/JSONC**: `.json`, `.jsonc`, `package.json`
* **Markdown**: `.md`
* **CSS**: `.css` (with Tailwind CSS v4 syntax support)

## Features

### Self-Dogfooding

This package uses its own ESLint configuration for validation, ensuring
quality and serving as a real-world test case.

### Automatic Import/Export Sorting

This configuration includes `eslint-plugin-perfectionist` which automatically
organizes your imports and exports. The sorting happens automatically when you
run `eslint --fix` or save files with ESLint auto-fix enabled in your editor:

```js
// Before
import { z } from 'zod';
import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from './components/Button';
import axios from 'axios';
import type { User } from '../types';
import { config } from './config';

// After (automatically fixed by ESLint)
import type { User } from '../types';

import axios from 'axios';
import React from 'react';
import { z } from 'zod';

import { config } from './config';
import { Button } from './components/Button';
import { useEffect, useState } from 'react';
```

#### Import Grouping with Empty Lines

The configuration respects empty lines as block separators, allowing you to
organize imports into logical groups:

```js
// Core React imports
import React from 'react';
import { useState, useEffect } from 'react';

// External libraries
import axios from 'axios';
import { z } from 'zod';

// Internal modules
import { config } from './config';
import { Button } from './components/Button';
```

Each group separated by empty lines is sorted independently, preserving your
intended organization while maintaining consistent ordering within each group.

### Union Type Sorting

The configuration also includes automatic sorting of TypeScript union types with
`perfectionist/sort-union-types`. Union members are sorted in natural order,
and you can use comments to create logical groups:

```ts
// Before
type Status = 'error' | 'loading' | 'success' | 'idle';

// After (automatically fixed by ESLint)
type Status = 'error' | 'idle' | 'loading' | 'success';

// With comment-based grouping
type Status =
  // Active states
  | 'loading'
  | 'processing'
  // Inactive states
  | 'error'
  | 'idle'
  | 'success';
```

## Advanced Configuration

### Custom Rule Overrides

```js
// @ts-check
import { defineConfig } from '@poupe/eslint-config';

export default defineConfig({
  rules: {
    // Disable specific rules
    'unicorn/filename-case': 'off',

    // Customize rule severity and options
    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
  },
});
```

### Selective Configuration Import

```js
// @ts-check
import { configs, withConfig } from '@poupe/eslint-config';

// Import only specific configurations
export default withConfig(
  configs.javascript,
  configs.typescript,
  configs.stylistic,
  configs.vue,
  // Add custom overrides
  {
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
);
```

## Poupe UI Recommended Rules

In addition to the rules from included plugins, this configuration adds these
custom rules:

### TypeScript Rules

* Enforces explicit return types on exported functions
* Requires consistent type imports (`import type`)
* Disables `@ts-` comment directives

### Vue.js Rules

* Enforces multi-word component names
* Requires `defineEmits` and `defineProps` type declarations
* Ensures proper `v-model` usage patterns

### General JavaScript Rules

* Enforces camelCase naming convention
* Allows `i`, `j`, `k` as loop counters and array indices
* Requires explicit radix in `parseInt`
* Prevents console statements in production code

### Stylistic Rules

* Single quotes for strings
* Semicolons required
* 1tbs (one true brace style)
* 2-space indentation for web files
* 80-character line limit for Markdown

## Migration Guide

### From Legacy ESLint Config

If you're migrating from a legacy `.eslintrc` configuration:

1. **Remove old config files**: Delete `.eslintrc`, `.eslintrc.js`,
   `.eslintrc.json`, etc.

2. **Update dependencies**:

   ```sh
   pnpm remove eslint-config-* eslint-plugin-*
   pnpm install -D eslint@^9 typescript @poupe/eslint-config
   ```

3. **Create new config**: Add `eslint.config.mjs` as shown in Getting Started

4. **Update scripts**: ESLint v9 automatically finds `eslint.config.mjs`

   ```json
   {
     "scripts": {
       "lint": "eslint .",
       "lint:fix": "eslint . --fix"
     }
   }
   ```

5. **Handle breaking changes**:
   * Some rules have been renamed or moved to different plugins
   * The flat config uses different property names (`files` instead of `overrides`)
   * Plugin names are now used as object keys instead of strings

## Examples

The `examples/` directory contains working examples demonstrating how to use
this ESLint configuration in different scenarios:

* **[playground-standard](./examples/playground-standard)** - Basic
  JavaScript/TypeScript projects
* **[playground-nuxt](./examples/playground-nuxt)** - Nuxt.js applications
* **[playground-nuxt-module](./examples/playground-nuxt-module)** - Nuxt module development

### Running Examples

This project uses pnpm workspaces. You can run commands on all examples:

```sh
# Install dependencies for all workspaces
pnpm install

# Lint all examples
pnpm -r --filter "./examples/*" lint

# Fix lint issues in all examples
pnpm -r --filter "./examples/*" lint:fix

# Run a specific example
pnpm --filter "@poupe/eslint-config-playground-standard" lint
```

## Troubleshooting

### Common Issues

#### "Cannot find module '@poupe/eslint-config'"

Ensure you've installed the package and are using the correct import path:

```sh
pnpm install -D @poupe/eslint-config
```

#### "Plugin conflict" errors with Nuxt

For Nuxt applications, make sure to use the appropriate helper:

* Use `forNuxt()` for Nuxt applications
* Use `forNuxtModules()` for Nuxt module development

#### CSS rules applying to JavaScript files

This should not happen with the default configuration. If it does, ensure
you're using the latest version and report an issue.

#### "Unknown rule" warnings

These warnings help the CSS filtering system learn about new rules. They're
informational and don't affect functionality.

### Debugging

To debug ESLint configuration issues:

```sh
# Show resolved configuration for a specific file
eslint --print-config path/to/file.js

# Enable ESLint debug output
DEBUG=eslint:* eslint .

# Debug specific aspects
DEBUG=eslint:eslint eslint .
```

## Development

For AI assistants working with this codebase, refer to [AGENT.md](./AGENT.md)
for detailed guidance and conventions.

### Project Structure

```text
src/
├── configs/        # Individual ESLint rule configurations
├── core/           # Core utilities and type definitions
├── config.ts       # Main configuration builder
├── configs.ts      # Configuration presets
├── index.ts        # Main entry point
└── nuxt.ts         # Nuxt-specific configurations
```

### Contributing

1. Make changes to configuration files in `src/configs/`
2. Run `pnpm build` to compile the package
3. Test with `pnpm lint` (self-linting)
4. Test in examples: `pnpm -r --filter "./examples/*" lint`

## License

MIT

[eslint-rules]: https://eslint.org/docs/latest/rules/
[stylistic]: https://eslint.style/packages/default
[typescript-eslint]: https://typescript-eslint.io/
[unicorn]: https://github.com/sindresorhus/eslint-plugin-unicorn
[perfectionist]: https://perfectionist.dev/
[vue-rules]: https://eslint.vuejs.org/rules/
[tsdoc]: https://github.com/microsoft/tsdoc/tree/main/eslint-plugin
[markdownlint]: https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md
[jsonc]: https://github.com/ota-meshi/eslint-plugin-jsonc
[css]: https://github.com/eslint/css
[flat-config]: https://eslint.org/docs/latest/use/configure/configuration-files
