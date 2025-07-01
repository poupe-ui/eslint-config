# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- **Import/Export sorting**: Added `eslint-plugin-perfectionist` for automatic
  organization of imports and exports with natural alphabetical ordering,
  grouped imports, and consistent formatting

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
