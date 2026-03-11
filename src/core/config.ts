import { config as configFactory } from 'typescript-eslint';

import { reconcilePlugins } from './utils';

export { ESLint, Linter } from 'eslint';

export type InfiniteDepthConfigWithExtends = Parameters<typeof configFactory>[number];
export type Config = ReturnType<typeof configFactory>[number];
export type Rules = Config['rules'] & {};

/**
 * Type-safe config builder that flattens nested configs, resolves `extends`,
 * and reconciles duplicate plugin instances (first-wins).
 */
export function withConfig(
  ...configs: InfiniteDepthConfigWithExtends[]
): Config[] {
  return reconcilePlugins(configFactory(...configs));
}
