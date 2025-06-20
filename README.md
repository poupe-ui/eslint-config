# `@poupe/eslint-config`

Sharable ESLint config preset for usage across Poupe UI projects.

✅ Includes:

* [eslint recommended rules][eslint-rules]
* [stylistic recommended formatting rules][stylistic]
* [typescript-eslint integration][typescript-eslint]
* [unicorn rules][unicorn]
* [vue recommended rules][vue-rules] with TypeScript support
* [tsdoc rules][tsdoc] for TypeScript documentation
* [markdownlint rules][markdownlint] for Markdown files
* Poupe UI recommended rules

## Getting started

> [!NOTE]
> This preset uses the new [ESLint flat config][flat-config].

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

For Nuxt.js projects (with @nuxt/eslint module):

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

## Development

For AI assistants working with this codebase, refer to [AGENT.md](./AGENT.md)
for detailed guidance and conventions.

## License

MIT

[eslint-rules]: https://eslint.org/docs/latest/rules/
[stylistic]: https://eslint.style/packages/default
[typescript-eslint]: https://typescript-eslint.io/
[unicorn]: https://github.com/sindresorhus/eslint-plugin-unicorn
[vue-rules]: https://eslint.vuejs.org/rules/
[tsdoc]: https://github.com/microsoft/tsdoc/tree/main/eslint-plugin
[markdownlint]: https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md
[flat-config]: https://eslint.org/docs/latest/use/configure/configuration-files
