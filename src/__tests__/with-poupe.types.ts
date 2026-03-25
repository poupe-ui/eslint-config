/**
 * Type-level tests for withPoupe's upstream parameter.
 * This file is only type-checked, not executed.
 */
import type { FlatConfigComposer } from 'eslint-flat-config-utils';

import type { Config } from '../core';

import { withPoupe } from '../config';

// Plain Config array and Promise
withPoupe([] as Config[]);
withPoupe(Promise.resolve([] as Config[]));

// FlatConfigComposer from createConfigForNuxt/withNuxt —
// extends Promise<Config[]>
withPoupe({} as FlatConfigComposer<Config>);
