# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed

- **deps**: Updated `eslint-plugin-perfectionist` ^4.15.1 → ^5.8.0
- **perfectionist**: Migrated `sort-imports` to v5 format — groups
  from `-type` suffix to `type-` prefix selectors, `'object'` →
  `'ts-equals-import'`, added `newlinesInside: 'newlinesBetween'`
  (required by v5 when `partitionByNewLine` is enabled)
- **perfectionist**: Removed unused `react`/`vue` `customGroups`
  from `sort-imports` — they were defined but never referenced in
  the `groups` array, so they had no effect
- **perfectionist**: Removed `groupKind: 'mixed'` from
  `sort-named-imports` and `sort-named-exports` (option removed
  in v5, mixed is the default behaviour)

### Fixed

- **perfectionist**: Enabled `partitionByNewLine` for `sort-exports`
  and `sort-named-exports` — was only set on the import rules,
  causing blank lines between export groups to be collapsed

### Internal

- Added perfectionist configuration tests

## [0.9.0] - 2026-04-05

### Added

- **exports**: `Plugin`, `InfiniteDepthConfigWithExtends`, and
  `Linter` are now importable from `@poupe/eslint-config`
- **vue**: CSS linting for Vue `<style>` blocks via merged
  processors (`eslint-merge-processors`, `eslint-processor-vue-blocks`)
  — same pattern as `@nuxt/eslint-config` and `@antfu/eslint-config`.
  New peer dependency: `@vue/compiler-sfc ^3.3.0`
- **css**: `GLOB_CSS` extended from `**/*.css` to `**/*.?(post)css`
  so `<style lang="postcss">` blocks and standalone `.postcss` files
  are also linted

### Changed

- **deps**: Updated `@eslint/css` ~0.14.1 → ^1.1.0 (breaking),
  `tailwind-csstree` ~0.1.4 → ~0.3.0,
  `@typescript-eslint/parser` ^8.57.0 → ^8.58.0,
  `typescript-eslint` ^8.57.0 → ^8.58.0,
  `@kagal/cross-test` ~0.1.2 → ~0.1.3,
  `vitest` ~4.0.18 → ~4.1.2,
  `oxc-parser` override 0.116.0 → 0.123.0
- **css**: Adapted `customSyntax` to `tailwind-csstree` 0.1.5's
  `SyntaxExtensionCallback` API — `tailwind4` is now a callback
  instead of a plain object (requires `@eslint/css` >= 1.0.0)
- **packageManager**: pnpm 10.32.1 → 10.33.0
- **engines**: Bumped minimum Node.js from >= 20.19.0 to >= 20.20.2
- **CI**: Updated `pnpm/action-setup` action to v5
- **core**: Migrated config factory from `typescript-eslint`'s
  deprecated `config()` to `eslint/config`'s `defineConfig()`.
  `Config` and `InfiniteDepthConfigWithExtends` types now derive
  from `@eslint/core` instead of `@typescript-eslint/utils` —
  the `plugins` field is stricter (language-specific plugins need
  `as unknown as Plugin` casts)

### Fixed

- **exports**: `Config` and `Rules` type exports were unreachable
  from the package entry point (`export type` combined with
  `export *` in the same barrel was silently dropped by unbuild)
- **ci**: Publish workflow switched from Node 22 + `npm install -g
  npm@^11` to Node 24 (bundles npm 11 natively) — Node 22's
  bundled npm 10 could not self-upgrade (`promise-retry` not found)
- **ci**: Added explicit `permissions: contents: read` to all
  workflows (CodeQL security hardening)

### Removed

- **nuxt**: Removed `@poupe/eslint-config/nuxt` entry point (`forNuxt`,
  `forNuxtModules`), deprecated since 0.8.3 — use `withPoupe` from
  `@poupe/eslint-config` instead
- **deps**: Dropped `eslint-flat-config-utils` devDependency — only
  used for its `FlatConfigComposer` type in a test, replaced with a
  local structural alias

## [0.8.4] - 2026-03-24

### Added

- **package.json**: Added `keywords` for npm discoverability and
  `bugs` URL

### Changed

- **deps**: Updated `@eslint/js` ^9.39.3 → ^9.39.4,
  `@stylistic/eslint-plugin` ^5.9.0 → ^5.10.0,
  `@typescript-eslint/parser` ^8.56.1 → ^8.57.0,
  `eslint` ^9.39.3 → ^9.39.4,
  `eslint-plugin-jsonc` ^3.1.1 → ^3.1.2,
  `typescript-eslint` ^8.56.1 → ^8.57.0,
  `pkg-pr-new` ~0.0.65 → ~0.0.66
