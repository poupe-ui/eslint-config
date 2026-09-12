# TypeScript 7 Playground

Standard JavaScript/TypeScript example whose only compiler is
**TypeScript 7**, declared the ordinary way:

```json
"typescript": "^7.0.2"
```

`tsc` in this directory is the native compiler.

## How it lints

TypeScript 7 is a different package rather than a version bump. Its main
export exposes version information, and the JavaScript compiler API sits
behind `./unstable/*` subpaths. `typescript-eslint` reads
`ts.versionMajorMinor` at module load and throws on major 7.

`@poupe/eslint-config` declares its own TypeScript 6 in `dependencies`.
`typescript` is a peer dependency of `typescript-eslint`, and a peer
resolves from the nearest dependent that provides it, so the preset's
`typescript-eslint` chain — parser, typescript-estree, type-utils and
utils — binds to 6.0.3 while `tsc` here is 7.0.2.

## What this shows, and what it does not

`pnpm lint:check` and `pnpm type-check` both pass: ESLint loads without
hitting the version guard, and the native compiler type-checks the
sources, `eslint.config.ts` included — that file imports the preset, so
the check reads its generated declarations.

It does not show how the preset behaves when installed from a registry.
This playground links the preset through the pnpm workspace, so
resolution runs through the repository root, where a TypeScript 6 is
present however the preset declares it. Moving that declaration out of
the preset does not make this playground fail.

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

# Type-check on the native TypeScript 7 compiler
pnpm type-check
```

## Related Examples

- [Standard playground](../playground-standard) - ESLint 10 + TypeScript 6
- [ESLint 9 playground](../playground-eslint9) - ESLint 9 + TypeScript 5.9
- [Nuxt app example](../playground-nuxt) - For Nuxt.js applications
- [Nuxt module example](../playground-nuxt-module) - For module development
