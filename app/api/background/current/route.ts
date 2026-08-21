import { NextResponse } from 'next/server';

const R2_ENDPOINT = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const R2_BUCKET = process.env.R2_BUCKET_NAME || 'backgrounds';
const AK = process.env.R2_ACCESS_KEY_ID;
const SK = process.env.R2_SECRET_ACCESS_KEY;

// 定义 KV 类型，get 返回 unknown 而非 any
interface KVNamespace {
  get(key: string, type?: string): Promise<unknown>;
  put(key: string, value: string): Promise<void>;
}

// 扩展 globalThis 类型
declare global {
  var BACKGROUND_SETTINGS: KVNamespace | undefined;
}

async function r2List(): Promise<string[]> {
  const r = await fetch(`${R2_ENDPOINT}/${R2_BUCKET}/?list-type=2`, {
    headers: { Authorization: `AWS ${AK}:${SK}` },
  });
  const xml = await r.text();
  return [...xml.matchAll(/<Key>([^<]+)<\/Key>/g)]
    .map((m) => m[1])
    .filter((k) => /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(k));
}

export async function GET() {
  const keys = await r2List();
  if (!keys.length) return NextResponse.json({ url: null, message: 'Empty' });

  let mode = 'daily';
  try {
    const kv = globalThis.BACKGROUND_SETTINGS;
    if (kv) {
      const v = await kv.get('settings', 'json');
      if (v && typeof v === 'object' && 'mode' in (v as Record<string, unknown>)) {
        mode = (v as { mode: string }).mode;
      }
    }
  } catch {
    // ignore
  }

  const now = Date.now();
  const idx =
    mode === 'random'
      ? Math.floor(Math.random() * keys.length)
      : mode === '7days'
        ? Math.floor(now / 604800000) % keys.length
        : mode === '14days'
          ? Math.floor(now / 1209600000) % keys.length
          : mode === '30days'
            ? Math.floor(now / 2592000000) % keys.length
            : Math.floor(now / 86400000) % keys.length;

  return NextResponse.json({
    url: `${R2_ENDPOINT}/${R2_BUCKET}/${keys[idx]}`,
    key: keys[idx],
    mode,
    total: keys.length,
  });
}
