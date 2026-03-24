import { describe, expect, it } from 'vitest';

import { poupeStylisticConfigs } from '../stylistic';
import { mustConfigByName } from './test-utils';

describe('stylistic configuration', () => {
  const rules = mustConfigByName(poupeStylisticConfigs, 'poupe/stylistic').rules!;

  it('should enforce arrow-parens always', () => {
    const rule = rules['@stylistic/arrow-parens'];
    expect(rule).toEqual(['error', 'always']);
  });
});
