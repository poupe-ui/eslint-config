import { PropertyType } from './utils';

import type { TypedFlatConfig } from 'eslint-config-unjs';

export type { TypedFlatConfig } from 'eslint-config-unjs';

export type Rules = PropertyType<TypedFlatConfig, 'rules'>;
