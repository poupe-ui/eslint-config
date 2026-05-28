import { describe, expect, it } from 'vitest';

import type { Config } from '../config';

import { mergeRules } from '../utils';

const createConfig = (rules?: Config['rules']): Config => ({
  name: 'test-config',
  rules,
});

describe('mergeRules', () => {
  it('returns an empty object for an empty array', () => {
    expect(mergeRules([])).toEqual({});
  });

  it('returns an empty object when no config has rules', () => {
    expect(mergeRules([createConfig(), createConfig()])).toEqual({});
  });

  it('returns the rules of a single config unchanged', () => {
    const rules = { 'no-console': 'error' as const };
    expect(mergeRules([createConfig(rules)])).toEqual(rules);
  });

  it('merges rules from multiple configs', () => {
    const result = mergeRules([
      createConfig({ 'no-console': 'error' }),
      createConfig({ 'no-debugger': 'warn' }),
    ]);
    expect(result).toEqual({ 'no-console': 'error', 'no-debugger': 'warn' });
  });

  it('lets later configs override earlier ones for duplicate keys', () => {
    const result = mergeRules([
      createConfig({ 'no-console': 'error' }),
      createConfig({ 'no-console': 'off' }),
    ]);
    expect(result).toEqual({ 'no-console': 'off' });
  });

  it('skips configs without rules without affecting the merge', () => {
    const result = mergeRules([
      createConfig({ 'no-console': 'error' }),
      createConfig(),
      createConfig({ 'no-debugger': 'warn' }),
    ]);
    expect(result).toEqual({ 'no-console': 'error', 'no-debugger': 'warn' });
  });
});
