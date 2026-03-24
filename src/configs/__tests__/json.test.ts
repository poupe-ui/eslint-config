import { describe, expect, it } from 'vitest';

import { poupeJsonConfigs } from '../json';
import { mustConfigByName } from './test-utils';

const findConfig = (name: string) => mustConfigByName(poupeJsonConfigs, name);

describe('JSON Configuration', () => {
  describe('poupeJsonConfigs', () => {
    it('should have 3 configurations', () => {
      expect(poupeJsonConfigs).toHaveLength(3);
    });

    it('should have correct configuration names', () => {
      expect(findConfig('poupe/json')).toBeDefined();
      expect(findConfig('poupe/package-json')).toBeDefined();
      expect(findConfig('poupe/jsonc')).toBeDefined();
    });

    it('should apply to correct file patterns', () => {
      const jsonConfig = findConfig('poupe/json');
      const packageJsonConfig = findConfig('poupe/package-json');
      const jsoncConfig = findConfig('poupe/jsonc');

      expect(jsonConfig.files).toEqual(['**/*.json']);
      expect(jsonConfig.ignores).toContain('**/package.json');
      expect(jsonConfig.ignores).toContain('**/tsconfig.json');
      expect(jsonConfig.ignores).toContain('**/jsconfig.json');
      expect(jsonConfig.ignores).toContain('**/.vscode/*.json');
      expect(packageJsonConfig.files).toEqual(['**/package.json']);
      expect(jsoncConfig.files).toContain('**/*.jsonc');
      expect(jsoncConfig.files).toContain('**/.vscode/*.json');
      expect(jsoncConfig.files).toContain('**/tsconfig.json');
      expect(jsoncConfig.files).toContain('**/jsconfig.json');
    });

    it('should include jsonc plugin for all configs', () => {
      for (const config of poupeJsonConfigs) {
        expect(config.plugins).toHaveProperty('jsonc');
      }
    });

    it('should use jsonc/json language for strict JSON configs', () => {
      expect(findConfig('poupe/json').language).toBe('jsonc/json');
      expect(findConfig('poupe/package-json').language).toBe('jsonc/json');
    });

    it('should use jsonc/jsonc language for JSONC config', () => {
      expect(findConfig('poupe/jsonc').language).toBe('jsonc/jsonc');
    });

    it('should disable comments rule for JSONC files', () => {
      const jsoncConfig = findConfig('poupe/jsonc');
      expect(jsoncConfig.rules?.['jsonc/no-comments']).toBe('off');
    });
  });

  describe('poupeJsonRules in JSON config', () => {
    const jsonConfig = findConfig('poupe/json');
    const rules = jsonConfig.rules || {};

    it('should define formatting rules', () => {
      expect(rules['jsonc/indent']).toEqual(['error', 2]);
      expect(rules['jsonc/comma-dangle']).toEqual(['error', 'never']);
      expect(rules['jsonc/comma-style']).toEqual(['error', 'last']);
      expect(rules['jsonc/object-curly-spacing']).toEqual(['error', 'always']);
    });

    it('should disallow comments in JSON files', () => {
      expect(rules['jsonc/no-comments']).toBe('error');
    });
  });

  describe('poupePackageJsonRules in package.json config', () => {
    const packageJsonConfig = findConfig('poupe/package-json');
    const jsonConfig = findConfig('poupe/json');
    const packageRules = packageJsonConfig.rules || {};
    const jsonRules = jsonConfig.rules || {};

    type SortKeysPattern = { pathPattern: string; order: string[] | { type: string } };
    const sortKeysRule = packageRules['jsonc/sort-keys'] as [string, SortKeysPattern, SortKeysPattern, SortKeysPattern];

    it('should include all general JSON rules', () => {
      const jsonFormattingRules = ['jsonc/indent', 'jsonc/comma-dangle', 'jsonc/comma-style', 'jsonc/object-curly-spacing', 'jsonc/no-comments'];
      for (const rule of jsonFormattingRules) {
        expect(packageRules).toHaveProperty(rule);
        expect(packageRules[rule]).toEqual(jsonRules[rule]);
      }
    });

    it('should define sort-keys rule for package.json', () => {
      expect(sortKeysRule).toBeDefined();
      expect(Array.isArray(sortKeysRule)).toBe(true);
      expect(sortKeysRule[0]).toBe('error');

      // Check that we have multiple pattern configurations
      const ruleArguments = sortKeysRule.slice(1);
      expect(ruleArguments).toHaveLength(3);
    });

    it('should sort root level package.json fields', () => {
      const [, rootPattern] = sortKeysRule;

      expect(rootPattern.pathPattern).toBe('^$');
      expect(Array.isArray(rootPattern.order)).toBe(true);

      const order = rootPattern.order as string[];
      expect(order[0]).toBe('name');
      expect(order[1]).toBe('version');
    });

    it('should sort dependencies alphabetically', () => {
      const depsPattern = sortKeysRule[2];

      expect(depsPattern.pathPattern).toBe('^(dependencies|devDependencies|peerDependencies|optionalDependencies)$');
      expect(depsPattern.order).toEqual({ type: 'asc' });
    });

    it('should sort other second-level objects alphabetically', () => {
      const secondLevelPattern = sortKeysRule[3];

      expect(secondLevelPattern.pathPattern).toBe('^(scripts|pnpm|exports|publishConfig)$');
      expect(secondLevelPattern.order).toEqual({ type: 'asc' });
    });
  });

  describe('Configuration Integration', () => {
    it('should apply Poupe rules to JSON files', () => {
      const rules = findConfig('poupe/json').rules;

      // Check that Poupe's custom rules are applied
      expect(rules).toBeDefined();
      expect(rules!['jsonc/indent']).toEqual(['error', 2]);
      expect(rules!['jsonc/no-comments']).toBe('error');
      expect(rules!['jsonc/comma-dangle']).toEqual(['error', 'never']);
      expect(rules!['jsonc/object-curly-spacing']).toEqual(['error', 'always']);
    });

    it('should apply Poupe rules to package.json files', () => {
      const rules = findConfig('poupe/package-json').rules;

      // Check that Poupe's JSON rules are applied to package.json
      expect(rules?.['jsonc/indent']).toEqual(['error', 2]);
      expect(rules?.['jsonc/no-comments']).toBe('error');
      expect(rules?.['jsonc/comma-dangle']).toEqual(['error', 'never']);

      // Check that package.json specific sort-keys rule is applied
      expect(rules?.['jsonc/sort-keys']).toBeDefined();
      expect(Array.isArray(rules?.['jsonc/sort-keys'])).toBe(true);
    });

    it('should merge third-party recommended rules with Poupe rules', () => {
      const rules = findConfig('poupe/json').rules;

      // Should have both third-party rules (check by presence of many jsonc/ rules)
      const jsoncRules = Object.keys(rules!).filter((key) => key.startsWith('jsonc/'));
      expect(jsoncRules.length).toBeGreaterThan(10); // Third-party provides many rules

      // And should have Poupe's specific overrides
      expect(rules!['jsonc/indent']).toEqual(['error', 2]); // Poupe override
      expect(rules!['jsonc/no-comments']).toBe('error'); // Poupe override
    });
  });
});
