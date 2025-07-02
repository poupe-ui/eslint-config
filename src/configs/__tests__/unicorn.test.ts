import { describe, expect, it } from 'vitest';

import { poupeUnicornRules } from '../unicorn';

interface PreventAbbreviationsOptions {
  allowList: Record<string, boolean>
  replacements: Record<string, boolean | string | string[]>
}

interface FilenameCaseOptions {
  case: string
  ignore?: string[]
}

describe('unicorn configuration', () => {
  describe('prevent-abbreviations rule', () => {
    it('should have correct configuration', () => {
      const rule = poupeUnicornRules['unicorn/prevent-abbreviations'];
      expect(rule).toBeDefined();
      expect(Array.isArray(rule)).toBe(true);
      if (Array.isArray(rule)) {
        expect(rule[0]).toBe('error');
      }
    });

    it('should allow i, j, k as variable names', () => {
      const rule = poupeUnicornRules['unicorn/prevent-abbreviations'];
      expect(Array.isArray(rule)).toBe(true);
      if (Array.isArray(rule) && rule.length > 1) {
        const options = rule[1] as PreventAbbreviationsOptions;
        expect(options.allowList).toBeDefined();
        expect(options.allowList.i).toBe(true);
        expect(options.allowList.j).toBe(true);
        expect(options.allowList.k).toBe(true);
      }
    });

    it('should not suggest replacements for i, j, k', () => {
      const rule = poupeUnicornRules['unicorn/prevent-abbreviations'];
      expect(Array.isArray(rule)).toBe(true);
      if (Array.isArray(rule) && rule.length > 1) {
        const options = rule[1] as PreventAbbreviationsOptions;
        expect(options.replacements).toBeDefined();
        // i, j, k should not be in replacements object since they're in omitReplacementList
        expect(options.replacements.i).toBeUndefined();
        expect(options.replacements.j).toBeUndefined();
        expect(options.replacements.k).toBeUndefined();
      }
    });

    it('should allow other common abbreviations', () => {
      const rule = poupeUnicornRules['unicorn/prevent-abbreviations'];
      expect(Array.isArray(rule)).toBe(true);
      if (Array.isArray(rule) && rule.length > 1) {
        const options = rule[1] as PreventAbbreviationsOptions;
        const commonAbbreviations = ['env', 'err', 'fn', 'pkg', 'props', 'utils'];

        for (const abbr of commonAbbreviations) {
          expect(options.allowList[abbr]).toBe(true);
        }
      }
    });
  });

  describe('filename-case rule', () => {
    it('should enforce kebab-case with exceptions for uppercase markdown files', () => {
      const rule = poupeUnicornRules['unicorn/filename-case'];
      expect(rule).toBeDefined();
      expect(Array.isArray(rule)).toBe(true);

      if (Array.isArray(rule) && rule.length > 1) {
        const severity = rule[0];
        const options = rule[1] as FilenameCaseOptions;
        expect(severity).toBe('error');
        expect(options.case).toBe('kebabCase');
        expect(options.ignore).toBeDefined();
        expect(options.ignore?.[0]).toBe(String.raw`^[A-Z][A-Z0-9\-_]*\.md$`);
      }
    });
  });
});
