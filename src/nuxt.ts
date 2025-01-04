import { Linter } from 'eslint';
import { files, rules } from './configs';

type Config = Linter.Config;

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
