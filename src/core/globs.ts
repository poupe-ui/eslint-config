export const GLOB_CSS = '**/*.css';
export const GLOB_JSON = '**/*.json';
export const GLOB_JSONC = '**/*.jsonc';
export const GLOB_SRC = '**/*.?([cm])[jt]s?(x)';
export const GLOB_VUE = '**/*.vue';

// JSON files that support JSONC (JSON with Comments) syntax
export const GLOB_JSONC_FILES: string[] = [
  GLOB_JSONC,
  '**/.vscode/*.json',
  '**/tsconfig.json',
  '**/tsconfig.*.json',
  '**/jsconfig.json',
  '**/jsconfig.*.json',
];
