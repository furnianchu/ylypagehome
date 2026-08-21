import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Neo's Space",
  description: '个人空间',
}

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-100 text-yellow-800 text-center py-3 px-4 text-sm font-medium border-b-2 border-yellow-400">
        🚧 本站正在修缮中，部分功能暂不可用，敬请期待！
      </div>
    </main>
  )
}
