# Changelog

All notable changes to this project will be documented in this file.

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
    - MD007: 4-space indentation for nested lists
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
