import {
  eslintRecommended,
  markdownlintRecommended,
  poupeConfigs,
  poupeCSSConfigs,
  stylisticRecommended,
  tsdocRecommended,
  tseslintRecommended,

  unicornRecommended,
  vueRecommended,
  vueSetupConfig,
} from './configs';
import {
  processCSSConfigs,
} from './configs/css-filter';
import {
  type Config,
  type InfiniteDepthConfigWithExtends,

  withConfig,
} from './core';

export type { Config, InfiniteDepthConfigWithExtends, Plugin, Rules } from './core';
export { Linter, reconcilePlugins, withConfig } from './core';
export * from './core/globs';

/**
 * Composes Poupe ESLint configs on top of an upstream config.
 *
 * Awaits the upstream config (which may be a `FlatConfigComposer`
 * from `createConfigForNuxt` / `withNuxt`, a `Promise`, or a plain
 * array), appends the full Poupe config set, and reconciles duplicate
 * plugin instances automatically.
 *
 * @param upstream - Upstream config array or awaitable (e.g. `FlatConfigComposer`)
 * @param userConfigs - Optional user config overrides (applied last)
 * @returns Reconciled config array ready for ESLint
 */
export async function withPoupe(
  upstream:
    Config[] |
    PromiseLike<Config[]>,
  ...userConfigs: InfiniteDepthConfigWithExtends[]
): Promise<Config[]> {
  const upstreamConfigs = await upstream as Config[];
  return withConfig(upstreamConfigs, ...defineConfig(...userConfigs));
}

export function defineConfig(...userConfigs: InfiniteDepthConfigWithExtends[]): Config[] {
  const configs = withConfig(
    {
      ignores: [
        '**/dist',
        '**/node_modules',
      ],
    },

    eslintRecommended,
    tseslintRecommended,

    markdownlintRecommended,
    stylisticRecommended,
    tsdocRecommended,
    unicornRecommended,
    vueRecommended,

    vueSetupConfig,

    poupeConfigs,
    poupeCSSConfigs,
    userConfigs,
  );

  return processCSSConfigs(configs);
}
