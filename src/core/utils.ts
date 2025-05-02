import { type Rules } from './types';

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
