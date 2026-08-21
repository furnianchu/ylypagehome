'use client'
import BackgroundWrapper from "@/components/BackgroundWrapper";
nexport const metadata: Metadata = {
  title: '月月子代代雪の草窝',
  description: '个人专属空间',
}

import { useEffect, useState } from 'react'
nexport const metadata: Metadata = {
  title: '月月子代代雪の草窝',
  description: '个人专属空间',
}
import { Geist, Geist_Mono } from "next/font/google"
nexport const metadata: Metadata = {
  title: '月月子代代雪の草窝',
  description: '个人专属空间',
}
import './globals.css'
nexport const metadata: Metadata = {
  title: '月月子代代雪の草窝',
  description: '个人专属空间',
}
import CustomCursor from '@/components/CustomCursor'
nexport const metadata: Metadata = {
  title: '月月子代代雪の草窝',
  description: '个人专属空间',
}
import MusicPlayer from '@/components/MusicPlayer'
nexport const metadata: Metadata = {
  title: '月月子代代雪の草窝',
  description: '个人专属空间',
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="referrer" content="no-referrer" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <BackgroundWrapper>
        {/* 👇 新增：顶部施工提示横幅 */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-100 text-yellow-800 text-center py-3 px-4 text-sm font-medium border-b-2 border-yellow-400">
          🚧 本站正在修建中，部分功能暂不可用，敬请期待！
        </div>

        <div className="min-h-screen">
          {children}
          <CustomCursor />
          <MusicPlayer />
        </div>
      </BackgroundWrapper>
      </body>
    </html>
  )
}

