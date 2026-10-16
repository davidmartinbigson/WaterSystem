import test from 'node:test';
import assert from 'node:assert/strict';
import { createLicenseCode, normalizeLicenseCode, parsePortableLicense } from './license.js';

test('monthly, quarterly, yearly and custom license codes retain their subscription duration', () => {
  for (const [days, expectedPlan] of [[30, 'Monthly'], [90, 'Quarterly'], [365, 'Yearly'], [45, 'Custom · 45 days']]) {
    const code = createLicenseCode(days);
    const parsed = parsePortableLicense(code);
    assert.equal(parsed?.days, days);
    assert.equal(parsed?.plan, expectedPlan);
  }
});

test('portable keys validate when copied with whitespace or without separators', () => {
  const code = createLicenseCode(90);
  assert.equal(parsePortableLicense(`  ${code.toLowerCase()}  `)?.days, 90);
  assert.equal(parsePortableLicense(normalizeLicenseCode(code))?.days, 90);
});

test('typos and out-of-range durations are rejected', () => {
  const code = createLicenseCode(30);
  const altered = `${code.slice(0, -1)}${code.endsWith('A') ? 'B' : 'A'}`;
  assert.equal(parsePortableLicense(altered), null);
  assert.equal(parsePortableLicense('AQF-000-ABC123-0000'), null);
});
