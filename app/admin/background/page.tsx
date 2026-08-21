'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function BGAdmin() {
  const [token, setToken] = useState('');
  const [ok, setOk] = useState(false);
  const [imgs, setImgs] = useState<{ key: string; url: string }[]>([]);
  const [mode, setMode] = useState('daily');
  const [msg, setMsg] = useState('');
  const base = '/api/background';

  async function go() {
    setOk(true);
    const r = await fetch(`${base}?token=${token}`);
    const d = await r.json();
    if (r.ok) setImgs(d.images || []);
    else setMsg(d.error);
    const r2 = await fetch('/api/background/settings');
    const d2 = await r2.json();
    if (r2.ok) setMode(d2.mode);
  }

  async function up(f: File) {
    const fd = new FormData();
    fd.append('file', f);
    const r = await fetch(`${base}?token=${token}`, { method: 'POST', body: fd });
    const d = await r.json();
    setMsg(d.message || d.error);
    if (r.ok) go();
  }

  async function del(k: string) {
    await fetch(`${base}/${encodeURIComponent(k)}?token=${token}`, { method: 'DELETE' });
    go();
  }

  async function clr() {
    await fetch(`${base}?token=${token}`, { method: 'DELETE' });
    go();
  }

  async function setM(m: string) {
    await fetch(`/api/background/settings?token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: m }),
    });
    setMode(m);
  }

  if (!ok)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="space-y-4 p-8 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
          <h1 className="text-2xl font-bold">背景管理</h1>
          <input
            type="password"
            placeholder="管理员令牌"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-80 px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
          />
          <button onClick={go} className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold">
            连接
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">🖼️ 背景管理</h1>

        <div className="p-6 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
          <h2 className="text-xl mb-4">上传图片</h2>
          <input
            type="file"
            accept=".zip,.jpg,.jpeg,.png,.webp,.gif,.avif"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) up(f);
            }}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white"
          />
          <p className="text-xs text-gray-500 mt-2">支持 .zip 批量上传或单张图片</p>
        </div>

        <div className="p-6 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
          <h2 className="text-xl mb-4">轮换模式</h2>
          <select
            value={mode}
            onChange={(e) => setM(e.target.value)}
            className="w-48 px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
          >
            <option value="daily">每天一换</option>
            <option value="7days">每7天一换</option>
            <option value="14days">每14天一换</option>
            <option value="30days">每30天一换</option>
            <option value="random">随机</option>
          </select>
        </div>

        <div className="p-6 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl">已上传 ({imgs.length})</h2>
            <button onClick={clr} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm">
              清空所有
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imgs.map((i) => (
              <div key={i.key} className="relative group">
                <Image
                  src={i.url}
                  alt="背景图片"
                  width={300}
                  height={150}
                  className="w-full h-32 object-cover rounded"
                />
                <button
                  onClick={() => del(i.key)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
                >
                  删除
                </button>
              </div>
            ))}
          </div>
        </div>

        {msg && <div className="p-4 bg-yellow-600/50 rounded text-sm">{msg}</div>}
      </div>
    </div>
  );
}
