/**
 * Standalone compatibility test — no test framework required.
 * Verifies the built dist loads and key exports resolve
 * on the current Node version.
 */

import { defineConfig, reconcilePlugins, withConfig, withPoupe } from '../dist/index.mjs';

let failures = 0;

function check(name, value) {
  if (typeof value === 'function') {
    console.log(`  ok ${name}`);
  } else {
    console.error(`  FAIL ${name}: expected function, got ${typeof value}`);
    failures++;
  }
}

function checkArray(name, value) {
  if (Array.isArray(value)) {
    console.log(`  ok ${name} (${value.length} configs)`);
  } else {
    console.error(`  FAIL ${name}: expected array, got ${typeof value}`);
    failures++;
  }
}

// Verify key exports are functions
check('defineConfig', defineConfig);
check('withConfig', withConfig);
check('withPoupe', withPoupe);
check('reconcilePlugins', reconcilePlugins);

// Verify defineConfig() produces a config array
checkArray('defineConfig()', defineConfig());

if (failures > 0) {
  throw new Error(`${failures} failure(s)`);
}

console.log(`\nok ${process.version} — all checks passed`);
