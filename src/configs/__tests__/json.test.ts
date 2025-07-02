import { describe, expect, it } from 'vitest';

import { jsoncRecommended, poupeJsonRules, poupePackageJsonRules } from '../json';

describe('JSON Configuration', () => {
  describe('jsoncRecommended', () => {
    it('should have 3 configurations', () => {
      expect(jsoncRecommended).toHaveLength(3);
    });

    it('should have correct configuration names', () => {
      expect(jsoncRecommended[0].name).toBe('poupe/json');
      expect(jsoncRecommended[1].name).toBe('poupe/package-json');
      expect(jsoncRecommended[2].name).toBe('poupe/allow-json-comments');
    });

    it('should apply to correct file patterns', () => {
      expect(jsoncRecommended[0].files).toEqual(['**/*.json']);
      expect(jsoncRecommended[0].ignores).toEqual(['**/package.json']);
      expect(jsoncRecommended[1].files).toEqual(['**/package.json']);
      expect(jsoncRecommended[2].files).toEqual([
        '**/.vscode/*.json',
        '**/tsconfig.json',
        '**/tsconfig.*.json',
      ]);
    });

    it('should include jsonc plugin and parser for JSON configs', () => {
      for (const config of jsoncRecommended) {
        // Allow-comments config only has rule overrides, no plugin/parser
        if (config.name === 'poupe/allow-json-comments') {
          expect(config.plugins).toBeUndefined();
          expect(config.languageOptions).toBeUndefined();
        } else {
          expect(config.plugins).toHaveProperty('jsonc');
          expect(config.languageOptions?.parser).toBeDefined();
        }
      }
    });

    it('should disable comments rule for specific files', () => {
      const allowCommentsConfig = jsoncRecommended[2];
      expect(allowCommentsConfig.rules).toEqual({
        'jsonc/no-comments': 'off',
      });
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
        expect(ruleArguments).toHaveLength(3);
      }
    });

    it('should sort root level package.json fields', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sortKeysRule = poupePackageJsonRules['jsonc/sort-keys'] as [string, any, any, any];
      const rootPattern = sortKeysRule[1];

      expect(rootPattern.pathPattern).toBe('^$');
      expect(Array.isArray(rootPattern.order)).toBe(true);
      expect(rootPattern.order[0]).toBe('name');
      expect(rootPattern.order[1]).toBe('version');
    });

    it('should sort dependencies alphabetically', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sortKeysRule = poupePackageJsonRules['jsonc/sort-keys'] as [string, any, any, any];
      const depsPattern = sortKeysRule[2];

      expect(depsPattern.pathPattern).toBe('^(dependencies|devDependencies|peerDependencies|optionalDependencies)$');
      expect(depsPattern.order).toEqual({ type: 'asc' });
    });

    it('should sort other second-level objects alphabetically', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sortKeysRule = poupePackageJsonRules['jsonc/sort-keys'] as [string, any, any, any];
      const secondLevelPattern = sortKeysRule[3];

      expect(secondLevelPattern.pathPattern).toBe('^(scripts|pnpm|exports|publishConfig)$');
      expect(secondLevelPattern.order).toEqual({ type: 'asc' });
    });
  });

  describe('Configuration Integration', () => {
    it('should apply Poupe rules to JSON files', () => {
      const [generalConfig] = jsoncRecommended;
      const rules = generalConfig.rules;

      // Check that Poupe's custom rules are applied
      expect(rules).toBeDefined();
      expect(rules!['jsonc/indent']).toEqual(['error', 2]);
      expect(rules!['jsonc/no-comments']).toBe('error');
      expect(rules!['jsonc/comma-dangle']).toEqual(['error', 'never']);
      expect(rules!['jsonc/object-curly-spacing']).toEqual(['error', 'always']);
    });

    it('should apply Poupe rules to package.json files', () => {
      const [, packageJsonConfig] = jsoncRecommended;
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
      const [generalConfig] = jsoncRecommended;
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
