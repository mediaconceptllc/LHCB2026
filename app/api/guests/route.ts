import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_PASSWORD,
  readGuests,
  writeGuests,
  type ConfirmStatus,
  type Guest,
} from '@/lib/guests';

// This route reads/writes a JSON file on disk, so it must run at request time.
export const dynamic = 'force-dynamic';

function isAuthorized(request: NextRequest): boolean {
  const pass = request.headers.get('x-admin-pass');
  return pass === ADMIN_PASSWORD;
}

const VALID_STATUS: ConfirmStatus[] = ['pending', 'confirmed', 'declined'];

// GET — return the full guest list. Requires the admin password.
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await readGuests();
  return NextResponse.json(data);
}

// PUT — update an existing guest's editable fields by id.
export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== 'number') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const data = await readGuests();
  const guest = data.guests.find((g) => g.id === body.id);
  if (!guest) {
    return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
  }

  if (typeof body.org === 'string') guest.org = body.org;
  if (typeof body.name === 'string') guest.name = body.name;
  if (typeof body.title === 'string') guest.title = body.title;
  if (typeof body.responsible === 'string') guest.responsible = body.responsible;
  if (typeof body.phone === 'string') guest.phone = body.phone.trim();
  if (typeof body.note === 'string') guest.note = body.note;
  if (typeof body.country === 'string') guest.country = body.country;
  if (typeof body.addedBy === 'string') guest.addedBy = body.addedBy;
  if (body.category === 'local' || body.category === 'honored') guest.category = body.category;
  if (typeof body.invited === 'boolean') guest.invited = body.invited;
  if (typeof body.confirmed === 'string' && VALID_STATUS.includes(body.confirmed)) {
    guest.confirmed = body.confirmed;
  }

  await writeGuests(data);
  return NextResponse.json({ guest });
}

// POST — add a new guest (e.g. to fill the open seats up to 50-60).
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const data = await readGuests();
  // Monotonic id: never reuse an id even after deleting the highest one.
  const maxId = data.guests.reduce((max, g) => Math.max(max, g.id), 0);
  const nextId = Math.max(maxId, data.seq ?? 0) + 1;
  data.seq = nextId;

  const guest: Guest = {
    id: nextId,
    org: typeof body?.org === 'string' ? body.org : '',
    name: typeof body?.name === 'string' ? body.name : '',
    title: typeof body?.title === 'string' ? body.title : '',
    invited: body?.invited === true,
    confirmed: VALID_STATUS.includes(body?.confirmed) ? body.confirmed : 'pending',
    phone: typeof body?.phone === 'string' ? body.phone.trim() : '',
    note: typeof body?.note === 'string' ? body.note : '',
    responsible: typeof body?.responsible === 'string' ? body.responsible : '',
    category: body?.category === 'honored' ? 'honored' : 'local',
    country: typeof body?.country === 'string' ? body.country : '',
    addedBy: typeof body?.addedBy === 'string' ? body.addedBy : '',
  };

  data.guests.push(guest);
  await writeGuests(data);
  return NextResponse.json({ guest });
}

// DELETE — remove a guest by id (?id=NN).
export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = Number(request.nextUrl.searchParams.get('id'));
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const data = await readGuests();
  const before = data.guests.length;
  data.guests = data.guests.filter((g) => g.id !== id);
  if (data.guests.length === before) {
    return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
  }

  await writeGuests(data);
  return NextResponse.json({ ok: true });
}
