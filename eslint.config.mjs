// @ts-check
import { defineConfig } from './dist/index.mjs';

export default defineConfig(undefined, {
  rules: {
    '@stylistic/semi': ['error', 'always'],
  },
});
