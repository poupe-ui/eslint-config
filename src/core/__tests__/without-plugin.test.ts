import { describe, expect, it } from 'vitest';

import type { Config } from '../config';

import { withoutPlugin } from '../utils';

const mockPlugin = { rules: {} };

const createConfig = (plugins: Config['plugins']): Config => ({
  name: 'test-config',
  plugins,
});

describe('withoutPlugin', () => {
  it('should remove a single plugin', () => {
    const config = createConfig({
      'unicorn': mockPlugin,
      '@stylistic': mockPlugin,
      '@eslint/js': mockPlugin,
    });

    const result = withoutPlugin('unicorn', config);

    expect(result[0].plugins).toBeDefined();
    expect(result[0].plugins).not.toHaveProperty('unicorn');
    expect(result[0].plugins).toHaveProperty('@stylistic');
    expect(result[0].plugins).toHaveProperty('@eslint/js');
  });

  it('should remove multiple plugins when array is provided', () => {
    const config = createConfig({
      'unicorn': mockPlugin,
      '@stylistic': mockPlugin,
      '@eslint/js': mockPlugin,
    });

    const result = withoutPlugin(['unicorn', '@stylistic'], config);

    expect(result[0].plugins).toBeDefined();
    expect(result[0].plugins).not.toHaveProperty('unicorn');
    expect(result[0].plugins).not.toHaveProperty('@stylistic');
    expect(result[0].plugins).toHaveProperty('@eslint/js');
  });

  it('should remove all plugins when no plugin name is provided', () => {
    const config = createConfig({
      'unicorn': mockPlugin,
      '@stylistic': mockPlugin,
    });

    const result = withoutPlugin(undefined, config);

    expect(result[0]).not.toHaveProperty('plugins');
  });

  it('should remove plugins property when last plugin is removed', () => {
    const config = createConfig({
      unicorn: mockPlugin,
    });

    const result = withoutPlugin('unicorn', config);

    expect(result[0]).not.toHaveProperty('plugins');
  });

  it('should return config unchanged if it has no plugins', () => {
    const config: Config = {
      name: 'no-plugins',
      rules: { 'no-console': 'error' },
    };

    const result = withoutPlugin('unicorn', config);

    expect(result[0]).toEqual(config);
  });

  it('should return config unchanged if plugin does not exist', () => {
    const config = createConfig({
      'unicorn': mockPlugin,
      '@stylistic': mockPlugin,
    });

    const result = withoutPlugin('non-existent', config);

    expect(result[0].plugins).toEqual(config.plugins);
  });

  it('should handle multiple configs', () => {
    const config1 = createConfig({ unicorn: mockPlugin });
    const config2 = createConfig({ '@stylistic': mockPlugin });
    const config3: Config = { name: 'no-plugins' };

    const result = withoutPlugin('unicorn', config1, config2, config3);

    expect(result[0]).not.toHaveProperty('plugins');
    expect(result[1].plugins).toHaveProperty('@stylistic');
    expect(result[2]).toEqual(config3);
  });
});
