import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit';

// Module options TypeScript interface definition
export interface ModuleOptions {
  // Add module options here
  enabled?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'playground-module',
    configKey: 'playgroundModule',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup() {
    const resolver = createResolver(import.meta.url);

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'));
  },
});
