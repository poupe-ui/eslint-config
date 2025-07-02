# AGENT.md

This file provides guidance to AI assistants when working with code in
this repository.

## Commands

### Development Commands

- `pnpm build` - Build the package using unbuild (required before testing
  changes)
- `pnpm lint` - Run ESLint with auto-fix enabled
- `pnpm type-check` - Check TypeScript types without emitting files
- `pnpm dev:prepare` - Create a fast stub build for development
- `pnpm clean` - Remove dist folder and node_modules
- `pnpm prepack` - Full validation (lint, type-check, build)

### Debugging

- `DEBUG=eslint:eslint pnpm lint` - Debug ESLint configuration issues

### Testing Changes

To test ESLint configuration changes:

1. Make changes to configuration files in `src/configs/`
2. Run `pnpm build` to compile the package
3. Run `pnpm lint` to test the configuration on this codebase itself
   (self-linting)
4. Test in example workspaces: `pnpm -r --filter "./examples/*" lint`

## Architecture

This is a shareable ESLint configuration package that provides standardized
linting rules for Poupe UI projects. It uses ESLint's flat configuration
format and is written in TypeScript.

### Key Concepts

1. **Flat Config Format**: Uses ESLint's modern flat configuration system
   (not legacy .eslintrc)
2. **Configuration Composition**: The package combines multiple ESLint plugins
   with custom rule overrides
3. **Entry Points**:
   - Main: `@poupe/eslint-config` for standard projects
   - Nuxt: `@poupe/eslint-config/nuxt` for Nuxt.js projects
4. **Type Safety**: Full TypeScript support with proper type definitions
   exported from `src/core/config.ts`
5. **Config Factory Pattern**: Uses typescript-eslint's `withConfig()` helper
   for proper config flattening and extends resolution
6. **Self-Dogfooding**: Package uses its own ESLint configuration for
   validation

### Project Structure

```text
.
├── src/              # Source code
│   ├── configs/      # Individual ESLint rule configurations
│   │   ├── css.ts        # CSS linting rules with Tailwind CSS support
│   │   ├── eslint.ts     # Core ESLint JavaScript rules
│   │   ├── json.ts       # JSON and package.json linting rules
│   │   ├── markdown.ts   # Markdown linting rules (markdownlint)
│   │   ├── stylistic.ts  # Code style and formatting rules (@stylistic)
│   │   ├── tsdoc.ts      # TypeScript documentation rules
│   │   ├── tseslint.ts   # TypeScript-specific ESLint rules
│   │   ├── unicorn.ts    # Modern JavaScript best practices
│   │   ├── vue.ts        # Vue.js framework rules
│   │   └── __tests__/    # Tests for config modules
│   │       ├── css.test.ts   # CSS configuration tests
│   │       └── json.test.ts  # JSON configuration tests
│   ├── core/         # Core configuration utilities
│   │   ├── config.ts     # TypeScript type definitions and withConfig export
│   │   ├── utils.ts      # Configuration helper functions
│   │   ├── css-filter.ts # CSS rule filtering logic
│   │   └── __tests__/    # Tests for core utilities
│   │       └── without-plugin.test.ts  # Tests for withoutPlugin helper
│   ├── config.ts     # Main configuration builder (defineConfig)
│   ├── configs.ts    # Configuration presets and exports
│   ├── index.ts      # Main entry point (re-exports)
│   ├── nuxt.ts       # Nuxt.js-specific configuration
│   └── __tests__/    # Tests for main modules
│       └── config.test.ts  # Tests for defineConfig
├── examples/         # Example implementations
│   ├── playground-standard/     # Basic JS/TS example
│   ├── playground-nuxt/         # Nuxt.js application example
│   └── playground-nuxt-module/  # Nuxt module development example
├── test/             # Integration test files
└── pnpm-workspace.yaml         # Workspace configuration
```

### ESLint Plugins Included

