import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const normalizeLicenseCode = (value) => String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

export function hashLicenseCode(value) {
  const secret = process.env.LICENSE_HASH_SECRET || process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error('Set LICENSE_HASH_SECRET or a 32-character AUTH_SECRET before using license keys.');
  return createHmac('sha256', secret).update(normalizeLicenseCode(value)).digest('hex');
}

export function generateLicenseCode() {
  const raw = randomBytes(16).toString('hex').toUpperCase();
  return `AQF-${raw.slice(0, 8)}-${raw.slice(8, 16)}-${raw.slice(16, 24)}-${raw.slice(24)}`;
}

export function licenseCodeMatches(value, expectedHash) {
  const candidate = Buffer.from(hashLicenseCode(value), 'hex');
  const expected = Buffer.from(expectedHash || '', 'hex');
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

export function licensePlan(days) {
  return days === 30 ? 'Monthly' : days === 90 ? 'Quarterly' : days === 365 ? 'Yearly' : `Custom · ${days} days`;
}
