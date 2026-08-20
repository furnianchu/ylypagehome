'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

export interface Credit {
  name: string
  title: string
  emoji: string
}

const CREDITS: Credit[] = [
  { name: '张三', title: '首席摸鱼官', emoji: '🦊' },
  { name: '李四', title: 'Bug 制造机', emoji: '🐱' },
  { name: '王五', title: '深夜陪聊员', emoji: '🐼' },
  { name: '赵六', title: '灵感赞助商', emoji: '🦝' },
  { name: '孙七', title: '精神支柱', emoji: '🐺' },
]

interface CreditsDrawerProps {
  open: boolean
  onClose: () => void
}

export default function CreditsDrawer({ open, onClose }: CreditsDrawerProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(6px)',
              zIndex: 100,
            }}
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '32px 24px 48px',
              zIndex: 101,
              maxHeight: '75vh',
              overflowY: 'auto',
              boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
            }}
          >
            <div style={{ width: '48px', height: '4px', background: '#ffffff33', borderRadius: '2px', margin: '0 auto 24px' }} />

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{ textAlign: 'center', fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '8px', letterSpacing: '2px' }}
            >
              🎬 特殊参演
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              style={{ textAlign: 'center', color: '#ffffff66', fontSize: '14px', marginBottom: '32px' }}
            >
              — 感谢以下开发者陪我一起折腾 —
            </motion.p>

            <div style={{ maxWidth: '480px', margin: '0 auto' }}>
              {CREDITS.map((person, index) => (
                <motion.div
                  key={person.name}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.12, type: 'spring', damping: 20, stiffness: 200 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 20px',
                    marginBottom: '12px',
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, hsl(${index * 72}, 70%, 50%), hsl(${index * 72 + 40}, 70%, 40%))`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      flexShrink: 0,
                    }}
                  >
                    {person.emoji}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#fff', fontSize: '18px', fontWeight: 700, marginBottom: '2px' }}>
                      {person.name}
                    </div>
                    <div style={{ color: '#ffffff88', fontSize: '13px' }}>
                      {person.title}
                    </div>
                  </div>

                  <div style={{ color: '#ffffff33', fontSize: '14px', fontFamily: 'monospace' }}>
                    #{String(index + 1).padStart(2, '0')}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{ textAlign: 'center', color: '#ffffff33', fontSize: '12px', marginTop: '24px' }}
            >
              点击空白处或按 ESC 关闭
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