- **stylistic**: Pinned `arrow-parens` to `['error', 'always']` —
  `@stylistic/eslint-plugin` 5.1.0 changed its recommended preset
  default from `"always"` to `"as-needed"`. Applied `(x) =>` parens
  across the codebase
- **packageManager**: pnpm 10.30.3 → 10.32.1
- **scripts**: Reordered `precommit` and `prepack` to run `build`
  before `lint` so all generated artifacts exist during linting

## [0.8.3] - 2026-03-11

### Added

- **core**: New `reconcilePlugins` utility for deduplicating plugin instances
  when combining ESLint configs from multiple sources — uses a first-wins
  strategy to replace duplicate physical copies with the canonical instance,
  resolving `FlatConfigComposer` plugin conflict errors
- **core**: New `withPoupe` async function for composing Poupe configs on
  top of an upstream config (e.g. `createConfigForNuxt`, `withNuxt`) —
  awaits the upstream config, appends the full Poupe config set via
  `defineConfig`, and reconciles duplicate plugins automatically.
  Accepts both tseslint's `Config[]` and eslint core's `Linter.Config[]`
  (including `FlatConfigComposer`) without casts

### Changed

- **core**: `withConfig` now wraps typescript-eslint's `config()` with
  `reconcilePlugins` — every config composition gets automatic plugin
  deduplication, transparent to all callers

### Deprecated

- **nuxt**: `forNuxt` and `forNuxtModules` — use `withPoupe` from
  `@poupe/eslint-config` instead. Will be removed in 0.9

## [0.8.2] - 2026-03-09

### Fixed

- **json**: Use `jsonc/jsonc` language for JSONC config — the `poupe/jsonc`
  config incorrectly used `jsonc/json` (strict JSON), which rejected
  comments before rules could run, breaking files like `.vscode/*.json`
  and `tsconfig.json`

### Changed

- **json**: Added `jsconfig.json` and `jsconfig.*.json` to JSONC file
  patterns — these use the same comment-supporting format as `tsconfig.json`
- **core**: Exported all `GLOB_*` file pattern constants (`GLOB_CSS`,
  `GLOB_JSON`, `GLOB_JSONC`, `GLOB_JSONC_FILES`, `GLOB_SRC`, `GLOB_VUE`)
  from `@poupe/eslint-config` for consumers composing custom configs
- **markdown**: `md013` now exempts tables (`tables: false`) — table
  rows often exceed 80 characters and can't be wrapped
- **markdown**: `md024` set to `siblings_only: true` — allows reusing
  heading names like "Usage" or "Examples" under different parents

## [0.8.1] - 2026-03-05

### Changed

- **deps**: `@eslint/css` `^0.9.0` → `~0.14.1` (5 new recommended rules,
  `css/no-parsing-errors` removed)
- **deps**: Added `tailwind-csstree` `~0.1.4` for Tailwind v4 syntax
  definitions (replaces local `tailwind-v4-syntax.ts`)
- **css**: `css/use-baseline` set to
  `['error', { allowSelectors: ['nesting'] }]` — CSS nesting is widely
  supported across all major browsers
- **css**: Removed `css/no-parsing-errors: 'off'` (rule removed in
  `@eslint/css` 0.14.x)
- **css**: Removed speculative "future rules" comments
- **nuxt**: Re-enabled CSS linting — disabled since v0.7.4, now safe
  with `@nuxt/eslint` v1.15.2 scoping tooling plugins to JS/TS/Vue

### Removed

- **css**: Deleted `tailwind-v4-syntax.ts` — all Tailwind v4 at-rules
  now provided by `tailwind-csstree`. Only `@tailwind` (legacy v3)
  remains as a local extension in `css.ts`.

### Fixed

- **tests**: Added trailing newlines to 9 single-line CSS test strings
  to satisfy `@stylistic/eol-last` with the stricter 0.14.x parser
- **tests**: Replaced `content-visibility: auto` with baseline-safe
  properties in `@layer utilities` test fixture

## [0.8.0] - 2026-03-02

### Added

- **core/globs**: New module exporting common file pattern constants
  (`GLOB_CSS`, `GLOB_SRC`, `GLOB_VUE`, etc.)
- **unicorn**: Split into `poupeUnicornConfigs` array with separate filename
  and general rules
- **vue**: Added `vueSetupConfig` for Vue TypeScript parser configuration

### Changed

- **CI**: Pinned Node.js to 20.19.0 in build and renovate workflows
  to match engines.node requirement
