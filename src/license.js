const KEY_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const normalizeLicenseCode = (value) => String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

const licenseChecksum = (payload) => {
  let hash = 2166136261;
  for (const character of `AquaFlow-demo-license-v1:${payload}`) {
    hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  }
  return (hash >>> 0).toString(36).toUpperCase().padStart(7, '0').slice(-4);
};

export const createLicenseCode = (days = 30, random = Math.random) => {
  const randomPart = (length) => Array.from({ length }, () => KEY_ALPHABET[Math.floor(random() * KEY_ALPHABET.length)]).join('');
  const duration = Math.max(1, Math.min(3650, Number(days) || 30)).toString(36).toUpperCase().padStart(3, '0');
  const nonce = randomPart(6);
  const payload = `${duration}${nonce}`;
  return `AQF-${duration}-${nonce}-${licenseChecksum(payload)}`;
};

export const parsePortableLicense = (value) => {
  const normalized = normalizeLicenseCode(value);
  const match = normalized.match(/^AQF([A-Z0-9]{3})([A-Z0-9]{6})([A-Z0-9]{4})$/);
  if (!match) return null;
  const [, duration, nonce, checksum] = match;
  if (licenseChecksum(`${duration}${nonce}`) !== checksum) return null;
  const days = Number.parseInt(duration, 36);
  if (!Number.isFinite(days) || days < 1 || days > 3650) return null;
  const plan = days === 30 ? 'Monthly' : days === 90 ? 'Quarterly' : days === 365 ? 'Yearly' : `Custom · ${days} days`;
  return { code: `AQF-${duration}-${nonce}-${checksum}`, days, plan };
};
