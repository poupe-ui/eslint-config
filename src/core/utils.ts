import { type Config, type Plugin, type Rules } from './config';

type Plugins = NonNullable<Config['plugins']>;

/**
 * Creates a new object by removing specified keys from the input object.
 *
 * @remarks
 * This function performs a shallow copy; nested objects are not cloned.
 *
 * @typeParam T - The type of the input object. Must extend `object`.
 * @typeParam K - The type union of literal string keys to be removed. Must be a string key of `T`.
 *
 * @param object - The source object to remove keys from. Its type is `T`.
 * @param keys - A rest parameter array of keys to be removed from the object. Each key must be of type `K`.
 * @returns A new object of type `Omit<T, K>` with the specified keys omitted.
 */
export const without = <T extends object, K extends keyof T & string>(
  object: T,
  ...keys: K[]
): Omit<T, K> => {
  const keysToRemove = new Set<string>(keys);
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => !keysToRemove.has(key)),
  ) as Omit<T, K>;
};

/**
 * A specific version of `without` tailored for ESLint rule objects.
 *
 * @param rules - The ESLint rules object. Defaults to an empty object if not provided.
 * @param keys - Rule names (strings) to be removed from the rules object.
 * @returns A new rules object with the specified rule names omitted.
 */
export const withoutRules = (rules: Rules = {}, ...keys: string[]): Rules => without(rules, ...keys);

/**
 * Helper function to remove plugins from a single config
 */
const removePluginsFromConfig = (config: Config, pluginsToRemove?: string[]): Config => {
  // If this config doesn't have plugins, return as-is
  if (!config.plugins) {
    return config;
  }

  // If no plugins specified or empty array, remove all plugins
  if (!pluginsToRemove || pluginsToRemove.length === 0) {
    return without(config, 'plugins');
  }

  // Create a new plugins object without the specified plugins
  const remainingPlugins: Plugins = {};
  for (const [name, plugin] of Object.entries(config.plugins)) {
    if (!pluginsToRemove.includes(name)) {
      remainingPlugins[name] = plugin;
    }
  }

  // If no plugins remain, omit the plugins property entirely
  if (Object.keys(remainingPlugins).length === 0) {
    return without(config, 'plugins');
  }

  // Return config with remaining plugins
  return {
    ...config,
    plugins: remainingPlugins,
  };
};

/**
 * Filters out plugin references from configs.
 * Removes the plugin from the plugins object but keeps any configuration that doesn't require the plugin.
 *
 * @param pluginNames - Optional plugin name(s) to remove (e.g., 'unicorn', '`@stylistic`'). Can be a string or array of strings. If not provided, removes all plugins.
 * @param configs - Variadic array of ESLint configs
 * @returns New array of configs with the specified plugin(s) removed
 */
export const withoutPlugin = (pluginNames?: string | string[], ...configs: Config[]): Config[] => {
  // Normalize plugin names to array or undefined
  const pluginsToRemove = pluginNames ?
    (Array.isArray(pluginNames) ? pluginNames : [pluginNames]) :
    undefined;

  return configs.map((config) => removePluginsFromConfig(config, pluginsToRemove));
};

/**
 * Reconciles duplicate plugin instances across an array of ESLint configs.
 *
 * When configs from multiple sources are combined, they may carry different
 * physical copies of the same plugin (e.g. two instances of `eslint-plugin-unicorn`
 * from separate `node_modules` trees). ESLint's `FlatConfigComposer` treats these
 * as conflicts. This function deduplicates them using a first-wins strategy.
 *
 * For each plugin name encountered:
 * - First occurrence: stored as the canonical instance
 * - Subsequent occurrence with a different instance: replaced with the first
 * - Same instance: no-op
 *
 * Only configs whose plugins were modified are cloned; all others pass through
 * by reference.
 *
 * @param configs - Array of ESLint flat configs to reconcile
 * @returns A new array with duplicate plugin instances replaced by their first occurrence
 */
export function reconcilePlugins(configs: Config[]): Config[] {
  const canonical = new Map<string, Plugin>();
  let changed = false;

  const result = configs.map((config) => {
    if (!config.plugins) {
      return config;
    }

    // First pass — register canonical instances, detect conflicts
    let configChanged = false;
    for (const [name, plugin] of Object.entries(config.plugins)) {
      if (!canonical.has(name)) {
        canonical.set(name, plugin);
      } else if (canonical.get(name) !== plugin) {
        configChanged = true;
      }
    }

    if (!configChanged) {
      return config;
    }

    // Second pass — build reconciled plugins (only when conflicts exist)
    changed = true;
    const reconciled: Plugins = {};
    for (const [name, plugin] of Object.entries(config.plugins)) {
      reconciled[name] = canonical.get(name) ?? plugin;
    }

    return { ...config, plugins: reconciled };
  });

  return changed ? result : configs;
}
