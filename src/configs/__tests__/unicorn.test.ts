import unicornPlugin from 'eslint-plugin-unicorn';
import { describe, expect, it } from 'vitest';

import { type Config, GLOB_SRC, GLOB_VUE, Linter } from '../../core';
import { poupeUnicornConfigs, withAbbreviations } from '../unicorn';
import { mustConfigByName } from './test-utils';

interface PreventAbbreviationsOptions {
  allowList: Record<string, boolean>
  replacements: Record<string, boolean | string | string[]>
}

const preventAbbreviationsOptions = (
  rule: unknown,
): PreventAbbreviationsOptions => {
  if (!Array.isArray(rule) || rule.length < 2) {
    throw new Error('expected prevent-abbreviations to carry options');
  }
  return rule[1] as PreventAbbreviationsOptions;
};

// Lint a snippet through the unicorn plugin plus the supplied blocks,
// proving ESLint honours the emitted options end-to-end — not just that
// the returned object has the right shape.
const lintSource = (
  code: string,
  ...configs: Config[]
): Linter.LintMessage[] => {
  const linter = new Linter();
  return linter.verify(
    code,
    [
      { plugins: { unicorn: unicornPlugin } },
      ...configs,
    ],
    'example.ts',
  );
};

const flagsAbbreviation = (messages: Linter.LintMessage[]): boolean =>
  messages.some((m) => m.ruleId === 'unicorn/prevent-abbreviations');

interface FilenameCaseOptions {
  case: string
  ignore?: string[]
}

describe('unicorn configuration', () => {
  const unicornRules = mustConfigByName(poupeUnicornConfigs, 'poupe/unicorn').rules!;
  const filenameRules = mustConfigByName(poupeUnicornConfigs, 'poupe/unicorn-filename').rules!;

  describe('prevent-abbreviations rule', () => {
    it('should have correct configuration', () => {
      const rule = unicornRules['unicorn/prevent-abbreviations'];
      expect(rule).toBeDefined();
      expect(Array.isArray(rule)).toBe(true);
      if (Array.isArray(rule)) {
        expect(rule[0]).toBe('error');
      }
    });

    it('should allow i, j, k as variable names', () => {
      const rule = unicornRules['unicorn/prevent-abbreviations'];
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
      const rule = unicornRules['unicorn/prevent-abbreviations'];
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
      const rule = unicornRules['unicorn/prevent-abbreviations'];
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

  describe('withAbbreviations', () => {
    it('emits a named block scoped to the preset files', () => {
      const block = withAbbreviations(['doc']);
      expect(block.name).toBe('poupe/unicorn-abbreviations');
      expect(block.files).toEqual([GLOB_SRC, GLOB_VUE]);
    });

    it('allows the new tokens and neutralises their replacements', () => {
      const rule = withAbbreviations(['doc', 'docs', 'dir'])
        .rules!['unicorn/prevent-abbreviations'];
      const options = preventAbbreviationsOptions(rule);

      for (const token of ['doc', 'docs', 'dir']) {
        expect(options.allowList[token]).toBe(true);
        expect(options.replacements[token]).toBe(false);
      }
    });

    it('preserves the base Poupe abbreviations (merged over the preset)', () => {
      const rule = withAbbreviations(['doc'])
        .rules!['unicorn/prevent-abbreviations'];
      const options = preventAbbreviationsOptions(rule);

      // Base allow tokens survive the merge.
      for (const token of ['env', 'err', 'fn', 'pkg', 'props', 'utils']) {
        expect(options.allowList[token]).toBe(true);
      }
      // i/j/k stay allowed but unmapped, as in the preset.
      expect(options.allowList.i).toBe(true);
      expect(options.replacements.i).toBeUndefined();
    });

    it('does not mutate the shared preset configuration', () => {
      const presetRule = mustConfigByName(poupeUnicornConfigs, 'poupe/unicorn')
        .rules!['unicorn/prevent-abbreviations'];
      const preset = preventAbbreviationsOptions(presetRule);

      withAbbreviations(['doc', 'docs', 'dir']);

      expect(preset.allowList.doc).toBeUndefined();
      expect(preset.replacements.dir).toBeUndefined();
    });

    it('re-emits the base options unchanged for an empty token list', () => {
      const rule = withAbbreviations([])
        .rules!['unicorn/prevent-abbreviations'];
      const options = preventAbbreviationsOptions(rule);

      expect(options.allowList.env).toBe(true);
      expect(options.allowList.doc).toBeUndefined();
    });
  });

  describe('withAbbreviations (integration)', () => {
    const preset = mustConfigByName(poupeUnicornConfigs, 'poupe/unicorn');

    it('flags an unlisted abbreviation under the bare preset', () => {
      expect(flagsAbbreviation(lintSource('const doc = 1;', preset))).toBe(true);
    });

    it('allows the token once withAbbreviations adds it', () => {
      const messages = lintSource(
        'const doc = 1;', preset, withAbbreviations(['doc']),
      );
      expect(flagsAbbreviation(messages)).toBe(false);
    });

    it('keeps the rule active for other abbreviations', () => {
      const messages = lintSource(
        'const arr = [];', preset, withAbbreviations(['doc']),
      );
      expect(flagsAbbreviation(messages)).toBe(true);
    });
  });

  describe('filename-case rule', () => {
    it('should enforce kebab-case with exceptions for uppercase .md and .txt files', () => {
      const rule = filenameRules['unicorn/filename-case'];
      expect(rule).toBeDefined();
      expect(Array.isArray(rule)).toBe(true);

      if (Array.isArray(rule) && rule.length > 1) {
        const severity = rule[0];
        const options = rule[1] as FilenameCaseOptions;
        expect(severity).toBe('error');
        expect(options.case).toBe('kebabCase');
        expect(options.ignore).toBeDefined();
        expect(options.ignore?.[0]).toBe(String.raw`^[A-Z][A-Z0-9\-_]*\.(md|txt)$`);
      }
    });
  });
});
