# `@poupe/eslint-config`

Sharable ESLint config preset for usage across Poupe UI projects.

✅ Includes:

* [eslint recommended rules](https://eslint.org/docs/latest/rules/)
* [stylistic recommended formatting rules](https://eslint.style/packages/default) ❤️
* [typescript-eslint integration](https://typescript-eslint.io/)
* [unicorn rules](https://github.com/sindresorhus/eslint-plugin-unicorn)
* [vue recommended rules](https://eslint.vuejs.org/rules/) with _typescript_ support.
* Poupe UI recommended rules

## Getting started

> [!NOTE]
> This preset uses the new [ESLint flat config](https://eslint.org/docs/latest/use/configure/configuration-files).

Install dependencies:

```sh
pnpx install -D eslint typescript @poupe/eslint-config
```

Create `eslint.config.mjs` in your project root:

```js
// @ts-check
import { defineConfig } from '@poupe/eslint-config';

export default defineConfig({
  rules: {
    // rule overrides
  },
});
```

**Tips:**

* You can pass any number of flat configs to `defineConfig()`

## License

MIT
