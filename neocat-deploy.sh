#!/bin/bash
set -e

echo "========================================"
echo "  NeoCat 背景轮换系统 + 毛玻璃重构部署"
echo "========================================"

# 进入项目目录
cd ~/homepage

# 1. 安装依赖
echo "[1/7] 安装 jszip..."
npm install jszip

# 2. 创建目录
echo "[2/7] 创建目录结构..."
mkdir -p lib app/api/background/\[id\] app/admin/background components

# 3. 创建 lib/background-auth.ts
echo "[3/7] 创建认证模块..."
cat > lib/background-auth.ts << 'EOF'
export function verifyToken(token: string | null): boolean {
  if (!token) return false;
  const validTokens = (process.env.BACKGROUND_ADMIN_TOKENS || '').split(',').map(t => t.trim());
  return validTokens.includes(token);
}
EOF

# 4. 创建 API 路由
echo "[4/7] 创建 API 路由..."

# 4.1 app/api/background/route.ts
cat > app/api/background/route.ts << 'APIBGEOF'
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/background-auth';
import JSZip from 'jszip';

const R2_ENDPOINT = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const R2_BUCKET = process.env.R2_BUCKET_NAME || 'backgrounds';
const ACCESS_KEY = process.env.R2_ACCESS_KEY_ID;
const SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY;

