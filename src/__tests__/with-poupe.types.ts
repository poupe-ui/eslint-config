/**
 * Type-level tests for withPoupe's upstream parameter.
 * This file is only type-checked, not executed.
 */
import type { Config } from '../core';

import { withPoupe } from '../config';

/**
 * Structural stand-in for `eslint-flat-config-utils`'s `FlatConfigComposer`,
 * which extends `Promise<Config[]>`. Avoids pulling in the real package as
 * a devDependency just for one type-level test.
 */
type FlatConfigComposer<T> = Promise<T[]>;

// Plain Config array and Promise
withPoupe([] as Config[]);
withPoupe(Promise.resolve([] as Config[]));

// FlatConfigComposer from createConfigForNuxt/withNuxt —
// extends Promise<Config[]>
withPoupe({} as FlatConfigComposer<Config>);
