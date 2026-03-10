import unicornPlugin from 'eslint-plugin-unicorn';
import { describe, expect, it } from 'vitest';

import type { Config } from '../core';

import { defineConfig, withPoupe } from '../config';

// Distinct objects with the same shape — identity checks distinguish them
const pluginA1 = { rules: {} };
const pluginA2 = { rules: {} };
const pluginB = { rules: {} };

class Thenable<T> implements PromiseLike<T> {
  #value: T;
  constructor(value: T) {
    this.#value = value;
  }

  // eslint-disable-next-line unicorn/no-thenable -- intentional PromiseLike mock for testing
  then<R1 = T, R2 = never>(
    onfulfilled?: ((value: T) => PromiseLike<R1> | R1) | null,
  ): PromiseLike<R1 | R2> {
    return Promise.resolve(onfulfilled ? onfulfilled(this.#value) : this.#value as unknown as R1);
  }
}

function makeThenable(configs: Config[]): PromiseLike<Config[]> {
  return new Thenable(configs);
}

describe('withPoupe', () => {
  it('should accept a plain Config[] upstream', async () => {
    const upstream: Config[] = [
      { plugins: { a: pluginA1 }, rules: { 'a/rule-a': 'error' } },
    ];

    const result = await withPoupe(upstream);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(1);
    // upstream config is included at the front
    expect(result[0].rules).toEqual({ 'a/rule-a': 'error' });
  });

  it('should accept a PromiseLike<Config[]> upstream', async () => {
    const upstream: Config[] = [
      { plugins: { b: pluginB }, rules: { 'b/rule-b': 'warn' } },
    ];

    const promise: PromiseLike<Config[]> = Promise.resolve(upstream);
    const result = await withPoupe(promise);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(1);
    expect(result[0].rules).toEqual({ 'b/rule-b': 'warn' });
  });

  it('should accept a thenable (non-Promise PromiseLike)', async () => {
    const upstream: Config[] = [
      { plugins: { b: pluginB } },
    ];

    // Simulate FlatConfigComposer which extends PromiseLike<Config[]>
    // but is not itself a Promise.
    const thenable = makeThenable(upstream);
    const result = await withPoupe(thenable);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(1);
  });

  it('should include the full Poupe config set', async () => {
    const result = await withPoupe([]);
    const names = result.map(c => c.name).filter(Boolean);

    // spot-check a few standard Poupe config names
    expect(names).toContain('poupe/json');
    expect(names).toContain('poupe/perfectionist');
    expect(names).toContain('poupe/stylistic');
    expect(names).toContain('poupe/unicorn');
    expect(names).toContain('poupe/vue');
  });

  it('should produce output consistent with defineConfig when upstream is empty', async () => {
    const fromDefine = defineConfig();
    const fromWithPoupe = await withPoupe([]);

    // same number of configs (defineConfig output is appended after empty upstream)
    expect(fromWithPoupe.length).toBe(fromDefine.length);

    // same config names in order
    const defineNames = fromDefine.map(c => c.name);
    const poupeNames = fromWithPoupe.map(c => c.name);
    expect(poupeNames).toEqual(defineNames);
  });

  it('should deduplicate plugin instances (first-wins)', async () => {
    const upstream: Config[] = [
      { plugins: { a: pluginA1 }, rules: { 'a/rule-a': 'error' } },
    ];

    // defineConfig may also include pluginA2 under the "a" key
    // simulate by passing a user config that re-registers "a"
    const result = await withPoupe(upstream, {
      plugins: { a: pluginA2 },
      rules: { 'a/rule-a': 'warn' },
    });

    // collect all plugin instances registered under "a"
    const aPlugins = result
      .filter(c => c.plugins?.a)
      .map(c => c.plugins!.a);

    // all should be the same reference (first-wins = upstream's pluginA1)
    for (const p of aPlugins) {
      expect(p).toBe(pluginA1);
    }
  });

  it('should have no duplicate plugin instances in output', async () => {
    const result = await withPoupe([]);

    // build a map: plugin name → Set of distinct object references
    const pluginReferences = new Map<string, Set<unknown>>();

    for (const config of result) {
      if (!config.plugins) continue;
      for (const [name, instance] of Object.entries(config.plugins)) {
        if (!pluginReferences.has(name)) {
          pluginReferences.set(name, new Set());
        }
        pluginReferences.get(name)!.add(instance);
      }
    }

    // every plugin name should map to exactly one instance
    for (const [name, references] of pluginReferences) {
      expect(references.size, `plugin "${name}" has ${references.size} distinct instances`).toBe(1);
    }
  });

  it('should reconcile real plugin duplicates (upstream unicorn vs ours)', async () => {
    const clonedUnicorn = { ...unicornPlugin };
    expect(clonedUnicorn).not.toBe(unicornPlugin);

    const upstream: Config[] = [
      {
        name: 'upstream/unicorn',
        plugins: { unicorn: clonedUnicorn },
        rules: { 'unicorn/no-null': 'error' },
      },
    ];

    const result = await withPoupe(upstream);

    // all unicorn plugin references should be the same instance
    const unicornReferences = result
      .filter(c => c.plugins?.unicorn)
      .map(c => c.plugins!.unicorn);

    expect(unicornReferences.length).toBeGreaterThan(1);
    const canonical = unicornReferences[0];
    for (const reference of unicornReferences) {
      expect(reference).toBe(canonical);
    }

    // upstream rules preserved
    expect(result[0].rules).toEqual({ 'unicorn/no-null': 'error' });
  });

  it('should apply user config overrides (last-wins for rules)', async () => {
    const result = await withPoupe([], {
      rules: {
        'no-console': 'off',
      },
    });

    // the user override should appear as the last config with that rule
    const consolRules = result
      .filter(c => c.rules?.['no-console'] !== undefined)
      .map(c => c.rules!['no-console']);

    // last occurrence should be the user's override
    expect(consolRules.at(-1)).toBe('off');
  });

  it('should place upstream configs before Poupe configs', async () => {
    const upstream: Config[] = [
      { name: 'upstream/base', rules: { 'no-eval': 'error' } },
      { name: 'upstream/ts', rules: { '@typescript-eslint/no-explicit-any': 'warn' } },
    ];

    const result = await withPoupe(upstream);

    // upstream configs should be at the start
    expect(result[0].name).toBe('upstream/base');
    expect(result[1].name).toBe('upstream/ts');
  });

  it('should use upstream plugin when versions differ (first-wins)', async () => {
    // Simulate: upstream ships plugin v1 (missing "rule-x"),
    // user depends on plugin v2 (has "rule-x").
    // first-wins means upstream's v1 becomes canonical.
    const pluginV1 = { rules: { 'rule-a': { meta: { type: 'problem' }, create: () => ({}) } } };
    const pluginV2 = {
      rules: {
        'rule-a': { meta: { type: 'problem' }, create: () => ({}) },
        'rule-x': { meta: { type: 'suggestion' }, create: () => ({}) },
      },
    };

    const upstream: Config[] = [
      {
        name: 'upstream/foo',
        plugins: { foo: pluginV1 },
        rules: { 'foo/rule-a': 'error' },
      },
    ];

    const result = await withPoupe(upstream, {
      plugins: { foo: pluginV2 },
      rules: { 'foo/rule-x': 'warn' },
    });

    // all "foo" plugin instances are upstream's v1 (first-wins)
    const fooPlugins = result
      .filter(c => c.plugins?.foo)
      .map(c => c.plugins!.foo);

    for (const p of fooPlugins) {
      expect(p).toBe(pluginV1);
    }

    // user's rule reference is preserved in the config...
    const ruleXConfigs = result.filter(
      c => c.rules?.['foo/rule-x'] !== undefined,
    );
    expect(ruleXConfigs.length).toBeGreaterThan(0);

    // ...but the canonical plugin lacks the rule definition.
    // ESLint would report "rule-x" as unknown at lint time.
    expect(pluginV1.rules).not.toHaveProperty('rule-x');
    expect(pluginV2.rules).toHaveProperty('rule-x');
  });

  it('should handle upstream with no plugins', async () => {
    const upstream: Config[] = [
      { rules: { 'no-eval': 'error' } },
      { rules: { 'no-debugger': 'error' } },
    ];

    const result = await withPoupe(upstream);

    expect(result[0].rules).toEqual({ 'no-eval': 'error' });
    expect(result[1].rules).toEqual({ 'no-debugger': 'error' });
    expect(result.length).toBeGreaterThan(2);
  });
});
