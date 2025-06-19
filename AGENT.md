# AGENT.md

This file provides guidance to AI assistants when working with code in this
repository.

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
   exported from `src/core/types.ts`
5. **Self-Dogfooding**: Package uses its own ESLint configuration for
   validation

### Configuration Structure
```
src/
├── configs/          # Individual ESLint rule configurations
│   ├── eslint.ts     # Core ESLint JavaScript rules
│   ├── stylistic.ts  # Code style and formatting rules (@stylistic)
│   ├── tsdoc.ts      # TypeScript documentation rules
│   ├── tseslint.ts   # TypeScript-specific ESLint rules
│   ├── unicorn.ts    # Modern JavaScript best practices
│   └── vue.ts        # Vue.js framework rules
├── core/             # Core configuration utilities
│   ├── types.ts      # TypeScript type definitions
│   └── utils.ts      # Configuration helper functions
├── config.ts         # Main configuration builder (defineConfig)
├── configs.ts        # Configuration presets and exports
├── index.ts          # Main entry point (re-exports)
└── nuxt.ts           # Nuxt.js-specific configuration
```

### ESLint Plugins Included
- **@eslint/js**: Core JavaScript linting rules
- **@stylistic/eslint-plugin**: Code formatting and style consistency
- **typescript-eslint**: TypeScript-specific linting and type checking
- **eslint-plugin-vue**: Vue.js template and script linting
- **eslint-plugin-unicorn**: Modern JavaScript best practices
- **eslint-plugin-tsdoc**: TypeScript documentation standards

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

## Common Tasks

### Adding or Modifying Rules
1. Locate the appropriate config file in `src/configs/` (e.g., `eslint.ts`
   for JavaScript rules)
2. Modify the rules object within the configuration
3. Run `pnpm build` then `pnpm lint` to test your changes

### Creating New Configuration Preset
1. Add new configuration to `src/configs.ts`
2. Export from appropriate entry point files
3. Build and test with `pnpm build` and `pnpm lint`

### Testing in Consuming Projects
1. Run `pnpm dev:prepare` for a stub build (faster than full build)
2. Link or install in consuming project
3. Test the configuration changes

## Build Process
The package uses `unbuild` which:
- Compiles TypeScript to both ESM (.mjs) and CommonJS (.cjs)
- Generates TypeScript declaration files
- Creates stub builds for faster development iteration
- The `eslint-flat-config-utils` package is marked as external in
  `build.config.ts`
- Outputs: `dist/index.mjs`, `dist/index.cjs`, `dist/nuxt.mjs`,
  `dist/nuxt.cjs`

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

// Custom composition
import { configs } from '@poupe/eslint-config';
export default [
  ...configs.javascript,
  ...configs.typescript,
  ...configs.stylistic,
];
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

### DO:
- Run `pnpm lint` and `pnpm type-check` before committing
- Test configuration changes by running lint on this codebase
- Follow existing patterns when adding new configurations
- Use semantic versioning for releases
- Follow the .editorconfig rules for consistent formatting
- Use atomic commits with explicit file lists

### DON'T:
- Create files unless necessary - prefer editing existing configurations
- Add external dependencies without careful consideration
- Ignore TypeScript errors or ESLint warnings
- Mix different configuration styles (stick to flat config format)
- Mix tabs and spaces - follow the .editorconfig rules for each file type
- Use `git commit -m` (use `-F` with a file instead)
- Rely on staged files - always specify files explicitly in commits