'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const messages = [
  'Handgemaakt in Houten',
  '3 werkdagen levertijd',
  'Digitaal al voor €10',
]

export function AnnouncementBar() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const prev = useCallback(() => {
    setCurrent((i) => (i - 1 + messages.length) % messages.length)
    setPaused(true)
  }, [])

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % messages.length)
    setPaused(true)
  }, [])

  useEffect(() => {
    if (paused) {
      const t = setTimeout(() => setPaused(false), 6000)
      return () => clearTimeout(t)
    }
    const t = setInterval(() => {
      setCurrent((i) => (i + 1) % messages.length)
    }, 4000)
    return () => clearInterval(t)
  }, [paused])

  return (
    <div className="fixed inset-x-0 top-0 z-[60] w-full bg-[#b5727f] text-white text-xs font-medium tracking-widest uppercase">
      <div className="flex items-center justify-center h-9 gap-4 max-w-screen-xl mx-auto px-4">
        <button
          onClick={prev}
          aria-label="Vorig bericht"
          className="opacity-70 hover:opacity-100 transition-opacity shrink-0"
        >
          ‹
        </button>

        <AnimatePresence mode="wait">
          <motion.span
            key={current}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="text-center leading-none"
          >
            {messages[current]}
          </motion.span>
        </AnimatePresence>

        <button
          onClick={next}
          aria-label="Volgend bericht"
          className="opacity-70 hover:opacity-100 transition-opacity shrink-0"
        >
          ›
        </button>
      </div>
    </div>
  )
}
