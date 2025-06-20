# Changelog

All notable changes to this project will be documented in this file.

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
