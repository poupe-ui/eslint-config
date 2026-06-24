# Examples

This directory contains example projects demonstrating how to use
`@poupe/eslint-config` in different scenarios:

## playground-standard

Basic usage with standard JavaScript/TypeScript projects. Inherits
`eslint`/`@eslint/js` from the workspace (currently ESLint 10) and pins
TypeScript 6 — the upper bound of the supported range.

```js
import { defineConfig } from '@poupe/eslint-config';
export default defineConfig();
```

## playground-eslint9

Like `playground-standard`, but pinned to ESLint 9 and TypeScript 5.9 — the
lower bounds of the supported ranges — so both ends of each peer range stay
exercised.

## playground-nuxt

Integration with Nuxt.js applications.

```js
import { withPoupe } from '@poupe/eslint-config';
import withNuxt from './.nuxt/eslint.config.mjs';
export default withPoupe(withNuxt());
```

## playground-nuxt-module

Configuration for Nuxt module development.

```js
import { createConfigForNuxt } from '@nuxt/eslint-config/flat';
import { withPoupe } from '@poupe/eslint-config';
export default withPoupe(createConfigForNuxt({
  features: { tooling: true, stylistic: true },
}));
```

## Running Examples

From the root directory, you can use pnpm workspace commands:

```bash
# Check all examples without fixing
pnpm -r --filter "./examples/*" lint:check

# Lint and fix all examples
pnpm -r --filter "./examples/*" lint

# Run a specific example
pnpm --filter "playground-standard" lint
```
