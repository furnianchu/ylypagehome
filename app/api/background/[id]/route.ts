import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/background-auth';

const R2_ENDPOINT = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const R2_BUCKET = process.env.R2_BUCKET_NAME || 'backgrounds';
const AK = process.env.R2_ACCESS_KEY_ID;
const SK = process.env.R2_SECRET_ACCESS_KEY;

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '') || request.nextUrl.searchParams.get('token');
  if (!verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const key = decodeURIComponent(id);
  await fetch(`${R2_ENDPOINT}/${R2_BUCKET}/${key}`, {
    method: 'DELETE',
    headers: { 'Authorization': `AWS ${AK}:${SK}` },
  });
  return NextResponse.json({ message: 'Deleted' });
}
