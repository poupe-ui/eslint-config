// TypeScript 7 side-by-side usage test
import { defineConfig } from '@poupe/eslint-config';

export default defineConfig({
  languageOptions: {
    globals: {
      console: 'readonly',
      process: 'readonly',
    },
  },
});
