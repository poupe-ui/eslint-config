import { describe, expect, it } from 'vitest';

import { jsoncRecommended, poupeJsonRules, poupePackageJsonRules } from '../json';

describe('JSON Configuration', () => {
  describe('jsoncRecommended', () => {
    it('should export an array of configurations', () => {
      expect(Array.isArray(jsoncRecommended)).toBe(true);
      expect(jsoncRecommended).toHaveLength(3);
    });

    it('should have separate configs for general JSON, package.json, and VSCode', () => {
      const [generalConfig, packageJsonConfig, vscodeConfig] = jsoncRecommended;

      expect(generalConfig.name).toBe('jsonc/json');
      expect(generalConfig.files).toContain('**/*.json');
      expect(generalConfig.ignores).toContain('**/package.json');

      expect(packageJsonConfig.name).toBe('jsonc/package-json');
      expect(packageJsonConfig.files).toContain('**/package.json');

      expect(vscodeConfig.name).toBe('jsonc/allow-comments');
      expect(vscodeConfig.files).toContain('**/.vscode/*.json');
    });

    it('should include jsonc plugin and parser', () => {
      for (const config of jsoncRecommended) {
        // VSCode config only has rule overrides, no plugin/parser
        if (config.name === 'jsonc/allow-comments') {
          expect(config.plugins).toBeUndefined();
          expect(config.languageOptions).toBeUndefined();
        } else {
          expect(config.plugins).toHaveProperty('jsonc');
          expect(config.languageOptions?.parser).toBeDefined();
        }
      }
    });
  });

  describe('poupeJsonRules', () => {
    it('should define formatting rules', () => {
      expect(poupeJsonRules['jsonc/indent']).toEqual(['error', 2]);
      expect(poupeJsonRules['jsonc/comma-dangle']).toEqual(['error', 'never']);
      expect(poupeJsonRules['jsonc/comma-style']).toEqual(['error', 'last']);
      expect(poupeJsonRules['jsonc/object-curly-spacing']).toEqual(['error', 'always']);
    });

    it('should disallow comments in JSON files', () => {
      expect(poupeJsonRules['jsonc/no-comments']).toBe('error');
    });
  });

  describe('poupePackageJsonRules', () => {
    it('should include all general JSON rules', () => {
      for (const rule of Object.keys(poupeJsonRules)) {
        expect(poupePackageJsonRules).toHaveProperty(rule);
      }
    });

    it('should define sort-keys rule for package.json', () => {
      const sortKeysRule = poupePackageJsonRules['jsonc/sort-keys'];
      expect(sortKeysRule).toBeDefined();
      expect(Array.isArray(sortKeysRule)).toBe(true);

      if (Array.isArray(sortKeysRule)) {
        expect(sortKeysRule[0]).toBe('error');

        // Check that we have multiple pattern configurations
        const ruleArguments = sortKeysRule.slice(1);
        expect(ruleArguments).toHaveLength(2);
      }
    });

    it('should sort root level package.json fields', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sortKeysRule = poupePackageJsonRules['jsonc/sort-keys'] as [string, any, any];
      const rootPattern = sortKeysRule[1];

      expect(rootPattern.pathPattern).toBe('^$');
      expect(Array.isArray(rootPattern.order)).toBe(true);
      expect(rootPattern.order[0]).toBe('name');
      expect(rootPattern.order[1]).toBe('version');
    });

    it('should sort dependencies alphabetically', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sortKeysRule = poupePackageJsonRules['jsonc/sort-keys'] as [string, any, any];
      const depsPattern = sortKeysRule[2];

      expect(depsPattern.pathPattern).toBe('^(dependencies|devDependencies|peerDependencies|optionalDependencies)$');
      expect(depsPattern.order).toEqual({ type: 'asc' });
    });
  });

  describe('Configuration Integration', () => {
    it('should apply correct rules to JSON files', () => {
      const [generalConfig] = jsoncRecommended;
      const rules = generalConfig.rules;

      // Check that recommended rules are included
      expect(rules).toBeDefined();
      expect(Object.keys(rules!).some(key => key.startsWith('jsonc/'))).toBe(true);

      // Check that our custom rules override the defaults
      expect(rules!['jsonc/indent']).toEqual(['error', 2]);
      expect(rules!['jsonc/no-comments']).toBe('error');
    });

    it('should apply correct rules to package.json files', () => {
      const [, packageJsonConfig] = jsoncRecommended;
      const rules = packageJsonConfig.rules;

      // Check that JSON rules are applied to package.json
      expect(rules?.['jsonc/indent']).toEqual(['error', 2]);
      expect(rules?.['jsonc/no-comments']).toBe('error');

      expect(rules?.['jsonc/sort-keys']).toBeDefined();
    });
  });
});
