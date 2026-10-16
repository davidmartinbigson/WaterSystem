import { NextResponse } from 'next/server';
import { getCurrentUser, publicUser } from '../../../../lib/auth.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
    return NextResponse.json({ user: publicUser(user) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Session check failed:', error);
    return NextResponse.json({ error: 'Could not verify your session. Check the database configuration.' }, { status: 500 });
  }
}
