# ESLint 9 Playground

Standard JavaScript/TypeScript example pinned to **ESLint 9** — the lower
bound of the `@poupe/eslint-config` peer range (`eslint@^9.39.4 || ^10`) —
and to **TypeScript 5.9**.

It pairs with [`playground-standard`](../playground-standard) (which tracks
the current default, ESLint 10, and pins TypeScript 6) so that linting the
suite exercises the configuration at both ends of the ESLint range. The
TypeScript pins serve `type-check`, which reads each playground's own
compiler, so the generated declarations are checked against both. Linting
parses through the compiler the preset resolves in either playground.

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
