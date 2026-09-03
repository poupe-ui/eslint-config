# Examples

This directory contains example projects demonstrating how to use
`@poupe/eslint-config` in different scenarios:

## playground-standard

Basic usage with standard JavaScript/TypeScript projects. Inherits
`eslint`/`@eslint/js` from the workspace (currently ESLint 10) and pins
TypeScript 6 — the major the preset declares for its own parsing.

```js
import { defineConfig } from '@poupe/eslint-config';
export default defineConfig();
```

## playground-eslint9

Like `playground-standard`, but pinned to ESLint 9 — the lower bound of the
peer range — and to TypeScript 5.9, so the suite lints at both ends of the
ESLint range and type-checks the declarations with both compilers.

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
