import { type PropType } from './utils';

import { config as configFactory } from 'typescript-eslint';
export { config as withConfigs } from 'typescript-eslint';

export type InfiniteDepthConfigWithExtends = Parameters<typeof configFactory>[number];
export type Config = ReturnType<typeof configFactory>[number];
export type Rules = PropType<Config, 'rules'>;
