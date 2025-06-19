// @ts-check
// Nuxt project test
import { forNuxt } from '../dist/nuxt.mjs';

// Mock the Nuxt eslint config since we don't have .nuxt directory
const withNuxt = (config) => config;

export default withNuxt(...forNuxt());