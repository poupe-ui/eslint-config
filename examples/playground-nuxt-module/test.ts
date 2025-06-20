// Test TypeScript file for Nuxt module
import { defineNuxtModule } from '@nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: 'test-module',
    configKey: 'testModule',
  },
  setup() {
    console.log('Module setup');
  },
});
