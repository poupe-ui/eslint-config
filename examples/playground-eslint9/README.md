# ESLint 9 Playground

Standard JavaScript/TypeScript example pinned to **ESLint 9**, the lower
bound of the `@poupe/eslint-config` dual peer range
(`eslint@^9.39.4 || ^10`).

It mirrors [`playground-standard`](../playground-standard) (which tracks
the current default, ESLint 10) so that `pnpm -r lint` exercises the same
configuration on both supported majors.

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

- [Standard playground](../playground-standard) - Same setup on ESLint 10
- [Nuxt app example](../playground-nuxt) - For Nuxt.js applications
- [Nuxt module example](../playground-nuxt-module) - For module development
