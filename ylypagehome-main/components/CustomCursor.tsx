'use client'

import { useEffect, useState } from 'react'

interface Position {
  x: number
  y: number
}

export default function CustomCursor() {
  const [stars, setStars] = useState<Position[]>([])

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setStars((prevStars) => [
        ...prevStars.slice(-10),
        { x: e.clientX, y: e.clientY },
      ])
    }

    window.addEventListener('mousemove', updatePosition)

    return () => {
      window.removeEventListener('mousemove', updatePosition)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setStars((prevStars) => prevStars.slice(1))
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {stars.map((star, index) => (
        <div
          key={index}
          className="fixed pointer-events-none z-40"
          style={{
            left: `${star.x - 10}px`,
            top: `${star.y + 10}px`,
            transform: 'translate(-50%, -50%) scale(0.8)',
            opacity: 0.5 - index / 20,
            transition: 'opacity 0.1s, transform 0.1s',
          }}
        >
          <svg
            className="w-5 h-5 text-pink-300"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
      ))}
    </>
  )
}