import { type Config, type Rules } from './config';

type Plugins = NonNullable<Config['plugins']>;

/**
 * Creates a new object by removing specified keys from the input object.
 *
 * @remarks
 * This function performs a shallow copy; nested objects are not cloned.
 *
 * @typeParam K - The type union of literal string keys to be removed. Must extend `string`.
 * @typeParam T - The type of the input object. Must be a record where keys are of type `K`.
 *
 * @param object - The source object to remove keys from. Its type is `T`.
 * @param keys - A rest parameter array of keys to be removed from the object. Each key must be of type `K`.
 * @returns A new object of type `Omit<T, K>` with the specified keys omitted.
 */
export const without = <K extends string, T extends Record<K, unknown>>(
  object: T,
  ...keys: K[]
): Omit<T, K> => {
  const keysToRemove = new Set(keys);
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => !keysToRemove.has(key as K)),
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { plugins: _plugins, ...configWithoutPlugins } = config;
    return configWithoutPlugins;
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { plugins: _allPlugins, ...configWithoutPlugins } = config;
    return configWithoutPlugins;
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

  return configs.map(config => removePluginsFromConfig(config, pluginsToRemove));
};
