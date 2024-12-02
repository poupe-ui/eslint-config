import type { Config } from './core';
import { files, rules } from './configs';

export const forNuxt = (): Config[] => [
  {
    name: 'poupe/files',
    files,
  },
  {
    name: 'poupe/rules',
    rules,
  },
];
