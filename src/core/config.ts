import { config as configFactory } from 'typescript-eslint';

export { ESLint, Linter } from 'eslint';

export type InfiniteDepthConfigWithExtends = Parameters<typeof configFactory>[number];
export type Config = ReturnType<typeof configFactory>[number];
export type Rules = Config['rules'] & {};

export { config as withConfig } from 'typescript-eslint';
