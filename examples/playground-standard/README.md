# Standard Playground

Example of a standard JavaScript/TypeScript project using
`@poupe/eslint-config`. Unlike the other playgrounds, it does **not** pin
`eslint`/`@eslint/js`; it inherits them from the workspace as the peer
dependencies they are, so it always exercises whatever ESLint major the
repo ships (currently **v10**). It does pin **TypeScript 6**, the upper
bound of the supported range, so the generated type declarations are
type-checked against the newest supported compiler. For the lower bounds of
both ranges, see [`playground-eslint9`](../playground-eslint9).

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

- [ESLint 9 playground](../playground-eslint9) - ESLint 9 + TypeScript 5.9
- [Nuxt app example](../playground-nuxt) - For Nuxt.js applications
- [Nuxt module example](../playground-nuxt-module) - For module development
