import Image from 'next/image'
import { useEffect, useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import WorksPage from '@/components/WorksPage'
import StarEffect from '@/components/StarEffect'
import FloatingCharacters from '@/components/FloatingCharacters'
import CreditsDrawer from '@/components/CreditsDrawer'
import { getSiteConfig } from '@/utils/config'

// 波点背景样式
const backgroundStyle = {
  backgroundImage: `
    radial-gradient(circle at center, #ffd1dc 0, #ffd1dc 6px, transparent 6px, transparent 100%),
    radial-gradient(circle at center, rgba(255, 209, 220, 0.2) 0, rgba(255, 209, 220, 0.2) 8px, transparent 8px, transparent 100%)
  `,
  backgroundPosition: '0 0, 30px 30px',
  backgroundSize: '60px 60px',
} as const

export default function Home() {
  const [currentPage, setCurrentPage] = useState(0)
  const [isTransitioning, startTransition] = useTransition()
  const [isClient, setIsClient] = useState(false)
  const [showStars, setShowStars] = useState(false)
  const [creditsOpen, setCreditsOpen] = useState(false)
  const siteConfig = getSiteConfig()

  useEffect(() => {
    setIsClient(true)

    const cleanup = () => {
      const elements = document.querySelectorAll('[dm-url], [data-atm-ext-installed]')
      elements.forEach(el => {
        el.removeAttribute('dm-url')
        el.removeAttribute('data-atm-ext-installed')
      })
    }

    cleanup()

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const el = mutation.target as Element
          if (el.hasAttribute('dm-url')) {
            el.removeAttribute('dm-url')
          }
          if (el.hasAttribute('data-atm-ext-installed')) {
            el.removeAttribute('data-atm-ext-installed')
          }
        }
      })
    })

    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['dm-url', 'data-atm-ext-installed']
    })

    return () => {
      observer.disconnect()
      cleanup()
    }
  }, [])

  const handlePageChange = (direction: 'next' | 'prev') => {
    if (isTransitioning) return

    startTransition(() => {
      if (direction === 'next' && currentPage < 1) {
        setCurrentPage(1)
        setShowStars(true)
        setTimeout(() => setShowStars(false), 1000)
      } else if (direction === 'prev' && currentPage > 0) {
        setCurrentPage(0)
        setShowStars(true)
        setTimeout(() => setShowStars(false), 1000)
      }
    })
  }

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-pink-50">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-pink-300 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-pink-50 relative">
      {/* 角色飘字背景动画 */}
      <FloatingCharacters />

      {/* 波点背景层 */}
      <div className="absolute inset-0 opacity-30" style={backgroundStyle} />

      <div className="flex-1 relative pb-24">
        <div className="absolute inset-0">
          <div
            className="min-h-screen transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentPage * 100}%)` }}
          >
            <div className="flex min-w-[200vw]">
              {/* 第一页 - 你的个人主页 */}
              <div className="w-screen min-h-screen flex flex-col items-center">
                <div className="mt-20 flex items-start gap-8">
                  <div className="rounded-xl bg-gradient-to-r from-pink-100 to-pink-50 p-1 shadow-md">
                    <div className="w-[500px] bg-white rounded-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-pink-100 to-pink-50 px-4 py-2 flex items-center justify-between border-b border-pink-200">
                        <div className="flex space-x-2">
                          <button className="w-3 h-3 rounded-full bg-pink-400 hover:bg-pink-500 transition-colors duration-200" />
                          <button className="w-3 h-3 rounded-full bg-pink-300 hover:bg-pink-400 transition-colors duration-200" />
                          <button className="w-3 h-3 rounded-full bg-pink-200 hover:bg-pink-300 transition-colors duration-200" />
                        </div>
                        <div className="absolute left-1/2 transform -translate-x-1/2 text-pink-400 font-medium">
                          Neo&apos;s Space
                        </div>
                      </div>

<div className="bg-gradient-to-r from-pink-50 to-white px-4 py-2 flex items-center space-x-4 border-b border-pink-100">