- **perfectionist**: Enhanced import sorting configuration
  - Enabled `partitionByNewLine` for `sort-imports` and `sort-named-imports`
  - Changed `newlinesBetween` from 'always' to 'ignore' to avoid conflicts
  - Empty lines now act as block separators, allowing logical grouping of imports
- **configs**: Restructured configuration exports from rule-only exports to
  complete ESLint config objects
  - Each config now includes its own file patterns for better modularity
  - Renamed exports for clarity (e.g., `cssRecommended` → `poupeCSSConfigs`)
  - Added centralised glob constants in `core/globs.ts`
- **stylistic**: Extended stylistic rules to apply to Vue files
- **nuxt**: `forNuxtModules` is now an alias of `forNuxt` — the
  `withoutPlugin('unicorn')` workaround and `rulesNotForModules` filter
  are no longer needed with `@nuxt/eslint` ~1.15.2 aligning plugin instances

### Removed

- **deps**: Removed unused `@humanwhocodes/momoa` direct dependency

### Updated

- `typescript` ~5.8.3 → ~5.9.3
- `unbuild` 3.5.0 → ~3.6.1
- `vitest` ^3.2.4 → ~4.0.18
- `@vitest/ui` ^3.2.4 → ~4.0.18
- `cross-env` ^7.0.3 → ~10.1.0
- `globals` ^16.5.0 → ~17.4.0
- `pkg-pr-new` ^0.0.54 → ~0.0.65
- `packageManager` pnpm 10.10.0 → 10.30.3
- `eslint-plugin-unicorn` ^59.0.1 → ^63.0.0 — 12 new recommended rules:
  `prefer-class-fields`, `no-array-reverse`, `require-module-specifiers`,
  `no-useless-error-capture-stack-trace`, `prefer-bigint-literals`,
  `prefer-classlist-toggle`, `require-module-attributes`, `no-array-sort`,
  `no-immediate-mutation`, `no-useless-collection-argument`,
  `prefer-response-static-json`, `isolated-functions`
- `@nuxt/eslint` ~1.4.1 → ~1.15.2
- `@nuxt/eslint-config` ~1.4.1 → ~1.15.2

### Fixed

- **CSS filter**: Added 3 new unicorn rules (`no-immediate-mutation`,
  `prefer-bigint-literals`, `prefer-response-static-json`) to the
  explicit disable list for CSS files
- **examples**: Added `playground/node_modules` to nuxt-module clean script
- **examples**: Changed `playground-nuxt` nuxt dependency from `^3.17.5`
  to `latest` to match `playground-nuxt-module` and stabilise lockfile
  dedupe across transitive dependencies
- **examples**: Removed redundant top-level `types` field from nuxt-module
  package.json (already declared in exports map)
- **vue**: Override deprecated `allowMultiplePropertiesPerLine` option on
  `vue/object-property-newline` set by `@nuxt/eslint-config@1.4.1`,
  which `eslint-plugin-vue@10.8.0` no longer accepts
- **README**: Corrected Node.js version requirement from v18.20.8+
  to v20.19.0+

### Internal

- Added shared `mustConfigByName` test utility for fail-fast config lookups
- Removed `eslint-disable` comment from `css.test.ts`: narrow
  `as any` to `as Linter.Config[]`
- Refactored test files to work with new config structure

## [0.7.13] - 2026-03-02

### Changed

- **eslint-plugin-jsonc**: Migrated from v2 to v3 — replaced
  `jsonc-eslint-parser` with built-in `language: 'jsonc/json'` plugin
- **engines.node**: Bumped minimum Node.js from >= 18.20.0 to >= 20.19.0
- **CSS filter**: Added `/^exp-/` pattern to disable `@stylistic`
  experimental rules for CSS files
- **CI**: Run full prepack pipeline in build workflow instead of
  only lint and build
- **licence**: Updated copyright to 2024-2026 Apptly Software Ltd,
  renamed LICENSE to LICENCE.txt

### Updated

- `eslint` ^9.30.1 → ^9.39.3
- `typescript-eslint` ^8.35.1 → ^8.56.1
- `@stylistic/eslint-plugin` ^5.1.0 → ^5.9.0
- `eslint-plugin-jsonc` ^2.20.1 → ^3.1.1 (removed `jsonc-eslint-parser`)
- `eslint-plugin-perfectionist` ^4.15.0 → ^4.15.1
- `@vue/eslint-config-typescript` ^14.5.1 → ^14.7.0
- `eslint-plugin-vue` ^10.2.0 → ^10.8.0
- `publint` ^0.3.12 → ^0.3.18
- `rimraf` ^6.0.1 → ^6.1.3
- `oxc-parser` override 0.72.3 → 0.116.0

