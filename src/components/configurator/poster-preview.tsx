'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useConfigurator } from '@/store/configurator'

const IMAGES: Record<string, string> = {
  'taupe-none':  '/images/posters/taupe.webp',
  'black-none':  '/images/posters/black.jpg',
  'white-none':  '/images/posters/white.jpg',
  'taupe-black': '/images/posters/taupe-frame-black.jpg',
  'black-black': '/images/posters/black-frame-black.jpg',
  'white-black': '/images/posters/white-frame-black.jpg',
  'taupe-white': '/images/posters/taupe-frame-white.jpg',
  'black-white': '/images/posters/black-frame-white.jpg',
  'white-white': '/images/posters/white-frame-white.jpg',
}

export function PosterPreview() {
  const { format, printColor, hasFrame, frameColor } = useConfigurator()

  const colorKey = printColor ?? 'taupe'
  const frameKey = hasFrame && frameColor ? frameColor : 'none'
  const src = IMAGES[`${colorKey}-${frameKey}`]

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-[var(--surface)] p-12">
      <AnimatePresence mode="wait">
        <motion.img
          key={src}
          src={src}
          alt="Poster preview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="max-h-full max-w-full object-contain drop-shadow-2xl"
        />
      </AnimatePresence>
    </div>
  )
}
