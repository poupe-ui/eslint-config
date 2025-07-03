import { describe, expect, it } from 'vitest';

import { defineConfig } from '../config';

describe('ESLint Configuration', () => {
  it('should export defineConfig function', () => {
    expect(defineConfig).toBeDefined();
    expect(typeof defineConfig).toBe('function');
  });

  it('should return an array of configurations', () => {
    const config = defineConfig();
    expect(Array.isArray(config)).toBe(true);
    expect(config.length).toBeGreaterThan(0);
  });

  it('should include base configurations', () => {
    const config = defineConfig();
    const configNames = config.map(c => c.name).filter(Boolean);

    // Check for some expected configurations
    expect(configNames).toContain('poupe/json');
    expect(configNames).toContain('poupe/perfectionist');
    expect(configNames).toContain('poupe/stylistic');
    expect(configNames).toContain('poupe/unicorn');
    expect(configNames).toContain('poupe/vue');
  });
});
