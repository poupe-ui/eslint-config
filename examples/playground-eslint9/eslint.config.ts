// ESLint 9 usage test
import { defineConfig } from '@poupe/eslint-config';

export default defineConfig({
  languageOptions: {
    globals: {
      console: 'readonly',
      process: 'readonly',
    },
  },
});
