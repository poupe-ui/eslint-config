/**
 * Type-level tests for public type exports.
 * This file is only type-checked, not executed.
 */
import type {
  Config,
  InfiniteDepthConfigWithExtends,
  Plugin,
  Rules,
} from '..';

import { defineConfig, Linter } from '..';

// Config is the output element type of defineConfig
const configs: Config[] = defineConfig();
const _config: Config = configs[0];

// Rules is the non-nullable rules property of Config
const _rules: Rules = _config.rules!;

// Plugin is the value type of Config['plugins']
const _plugin: Plugin = Object.values(_config.plugins!)[0];

// Plugin accepts real plugin objects via cast
const mockPlugin = { rules: {} } as unknown as Plugin;
const _withPlugin: Config = { plugins: { mock: mockPlugin } };

// InfiniteDepthConfigWithExtends is the input element type
const _input: InfiniteDepthConfigWithExtends = { rules: {} };
const _nested: InfiniteDepthConfigWithExtends = [{ rules: {} }];

// Linter namespace is available for Nuxt interop
const _linterConfig: Linter.Config = {} as Linter.Config;

// Suppress unused variable warnings
void [_config, _rules, _plugin, _withPlugin, _input, _nested, _linterConfig];
