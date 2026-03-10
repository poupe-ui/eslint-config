import unicornPlugin from 'eslint-plugin-unicorn';
import { describe, expect, it } from 'vitest';

import type { Config } from '../config';

import { reconcilePlugins } from '../utils';

// Distinct objects with the same shape — identity checks distinguish them
const pluginA1 = { rules: {} };
const pluginA2 = { rules: {} };
const pluginB = { rules: {} };
const pluginC = { rules: {} };

describe('reconcilePlugins', () => {
  it('synthetic mocks are structurally equal but distinct references', () => {
    expect(pluginA1).toEqual(pluginA2);
    expect(pluginA1).not.toBe(pluginA2);
  });

  it('should return the same array when no duplicates exist', () => {
    const configs: Config[] = [
      { plugins: { a: pluginA1 } },
      { plugins: { b: pluginB } },
    ];

    const result = reconcilePlugins(configs);

    expect(result).toBe(configs);
  });

  it('should replace duplicate plugin instances with the first occurrence', () => {
    const configs: Config[] = [
      { plugins: { unicorn: pluginA1 } },
      { plugins: { unicorn: pluginA2 } },
    ];

    const result = reconcilePlugins(configs);

    expect(result[0].plugins!.unicorn).toBe(pluginA1);
    expect(result[1].plugins!.unicorn).toBe(pluginA1);
  });

  it('should not replace when the same instance is reused', () => {
    const configs: Config[] = [
      { plugins: { a: pluginA1 } },
      { plugins: { a: pluginA1 } },
    ];

    const result = reconcilePlugins(configs);

    expect(result).toBe(configs);
  });

  it('should pass through configs without plugins unchanged', () => {
    const configWithRules: Config = { rules: { 'no-console': 'error' } };
    const configs: Config[] = [
      { plugins: { a: pluginA1 } },
      configWithRules,
      { plugins: { a: pluginA2 } },
    ];

    const result = reconcilePlugins(configs);

    expect(result[1]).toBe(configWithRules);
  });

  it('should handle multiple plugins per config', () => {
    const configs: Config[] = [
      { plugins: { a: pluginA1, b: pluginB } },
      { plugins: { a: pluginA2, c: pluginC } },
    ];

    const result = reconcilePlugins(configs);

    expect(result[0].plugins!.a).toBe(pluginA1);
    expect(result[0].plugins!.b).toBe(pluginB);
    expect(result[1].plugins!.a).toBe(pluginA1);
    expect(result[1].plugins!.c).toBe(pluginC);
  });

  it('should only clone configs whose plugins were modified', () => {
    const config1: Config = { plugins: { a: pluginA1 } };
    const config2: Config = { plugins: { b: pluginB } };
    const config3: Config = { plugins: { a: pluginA2 } };

    const result = reconcilePlugins([config1, config2, config3]);

    // config1 and config2 untouched
    expect(result[0]).toBe(config1);
    expect(result[1]).toBe(config2);
    // config3 cloned with reconciled plugin
    expect(result[2]).not.toBe(config3);
    expect(result[2].plugins!.a).toBe(pluginA1);
    // original config3 not mutated
    expect(config3.plugins!.a).toBe(pluginA2);
  });

  it('should handle an empty array', () => {
    const result = reconcilePlugins([]);

    expect(result).toEqual([]);
  });

  it('should handle configs with empty plugins objects', () => {
    const configs: Config[] = [
      { plugins: {} },
      { plugins: { a: pluginA1 } },
    ];

    const result = reconcilePlugins(configs);

    expect(result).toBe(configs);
  });

  it('should reconcile across three or more occurrences', () => {
    const pluginA3 = { rules: {} };
    const configs: Config[] = [
      { plugins: { x: pluginA1 } },
      { plugins: { x: pluginA2 } },
      { plugins: { x: pluginA3 } },
    ];

    const result = reconcilePlugins(configs);

    expect(result[0].plugins!.x).toBe(pluginA1);
    expect(result[1].plugins!.x).toBe(pluginA1);
    expect(result[2].plugins!.x).toBe(pluginA1);
  });

  it('should reconcile a real plugin against a structurally identical copy', () => {
    // Simulate what happens when two dependency trees resolve
    // eslint-plugin-unicorn to separate physical copies
    const clonedPlugin = { ...unicornPlugin };

    // The copy is structurally equal but a different object
    expect(clonedPlugin).toEqual(unicornPlugin);
    expect(clonedPlugin).not.toBe(unicornPlugin);

    const upstream: Config = {
      name: 'upstream/unicorn',
      plugins: { unicorn: clonedPlugin },
      rules: { 'unicorn/no-null': 'error' },
    };
    const ours: Config = {
      name: 'poupe/unicorn',
      plugins: { unicorn: unicornPlugin },
      rules: { 'unicorn/no-array-for-each': 'error' },
    };

    const result = reconcilePlugins([ours, upstream]);

    // First wins — our instance is canonical
    expect(result[0]).toBe(ours);
    expect(result[0].plugins!.unicorn).toBe(unicornPlugin);
    // Upstream's copy replaced with ours
    expect(result[1].plugins!.unicorn).toBe(unicornPlugin);
    // Upstream's rules and name preserved
    expect(result[1].name).toBe('upstream/unicorn');
    expect(result[1].rules).toEqual({ 'unicorn/no-null': 'error' });
  });

  it('should not modify configs when the same real plugin instance is shared', () => {
    const configs: Config[] = [
      {
        name: 'first',
        plugins: { unicorn: unicornPlugin },
      },
      {
        name: 'second',
        plugins: { unicorn: unicornPlugin },
      },
    ];

    const result = reconcilePlugins(configs);

    // Same instance throughout — no changes, returns original array
    expect(result).toBe(configs);
  });

  it('should preserve non-plugin config properties in cloned configs', () => {
    const configs: Config[] = [
      { plugins: { a: pluginA1 }, rules: { 'rule-1': 'error' } },
      {
        name: 'upstream',
        plugins: { a: pluginA2 },
        rules: { 'rule-2': 'warn' },
        files: ['**/*.ts'],
      },
    ];

    const result = reconcilePlugins(configs);

    expect(result[1].name).toBe('upstream');
    expect(result[1].rules).toEqual({ 'rule-2': 'warn' });
    expect(result[1].files).toEqual(['**/*.ts']);
    expect(result[1].plugins!.a).toBe(pluginA1);
  });
});