async function r2Put(key: string, body: ArrayBuffer, contentType: string) {
  const url = `${R2_ENDPOINT}/${R2_BUCKET}/${key}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `AWS ${ACCESS_KEY}:${SECRET_KEY}`,
      'Content-Type': contentType,
      'x-amz-acl': 'public-read',
    },
    body,
  });
  if (!res.ok) throw new Error(`R2 PUT failed: ${res.status}`);
  return url;
}

async function r2List(): Promise<string[]> {
  const url = `${R2_ENDPOINT}/${R2_BUCKET}/?list-type=2`;
  const res = await fetch(url, {
    headers: { 'Authorization': `AWS ${ACCESS_KEY}:${SECRET_KEY}` },
  });
  const xml = await res.text();
  const keys = [...xml.matchAll(/<Key>([^<]+)<\/Key>/g)].map(m => m[1]);
  return keys;
}

async function r2Delete(key: string) {
  const url = `${R2_ENDPOINT}/${R2_BUCKET}/${key}`;
  await fetch(url, {
    method: 'DELETE',
    headers: { 'Authorization': `AWS ${ACCESS_KEY}:${SECRET_KEY}` },
  });
}

export async function GET(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '') || request.nextUrl.searchParams.get('token');
  if (!verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const keys = await r2List();
    const images = keys.filter(k => /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(k));
    const baseUrl = `${R2_ENDPOINT}/${R2_BUCKET}/`;
    return NextResponse.json({ images: images.map(k => ({ key: k, url: baseUrl + k })) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '') || request.nextUrl.searchParams.get('token');
  if (!verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    const buffer = await file.arrayBuffer();
    const fileName = file.name.toLowerCase();
    if (fileName.endsWith('.zip')) {
      const zip = await JSZip.loadAsync(buffer);
      const uploaded: string[] = [];
      for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
        if (zipEntry.dir) continue;
        const ext = relativePath.split('.').pop()?.toLowerCase();
        if (!['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'].includes(ext || '')) continue;
        const entryBuffer = await zipEntry.async('arraybuffer');
        const key = `uploaded/${Date.now()}_${relativePath.replace(/[/\\]/g, '_')}`;
        const url = await r2Put(key, entryBuffer, `image/${ext === 'jpg' ? 'jpeg' : ext}`);
        uploaded.push(url);
      }
      return NextResponse.json({ message: `Uploaded ${uploaded.length} images`, urls: uploaded });
    } else {
      const ext = fileName.split('.').pop()?.toLowerCase();
      if (!['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'].includes(ext || '')) {
        return NextResponse.json({ error: 'Unsupported image format' }, { status: 400 });
      }
      const key = `uploaded/${Date.now()}_${fileName}`;
      const url = await r2Put(key, buffer, `image/${ext === 'jpg' ? 'jpeg' : ext}`);
      return NextResponse.json({ message: 'Uploaded', url });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '') || request.nextUrl.searchParams.get('token');
  if (!verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const keys = await r2List();
    const imageKeys = keys.filter(k => k.startsWith('uploaded/'));
    for (const key of imageKeys) {
      await r2Delete(key);
    }
    return NextResponse.json({ message: `Deleted ${imageKeys.length} images` });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
APIBGEOF

# 4.2 app/api/background/[id]/route.ts
cat > 'app/api/background/[id]/route.ts' << 'APIDELETEEOF'
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/background-auth';

const R2_ENDPOINT = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const R2_BUCKET = process.env.R2_BUCKET_NAME || 'backgrounds';
const ACCESS_KEY = process.env.R2_ACCESS_KEY_ID;
const SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY;

async function r2Delete(key: string) {
  const url = `${R2_ENDPOINT}/${R2_BUCKET}/${key}`;
  await fetch(url, {
    method: 'DELETE',
    headers: { 'Authorization': `AWS ${ACCESS_KEY}:${SECRET_KEY}` },
  });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '') || request.nextUrl.searchParams.get('token');
  if (!verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const key = decodeURIComponent(params.id);
    await r2Delete(key);
    return NextResponse.json({ message: 'Deleted' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
APIDELETEEOF

# 4.3 app/api/background/settings/route.ts
cat > app/api/background/settings/route.ts << 'APISETTINGSEOF'
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/background-auth';

interface Settings {
  mode: 'daily' | '7days' | '14days' | '30days' | 'random';
  updatedAt: number;
}

let cachedSettings: Settings | null = null;

async function getSettings(): Promise<Settings> {
  if (cachedSettings) return cachedSettings;
  try {
    const kvValue = await BACKGROUND_SETTINGS.get('settings', 'json');
    if (kvValue) {
      cachedSettings = kvValue as Settings;
      return cachedSettings;
    }
  } catch {}
  return { mode: 'daily', updatedAt: Date.now() };
}

async function saveSettings(s: Settings) {
  cachedSettings = s;
  try {
    await BACKGROUND_SETTINGS.put('settings', JSON.stringify(s));
  } catch {}
}

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function POST(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '') || request.nextUrl.searchParams.get('token');
  if (!verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const { mode } = body;
  if (!['daily', '7days', '14days', '30days', 'random'].includes(mode)) {
    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
  }
  await saveSettings({ mode, updatedAt: Date.now() });
  return NextResponse.json({ message: 'Settings updated', mode });
}
APISETTINGSEOF

# 4.4 app/api/background/current/route.ts
cat > app/api/background/current/route.ts << 'APICURRENTEOF'
import { NextResponse } from 'next/server';

const R2_ENDPOINT = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const R2_BUCKET = process.env.R2_BUCKET_NAME || 'backgrounds';
const ACCESS_KEY = process.env.R2_ACCESS_KEY_ID;
const SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY;

async function r2List(): Promise<string[]> {
  const url = `${R2_ENDPOINT}/${R2_BUCKET}/?list-type=2`;
  const res = await fetch(url, {
    headers: { 'Authorization': `AWS ${ACCESS_KEY}:${SECRET_KEY}` },
  });
  const xml = await res.text();
  const keys = [...xml.matchAll(/<Key>([^<]+)<\/Key>/g)].map(m => m[1]);
  return keys.filter(k => /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(k));
}

export async function GET() {
  try {
    const keys = await r2List();
    if (keys.length === 0) {
      return NextResponse.json({ url: null, message: 'No backgrounds' });
    }
    let mode = 'daily';
    try {
      const kvValue = await BACKGROUND_SETTINGS.get('settings', 'json');
      if (kvValue) mode = (kvValue as any).mode;
    } catch {}
    let index: number;
    const now = Date.now();
    switch (mode) {
      case 'daily': index = Math.floor(now / 86400000) % keys.length; break;
      case '7days': index = Math.floor(now / (86400000 * 7)) % keys.length; break;
      case '14days': index = Math.floor(now / (86400000 * 14)) % keys.length; break;
      case '30days': index = Math.floor(now / (86400000 * 30)) % keys.length; break;
      case 'random': index = Math.floor(Math.random() * keys.length); break;
      default: index = 0;
    }
    const selectedKey = keys[index];
    const url = `${R2_ENDPOINT}/${R2_BUCKET}/${selectedKey}`;
    return NextResponse.json({ url, key: selectedKey, mode, total: keys.length });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
APICURRENTEOF

# 5. 创建管理后台页面
echo "[5/7] 创建管理后台..."
cat > app/admin/background/page.tsx << 'ADMINEOF'
'use client';
import { useState, useEffect } from 'react';

export default function BackgroundAdminPage() {
  const [token, setToken] = useState('');
  const [connected, setConnected] = useState(false);
  const [images, setImages] = useState<{ key: string; url: string }[]>([]);
  const [mode, setMode] = useState('daily');
  const [message, setMessage] = useState('');

  const apiBase = '/api/background';

  async function fetchImages() {
    const res = await fetch(`${apiBase}?token=${token}`);
    const data = await res.json();
    if (res.ok) setImages(data.images || []);
    else setMessage(data.error);
  }

  async function fetchSettings() {
    const res = await fetch('/api/background/settings');
    const data = await res.json();
    if (res.ok) setMode(data.mode);
  }

  async function connect() {
    setConnected(true);
    await Promise.all([fetchImages(), fetchSettings()]);
  }

  async function uploadFile(file: File) {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${apiBase}?token=${token}`, { method: 'POST', body: form });
    const data = await res.json();
    setMessage(data.message || data.error);
    if (res.ok) fetchImages();
  }

  async function deleteImage(key: string) {
    const res = await fetch(`${apiBase}/${encodeURIComponent(key)}?token=${token}`, { method: 'DELETE' });
    const data = await res.json();
    setMessage(data.message || data.error);
    if (res.ok) fetchImages();
  }

  async function clearAll() {
    const res = await fetch(`${apiBase}?token=${token}`, { method: 'DELETE' });
    const data = await res.json();
    setMessage(data.message || data.error);
    if (res.ok) fetchImages();
  }

  async function updateSettings(newMode: string) {
    const res = await fetch(`/api/background/settings?token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: newMode }),
    });
    const data = await res.json();
    setMessage(data.message || data.error);
    if (res.ok) setMode(newMode);
  }

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="space-y-4 p-8 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
          <h1 className="text-2xl font-bold">背景管理</h1>
          <input
            type="password"
            placeholder="输入管理员令牌"
            value={token}
            onChange={e => setToken(e.target.value)}
            className="w-80 px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
          />
          <button onClick={connect} className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold">
            连接
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">🖼️ 背景管理</h1>

        <div className="p-6 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
          <h2 className="text-xl mb-4">上传图片</h2>
          <input
            type="file"
            accept=".zip,.jpg,.jpeg,.png,.webp,.gif,.avif"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) uploadFile(file);
            }}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
          <p className="text-xs text-gray-500 mt-2">支持 .zip 压缩包（自动解压图片）或单张图片</p>
        </div>

        <div className="p-6 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
          <h2 className="text-xl mb-4">轮换模式</h2>
          <select
            value={mode}
            onChange={e => updateSettings(e.target.value)}
            className="w-48 px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
          >
            <option value="daily">每天一换</option>
            <option value="7days">每7天一换</option>
            <option value="14days">每14天一换</option>
            <option value="30days">每30天一换</option>
            <option value="random">随机</option>
          </select>
          <span className="ml-4 text-sm text-gray-400">当前模式：{mode}</span>
        </div>

        <div className="p-6 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl">已上传图片 ({images.length})</h2>
            <button onClick={clearAll} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm">
              清空所有
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map(img => (
              <div key={img.key} className="relative group">
                <img src={img.url} alt="" className="w-full h-32 object-cover rounded" />
                <button
                  onClick={() => deleteImage(img.key)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  删除
                </button>
                <p className="text-xs text-gray-400 truncate mt-1">{img.key.split('/').pop()}</p>
              </div>
            ))}
          </div>
        </div>

        {message && (
          <div className="p-4 bg-yellow-600/50 rounded text-sm">{message}</div>
        )}
      </div>
    </div>
  );
}
ADMINEOF

# 6. 创建 BackgroundWrapper 组件
echo "[6/7] 创建背景包装组件..."
cat > components/BackgroundWrapper.tsx << 'WRAPPEREOF'
'use client';
import { useEffect, useState } from 'react';

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  const [bgUrl, setBgUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/background/current')
      .then(res => res.json())
      .then(data => {
        if (data.url) setBgUrl(data.url);
      })
      .catch(() => {});
  }, []);

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
WRAPPEREOF

# 7. 创建 .env.local 模板
echo "[7/7] 创建环境变量模板..."
cat > .env.local << 'ENVEOF'
# 背景管理后台令牌（逗号分隔，支持多个）
BACKGROUND_ADMIN_TOKENS=your_secret_token_here

# Cloudflare R2 配置（必须）
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=backgrounds
ENVEOF

echo ""
echo "========================================"
echo "  ✅ 所有文件已创建完毕！"
echo "========================================"
echo ""
echo "接下来你需要手动完成以下步骤："
echo ""
echo "1. 编辑 .env.local 文件，填入你的 R2 配置和自定义令牌："
echo "   vim .env.local"
echo ""
echo "2. 修改 app/layout.tsx，加入 BackgroundWrapper："
echo "   在文件顶部添加："
echo '   import BackgroundWrapper from "@/components/BackgroundWrapper";'
echo "   然后将 <body> 内的内容包裹在 <BackgroundWrapper> 标签内。"
echo ""
echo "3. 构建部署："
echo "   npm run build"
echo "   git add ."
echo "   git commit -m \"feat: 背景轮换系统 + 毛玻璃重构\""
echo "   git push"
echo ""
echo "4. 访问管理后台：https://你的域名/admin/background"
echo ""
echo "⚠️ 注意：如果不想使用 R2，请参考 INSTRUCTIONS.txt 中的本地文件方案。"

