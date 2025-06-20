/* eslint-env node */
import { execSync } from 'node:child_process';
import path from 'node:path';
import { existsSync } from 'node:fs';

const examples = [
  'playground-standard',
  'playground-nuxt',
  'playground-nuxt-module',
];

// ESLint severity levels
const SEVERITY = {
  OFF: 0,
  WARN: 1,
  ERROR: 2,
};

// Convert string severity to numeric
function normalizeSeverity(value) {
  if (typeof value === 'number') return value;
  switch (value) {
    case 'off': return SEVERITY.OFF;
    case 'warn': return SEVERITY.WARN;
    case 'error': return SEVERITY.ERROR;
    default: return value;
  }
}

// Extract severity from rule config
function getRuleSeverity(ruleConfig) {
  if (Array.isArray(ruleConfig)) {
    return normalizeSeverity(ruleConfig[0]);
  }
  return normalizeSeverity(ruleConfig);
}

// Check if our filename-case ignore pattern is present
function hasUppercaseMdIgnorePattern(config) {
  if (!Array.isArray(config)) return false;
  const [, options] = config;
  return options?.ignore?.some(pattern =>
    pattern.includes('[A-Z]') && pattern.includes('.md'),
  );
}

// Rules we expect to be configured
const expectedRules = {
  'unicorn/filename-case': {
    test: config => hasUppercaseMdIgnorePattern(config),
    description: 'should have ignore pattern for uppercase .md files',
  },
  'unicorn/no-array-for-each': {
    severity: SEVERITY.ERROR,
    description: 'should be set to error',
  },
  'unicorn/prevent-abbreviations': {
    test: (config) => {
      if (!Array.isArray(config)) return false;
      const [, options] = config;
      // Check if our custom abbreviations are allowed
      return options?.allowList?.env === true
        && options?.allowList?.props === true;
    },
    description: 'should allow our custom abbreviations',
  },
  '@stylistic/semi': {
    test: (config) => {
      const severity = getRuleSeverity(config);
      return severity === SEVERITY.ERROR;
    },
    description: 'should enforce semicolons',
  },
};

function getESLintConfig(exampleDirectory, testFile) {
  const cwd = path.resolve('examples', exampleDirectory);

  if (!existsSync(cwd)) {
    throw new Error(`Example directory not found: ${cwd}`);
  }

  try {
    const output = execSync(
      `pnpm eslint --print-config ${testFile}`,
      { cwd, encoding: 'utf8' },
    );
    return JSON.parse(output);
  } catch (error) {
    console.error(`Failed to get config for ${exampleDirectory}:`, error.message);
    throw error;
  }
}

// Get the test file for each example type
function getTestFile(exampleName) {
  switch (exampleName) {
    case 'playground-nuxt':
      return 'test.vue';
    case 'playground-nuxt-module':
      return 'src/module.ts';
    default:
      return 'test.js';
  }
}

// Test a single rule
function testRule(ruleName, expected, ruleConfig) {
  const errors = [];

  if (!ruleConfig) {
    errors.push(`Rule '${ruleName}' is missing`);
    return errors;
  }

  // Test custom validation function
  if (expected.test) {
    if (expected.test(ruleConfig)) {
      console.log(`  ✅ ${ruleName}: ${expected.description}`);
    } else {
      errors.push(`${ruleName}: ${expected.description} - FAILED`);
    }
  }

  // Test severity level
  if (expected.severity !== undefined) {
    const actualSeverity = getRuleSeverity(ruleConfig);
    if (actualSeverity === expected.severity) {
      console.log(`  ✅ ${ruleName}: ${expected.description}`);
    } else {
      errors.push(`${ruleName}: expected severity ${expected.severity}, got ${actualSeverity}`);
    }
  }

  return errors;
}

// Test markdown-specific rules
function testMarkdownRules(exampleName) {
  console.log('\n  Testing markdown configuration...');

  // All examples should have test.md for consistency
  const mdConfig = getESLintConfig(exampleName, 'test.md');

  if (mdConfig.rules['markdownlint/md013']) {
    console.log('  ✅ Markdown linting is configured for .md files');
    return [];
  } else {
    return ['Markdown linting is not configured for .md files'];
  }
}

// Test JSON-specific rules
function testJsonRules(exampleName) {
  console.log('\n  Testing JSON configuration...');
  const errors = [];

  // Test general JSON file configuration
  const jsonConfig = getESLintConfig(exampleName, 'test.json');

  if (jsonConfig.rules['jsonc/indent']) {
    console.log('  ✅ JSON linting is configured for .json files');
  } else {
    errors.push('JSON linting is not configured for .json files');
  }

  // Test package.json specific configuration
  const packageJsonConfig = getESLintConfig(exampleName, 'package.json');

  if (packageJsonConfig.rules['jsonc/indent']) {
    console.log('  ✅ Package.json has JSON linting rules applied');
  } else {
    errors.push('Package.json is not being linted');
  }

  if (packageJsonConfig.rules['jsonc/sort-keys']) {
    console.log('  ✅ Package.json sorting is configured');
  } else {
    errors.push('Package.json sorting is not configured');
  }

  return errors;
}

function testExample(exampleName) {
  console.log(`\nTesting ${exampleName}...`);

  const testFile = getTestFile(exampleName);
  const config = getESLintConfig(exampleName, testFile);
  const errors = [];

  // Test each expected rule
  for (const [ruleName, expected] of Object.entries(expectedRules)) {
    const ruleConfig = config.rules[ruleName];
    const ruleErrors = testRule(ruleName, expected, ruleConfig);
    errors.push(...ruleErrors.map(error => `  ❌ ${error}`));
  }

  // Test markdown-specific configuration
  const mdErrors = testMarkdownRules(exampleName);
  errors.push(...mdErrors.map(error => `  ❌ ${error}`));

  // Test JSON-specific configuration
  const jsonErrors = testJsonRules(exampleName);
  errors.push(...jsonErrors.map(error => `  ❌ ${error}`));

  return errors;
}

// Main test runner
console.log('Testing ESLint configurations in examples...\n');

let hasErrors = false;
for (const example of examples) {
  try {
    const errors = testExample(example);
    if (errors.length > 0) {
      hasErrors = true;
      console.error('\n' + errors.join('\n'));
    }
  } catch (error) {
    hasErrors = true;
    console.error(`\n  ❌ Failed to test ${example}: ${error.message}`);
  }
}

if (hasErrors) {
  console.error('\n❌ Some tests failed!');
  throw new Error('Some tests failed');
} else {
  console.log('\n✅ All tests passed!');
}
