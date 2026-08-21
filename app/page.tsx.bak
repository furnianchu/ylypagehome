// app/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'XingHuiSama の宝藏之地',
  description: '个人空间',
}

export default function Home() {
  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden">
      
      {/* 顶部导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 text-white">
        <div className="font-bold text-xl tracking-wider">XingHuiSama の宝藏之地</div>
        <div className="flex space-x-6 text-sm">
          <a href="#" className="hover:text-pink-300 transition">首页</a>
          <a href="#" className="hover:text-pink-300 transition">项目</a>
          <a href="#" className="hover:text-pink-300 transition">归档</a>
          <a href="#" className="hover:text-pink-300 transition">关于</a>
        </div>
      </nav>
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
        <img src="/right-decoration.jpg" alt="Decoration" className="w-32 h-auto opacity-80 hover:opacity-100 transition-opacity" />
      </div>

      {/* 中间内容区 */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 mt-20">
        
        {/* 第一行：个人信息卡片 & 音乐播放器 */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          
          {/* 左侧：个人信息卡片 */}
          <div className="flex-1 backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl text-white">
            <div className="flex items-center gap-4 mb-4">
              <img src="/avatar.png" alt="Avatar" className="w-20 h-20 rounded-full border-2 border-white/50" /> 
              <div>
                <h1 className="text-3xl font-bold">XingHuiSama</h1>
                <p className="text-gray-200 text-sm">热爱技术，热爱生活的普通人。</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              这里是个人空间，分享一些编程笔记、生活碎片和好听的音乐。
            </p>
            <div className="flex gap-4">
               <button className="px-4 py-2 bg-pink-500/80 hover:bg-pink-600 rounded-full text-sm">查看项目</button>
               <button className="px-4 py-2 bg-blue-500/80 hover:bg-blue-600 rounded-full text-sm">联系我</button>
            </div>
          </div>

          {/* 右侧：音乐播放器卡片 */}
          <div className="w-full md:w-96 backdrop-blur-lg bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl text-white">
             <div className="flex items-center gap-3 mb-4">
                <img src="/music-cover.jpg" alt="Music Cover" className="w-16 h-16 rounded-full" />
                <div>
                   <div className="font-bold">如果呢</div>
                   <div className="text-xs text-gray-300">郑润泽</div>
                </div>
             </div>
             <div className="w-full bg-white/20 rounded-full h-1 mb-2">
                <div className="bg-pink-400 h-1 rounded-full w-1/3"></div>
             </div>
             <div className="flex justify-between text-xs text-gray-400">
                <span>01:23</span>
                <span>03:45</span>
             </div>
          </div>

        </div>

        {/* 第二行：动态/文章卡片区 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl text-white">
              <img src="/card1.jpg" alt="Card 1" className="w-full h-32 object-cover rounded-xl mb-4" />
              <h3 className="font-bold mb-2">Leetcode 一百题</h3>
              <p className="text-sm text-gray-300">今天也要努力刷题呀。</p>
           </div>
           <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl text-white">
              <img src="/card2.jpg" alt="Card 2" className="w-full h-32 object-cover rounded-xl mb-4" />
              <h3 className="font-bold mb-2">板栗猫猫</h3>
              <p className="text-sm text-gray-300">可爱的猫咪图片分享。</p>
           </div>
           <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl text-white">
              <img src="/card3.jpg" alt="Card 3" className="w-full h-32 object-cover rounded-xl mb-4" />
              <h3 className="font-bold mb-2">守得云开见月明</h3>
              <p className="text-sm text-gray-300">记录美好的瞬间。</p>
           </div>
        </div>

      </div>

      {/* 右下角悬浮看板娘 */}
      <div className="fixed bottom-6 right-6 z-50">
         <img src="/miku.png" alt="Mascot" className="w-24 h-auto drop-shadow-lg" />
      </div>

    </main>
  );
}
