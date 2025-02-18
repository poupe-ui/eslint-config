const abbreviations = [
  'attr',
  'attrs',
  'env',
  'err',
  'fn',
  'i',
  'msg',
  'opt',
  'opts',
  'pkg',
  'param',
  'params',
  'prop',
  'props',
  'vars',
] as const;

const omitReplacementList = new Set(['i']);

export const allowList = Object.fromEntries(
  abbreviations.map(s => [s, true]),
);

export const replacements = Object.fromEntries(
  abbreviations.filter(s => !(omitReplacementList.has(s))).map(s => [s, false]),
);
