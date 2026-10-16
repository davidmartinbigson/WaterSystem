import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth.js';
import { query } from '../../../../lib/db.js';
import { generateLicenseCode, hashLicenseCode, licensePlan } from '../../../../lib/license.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const dateOnly = (value) => value ? new Date(value).toISOString().slice(0, 10) : '';
const failure = (message, status) => NextResponse.json({ error: message }, { status });

async function masterForRequest(request) {
  const user = await getCurrentUser(request);
  if (!user) return { error: failure('Please sign in again.', 401) };
  if (user.role !== 'MASTER') return { error: failure('Master administrator access is required.', 403) };
  return { user };
}

export async function GET(request) {
  try {
    const { error } = await masterForRequest(request);
    if (error) return error;
    await query("UPDATE license_keys SET status = 'Expired' WHERE status = 'Active' AND expires_at <= NOW()");
    const result = await query(
      `SELECT id, code_hint, plan, days, status, business, email, created_at, expires_at
         FROM license_keys ORDER BY created_at DESC`,
    );
    const licenses = result.rows.map((license) => ({
      id: license.id,
      code: `AQF-••••-••••-${license.code_hint}`,
      codeHint: license.code_hint,
      redacted: true,
      plan: license.plan,
      days: license.days,
      status: license.status,
      business: license.business,
      email: license.email,
      createdAt: dateOnly(license.created_at),
      expiresAt: dateOnly(license.expires_at),
    }));
    return NextResponse.json({ licenses }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('License list failed:', error);
    return failure('License list could not be loaded.', 500);
  }
}

export async function POST(request) {
  try {
    const { user, error } = await masterForRequest(request);
    if (error) return error;
    const body = await request.json();
    const requestedPlan = String(body.plan || '');
    const requestedDays = Number(body.days);
    const expectedDays = { Monthly: 30, Quarterly: 90, Yearly: 365 }[requestedPlan];
    const days = expectedDays || requestedDays;
    if (!Number.isInteger(days) || days < 1 || days > 3650 || (expectedDays && requestedDays !== expectedDays)) return failure('Choose a valid monthly, quarterly, yearly or custom duration (1–3650 days).', 400);
    const business = String(body.business || '').trim().slice(0, 160) || 'Invite · unassigned';
    const email = String(body.email || '').trim().toLowerCase();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return failure('Enter a valid business email.', 400);

    const code = generateLicenseCode();
    const codeHash = hashLicenseCode(code);
    const id = randomUUID();
    const plan = expectedDays ? requestedPlan : licensePlan(days);
    const result = await query(
      `INSERT INTO license_keys (id, code_hash, code_hint, plan, days, status, business, email, issued_by_user_id)
       VALUES ($1, $2, $3, $4, $5, 'Available', $6, $7, $8)
       RETURNING id, code_hint, plan, days, status, business, email, created_at, expires_at`,
      [id, codeHash, code.slice(-8), plan, days, business, email, user.id],
    );
    const license = result.rows[0];
    return NextResponse.json({
      code,
      license: {
        id: license.id,
        code,
        codeHint: license.code_hint,
        redacted: false,
        plan: license.plan,
        days: license.days,
        status: license.status,
        business: license.business,
        email: license.email,
        createdAt: dateOnly(license.created_at),
        expiresAt: dateOnly(license.expires_at),
      },
    }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('License generation failed:', error);
    return failure(error.message?.includes('LICENSE_HASH_SECRET') ? error.message : 'License key could not be generated.', 500);
  }
}
