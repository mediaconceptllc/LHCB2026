import { promises as fs } from 'fs';
import path from 'path';
import seed from '@/data/guests.json';

export type ConfirmStatus = 'pending' | 'confirmed' | 'declined';

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
}

export interface GuestsFile {
  event: {
    title: string;
    subtitle: string;
    date: string;
    targetGuests: string;
  };
  guests: Guest[];
}

// Temporary admin password gate for the registration checker page.
export const ADMIN_PASSWORD = '98115512';

const SEED = seed as GuestsFile;

// --- Storage backend selection -------------------------------------------
// On Vercel the filesystem is read-only, so we persist to a Redis (Vercel KV /
// Upstash) store when its env vars are present. Locally we fall back to the
// JSON file on disk, so `next dev` keeps working with zero setup.
const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const useRedis = Boolean(KV_URL && KV_TOKEN);
const REDIS_KEY = 'lhcb2026:guests';

const DATA_PATH = path.join(process.cwd(), 'data', 'guests.json');

type RedisClient = import('@upstash/redis').Redis;
let redisClient: RedisClient | null = null;

async function getRedis(): Promise<RedisClient> {
  if (!redisClient) {
    const { Redis } = await import('@upstash/redis');
    redisClient = new Redis({ url: KV_URL!, token: KV_TOKEN! });
  }
  return redisClient;
}

export async function readGuests(): Promise<GuestsFile> {
  if (useRedis) {
    const redis = await getRedis();
    const data = await redis.get<GuestsFile>(REDIS_KEY);
    if (data && Array.isArray(data.guests)) return data;
    // First run on a fresh store: seed it from the bundled list.
    await redis.set(REDIS_KEY, SEED);
    return SEED;
  }
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw) as GuestsFile;
}

export async function writeGuests(data: GuestsFile): Promise<void> {
  if (useRedis) {
    const redis = await getRedis();
    await redis.set(REDIS_KEY, data);
    return;
  }
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}
