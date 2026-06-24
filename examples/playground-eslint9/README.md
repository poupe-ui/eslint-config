# ESLint 9 Playground

Standard JavaScript/TypeScript example pinned to **ESLint 9** and
**TypeScript 5.9** — the lower bounds of the `@poupe/eslint-config` peer
ranges (`eslint@^9.39.4 || ^10`, `typescript@>=5.9.0 <6.1.0`).

It pairs with [`playground-standard`](../playground-standard) (which tracks
the current default, ESLint 10, and pins TypeScript 6) so that linting and
type-checking the suite exercise the configuration and its generated
declarations across both ends of each range.

## Usage

```js
import { defineConfig } from '@poupe/eslint-config';

export default defineConfig({
  // Additional configuration
});
```

## Development

```bash
# Install dependencies
pnpm install

# Lint and fix
pnpm lint

# Check without fixing
pnpm lint:check
```

## Related Examples

- [Standard playground](../playground-standard) - ESLint 10 + TypeScript 6
- [Nuxt app example](../playground-nuxt) - For Nuxt.js applications
- [Nuxt module example](../playground-nuxt-module) - For module development
