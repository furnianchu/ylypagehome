import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/background-auth';
import JSZip from 'jszip';

const R2_ENDPOINT = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const R2_BUCKET = process.env.R2_BUCKET_NAME || 'backgrounds';
const AK = process.env.R2_ACCESS_KEY_ID;
const SK = process.env.R2_SECRET_ACCESS_KEY;

async function r2Put(key: string, body: ArrayBuffer, ct: string) {
  const res = await fetch(`${R2_ENDPOINT}/${R2_BUCKET}/${key}`, {
    method: 'PUT',
    headers: { 'Authorization': `AWS ${AK}:${SK}`, 'Content-Type': ct, 'x-amz-acl': 'public-read' },
    body,
  });
  if (!res.ok) throw new Error(`R2 PUT ${res.status}`);
  return `${R2_ENDPOINT}/${R2_BUCKET}/${key}`;
}

async function r2List(): Promise<string[]> {
  const res = await fetch(`${R2_ENDPOINT}/${R2_BUCKET}/?list-type=2`, {
    headers: { 'Authorization': `AWS ${AK}:${SK}` },
  });
  const xml = await res.text();
  return [...xml.matchAll(/<Key>([^<]+)<\/Key>/g)].map(m => m[1]);
}

async function r2Delete(key: string) {
  await fetch(`${R2_ENDPOINT}/${R2_BUCKET}/${key}`, {
    method: 'DELETE',
    headers: { 'Authorization': `AWS ${AK}:${SK}` },
  });
}

export async function GET(req: NextRequest) {
  const t = req.headers.get('authorization')?.replace('Bearer ','') || req.nextUrl.searchParams.get('token');
  if (!verifyToken(t)) return NextResponse.json({error:'Unauthorized'},{status:401});
  const keys = (await r2List()).filter(k => /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(k));
  return NextResponse.json({images: keys.map(k=>({key:k,url:`${R2_ENDPOINT}/${R2_BUCKET}/${k}`}))});
}

export async function POST(req: NextRequest) {
  const t = req.headers.get('authorization')?.replace('Bearer ','') || req.nextUrl.searchParams.get('token');
  if (!verifyToken(t)) return NextResponse.json({error:'Unauthorized'},{status:401});
  const fd = await req.formData();
  const file = fd.get('file') as File|null;
  if (!file) return NextResponse.json({error:'No file'},{status:400});
  const buf = await file.arrayBuffer();
  const name = file.name.toLowerCase();
  if (name.endsWith('.zip')) {
    const zip = await JSZip.loadAsync(buf);
    const uploaded:string[]=[];
    for (const [p,entry] of Object.entries(zip.files)) {
      if (entry.dir) continue;
      const ext = p.split('.').pop()?.toLowerCase()||'';
      if (!['jpg','jpeg','png','webp','gif','avif'].includes(ext)) continue;
      const eb = await entry.async('arraybuffer');
      const key = `uploaded/${Date.now()}_${p.replace(/[/\\]/g,'_')}`;
      uploaded.push(await r2Put(key,eb,`image/${ext==='jpg'?'jpeg':ext}`));
    }
    return NextResponse.json({message:`Uploaded ${uploaded.length}`,urls:uploaded});
  }
  const ext = name.split('.').pop()?.toLowerCase()||'';
  if (!['jpg','jpeg','png','webp','gif','avif'].includes(ext)) return NextResponse.json({error:'Bad format'},{status:400});
  const key = `uploaded/${Date.now()}_${name}`;
  return NextResponse.json({message:'OK',url:await r2Put(key,buf,`image/${ext==='jpg'?'jpeg':ext}`)});
}

export async function DELETE(req: NextRequest) {
  const t = req.headers.get('authorization')?.replace('Bearer ','') || req.nextUrl.searchParams.get('token');
  if (!verifyToken(t)) return NextResponse.json({error:'Unauthorized'},{status:401});
  const keys = (await r2List()).filter(k => k.startsWith('uploaded/'));
  for (const k of keys) await r2Delete(k);
  return NextResponse.json({message:`Deleted ${keys.length}`});
}
