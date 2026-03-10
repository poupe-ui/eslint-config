/**
 * Type-level tests for withPoupe's upstream parameter.
 * This file is only type-checked, not executed.
 */
import type { Linter } from 'eslint';
import type { FlatConfigComposer } from 'eslint-flat-config-utils';

import type { Config } from '../core';

import { withPoupe } from '../config';

// tseslint's Config (our own type alias)
withPoupe([] as Config[]);
withPoupe(Promise.resolve([] as Config[]));

// eslint core's Linter.Config (structurally similar but distinct type)
withPoupe([] as Linter.Config[]);
withPoupe(Promise.resolve([] as Linter.Config[]));

// FlatConfigComposer from createConfigForNuxt/withNuxt —
// extends Promise<Linter.Config[]> with a stricter then() override
withPoupe({} as FlatConfigComposer);
