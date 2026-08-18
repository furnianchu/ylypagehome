'use client'

import { useEffect, useState, useRef } from 'react'
import { siteConfig } from '@/config/site'

export default function MusicPlayer() {
  const [mounted, setMounted] = useState(false)
  const playerRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <iframe
        ref={playerRef}
        frameBorder="no"
        marginWidth={0}
        marginHeight={0}
        width={330}
        height={86}
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          filter: 'hue-rotate(-10deg) saturate(1.2)'
        }}
        src={`//music.163.com/outchain/player?type=2&id=${siteConfig.music.id}&auto=1&height=66`}
        allow="autoplay"
      />
    </div>
  )
} 