// @ts-check
// Nuxt module test
import { forNuxtModules } from '../dist/nuxt.mjs';

// Mock createConfigForNuxt since we don't have @nuxt/eslint-config
const createConfigForNuxt = (options, ...configs) => configs;

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: true,
  },
  dirs: {
    src: [
      './playground',
    ],
  },
}, ...forNuxtModules());