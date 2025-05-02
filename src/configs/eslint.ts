import { Linter } from '../core/types';

import jsPlugin from '@eslint/js';

export const eslintRecommended: Linter.Config = jsPlugin.configs.recommended;
