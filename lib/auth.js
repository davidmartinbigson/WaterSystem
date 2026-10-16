import { SignJWT, jwtVerify } from 'jose';
import { query } from './db.js';

export const SESSION_COOKIE = 'aquaflow_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function authKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error('AUTH_SECRET must contain at least 32 characters.');
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(userId) {
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(authKey());
}

export async function attachSessionCookie(response, userId) {
  const token = await createSessionToken(userId);
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}

export function clearSessionCookie(response) {
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}

export async function getCurrentUser(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  let userId;
  try {
    const { payload } = await jwtVerify(token, authKey());
    if (typeof payload.sub !== 'string') return null;
    userId = payload.sub;
  } catch {
    return null;
  }
  const result = await query(
    `SELECT u.id, u.email, u.name, u.business_name, u.business_phone, u.business_address, u.role, u.license_id,
            l.status AS license_status, l.plan AS license_plan, l.code_hint,
            l.expires_at AS license_expires_at
       FROM users u
       LEFT JOIN license_keys l ON l.id = u.license_id
      WHERE u.id = $1`,
    [userId],
  );
  return result.rows[0] || null;
}

export function hasActiveSubscription(user) {
  return Boolean(
    user?.role === 'MASTER'
      || (user?.role === 'OWNER'
        && user.license_status === 'Active'
        && user.license_expires_at
        && new Date(user.license_expires_at).getTime() > Date.now()),
  );
}

const dateOnly = (value) => value ? new Date(value).toISOString().slice(0, 10) : '';

export function publicUser(user) {
  const isOwner = user.role === 'OWNER';
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    business: user.business_name,
    businessPhone: user.business_phone || '',
    businessAddress: user.business_address || '',
    role: isOwner ? 'owner' : 'master',
    license: user.code_hint ? `AQF-••••-••••-${user.code_hint}` : '',
    licenseStatus: user.license_status || '',
    licensePlan: user.license_plan || '',
    licenseExpiresAt: dateOnly(user.license_expires_at),
    subscriptionUnavailable: isOwner && !hasActiveSubscription(user),
  };
}
