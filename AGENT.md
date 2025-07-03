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
- **eslint-plugin-perfectionist**: Import/export and union type sorting
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
- **Operator Line Breaks**: Operators placed after line breaks in multi-line
  statements
- **Import/Export Sorting**: Automatic import organization with:
  - Natural alphabetical ordering
  - Groups: types, builtin/external, internal, parent/sibling/index
  - Newlines between import groups
  - Sorted named imports and exports
- **Union Type Sorting**: Automatic sorting of TypeScript union types with
  comment-based grouping support

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

// Nuxt Module usage
import { createConfigForNuxt } from '@nuxt/eslint-config/flat';
import { forNuxtModules } from '@poupe/eslint-config/nuxt';
export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: true,
  }
}, ...forNuxtModules());

// Custom composition with withConfig
import { configs, withConfig } from '@poupe/eslint-config';
export default withConfig(
  configs.javascript,
  configs.typescript,
  configs.stylistic,
);
```

## Nuxt Configuration Complexity

### Why Different Configs for Nuxt Apps vs Modules?

Nuxt applications and Nuxt modules have different ESLint setups:

1. **Nuxt Applications** use `@nuxt/eslint` which generates a config at
   `.nuxt/eslint.config.mjs`. This is integrated with the Nuxt build process.

2. **Nuxt Modules** use `@nuxt/eslint-config/flat` directly with
   `createConfigForNuxt`. The `tooling` feature enables module-author-specific
   rules including their own version of unicorn rules.

### The Unicorn Plugin Conflict

The issue with unicorn rules stems from:

1. **Plugin Instance Conflicts**: `@nuxt/eslint` includes its own unicorn plugin
   instance in the `nuxt/tooling/unicorn` config. When we also include our
   unicorn plugin, ESLint detects different instances and throws an error:
   "Different instances of plugin 'unicorn' found in multiple configs:
   nuxt/tooling/unicorn, unicorn/recommended"

2. **Version Mismatches**: Historically, Nuxt tooling used an older version of
   unicorn that didn't include these rules:
   - `unicorn/no-unnecessary-array-flat-depth`
   - `unicorn/no-unnecessary-array-splice-count`
   - `unicorn/no-unnecessary-slice-end`
   - `unicorn/prefer-single-call`

3. **Current Solution**: For Nuxt modules, we:
   - Remove the unicorn plugin using `withoutPlugin('unicorn', ...)` to avoid
     conflicts with `@nuxt/eslint`'s instance
   - Add `unicornSetupConfig` (bare plugin without rules) to ensure the plugin
     is available for our own rule references
   - Filter out rules that might not exist using `withoutRules(...)`
   - This allows `@nuxt/eslint` to use its own unicorn configuration while
     preventing "Could not find plugin 'unicorn'" errors for our rules

### Implementation Pattern

When removing a plugin with `withoutPlugin()` but still having rules that
reference it:

1. Create a setup config that provides just the plugin without rules
2. Add this setup config BEFORE the filtered configs
3. This ensures ESLint can resolve rule references without conflicts

Example:

```typescript
// In unicorn.ts
export const unicornSetupConfig: Config = {
  name: 'poupe/unicorn-setup',
  plugins: { unicorn: unicornPlugin },
};

