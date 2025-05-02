import { config as configFactory } from 'typescript-eslint';

export type Config = ReturnType<typeof configFactory>[number];
export type Rules = Config['rules'] & {};

export { Linter, ESLint } from 'eslint';