- **@eslint/js**: Core JavaScript linting rules
- **@eslint/css**: CSS linting with Tailwind CSS syntax support
- **@stylistic/eslint-plugin**: Code formatting and style consistency
- **typescript-eslint**: TypeScript-specific linting and type checking
- **eslint-plugin-vue**: Vue.js template and script linting
- **eslint-plugin-unicorn**: Modern JavaScript best practices
- **eslint-plugin-tsdoc**: TypeScript documentation standards
- **eslint-plugin-markdownlint**: Markdown file linting (MD001-MD050 rules)
- **eslint-plugin-jsonc**: JSON and JSONC file linting with package.json sorting

### Supported File Types

The configuration automatically lints the following file types:

- **JavaScript**: `.js`, `.mjs`, `.cjs`
- **TypeScript**: `.ts`, `.tsx`
- **Vue.js**: `.vue` (SFC)
- **JSON/JSONC**: `.json`, `.jsonc`, `package.json`
- **Markdown**: `.md`
- **CSS**: `.css` (with Tailwind CSS syntax support)

### CSS Configuration System

The CSS configuration (`src/configs/css.ts`) uses a sophisticated filtering
system to apply appropriate rules to CSS files:

#### CSS Language Options

The CSS configuration uses `tolerant: true` mode for parsing, which allows
the parser to handle recoverable errors that browsers would automatically fix.
This is particularly important for Tailwind CSS's extended syntax.

```typescript
languageOptions: {
  tolerant: true, // Enable tolerant mode for Tailwind CSS compatibility
  customSyntax: tailwindSyntax,
}
```

#### Rule Filtering Architecture

1. **ALWAYS_KEEP_PLUGINS**: Plugins where all rules work with CSS files
   - `css`, `jsonc`, `markdown`

2. **ALWAYS_DISABLE_PLUGINS**: Plugins where no rules work with CSS files
   - Core ESLint rules (`''`), `@typescript-eslint`, `vue`, `tsdoc`

3. **KNOWN_PLUGINS**: Plugins requiring fine-grained rule control
   - Each plugin has a `PluginRuleConfig` with:
     - `alwaysKeepRules`: Specific rules to keep for CSS files
     - `alwaysDisableRules`: Specific rules to disable for CSS files
     - `alwaysKeepPatterns`: RegExp patterns for rules to keep
     - `alwaysDisablePatterns`: RegExp patterns for rules to disable

4. **Dynamic Detection**: Unknown plugins/rules are automatically handled
   - Unknown plugin → Warning + add to ALWAYS_DISABLE_PLUGINS
   - Unknown rule in known plugin → Warning + add to alwaysDisableRules

#### Adding CSS Support for New Plugins

When adding a new ESLint plugin that might have CSS-relevant rules:

1. Analyze which rules make sense for CSS files
2. Add the plugin to the appropriate category:
   - If all rules work with CSS → ALWAYS_KEEP_PLUGINS
   - If no rules work with CSS → ALWAYS_DISABLE_PLUGINS
   - If mixed → Add to KNOWN_PLUGINS with detailed configuration
3. Run `pnpm lint` to see warnings for uncategorized rules
4. Use the warnings to populate your rule sets

## Code Style Guidelines

Follow these conventions (enforced by .editorconfig and ESLint):

### EditorConfig Rules

- **Charset**: UTF-8
- **Line Endings**: Unix (LF)
- **Final Newline**: Always insert
- **Trailing Whitespace**: Always trim (except in Markdown files)
- **Default Indentation**: 8-space tabs for most files
- **Special Indentation**:
  - 2 spaces for `.json`, `.yaml`, `.yml`, `.js`, `.cjs`, `.mjs`, `.ts`,
    `.vue`, `.css`, `.md`

### ESLint Enforced Rules

- **Quotes**: Single quotes for strings
- **Semicolons**: Always use semicolons
- **Brace Style**: 1tbs (one true brace style)
- **Naming**: camelCase for variables/functions, PascalCase for
  types/interfaces

### Markdown Linting Rules

Custom markdownlint rules enforced:

- **MD013**: 80-character line length limit
- **MD041**: Disabled (first line heading requirement)

### JSON Linting Rules

JSON files are linted with specific formatting rules:

