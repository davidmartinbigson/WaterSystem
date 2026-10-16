import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { initialComms, initialCustomers, initialExpenses, initialInventory, initialOrders, initialPricing, initialRoutes } from '../../../../src/data.js';
import { attachSessionCookie, publicUser } from '../../../../lib/auth.js';
import { query, withTransaction } from '../../../../lib/db.js';
import { hashLicenseCode, licensePlan } from '../../../../lib/license.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const fail = (status, message) => Object.assign(new Error(message), { status });

export async function POST(request) {
  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    const business = String(body.business || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const licenseKey = String(body.licenseKey || '');
    if (!name || !business || !email || !password || !licenseKey) return NextResponse.json({ error: 'Complete all required fields.' }, { status: 400 });
    if (name.length > 120 || business.length > 160 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Check the name, business and email fields.' }, { status: 400 });
    if (password.length < 8 || password.length > 128) return NextResponse.json({ error: 'Password must be between 8 and 128 characters.' }, { status: 400 });

    const normalizedKeyHash = hashLicenseCode(licenseKey);
    const passwordHash = await bcrypt.hash(password, 12);
    const userId = randomUUID();
    const workspaceSeed = {
      orders: initialOrders,
      customers: initialCustomers,
      inventory: initialInventory,
      expenses: initialExpenses,
      routes: initialRoutes,
      pricing: initialPricing,
      comms: initialComms,
    };

    const result = await withTransaction(async (client) => {
      const existingUser = await client.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existingUser.rowCount) throw fail(409, 'An account with this email already exists.');

      const licenseResult = await client.query('SELECT * FROM license_keys WHERE code_hash = $1 FOR UPDATE', [normalizedKeyHash]);
      const license = licenseResult.rows[0];
      if (!license || license.status !== 'Available') throw fail(400, 'That license key is invalid, already claimed, expired, or revoked.');
      if (license.email && license.email.toLowerCase() !== email) throw fail(400, 'This license key was issued for a different email address.');
      const expiresAt = new Date(Date.now() + Number(license.days) * 86_400_000);
      const claimed = await client.query(
        `UPDATE license_keys
            SET status = 'Active', business = $2, email = $3, activated_at = NOW(),
                expires_at = $4, used_by_user_id = $5
          WHERE id = $1 AND status = 'Available'
          RETURNING id, code_hint, plan, days, status, business, email, created_at, expires_at`,
        [license.id, business, email, expiresAt, userId],
      );
      if (!claimed.rowCount) throw fail(409, 'That license key has just been claimed. Ask the admin to issue another.');

      const created = await client.query(
        `INSERT INTO users (id, email, password_hash, name, business_name, role, license_id)
         VALUES ($1, $2, $3, $4, $5, 'OWNER', $6)
         RETURNING id, email, name, business_name, business_phone, business_address, role, license_id`,
        [userId, email, passwordHash, name, business, license.id],
      );
      await client.query('INSERT INTO workspace_data (owner_id, payload) VALUES ($1, $2::jsonb)', [userId, JSON.stringify(workspaceSeed)]);
      return { user: created.rows[0], license: claimed.rows[0] };
    });

    const user = {
      ...result.user,
      license_status: result.license.status,
      license_plan: result.license.plan,
      code_hint: result.license.code_hint,
      license_expires_at: result.license.expires_at,
    };
    const response = NextResponse.json({ user: publicUser(user) }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
    await attachSessionCookie(response, userId);
    return response;
  } catch (error) {
    if (error.status) return NextResponse.json({ error: error.message }, { status: error.status });
    if (error.code === '23505') return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    console.error('Signup failed:', error);
    const message = /LICENSE_HASH_SECRET|AUTH_SECRET/.test(error.message || '') ? error.message : 'Signup is temporarily unavailable.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
