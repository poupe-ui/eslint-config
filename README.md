# `@poupe/eslint-config`

Sharable ESLint config preset for usage across Poupe UI projects.

✅ Includes:

* [eslint recommended rules][eslint-rules]
* [stylistic recommended formatting rules][stylistic]
* [typescript-eslint integration][typescript-eslint]
* [unicorn rules][unicorn]
* [vue recommended rules][vue-rules] with TypeScript support
* [tsdoc rules][tsdoc] for TypeScript documentation
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

## License

MIT

[eslint-rules]: https://eslint.org/docs/latest/rules/
[stylistic]: https://eslint.style/packages/default
[typescript-eslint]: https://typescript-eslint.io/
[unicorn]: https://github.com/sindresorhus/eslint-plugin-unicorn
[vue-rules]: https://eslint.vuejs.org/rules/
[tsdoc]: https://github.com/microsoft/tsdoc/tree/main/eslint-plugin
[flat-config]: https://eslint.org/docs/latest/use/configure/configuration-files
