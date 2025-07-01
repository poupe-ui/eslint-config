import type { Config, Rules } from '../core';
import { withConfig } from '../core';

import jsoncPlugin from 'eslint-plugin-jsonc';
import * as jsoncParser from 'jsonc-eslint-parser';

const jsoncRecommendedRules = jsoncPlugin.configs['recommended-with-json'].rules as Rules;

export const poupeJsonRules: Rules = {
  // Consistent formatting
  'jsonc/indent': ['error', 2],
  'jsonc/comma-dangle': ['error', 'never'],
  'jsonc/comma-style': ['error', 'last'],
  'jsonc/array-bracket-newline': ['error', 'consistent'],
  'jsonc/array-bracket-spacing': ['error', 'never'],
  'jsonc/object-curly-newline': ['error', { multiline: true, consistent: true }],
  'jsonc/object-curly-spacing': ['error', 'always'],
  'jsonc/key-spacing': ['error', { beforeColon: false, afterColon: true }],

  // No comments in JSON files
  'jsonc/no-comments': 'error',
};

export const poupePackageJsonRules: Rules = {
  ...poupeJsonRules,
  // Sort package.json keys in standard order
  'jsonc/sort-keys': [
    'error',
    {
      pathPattern: '^$', // Root level
      order: [
        'name',
        'version',
        'private',
        'type',
        'description',
        'author',
        'license',
        'homepage',
        'repository',
        'bugs',
        'keywords',
        'main',
        'module',
        'types',
        'exports',
        'files',
        'scripts',
        'dependencies',
        'devDependencies',
        'peerDependencies',
        'peerDependenciesMeta',
        'optionalDependencies',
        'engines',
        'packageManager',
        'publishConfig',
      ],
    },
    {
      // Sort dependencies alphabetically
      pathPattern: '^(dependencies|devDependencies|peerDependencies|optionalDependencies)$',
      order: { type: 'asc' },
    },
  ],
};

export const jsoncRecommended: Config[] = withConfig(
  {
    name: 'jsonc/json',
    files: ['**/*.json'],
    ignores: ['**/package.json'],
    plugins: {
      jsonc: jsoncPlugin,
    },
    languageOptions: {
      parser: jsoncParser,
    },
    rules: {
      ...jsoncRecommendedRules,
      ...poupeJsonRules,
    },
  },
  {
    name: 'jsonc/package-json',
    files: ['**/package.json'],
    plugins: {
      jsonc: jsoncPlugin,
    },
    languageOptions: {
      parser: jsoncParser,
    },
    rules: {
      ...jsoncRecommendedRules,
      ...poupePackageJsonRules,
    },
  },
  {
    name: 'jsonc/allow-comments',
    files: ['**/.vscode/*.json'],
    rules: {
      // Allow comments in VSCode configuration files
      'jsonc/no-comments': 'off',
    },
  },
);
