"use client";
/** @format */

import { useEffect, useState } from 'react';


export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-black">
      
      {/* 背景视频 */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-0 blur-sm brightness-75" 
      >
        <source src="/video-bg.mp4" type="video/mp4" />
      </video>

      {/* 遮罩层 */}
      <div className="fixed inset-0 z-0 bg-black/40" />

      {/* 顶部导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 text-white font-sans">
        <div className="font-bold text-xl tracking-wider">月月子代代雪の草窝</div>
        <div className="flex space-x-6 text-sm">
          <a href="#" className="hover:text-pink-300 transition">首页</a>
          <a href="#" className="hover:text-pink-300 transition">项目</a>
          <a href="#" className="hover:text-pink-300 transition">归档</a>
          <a href="#" className="hover:text-pink-300 transition">关于</a>
        </div>
      </nav>

      {/* 中间内容区 */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 mt-20">
        
        {/* 个人信息卡片 */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          
          <div className="flex-1 backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-full bg-pink-500 flex items-center justify-center text-3xl font-bold">N</div>
              <div>
                <h1 className="text-3xl font-bold">月月子代代雪</h1>
                <p className="text-gray-200 text-sm">热爱技术，热爱生活的探索者。</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              这里是我的个人空间，分享一些编程笔记和生活日常。
            </p>
            <div className="flex gap-4">
               <button className="px-4 py-2 bg-pink-500/80 hover:bg-pink-600 rounded-full text-sm">查看项目</button>
               <button className="px-4 py-2 bg-blue-500/80 hover:bg-blue-600 rounded-full text-sm">联系我</button>
            </div>
          </div>

          <div className="w-full md:w-96 backdrop-blur-lg bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl text-white">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center text-2xl">🎵</div>
                <div>
                   <div className="font-bold">星降る夜のラビス</div>
                   <div className="text-xs text-gray-300">4th Avenue Reject</div>
                </div>
             </div>
             <div className="w-full bg-white/20 rounded-full h-1 mb-2">
                <div className="bg-pink-400 h-1 rounded-full w-1/2"></div>
             </div>
             <div className="flex justify-between text-xs text-gray-400">
                <span>02:15</span>
                <span>04:30</span>
             </div>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl text-white">
              <div className="w-full h-32 bg-gray-700 rounded-xl mb-4 flex items-center justify-center">计数器区域</div>
              <h3 className="font-bold mb-2">刷题计数</h3>
              <p className="text-sm text-gray-300">LeetCode 每日打卡。</p>
           </div>
           <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl text-white">
              <div className="w-full h-32 bg-gray-700 rounded-xl mb-4 flex items-center justify-center">GitHub 链接</div>
              <h3 className="font-bold mb-2">开源仓库</h3>
              <p className="text-sm text-gray-300">我的项目代码。</p>
           </div>
           <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl text-white">
              <div className="w-full h-32 bg-gray-700 rounded-xl mb-4 flex items-center justify-center">B站 链接</div>
              <h3 className="font-bold mb-2">视频空间</h3>
              <p className="text-sm text-gray-300">日常摸鱼视频。</p>
           </div>
        </div>

      </div>

      {/* 右下角：功能面板 + 独立看板娘框 */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
        
        {/* 功能面板（计数器/GitHub/B站/时间） */}
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-3 border border-white/20 shadow-2xl text-white w-48">
          
          <div className="flex items-center justify-between bg-white/20 rounded-full px-3 py-1 mb-2 cursor-pointer hover:bg-white/30">
            <span className="text-xs">📝 今日计划</span>
            <span className="text-sm font-bold bg-pink-500 px-2 rounded-full">3/5</span>
          </div>

          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 mb-2 cursor-pointer hover:bg-white/30"
          >
            <span className="text-lg">🐙</span>
            <span className="text-xs">GitHub</span>
          </a>

          <a 
            href="https://bilibili.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 mb-2 cursor-pointer hover:bg-white/30"
          >
            <span className="text-lg">📺</span>
            <span className="text-xs">Bilibili</span>
          </a>

          <div className="flex items-center justify-between bg-white/20 rounded-full px-3 py-1 cursor-pointer hover:bg-white/30">
            <span className="text-xs">⏰ 系统时间</span>
            <span className="text-xs font-mono">{formattedTime}</span>
          </div>

        </div>

        {/* 独立看板娘框（使用你指定的图片） */}
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-2 border border-white/20 shadow-2xl">
          <img 
            src="/kanniang.jpg" 
            alt="看板娘" 
            className="w-20 h-20 object-cover rounded-xl"
          />
        </div>

      </div>

    </main>
  );
}
