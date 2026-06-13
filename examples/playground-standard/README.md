# Standard Playground

Example of a standard JavaScript/TypeScript project using
`@poupe/eslint-config`. Unlike the other playgrounds, it does **not** pin
`eslint`/`@eslint/js`; it inherits them from the workspace as the peer
dependencies they are, so it always exercises whatever ESLint major the
repo ships (currently **v10**). For an explicitly pinned lower bound, see
[`playground-eslint9`](../playground-eslint9).

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

- [ESLint 9 playground](../playground-eslint9) - Same setup on the held lower bound
- [Nuxt app example](../playground-nuxt) - For Nuxt.js applications
- [Nuxt module example](../playground-nuxt-module) - For module development
