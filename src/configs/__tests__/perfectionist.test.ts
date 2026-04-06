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
});
