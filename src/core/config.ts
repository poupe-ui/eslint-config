import { defineConfig as configFactory } from 'eslint/config';

import { reconcilePlugins } from './utils';

export { Linter } from 'eslint';

export type InfiniteDepthConfigWithExtends = Parameters<typeof configFactory>[number];
export type Config = ReturnType<typeof configFactory>[number];
export type Rules = Config['rules'] & {};

// @eslint/core's Plugin type is contravariant with language-specific
// rule contexts (e.g. @eslint/css, eslint-plugin-jsonc). Real plugin
// objects need `as unknown as Plugin` casts in config files.
export type Plugin = NonNullable<Config['plugins']>[string];

/**
 * Type-safe config builder that flattens nested configs, resolves `extends`,
 * and reconciles duplicate plugin instances (first-wins).
 */
export function withConfig(
  ...configs: InfiniteDepthConfigWithExtends[]
): Config[] {
  return reconcilePlugins(configFactory(...configs));
}