### Fixed

- **clean script**: Reordered to clean example workspaces before root
  `node_modules`, preventing rimraf not-found errors
- **CSS tests**: Added `trim()` helper to avoid `@stylistic/no-trailing-spaces`
  false positives in template literals
- **examples**: Pinned `@nuxt/eslint` to `~1.4.x` to avoid upstream
  compatibility issues
- **unicorn/filename-case**: Extended exception pattern to cover
  uppercase `.txt` files (e.g. LICENCE.txt) alongside `.md` files

## [0.7.12] - 2025-07-02

### Fixed

- **examples**: Use cross-platform compatible commands in playground scripts
  - Replace Unix-specific `rm -rf` with `rimraf` for file deletion
  - Replace Unix-specific `env` with `cross-env` for environment variables
  - Ensures examples work correctly on Windows, macOS, and Linux

## [0.7.11] - 2025-07-02

### Changed

- **unicorn/prevent-abbreviations**: Allow `i`, `j`, `k` as idiomatic variable names
  for loop counters and array indices

## [0.7.10] - 2025-07-02

### Documentation

- Enhanced README with comprehensive documentation including supported file types,
  advanced configuration examples, migration guide, and troubleshooting section
- Added package.json description field for better npm registry visibility

### Fixed

- Removed redundant export in index.ts that was duplicating configs exports

## [0.7.9] - 2025-07-01

### Added

- **Import/Export sorting**: Added `eslint-plugin-perfectionist` for automatic
  organization of imports and exports with natural alphabetical ordering,
  grouped imports, and consistent formatting
- **package.json sorting**: Alphabetical sorting for second-level objects
  (scripts, pnpm, exports, publishConfig) in package.json files
- **Operator line breaks**: Added `@stylistic/operator-linebreak` rule to enforce
  placing operators after line breaks in multi-line statements
- **Union type sorting**: Added `perfectionist/sort-union-types` rule for automatic
  sorting of TypeScript union type members with comment-based grouping support

### Fixed

- **JSON config**: Allow comments in tsconfig.json and tsconfig.*.json files by
  adding them to JSONC_ALLOW_COMMENTS_FILES exception list

### Changed

- **JSON configs**: Renamed to use `poupe/` prefix: `poupe/json` and
  `poupe/package-json` for better namespace organization
- **JSON tests**: Refactor tests for better clarity and more specific assertions

## [0.7.8] - 2025-07-01

### Added

- **withoutPlugin utility**: New helper function to remove plugins from configs
  while preserving all other settings, useful for Nuxt module configurations

### Changed

- **CSS rule filtering**: Refactored CSS disable rules logic into a separate
  `processCSSConfigs` helper function for better maintainability
- **Nuxt module config**: Replaced manual plugin destructuring with the new
  `withoutPlugin` utility for cleaner code

### Fixed

- **Test organization**: Migrated test files to proper `src/` subdirectories
  to align with modern project structure

### Updated

- Updated typescript-eslint monorepo to ^8.35.1
- Updated globals to ^16.3.0

## [0.7.7] - 2025-07-01

### Changed

- **Architecture refactor**: Migrated from `Linter.Config` to typescript-eslint's
  `Config` type pattern with `withConfig()` helper for better type safety and
  automatic config flattening
- **CSS tolerant mode**: Enabled tolerant parsing mode for CSS files to support
  Tailwind CSS v4 extended syntax without parsing errors

### Updated

- Updated @stylistic/eslint-plugin to v5
- Updated @eslint/css to ^0.9.0
- Updated typescript-eslint monorepo to ^8.35.0
- Updated eslint monorepo to ^9.30.0
- Updated pkg-pr-new to ^0.0.54

## [0.7.6] - 2025-06-29

### Changed

- **unicorn/filename-case**: Updated regex pattern to allow numbers in all-caps
  markdown filenames (e.g., MD5.md, SHA256.md, RFC2119.md)

## [0.7.5] - 2025-06-20

### Added

- **poupeCssRules export**: New rules configuration specifically for CSS files
  with Tailwind CSS v4 compatibility
- **Smart CSS rule filtering**: Implemented intelligent filtering system that
  scans all plugin rules (not just configured ones) to properly categorize
  which rules apply to CSS files
- **VSCode JSON comments**: Allow comments in VSCode configuration files
  (`**/.vscode/*.json`) while maintaining strict no-comment rules for regular
  JSON files

### Fixed

- **CSS rule application**: Fixed issue where `unicorn/filename-case` was
  incorrectly disabled for CSS files
