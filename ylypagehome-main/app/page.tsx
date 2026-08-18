'use client'

import Image from 'next/image'
import { useEffect, useState, useTransition } from 'react'
import WorksPage from '@/components/WorksPage'
import StarEffect from '@/components/StarEffect'
import { getSiteConfig } from '@/utils/config'

// 修改波点背景样式 - 让波点更大
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
  const siteConfig = getSiteConfig()

  useEffect(() => {
    // 处理客户端渲染
    setIsClient(true)
    
    // 清理浏览器扩展添加的属性
    const cleanup = () => {
      const elements = document.querySelectorAll('[dm-url], [data-atm-ext-installed]')
      elements.forEach(el => {
        el.removeAttribute('dm-url')
        el.removeAttribute('data-atm-ext-installed')
      })
    }
    
    // 初始清理
    cleanup()
    
    // 添加 MutationObserver 来持续监听和清理属性
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

    // 开始观察
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['dm-url', 'data-atm-ext-installed']
    })

    // 清理函数
    return () => {
      observer.disconnect()
      cleanup()
    }
  }, [])

  // 页面切换处理函数
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

  // 在客户端渲染之前显示加载状态
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
      <div className="absolute inset-0 opacity-30" style={backgroundStyle} />

      <div className="flex-1 relative pb-24">
        <div className="absolute inset-0">
          <div
            className="min-h-screen transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentPage * 100}%)`,
            }}
          >
            <div className="flex min-w-[200vw]">
              <div className="w-screen min-h-screen flex flex-col items-center">
                <div className="mt-20 flex items-start gap-8">
                  <div className="rounded-xl bg-gradient-to-r from-pink-100 to-pink-50 p-1 shadow-md">
                    <div className="w-[500px] bg-white rounded-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-pink-100 to-pink-50 px-4 py-2 flex items-center justify-between border-b border-pink-200">
                        <div className="flex space-x-2">
                          <button className="w-3 h-3 rounded-full bg-pink-400 hover:bg-pink-500 transition-colors duration-200"></button>
                          <button className="w-3 h-3 rounded-full bg-pink-300 hover:bg-pink-400 transition-colors duration-200"></button>
                          <button className="w-3 h-3 rounded-full bg-pink-200 hover:bg-pink-300 transition-colors duration-200"></button>
                        </div>
                        <div className="absolute left-1/2 transform -translate-x-1/2 text-pink-400 font-medium">
                          Neo&apos;s Space
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-pink-50 to-white px-4 py-2 flex items-center space-x-4 border-b border-pink-100">
                        <div className="flex space-x-2">
                          <button className="text-pink-400 hover:text-pink-600 transition-colors duration-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button className="text-pink-400 hover:text-pink-600 transition-colors duration-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          <button className="text-pink-400 hover:text-pink-600 transition-colors duration-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex-1 flex items-center">
                          <div className="flex items-center bg-white w-full px-3 py-1.5 rounded-full border border-pink-200 shadow-inner">
                            <svg className="w-4 h-4 text-pink-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                            </svg>
                            <span className="text-pink-400 text-sm">neo.moe</span>
                            <div className="ml-auto flex items-center space-x-2">
                              <span className="text-xs text-pink-300">♥</span>
                              <span className="text-xs text-pink-300">✧</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-gradient-to-b from-white to-pink-50 max-h-[400px]">
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-inner border border-pink-100">
                          <h1 className="text-3xl font-bold text-pink-400 mb-4">{siteConfig.author.name}</h1>
                          <div className="text-lg text-pink-500 mb-4">{siteConfig.author.title}</div>
                          <p className="text-gray-600 mb-6">{siteConfig.author.description}</p>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {siteConfig.tags.map((tag: string, index: number) => (
                              <span 
                                key={index} 
                                className="bg-pink-100 px-4 py-2 rounded-full text-pink-600 hover:bg-pink-200 transition-colors duration-200"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative w-[300px] h-[400px]">
                    <div className="absolute inset-0 rounded-3xl overflow-hidden">
                      <Image 
                        src={process.env.NEXT_PUBLIC_IMAGE_URL || '/yly.png'}
                        alt={siteConfig.author.name}
                        fill
                        style={{
                          objectFit: 'cover',
                        }}
                        className="rounded-3xl"
                        priority
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-6 mt-16 mb-32">
                  {siteConfig.social.map((platform: { url: string; name: string; icon: string }, index) => (
                    <a
                      key={index}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group transform hover:-translate-y-1 transition-transform duration-200"
                      style={{
                        transform: `translateY(${Math.sin(index * 2) * 20}px)`,
                        position: 'relative',
                        zIndex: 10
                      }}
                    >
                      <div className="relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden">
                        <div className="relative z-10 p-4 flex items-center gap-3">
                          <Image 
                            src={platform.icon}
                            alt={platform.name}
                            width={24}
                            height={24}
                            className="group-hover:scale-110 transition-transform duration-200"
                          />
                          <span className="text-pink-400 font-medium">{platform.name}</span>
                        </div>
                        
                        <div className="absolute bottom-0 right-0 w-8 h-8">
                          <div className="absolute bottom-0 right-0 w-8 h-8 bg-pink-100/50 transform rotate-45 translate-x-4 translate-y-4"></div>
                          <div className="absolute bottom-0 right-0 w-8 h-8 bg-white transform rotate-45 translate-x-[14px] translate-y-[14px] border-l-2 border-pink-200"></div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="w-screen min-h-screen flex flex-col items-center justify-center">
                <WorksPage />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-24 relative">
        <div className="absolute inset-x-0 bottom-12 flex justify-center">
          <div className="flex space-x-2 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
            <button 
              onClick={() => handlePageChange('prev')}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                        ${currentPage === 0 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-pink-200 hover:bg-pink-300 text-pink-600'
                        }`}
              disabled={currentPage === 0}
            >
              ←
            </button>
            <button 
              className={`w-3 h-3 rounded-full ${currentPage === 0 ? 'bg-pink-300' : 'bg-gray-300'}`}
              onClick={() => setCurrentPage(0)}
            />
            <button 
              className={`w-3 h-3 rounded-full ${currentPage === 1 ? 'bg-pink-300' : 'bg-gray-300'}`}
              onClick={() => setCurrentPage(1)}
            />
            <button 
              onClick={() => handlePageChange('next')}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                        ${currentPage === 1 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-pink-200 hover:bg-pink-300 text-pink-600'
                        }`}
              disabled={currentPage === 1}
            >
              →
            </button>
          </div>
        </div>
      </div>

      {showStars && <StarEffect />}
    </div>
  )
}
