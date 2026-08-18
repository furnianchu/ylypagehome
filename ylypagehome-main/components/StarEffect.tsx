'use client'

import { useEffect, useState } from 'react'

interface Star {
  id: number
  x: number
  y: number
  size: number
  rotation: number
  opacity: number
}

export default function StarEffect() {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    const newStars = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 15 + 10,
      rotation: Math.random() * 360,
      opacity: 1
    }))

    setStars(newStars)

    const timer = setTimeout(() => {
      setStars([])
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute"
          style={{
            left: star.x,
            top: star.y,
            transform: `rotate(${star.rotation}deg) scale(${star.size / 20})`,
            opacity: star.opacity,
            transition: 'all 1s ease-out',
          }}
        >
          <svg
            className="w-4 h-4 text-pink-300 animate-ping"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
      ))}
    </div>
  )
} 