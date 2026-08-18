'use client'

import { useEffect, useState } from 'react'
import { Geist, Geist_Mono } from "next/font/google"
import './globals.css'
import CustomCursor from '@/components/CustomCursor'
import MusicPlayer from '@/components/MusicPlayer'

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
        <div className="min-h-screen">
          {children}
          <CustomCursor />
          <MusicPlayer />
        </div>
      </body>
    </html>
  )
}
