import { NextResponse } from 'next/server';
import { getCurrentUser, hasActiveSubscription } from '../../../lib/auth.js';
import { query } from '../../../lib/db.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WORKSPACE_FIELDS = ['orders', 'customers', 'inventory', 'expenses', 'routes'];
const failure = (message, status) => NextResponse.json({ error: message }, { status });

async function ownerForRequest(request) {
  const user = await getCurrentUser(request);
  if (!user) return { error: failure('Please sign in again.', 401) };
  if (user.role !== 'OWNER') return { error: failure('A supplier workspace is required.', 403) };
  if (!hasActiveSubscription(user)) return { error: failure('This workspace license is expired or revoked.', 403) };
  return { user };
}

export async function GET(request) {
  try {
    const { user, error } = await ownerForRequest(request);
    if (error) return error;
    const result = await query('SELECT payload, updated_at FROM workspace_data WHERE owner_id = $1', [user.id]);
    if (!result.rowCount) return failure('Workspace data was not found. Please contact the platform administrator.', 404);
    return NextResponse.json({ data: result.rows[0].payload, updatedAt: result.rows[0].updated_at }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Workspace read failed:', error);
    return failure('Workspace data could not be loaded.', 500);
  }
}

export async function PUT(request) {
  try {
    const { user, error } = await ownerForRequest(request);
    if (error) return error;
    const body = await request.json();
    const source = body?.data;
    if (!source || typeof source !== 'object' || Array.isArray(source)) return failure('Workspace payload is invalid.', 400);
    if (WORKSPACE_FIELDS.some((field) => !Array.isArray(source[field]))) return failure('Workspace lists are incomplete.', 400);
    if (!source.pricing || typeof source.pricing !== 'object' || !source.comms || typeof source.comms !== 'object') return failure('Workspace settings are incomplete.', 400);
    if (WORKSPACE_FIELDS.some((field) => source[field].length > 10_000)) return failure('Workspace exceeds the allowed record limit.', 413);

    const data = Object.fromEntries([...WORKSPACE_FIELDS.map((field) => [field, source[field]]), ['pricing', source.pricing], ['comms', source.comms]]);
    const serialized = JSON.stringify(data);
    if (Buffer.byteLength(serialized, 'utf8') > 2_000_000) return failure('Workspace data exceeds the 2 MB limit.', 413);
    await query(
      `INSERT INTO workspace_data (owner_id, payload, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (owner_id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()`,
      [user.id, serialized],
    );
    return NextResponse.json({ ok: true, savedAt: new Date().toISOString() }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Workspace save failed:', error);
    return failure('Workspace data could not be saved.', 500);
  }
}
