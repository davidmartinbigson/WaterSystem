import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../../lib/auth.js';
import { query } from '../../../../../lib/db.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });
    if (user.role !== 'MASTER') return NextResponse.json({ error: 'Master administrator access is required.' }, { status: 403 });
    const { id } = await params;
    const result = await query(
      `UPDATE license_keys SET status = 'Revoked'
        WHERE id = $1 AND status IN ('Available', 'Active')
        RETURNING id, status`,
      [id],
    );
    if (!result.rowCount) return NextResponse.json({ error: 'That license is no longer available to revoke.' }, { status: 404 });
    return NextResponse.json({ id, status: 'Revoked' });
  } catch (error) {
    console.error('License revoke failed:', error);
    return NextResponse.json({ error: 'License could not be revoked.' }, { status: 500 });
  }
}
