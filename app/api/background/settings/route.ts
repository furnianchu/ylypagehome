import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/background-auth';

interface Settings {
  mode: 'daily' | '7days' | '14days' | '30days' | 'random';
  updatedAt: number;
}

interface KVNamespace {
  get(key: string, type?: string): Promise<unknown>;
  put(key: string, value: string): Promise<void>;
}

declare global {
  var BACKGROUND_SETTINGS: KVNamespace | undefined;
}

let cache: Settings | null = null;

async function getS(): Promise<Settings> {
  if (cache) return cache;
  try {
    const kv = globalThis.BACKGROUND_SETTINGS;
    if (kv) {
      const v = await kv.get('settings', 'json');
      if (v && typeof v === 'object' && 'mode' in (v as Record<string, unknown>)) {
        cache = v as Settings;
        return cache;
      }
    }
  } catch {
    // ignore
  }
  return { mode: 'daily', updatedAt: Date.now() };
}

export async function GET() {
  return NextResponse.json(await getS());
}

export async function POST(req: NextRequest) {
  const t =
    req.headers.get('authorization')?.replace('Bearer ', '') ||
    req.nextUrl.searchParams.get('token');
  if (!verifyToken(t))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { mode } = (await req.json()) as { mode: string };
  if (!['daily', '7days', '14days', '30days', 'random'].includes(mode))
    return NextResponse.json({ error: 'Bad mode' }, { status: 400 });

  const settings: Settings = { mode: mode as Settings['mode'], updatedAt: Date.now() };
  cache = settings;
  try {
    const kv = globalThis.BACKGROUND_SETTINGS;
    if (kv) {
      await kv.put('settings', JSON.stringify(settings));
    }
  } catch {
    // ignore
  }
  return NextResponse.json({ message: 'OK', mode });
}
