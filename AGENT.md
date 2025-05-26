# @poupe/eslint-config Package Agent Guidelines

## Build/Lint/Test Commands
- Build: `pnpm build`
- Type check: `pnpm type-check`
- Lint: `pnpm lint`
- Development build (stub): `pnpm dev:prepare`
- Clean: `pnpm clean`
- Pre-publish check: `pnpm prepack`

## Code Style Guidelines (.editorconfig)
- Use UTF-8 charset
- Unix line endings (LF)
- Use spaces for indentation in TypeScript/JavaScript/JSON files (2 spaces)
- Use tabs for other files (8 spaces width)
- Always insert final newline
- Trim trailing whitespace
- Single quotes for strings
- Always use semicolons
- Use 1tbs (one true brace style)
- Follow existing naming patterns (camelCase for variables/functions, PascalCase for types/interfaces)
- Use markdown reference variables for links in documentation

## Package Structure
```text
src/
├── configs/          # Individual ESLint rule configurations
│   ├── eslint.ts     # Core ESLint JavaScript rules
│   ├── stylistic.ts  # Code style and formatting rules
│   ├── tsdoc.ts      # TypeScript documentation rules
│   ├── tseslint.ts   # TypeScript-specific ESLint rules
│   ├── unicorn.ts    # Modern JavaScript best practices
│   └── vue.ts        # Vue.js framework rules
├── core/             # Core configuration utilities
│   ├── types.ts      # TypeScript type definitions
│   └── utils.ts      # Configuration helper functions
├── config.ts         # Main configuration builder
├── configs.ts        # Configuration presets
├── index.ts          # Main entry point (default config)
└── nuxt.ts           # Nuxt.js-specific configuration
```

## Configuration Presets
- **Default export**: Base configuration with JavaScript, TypeScript, and stylistic rules
- **Nuxt export**: Extended configuration for Nuxt.js projects with Vue support
- **Modular configs**: Individual rule sets that can be composed together

## ESLint Rule Categories
- **@eslint/js**: Core JavaScript linting rules
- **@stylistic**: Code formatting and style consistency
- **typescript-eslint**: TypeScript-specific linting and type checking
- **eslint-plugin-vue**: Vue.js template and script linting
- **eslint-plugin-unicorn**: Modern JavaScript best practices
- **eslint-plugin-tsdoc**: TypeScript documentation standards

## Configuration Architecture
- **Flat config format**: Uses ESLint's modern flat configuration system
- **Composable**: Individual rule sets can be mixed and matched
- **Type-safe**: Full TypeScript support with proper type definitions
- **Framework-aware**: Specific configurations for Vue.js and Nuxt.js

## Usage Examples
```typescript
// Basic usage
import poupeConfig from '@poupe/eslint-config';
export default poupeConfig;

// Nuxt.js usage
import { nuxt } from '@poupe/eslint-config/nuxt';
export default nuxt;

// Custom composition
import { configs } from '@poupe/eslint-config';
export default [
  ...configs.javascript,
  ...configs.typescript,
  ...configs.stylistic,
];
```

## Dependencies
- **Runtime**: `@eslint/js`, `@stylistic/eslint-plugin`, `typescript-eslint`, `eslint-plugin-vue`, `eslint-plugin-unicorn`, `eslint-plugin-tsdoc`
- **Peer**: `eslint@^9.27.0`
- **Build**: TypeScript, Unbuild

## Common Tasks
1. **Adding new rules**: Modify configs in `src/configs/` → run `pnpm build`
2. **Creating new preset**: Add to `src/configs.ts` → export from main files
3. **Testing changes**: `pnpm dev:prepare` (stub build) → test in consuming project
4. **Type checking**: `pnpm type-check`
5. **Linting**: `pnpm lint` (uses own config to lint itself)

## Build Process
1. Unbuild compiles TypeScript and bundles modules
2. Outputs: `dist/index.mjs`, `dist/index.cjs`, `dist/nuxt.mjs`, `dist/nuxt.cjs`
3. Type definitions generated automatically
4. Both ES modules and CommonJS formats for compatibility

## Development Notes
- Self-linting: Package uses its own ESLint configuration
- Flat config: Modern ESLint configuration format (not legacy .eslintrc)
- Debug mode: Use `DEBUG=eslint:eslint` environment variable for debugging
- Stub mode: `pnpm dev:prepare` creates stub build for development
