import { promises as fs } from 'fs';
import path from 'path';
import seed from '@/data/guests.json';

export type ConfirmStatus = 'pending' | 'confirmed' | 'declined';
export type GuestCategory = 'local' | 'honored';

export interface Guest {
  id: number;
  org: string;
  name: string;
  title: string;
  invited: boolean;
  confirmed: ConfirmStatus;
  phone: string;
  note: string;
  responsible: string;
  /** 'local' = Зочид, 'honored' = Хүндэт зочид (international LHCb guests). */
  category?: GuestCategory;
  /** Country flag/name, mainly for honored guests (Улс). */
  country?: string;
  /** Who registered this guest (Бүртгэсэн). Required when adding. */
  addedBy?: string;
}

/** Seat assignments: table id (string) -> array of guest ids (or null = empty seat). */
export type Seating = Record<string, (number | null)[]>;

export interface GuestsFile {
  event: {
    title: string;
    subtitle: string;
    date: string;
    targetGuests: string;
  };
  guests: Guest[];
  /** Monotonic counter so guest ids are never reused after deletion. */
  seq?: number;
  /** Table seating plan. */
  seating?: Seating;
}

// Temporary admin password gate for the registration checker page.
export const ADMIN_PASSWORD = '98115512';

const SEED = seed as GuestsFile;

// --- Storage backend selection -------------------------------------------
// On Vercel the filesystem is read-only, so we persist to a private Vercel Blob
// store when its token is present. Locally we fall back to the JSON file on
// disk, so `next dev` keeps working with zero setup.
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const useBlob = Boolean(BLOB_TOKEN);
const BLOB_PATH = 'guests.json';

const DATA_PATH = path.join(process.cwd(), 'data', 'guests.json');

export async function readGuests(): Promise<GuestsFile> {
  if (useBlob) {
    const { get } = await import('@vercel/blob');
    try {
      // useCache:false → always read the latest write (strong read-after-write).
      const result = await get(BLOB_PATH, { access: 'private', useCache: false });
      if (result?.stream) {
        const text = await new Response(result.stream).text();
        const data = JSON.parse(text) as GuestsFile;
        if (data && Array.isArray(data.guests)) return data;
      }
    } catch (e) {
      // Only seed when the blob genuinely doesn't exist yet. Any other error
      // (network/transient) must NOT fall through to re-seeding, or it would
      // wipe live data — rethrow so the request fails instead.
      const name = (e as Error)?.name ?? '';
      if (name !== 'BlobNotFoundError') throw e;
    }
    await writeGuests(SEED);
    return SEED;
  }
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw) as GuestsFile;
}

export async function writeGuests(data: GuestsFile): Promise<void> {
  if (useBlob) {
    const { put } = await import('@vercel/blob');
    await put(BLOB_PATH, JSON.stringify(data, null, 2), {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    });
    return;
  }
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}
