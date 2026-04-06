import { describe, expect, it } from 'vitest';

import { poupePerfectionistConfigs } from '../perfectionist';
import { mustConfigByName } from './test-utils';

describe('perfectionist configuration', () => {
  const rules = mustConfigByName(poupePerfectionistConfigs, 'poupe/perfectionist').rules!;

  describe('sort-imports', () => {
    const rule = rules['perfectionist/sort-imports'] as [string, Record<string, unknown>];

    it('should be set to error', () => {
      expect(rule[0]).toBe('error');
    });

    it('should enable partitionByNewLine', () => {
      expect(rule[1].partitionByNewLine).toBe(true);
    });

    it('should use v5 group format (no -type suffixed selectors)', () => {
      const groups = rule[1].groups as (string | string[])[];
      const flat = groups.flat();
      const legacySelectors = flat.filter((g) => g.endsWith('-type'));
      expect(legacySelectors).toEqual([]);
    });

    it('should set newlinesInside to newlinesBetween', () => {
      expect(rule[1].newlinesInside).toBe('newlinesBetween');
    });
  });

  describe('sort-exports', () => {
    const rule = rules['perfectionist/sort-exports'] as [string, Record<string, unknown>];

    it('should be set to error', () => {
      expect(rule[0]).toBe('error');
    });

    it('should enable partitionByNewLine', () => {
      expect(rule[1].partitionByNewLine).toBe(true);
    });
  });

  describe('sort-named-imports', () => {
    const rule = rules['perfectionist/sort-named-imports'] as [string, Record<string, unknown>];

    it('should be set to error', () => {
      expect(rule[0]).toBe('error');
    });

    it('should enable partitionByNewLine', () => {
      expect(rule[1].partitionByNewLine).toBe(true);
    });

    it('should not use removed groupKind option', () => {
      expect(rule[1].groupKind).toBeUndefined();
    });
  });

  describe('sort-named-exports', () => {
    const rule = rules['perfectionist/sort-named-exports'] as [string, Record<string, unknown>];

    it('should be set to error', () => {
      expect(rule[0]).toBe('error');
    });

    it('should enable partitionByNewLine', () => {
      expect(rule[1].partitionByNewLine).toBe(true);
    });

    it('should not use removed groupKind option', () => {
      expect(rule[1].groupKind).toBeUndefined();
    });
  });

  describe('sort-import-attributes', () => {
    const rule = rules['perfectionist/sort-import-attributes'] as [string, Record<string, unknown>];

    it('should be set to error with natural sorting', () => {
      expect(rule[0]).toBe('error');
      expect(rule[1].type).toBe('natural');
    });
  });

  describe('sort-export-attributes', () => {
    const rule = rules['perfectionist/sort-export-attributes'] as [string, Record<string, unknown>];

    it('should be set to error with natural sorting', () => {
      expect(rule[0]).toBe('error');
      expect(rule[1].type).toBe('natural');
    });
  });

  describe('sort-union-types', () => {
    const rule = rules['perfectionist/sort-union-types'] as [string, Record<string, unknown>];

    it('should be set to error', () => {
      expect(rule[0]).toBe('error');
    });

    it('should enable partitionByComment', () => {
      expect(rule[1].partitionByComment).toBe(true);
    });

    it('should disable partitionByNewLine', () => {
      expect(rule[1].partitionByNewLine).toBe(false);
    });
  });

  describe('sort-intersection-types', () => {
    const rule = rules['perfectionist/sort-intersection-types'] as [string, Record<string, unknown>];

    it('should mirror sort-union-types options', () => {
      const unionRule = rules['perfectionist/sort-union-types'] as [string, Record<string, unknown>];
      expect(rule[0]).toBe(unionRule[0]);
      expect(rule[1]).toEqual(unionRule[1]);
    });
  });

  describe.each([
    'sort-classes',
    'sort-enums',
    'sort-interfaces',
    'sort-object-types',
    'sort-variable-declarations',
  ] as const)('%s', (ruleName) => {
    const rule = rules[`perfectionist/${ruleName}`] as [string, Record<string, unknown>];

    it('should be set to error with natural sorting and partitionByNewLine', () => {
      expect(rule[0]).toBe('error');
      expect(rule[1].type).toBe('natural');
      expect(rule[1].ignoreCase).toBe(true);
      expect(rule[1].partitionByNewLine).toBe(true);
    });
  });

  describe('sort-heritage-clauses', () => {
    const rule = rules['perfectionist/sort-heritage-clauses'] as [string, Record<string, unknown>];

    it('should be set to error with natural sorting', () => {
      expect(rule[0]).toBe('error');
      expect(rule[1].type).toBe('natural');
      expect(rule[1].ignoreCase).toBe(true);
    });
  });
});
