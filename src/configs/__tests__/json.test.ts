import { describe, expect, it } from 'vitest';

import { poupeJsonConfigs } from '../json';

describe('JSON Configuration', () => {
  describe('poupeJsonConfigs', () => {
    it('should have 3 configurations', () => {
      expect(poupeJsonConfigs).toHaveLength(3);
    });

    it('should have correct configuration names', () => {
      expect(poupeJsonConfigs[0].name).toBe('poupe/json');
      expect(poupeJsonConfigs[1].name).toBe('poupe/package-json');
      expect(poupeJsonConfigs[2].name).toBe('poupe/jsonc');
    });

    it('should apply to correct file patterns', () => {
      expect(poupeJsonConfigs[0].files).toEqual(['**/*.json']);
      expect(poupeJsonConfigs[0].ignores).toEqual(['**/package.json']);
      expect(poupeJsonConfigs[1].files).toEqual(['**/package.json']);
      expect(poupeJsonConfigs[2].files).toContain('**/*.jsonc');
      expect(poupeJsonConfigs[2].files).toContain('**/.vscode/*.json');
      expect(poupeJsonConfigs[2].files).toContain('**/tsconfig.json');
    });

    it('should include jsonc plugin and parser for configs that need them', () => {
      // First two configs should have plugins and parser
      expect(poupeJsonConfigs[0].plugins).toHaveProperty('jsonc');
      expect(poupeJsonConfigs[0].languageOptions?.parser).toBeDefined();

      expect(poupeJsonConfigs[1].plugins).toHaveProperty('jsonc');
      expect(poupeJsonConfigs[1].languageOptions?.parser).toBeDefined();

      // Third config (jsonc) only has rules, inherits plugins/parser from earlier configs
      expect(poupeJsonConfigs[2].rules).toBeDefined();
    });

    it('should disable comments rule for JSONC files', () => {
      const jsoncConfig = poupeJsonConfigs[2];
      expect(jsoncConfig.rules?.['jsonc/no-comments']).toBe('off');
    });
  });

  describe('poupeJsonRules in JSON config', () => {
    const jsonConfig = poupeJsonConfigs[0]; // poupe/json config
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
    const packageJsonConfig = poupeJsonConfigs[1]; // poupe/package-json config
    const jsonConfig = poupeJsonConfigs[0]; // poupe/json config
    const packageRules = packageJsonConfig.rules || {};
    const jsonRules = jsonConfig.rules || {};

    it('should include all general JSON rules', () => {
      const jsonFormattingRules = ['jsonc/indent', 'jsonc/comma-dangle', 'jsonc/comma-style', 'jsonc/object-curly-spacing', 'jsonc/no-comments'];
      for (const rule of jsonFormattingRules) {
        expect(packageRules).toHaveProperty(rule);
        expect(packageRules[rule]).toEqual(jsonRules[rule]);
      }
    });

    it('should define sort-keys rule for package.json', () => {
      const sortKeysRule = packageRules['jsonc/sort-keys'];
      expect(sortKeysRule).toBeDefined();
      expect(Array.isArray(sortKeysRule)).toBe(true);

      if (Array.isArray(sortKeysRule)) {
        expect(sortKeysRule[0]).toBe('error');

        // Check that we have multiple pattern configurations
        const ruleArguments = sortKeysRule.slice(1);
        expect(ruleArguments).toHaveLength(3);
      }
    });

    it('should sort root level package.json fields', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sortKeysRule = packageRules['jsonc/sort-keys'] as [string, any, any, any];
      const rootPattern = sortKeysRule[1];

      expect(rootPattern.pathPattern).toBe('^$');
      expect(Array.isArray(rootPattern.order)).toBe(true);
      expect(rootPattern.order[0]).toBe('name');
      expect(rootPattern.order[1]).toBe('version');
    });

    it('should sort dependencies alphabetically', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sortKeysRule = packageRules['jsonc/sort-keys'] as [string, any, any, any];
      const depsPattern = sortKeysRule[2];

      expect(depsPattern.pathPattern).toBe('^(dependencies|devDependencies|peerDependencies|optionalDependencies)$');
      expect(depsPattern.order).toEqual({ type: 'asc' });
    });

    it('should sort other second-level objects alphabetically', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sortKeysRule = packageRules['jsonc/sort-keys'] as [string, any, any, any];
      const secondLevelPattern = sortKeysRule[3];

      expect(secondLevelPattern.pathPattern).toBe('^(scripts|pnpm|exports|publishConfig)$');
      expect(secondLevelPattern.order).toEqual({ type: 'asc' });
    });
  });

  describe('Configuration Integration', () => {
    it('should apply Poupe rules to JSON files', () => {
      const [generalConfig] = poupeJsonConfigs;
      const rules = generalConfig.rules;

      // Check that Poupe's custom rules are applied
      expect(rules).toBeDefined();
      expect(rules!['jsonc/indent']).toEqual(['error', 2]);
      expect(rules!['jsonc/no-comments']).toBe('error');
      expect(rules!['jsonc/comma-dangle']).toEqual(['error', 'never']);
      expect(rules!['jsonc/object-curly-spacing']).toEqual(['error', 'always']);
    });

    it('should apply Poupe rules to package.json files', () => {
      const [, packageJsonConfig] = poupeJsonConfigs;
      const rules = packageJsonConfig.rules;

      // Check that Poupe's JSON rules are applied to package.json
      expect(rules?.['jsonc/indent']).toEqual(['error', 2]);
      expect(rules?.['jsonc/no-comments']).toBe('error');
      expect(rules?.['jsonc/comma-dangle']).toEqual(['error', 'never']);

      // Check that package.json specific sort-keys rule is applied
      expect(rules?.['jsonc/sort-keys']).toBeDefined();
      expect(Array.isArray(rules?.['jsonc/sort-keys'])).toBe(true);
    });

    it('should merge third-party recommended rules with Poupe rules', () => {
      const [generalConfig] = poupeJsonConfigs;
      const rules = generalConfig.rules;

      // Should have both third-party rules (check by presence of many jsonc/ rules)
      const jsoncRules = Object.keys(rules!).filter(key => key.startsWith('jsonc/'));
      expect(jsoncRules.length).toBeGreaterThan(10); // Third-party provides many rules

      // And should have Poupe's specific overrides
      expect(rules!['jsonc/indent']).toEqual(['error', 2]); // Poupe override
      expect(rules!['jsonc/no-comments']).toBe('error'); // Poupe override
    });
  });
});
