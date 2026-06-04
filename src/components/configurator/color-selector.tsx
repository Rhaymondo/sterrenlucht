'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useConfigurator } from '@/store/configurator'
import type { PrintColor } from '@/types'

const COLORS: { value: PrintColor; label: string; swatch: string; border?: string }[] = [
  { value: 'black', label: 'Zwart', swatch: '#1c1917' },
  { value: 'taupe', label: 'Taupe', swatch: '#b8a99a' },
  { value: 'white', label: 'Wit',   swatch: '#f5f0eb', border: 'var(--border)' },
]

export function ColorSelector() {
  const { format, printColor, setPrintColor } = useConfigurator()

  return (
    <AnimatePresence initial={false}>
      {(format === 'printed' || format === 'digital') && (
        <motion.div
          initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
          animate={{ opacity: 1, height: 'auto', transitionEnd: { overflow: 'visible' } }}
          exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-4 text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">Posterkleur</p>
          <div className="flex gap-4">
            {COLORS.map((c) => {
              const selected = printColor === c.value
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setPrintColor(c.value)}
                  className="flex flex-col items-center gap-2"
                >
                  <span
                    className={[
                      'flex h-10 w-10 rounded-full transition-all',
                      selected
                        ? 'ring-2 ring-[var(--foreground)] ring-offset-2 ring-offset-[var(--background)]'
                        : 'ring-1 ring-transparent hover:ring-[var(--muted)] hover:ring-offset-2 hover:ring-offset-[var(--background)]',
                    ].join(' ')}
                    style={{
                      backgroundColor: c.swatch,
                      boxShadow: c.border ? `inset 0 0 0 1px ${c.border}` : undefined,
                    }}
                  />
                  <span className={[
                    'text-[10px] uppercase tracking-[0.12em] transition-colors',
                    selected ? 'text-[var(--foreground)]' : 'text-[var(--muted)]',
                  ].join(' ')}>
                    {c.label}
                  </span>
                </button>
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