- **Complete rule coverage**: Now properly disables ~280 JavaScript-specific
  rules for CSS files by scanning plugin rules directly
- **Stylistic rules for CSS**: Correctly keeps formatting rules like `eol-last`,
  `no-trailing-spaces`, and `spaced-comment` that work with CSS files
- **Markdown indentation**: Set explicit 2-space indentation for MD007 rule
  (unordered list indentation) to ensure consistent formatting

### Changed

- **CSS configuration architecture**: Replaced hardcoded plugin lists with a
  flexible configuration system supporting per-plugin rule sets and patterns

## [0.7.4] - 2025-06-20

### Added

- **Tailwind CSS v4 support**: Full syntax support for all Tailwind CSS v4
  directives including @theme, @source, @utility, @variant, @custom-variant,
  @reference, and @layer
- **CSS example files**: Added Tailwind CSS v4 example files to all playground
  projects demonstrating modifiers and directives

### Fixed

- **File restrictions**: Added proper file restrictions to eslint, stylistic,
  tsdoc, and unicorn configurations to prevent JS/TS rules from being applied
  to non-JS files
- **Vue rules**: Fixed Vue rules to only apply to .vue files
- **Nuxt CSS support**: Temporarily disabled CSS support for Nuxt configurations
  due to upstream conflicts with @nuxt/eslint-config (see issue #138)

## [0.7.3] - 2025-06-20

### Added

- **CSS support**: Added `@eslint/css` plugin for linting CSS files with
    Tailwind CSS syntax support
- **File type documentation**: Added supported file types section to AGENT.md
- **Renovate labels**: Configure Renovate to automatically add "dependencies"
    label to all dependency update PRs

### Fixed

- **File pattern restrictions**: Added file pattern restrictions to JavaScript
    and TypeScript rules to prevent them from being applied to CSS files
- **Example workspaces**: Fixed missing newlines and JSON key ordering in
    playground example files
- **Dependencies**: Updated multiple dependencies to their latest versions:
  - `@eslint/js` and `eslint` to ^9.29.0
  - `typescript-eslint` monorepo to ^8.34.1
  - `eslint-plugin-vue` to ^10.2.0
  - `@stylistic/eslint-plugin` to ^4.4.1
  - `@vue/eslint-config-typescript` to ^14.5.1

### Chores

- **Development dependencies**: Updated build and test tools:
  - `pkg-pr-new` to ^0.0.51
  - `publint` to ^0.3.12
  - `npm-run-all2` to ^8.0.4

## [0.7.2] - 2025-06-20

### Added

- **JSON support**: Added `eslint-plugin-jsonc` for linting JSON and JSONC
    files with specific formatting rules
- **Package.json sorting**: Enforced standard key ordering and alphabetical
    dependency sorting for package.json files
- **JSON test files**: Added example JSON files to all test workspaces

### Improved

- **Documentation**: Updated AGENT.md to include JSON linting configuration
    details

## [0.7.1] - 2025-06-20

### Fixed

- **Nuxt configurations**: Added missing markdown support to `forNuxt` and
    `forNuxtModules` configurations to ensure consistent markdown linting
    across all project types

### Added

- **Example workspaces**: Added comprehensive test examples for standard,
    Nuxt, and Nuxt module projects to verify ESLint configuration behavior
- **Configuration tests**: Added automated tests to ensure rules work
    consistently across all project types

### Improved

- **Test infrastructure**: Enhanced test script to properly prepare all
    workspaces before running tests
- **Clean script**: Extended to clean example workspace build artifacts

## [0.7.0] - 2025-06-19

### Added

- **Markdown support**: Integrated `eslint-plugin-markdownlint` for linting
    markdown files with MD001-MD050 rules and custom stricter formatting:
  - MD013: 80-character line length limit
  - MD041: Disabled (first line heading requirement)
- **Filename exceptions**: Added unicorn/filename-case exception for
    uppercase markdown files (e.g., README.md, AGENT.md, CODE_OF_CONDUCT.md)
- **Build scripts**: Added `precommit` script that runs lint, type-check,
    test, and build in sequence
- **Package validation**: Added `publint` to validate package configuration
    before publishing
- **Dependencies**:
  - `eslint-plugin-markdownlint` for markdown linting
  - `npm-run-all2` for running scripts in sequence
  - `publint` for package validation

### Changed

- Updated `prepack` script to include full validation pipeline:
  - lint
  - type-check
  - test
  - build
  - publint

### Fixed

- Documentation formatting to comply with markdown linting rules:
  - 80-character line limit
  - 4-space indentation for nested lists
  - Language specifiers for code blocks

## [0.6.4] - 2025-05-26
