# Examples

This directory contains example projects demonstrating how to use
`@poupe/eslint-config` in different scenarios:

## playground-standard

Basic usage with standard JavaScript/TypeScript projects.

```js
import { defineConfig } from '@poupe/eslint-config';
export default defineConfig();
```

## playground-nuxt

Integration with Nuxt.js applications.

```js
import { forNuxt } from '@poupe/eslint-config/nuxt';
import withNuxt from './.nuxt/eslint.config.mjs';
export default withNuxt(...forNuxt());
```

## playground-nuxt-module

Configuration for Nuxt module development.

```js
import { createConfigForNuxt } from '@nuxt/eslint-config/flat';
import { forNuxtModules } from '@poupe/eslint-config/nuxt';
export default createConfigForNuxt({...}, ...forNuxtModules());
```

## Running Examples

From the root directory, you can use pnpm workspace commands:

```bash
# Lint all examples
pnpm -r --filter "./examples/*" lint

# Fix lint issues in all examples
pnpm -r --filter "./examples/*" lint:fix

# Run a specific example
pnpm --filter "@poupe/eslint-config-playground-standard" lint
```
