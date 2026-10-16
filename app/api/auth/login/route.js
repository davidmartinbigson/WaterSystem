import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { attachSessionCookie, hasActiveSubscription, publicUser } from '../../../../lib/auth.js';
import { query } from '../../../../lib/db.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function provisionConfiguredMaster(email) {
  const configuredEmail = String(process.env.MASTER_ADMIN_EMAIL || '').trim().toLowerCase();
  const configuredPassword = process.env.MASTER_ADMIN_PASSWORD || '';
  if (!configuredEmail || !configuredPassword || email !== configuredEmail) return;
  const existing = await query('SELECT id FROM users WHERE email = $1', [configuredEmail]);
  if (existing.rowCount) return;
  const existingMaster = await query("SELECT id FROM users WHERE role = 'MASTER' LIMIT 1");
  if (existingMaster.rowCount) return;
  if (configuredPassword.length < 12) throw new Error('MASTER_ADMIN_PASSWORD must contain at least 12 characters.');
  try {
    const passwordHash = await bcrypt.hash(configuredPassword, 12);
    await query(
      `INSERT INTO users (id, email, password_hash, name, business_name, role)
       VALUES ($1, $2, $3, $4, 'AquaFlow Platform', 'MASTER')`,
      [randomUUID(), configuredEmail, passwordHash, process.env.MASTER_ADMIN_NAME || 'AquaFlow Platform'],
    );
  } catch (error) {
    if (error.code !== '23505') throw error;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    if (!email || !password) return NextResponse.json({ error: 'Enter your email and password.' }, { status: 400 });

    await provisionConfiguredMaster(email);
    const result = await query(
      `SELECT u.id, u.email, u.password_hash, u.name, u.business_name, u.business_phone, u.business_address, u.role, u.license_id,
              l.status AS license_status, l.plan AS license_plan, l.code_hint,
              l.expires_at AS license_expires_at
         FROM users u LEFT JOIN license_keys l ON l.id = u.license_id
        WHERE u.email = $1`,
      [email],
    );
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return NextResponse.json({ error: 'Email or password did not match.' }, { status: 401 });
    }
    if (!hasActiveSubscription(user)) {
      return NextResponse.json({ error: 'This workspace subscription has expired or was revoked. Contact the platform administrator.' }, { status: 403 });
    }

    const response = NextResponse.json({ user: publicUser(user) }, { headers: { 'Cache-Control': 'no-store' } });
    await attachSessionCookie(response, user.id);
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    const message = /^(AUTH_SECRET|MASTER_ADMIN_PASSWORD)/.test(error.message || '') ? error.message : 'Login is temporarily unavailable.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
