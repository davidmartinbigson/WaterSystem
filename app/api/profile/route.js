import { NextResponse } from 'next/server';
import { getCurrentUser, publicUser } from '../../../lib/auth.js';
import { query } from '../../../lib/db.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request) {
  try {
    const current = await getCurrentUser(request);
    if (!current) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });
    if (current.role !== 'OWNER') return NextResponse.json({ error: 'Only supplier workspaces can change this profile.' }, { status: 403 });
    const body = await request.json();
    const name = String(body.name || '').trim();
    const business = String(body.business || '').trim();
    const phone = String(body.phone || '').trim();
    const address = String(body.address || '').trim();
    if (!name || !business || name.length > 120 || business.length > 160 || phone.length > 40 || address.length > 240) return NextResponse.json({ error: 'Enter valid profile details.' }, { status: 400 });
    await query('UPDATE users SET name = $2, business_name = $3, business_phone = $4, business_address = $5, updated_at = NOW() WHERE id = $1', [current.id, name, business, phone, address]);
    const result = await query(
      `SELECT u.id, u.email, u.name, u.business_name, u.business_phone, u.business_address, u.role, u.license_id,
              l.status AS license_status, l.plan AS license_plan, l.code_hint,
              l.expires_at AS license_expires_at
         FROM users u LEFT JOIN license_keys l ON l.id = u.license_id WHERE u.id = $1`,
      [current.id],
    );
    return NextResponse.json({ user: publicUser(result.rows[0]) });
  } catch (error) {
    console.error('Profile update failed:', error);
    return NextResponse.json({ error: 'Profile could not be saved.' }, { status: 500 });
  }
}
