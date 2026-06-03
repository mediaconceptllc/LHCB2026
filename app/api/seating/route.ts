import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_PASSWORD, readGuests, writeGuests, type Seating } from '@/lib/guests';

// Reads/writes the JSON store, so it must run at request time.
export const dynamic = 'force-dynamic';

function isAuthorized(request: NextRequest): boolean {
  return request.headers.get('x-admin-pass') === ADMIN_PASSWORD;
}

// GET — return just the seating plan.
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await readGuests();
  return NextResponse.json({ seating: data.seating ?? {} });
}

// PUT — replace the whole seating plan ({ seating: { tableId: [guestId|null, ...] } }).
export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const incoming = body?.seating;
  if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  // Sanitize: keep only arrays of (number | null).
  const clean: Seating = {};
  for (const [tableId, seats] of Object.entries(incoming)) {
    if (!Array.isArray(seats)) continue;
    clean[tableId] = seats.map((s) => (typeof s === 'number' ? s : null));
  }

  const data = await readGuests();
  data.seating = clean;
  await writeGuests(data);
  return NextResponse.json({ ok: true, seating: clean });
}