- **General JSON files**: 2-space indentation, no trailing commas, no comments
  (except tsconfig.json and .vscode/*.json which allow comments)
- **package.json files**: Additionally enforces standard key ordering,
  alphabetical dependency sorting, and alphabetical sorting of second-level
  objects (scripts, pnpm, exports, publishConfig)

## Common Tasks

### Adding or Modifying Rules

1. Locate the appropriate config file in `src/configs/` (e.g., `eslint.ts`
   for JavaScript rules, `markdown.ts` for Markdown rules)
2. Modify the rules object within the configuration
3. Run `pnpm build` then `pnpm lint` to test your changes
4. Test in all example workspaces: `pnpm -r --filter "./examples/*" lint`

### Creating New Configuration Preset

1. Add new configuration to `src/configs.ts`
2. Export from appropriate entry point files
3. Build and test with `pnpm build` and `pnpm lint`

### Testing in Example Workspaces

The project includes example workspaces in the `examples/` directory for
testing different usage scenarios:

1. **playground-standard**: Basic JavaScript/TypeScript project
2. **playground-nuxt**: Nuxt.js application using `@nuxt/eslint`
3. **playground-nuxt-module**: Nuxt module development setup

To test changes:

```bash
# Build the package
pnpm build

# Lint all examples
pnpm -r --filter "./examples/*" lint

# Fix issues in all examples
pnpm -r --filter "./examples/*" lint:fix

# Run specific example
pnpm --filter "@poupe/eslint-config-playground-nuxt" lint
```

### Testing in External Projects

1. Run `pnpm dev:prepare` for a stub build (faster than full build)
2. Link or install in consuming project
3. Test the configuration changes

## Build Process

The package uses `unbuild` which:

- Compiles TypeScript to both ESM (.mjs) and CommonJS (.cjs)
- Generates TypeScript declaration files
- Creates stub builds for faster development iteration
- Outputs: `dist/index.mjs`, `dist/index.cjs`, `dist/nuxt.mjs`,
  `dist/nuxt.cjs`

## Type System

The package uses typescript-eslint's `Config` type throughout, providing better
type safety and integration with the typescript-eslint ecosystem. Key types:

- `Config`: The main configuration type from typescript-eslint
- `Rules`: Type-safe rule definitions
- `withConfig()`: Helper function that flattens configs and resolves extends

All configuration modules return `Config[]` arrays, which are automatically
flattened by `withConfig()`.

## Usage Examples

```typescript
// Basic usage
import poupeConfig from '@poupe/eslint-config';
export default poupeConfig;

// Custom configuration
import { defineConfig } from '@poupe/eslint-config';
export default defineConfig({
  rules: {
    // custom overrides
  }
});

// Nuxt.js usage
import { forNuxt } from '@poupe/eslint-config/nuxt';
import withNuxt from './.nuxt/eslint.config.mjs';
export default withNuxt(...forNuxt());

// Custom composition with withConfig
import { configs, withConfig } from '@poupe/eslint-config';
export default withConfig(
  configs.javascript,
  configs.typescript,
  configs.stylistic,
);
```

## Git Workflow

### Commit Guidelines

- Always use `-s` flag for signed commits
- Never use `-m` flag
- Use `-F` flag with a commit message file
- Create unique commit message files: `.commit-msg-<timestamp>` in CWD
- Delete commit message files after use to avoid conflicts
- Always specify explicit file names in the commit command
- Use the Write tool to create commit message files (avoid echo/heredoc to
  prevent shell expansion issues)
- Example workflow:
  1. Use Write tool to create `.commit-msg-<timestamp>`
  2. Run: `git commit -s -F .commit-msg-<timestamp> file1 file2`
  3. Delete the commit message file after use

## Development Practices

### DO

- Run `pnpm lint` and `pnpm type-check` before committing
- Test configuration changes by running lint on this codebase
- Follow existing patterns when adding new configurations
- Use semantic versioning for releases
- Follow the .editorconfig rules for consistent formatting
- Use atomic commits with explicit file lists

### DON'T

- Create files unless necessary - prefer editing existing configurations
- Add external dependencies without careful consideration
- Ignore TypeScript errors or ESLint warnings
- Mix different configuration styles (stick to flat config format)
- Mix tabs and spaces - follow the .editorconfig rules for each file type
- Use `git commit -m` (use `-F` with a file instead)
- Rely on staged files - always specify files explicitly in commits