// In nuxt.ts
const configs = withoutPlugin('unicorn', ...forNuxt(...userConfigs));
return [unicornSetupConfig, ...configs.map(c => removeUnsupportedRules(c))];
```

### Future Considerations

- The version mismatch may no longer exist if Nuxt has updated their unicorn
  dependency
- The filtered rules should be periodically reviewed to check if they're still
  necessary
- Consider using feature detection instead of hardcoding rule names
- With `@nuxt/eslint` v1.5.0+ adding file restrictions to configs (limiting
  rules to `GLOB_SRC` and `GLOB_VUE`), the plugin conflict issues should be
  reduced

## Git Workflow

### Commit Guidelines

#### CRITICAL: THINK BEFORE YOU COMMIT - READ THIS SECTION TWICE

##### Pre-commit Checklist (MANDATORY)

1. Run `git status` and READ every file listed
2. Ask yourself: "Do ALL these files belong in this commit?"
3. If working on feature X, do NOT include unrelated feature Y files
4. NEVER stage files in bulk with `git add -A` or `git add .`
5. Check if your changes require updates to:
   - **CHANGELOG.md** - for any user-facing changes or fixes
   - **README.md** - for new features, API changes, or usage examples
   - **AGENT.md** - for new development guidelines or workflow changes

##### Commit Rules (STRICT ENFORCEMENT)

- Always use `-s` flag for signed commits
- Never use `-m` flag
- Use `-F` flag with a commit message file
- Create unique commit message files: `.commit-msg-<descriptive-slug>` in CWD
- Delete commit message files after use to avoid conflicts
- **ALWAYS specify explicit file names in EVERY git command** — for example:
  - `git commit` - list every file
  - `git commit --amend` - list every file being added
  - `git add` - list specific files, never use `-A` or `.`
- Use the Write tool to create commit message files (avoid echo/heredoc to
  prevent shell expansion issues)
- When editing PRs with `gh pr edit`, use `--body-file` with a file created
  by the Write tool to avoid shell expansion issues

##### Example workflow (FOLLOW EXACTLY)

1. Run `git status` and identify files for THIS commit only
2. Stage files individually: `git add src/file1.ts src/file2.ts`
3. Use Write tool to create `.commit-msg-<descriptive-slug>`
4. Run: `git commit -s -F .commit-msg-<descriptive-slug> src/file1.ts src/file2.ts`
5. Delete the commit message file after use
6. If you need to amend:

   ```bash
   git commit --amend -F .commit-msg-<descriptive-slug> \
     src/file1.ts src/file2.ts src/file3.ts
   ```

##### Common Mistakes That Waste Credits

- Committing unrelated work (e.g., CSS fixes + future migration plans)
- Using `git add -A` or `git add .`
- Not reading `git status` output before committing
- Using `--amend` without explicit file lists
- Rushing commits without thoughtful review
- Including package.json/pnpm-lock.yaml updates without thinking if they belong
- Mixing example updates with core library changes
- Forgetting to delete commit message files after use
- Using `cd` in bash commands instead of absolute paths
- Committing generated files (.nuxt/, dist/) or editor files (.vscode/)

## Development Practices

### DO

- Run `pnpm lint` and `pnpm type-check` before committing
- Test configuration changes by running lint on this codebase
- Follow existing patterns when adding new configurations
- Use semantic versioning for releases
- Follow the .editorconfig rules for consistent formatting
- Use atomic commits with explicit file lists
- Update CHANGELOG.md for user-facing changes
- Update README.md when adding features or changing APIs
- Update AGENT.md when changing development workflows

### DON'T

- Create files unless necessary - prefer editing existing configurations
- Add external dependencies without careful consideration
- Ignore TypeScript errors or ESLint warnings
- Mix different configuration styles (stick to flat config format)
- Mix tabs and spaces - follow the .editorconfig rules for each file type
- Use `git commit -m` (use `-F` with a file instead)
- Rely on staged files - always specify files explicitly in commits
- Use `cd` in bash commands - use absolute paths or `pnpm --filter`
- Delete files without explicit permission

## Agent-Specific Instructions

### Claude Code-Specific Instructions

- Use the TodoWrite tool for complex multi-step tasks
- **CRITICAL: Always enumerate files explicitly in git commit commands**
- **NEVER use bare `git commit` without file arguments**
- Fix issues immediately without commentary
- Stay focused on the task at hand

### Universal Agent Guidelines

- Test changes thoroughly before considering tasks complete
- Follow the pre-commit checklist strictly
- Use Write tool for commit messages, not echo, -m, or heredocs
- Create commit message files with descriptive slugs: `.commit-msg-<descriptive-slug>`
- NEVER USE `cd` IN BASH COMMANDS - use absolute paths
- When testing examples, use `pnpm --filter` instead of changing directories

## Debugging Tips

1. **Build Issues**: Run `pnpm clean` then `pnpm build`
2. **Type Errors**: Check `tsconfig.json` and ensure all imports have types
3. **ESLint Not Working**: Use `DEBUG=eslint:eslint pnpm lint` for verbose output
4. **Test Failures**: Check if config changes affect self-linting
5. **Example Issues**: Each example has its own dependencies - check
   package.json
6. **Plugin Conflicts**: Different plugin instances = check version consistency
7. **CSS Rule Errors**: Rules meant for JS don't work on CSS files
