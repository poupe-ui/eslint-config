import jsoncPlugin from 'eslint-plugin-jsonc';

import {
  type Config,
  type Rules,

  GLOB_JSON,
  GLOB_JSONC,
} from '../core';

// v3: configs['recommended-with-json'] returns [plugins, language+files, rules]
const jsoncRecommendedConfigs = jsoncPlugin.configs['recommended-with-json'];
const jsoncRecommendedRules = jsoncRecommendedConfigs[2].rules as Rules;

const GLOB_PACKAGE_JSON = '**/package.json';

const JSONC_FILES = [
  GLOB_JSONC,
  '**/.vscode/*.json',
  '**/tsconfig.json',
  '**/tsconfig.*.json',
];

const poupeJsonRules: Rules = {
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

const poupeJsoncRules: Rules = {
  ...poupeJsonRules,
  'jsonc/no-comments': 'off',
};

const poupePackageJsonRules: Rules = {
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
    {
      // Sort other second-level objects alphabetically (scripts, etc.)
      pathPattern: '^(scripts|pnpm|exports|publishConfig)$',
      order: { type: 'asc' },
    },
  ],
};

export const poupeJsonConfigs: Config[] = [
  {
    name: 'poupe/json',
    files: [GLOB_JSON],
    ignores: [GLOB_PACKAGE_JSON],
    plugins: {
      jsonc: jsoncPlugin,
    },
    language: 'jsonc/json',
    rules: {
      ...jsoncRecommendedRules,
      ...poupeJsonRules,
    },
  },
  {
    name: 'poupe/package-json',
    files: [GLOB_PACKAGE_JSON],
    plugins: {
      jsonc: jsoncPlugin,
    },
    language: 'jsonc/json',
    rules: {
      ...jsoncRecommendedRules,
      ...poupePackageJsonRules,
    },
  },
  {
    name: 'poupe/jsonc',
    files: JSONC_FILES,
    plugins: {
      jsonc: jsoncPlugin,
    },
    language: 'jsonc/json',
    rules: {
      ...jsoncRecommendedRules,
      ...poupeJsoncRules,
    },
  },
];
