import test from 'node:test';
import assert from 'node:assert/strict';
import { generateLicenseCode, hashLicenseCode, licenseCodeMatches, normalizeLicenseCode } from './license.js';

process.env.LICENSE_HASH_SECRET = 'unit-test-only-license-hash-secret-32-characters-long';

test('server license keys have a random format and normalize to the same server-side HMAC', () => {
  const code = generateLicenseCode();
  assert.match(code, /^AQF-[A-F0-9]{8}-[A-F0-9]{8}-[A-F0-9]{8}-[A-F0-9]{8}$/);
  const hash = hashLicenseCode(code);
  assert.ok(licenseCodeMatches(code.toLowerCase().replaceAll('-', ' '), hash));
  assert.equal(licenseCodeMatches(`${code.slice(0, -1)}0`, hash), false);
  assert.equal(normalizeLicenseCode(code), normalizeLicenseCode(code.toLowerCase()));
});
