'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CHARACTERS = [
  '钟离', '胡桃', '雷电将军', '温迪', '可莉',
  '甘雨', '魈', '神里绫华', '枫原万叶', '夜兰',
  '三月七', '丹恒', '姬子', '卡芙卡', '银狼',
  '景元', '符玄', '真理医生', '黑天鹅', '花火',
  '朱鸢', '格莉丝', '丽娜', '艾莲', '星见雅',
  '比利', '安比', '妮可', '珂蕾妲', '露西',
]

const COLORS = [
  '#f87171', '#fb923c', '#fbbf24', '#a3e635', '#34d399',
  '#22d3ee', '#60a5fa', '#818cf8', '#a78bfa', '#e879f9',
  '#fb7185', '#f97316', '#eab308', '#84cc16', '#10b981',
  '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef',
]

function VerticalText({ text }: { text: string }) {
  return (
    <span style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
      {text}
    </span>
  )
}

interface FloatingChar {
  id: number
  name: string
  color: string
  left: number
  delay: number
  duration: number
  fontSize: number
}

export default function FloatingCharacters() {
  const [chars, setChars] = useState<FloatingChar[]>([])

  useEffect(() => {
    let id = 0
    const interval = setInterval(() => {
      const name = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      const left = 2 + Math.random() * 18
      const delay = Math.random() * 0.5
      const duration = 4 + Math.random() * 3
      const fontSize = 14 + Math.random() * 10

      const newChar: FloatingChar = {
        id: id++,
        name,
        color,
        left,
        delay,
        duration,
        fontSize,
      }

      setChars(prev => [...prev, newChar])

      setTimeout(() => {
        setChars(prev => prev.filter(c => c.id !== newChar.id))
      }, (delay + duration) * 1000 + 500)
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '25vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 10,
        overflow: 'hidden',
      }}
    >
      <AnimatePresence>
        {chars.map(char => (
          <motion.div
            key={char.id}
            initial={{ y: '-20%', opacity: 0, filter: 'blur(0px)', scale: 1 }}
            animate={{
              y: '110%',
              opacity: [0, 1, 1, 0.6, 0],
              filter: ['blur(0px)', 'blur(0px)', 'blur(2px)', 'blur(6px)', 'blur(12px)'],
              scale: [1, 1, 0.95, 0.8, 0.5],
            }}
            transition={{
              duration: char.duration,
              delay: char.delay,
              ease: 'easeIn',
              times: [0, 0.1, 0.4, 0.7, 1],
            }}
            style={{
              position: 'absolute',
              top: 0,
              right: `${char.left}%`,
              color: char.color,
              fontSize: `${char.fontSize}px`,
              fontWeight: 700,
              fontFamily: '"Noto Sans CJK SC", "WenQuanYi Micro Hei", sans-serif',
              textShadow: `0 0 8px ${char.color}44`,
              letterSpacing: '4px',
              whiteSpace: 'nowrap',
            }}
          >
            <VerticalText text={char.name} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
