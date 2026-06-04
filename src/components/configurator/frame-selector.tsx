'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useConfigurator, PRICES } from '@/store/configurator'
import { formatEuro } from '@/lib/utils'
import type { FrameColor } from '@/types'

const FRAME_COLORS: { value: FrameColor; label: string; swatch: string; border?: string }[] = [
  { value: 'black', label: 'Zwart', swatch: '#1c1917' },
  { value: 'white', label: 'Wit',   swatch: '#f5f0eb', border: 'var(--border)' },
]

export function FrameSelector() {
  const { format, hasFrame, frameColor, setHasFrame, setFrameColor } = useConfigurator()

  return (
    <AnimatePresence initial={false}>
      {format === 'printed' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <p className="mb-4 text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">Lijst</p>

          <div className="grid grid-cols-2 gap-3">
            {[
              { v: false, label: 'Zonder lijst', sub: 'Inbegrepen' },
              { v: true,  label: 'Met lijst',    sub: `+ ${formatEuro(PRICES.frame)}` },
            ].map(({ v, label, sub }) => (
              <button
                key={String(v)}
                type="button"
                onClick={() => setHasFrame(v)}
                className={[
                  'rounded-lg border p-4 text-left transition-colors',
                  hasFrame === v
                    ? 'border-[var(--foreground)] bg-[var(--surface)]'
                    : 'border-[var(--border)] hover:border-[var(--muted)]',
                ].join(' ')}
              >
                <p className="mb-0.5 text-[13px] font-medium text-[var(--foreground)]">{label}</p>
                <p className="text-[12px] text-[var(--muted)]">{sub}</p>
              </button>
            ))}
          </div>

          <AnimatePresence initial={false}>
            {hasFrame && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-6 overflow-hidden"
              >
                <p className="mb-4 text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">Lijstkleur</p>
                <div className="flex gap-4">
                  {FRAME_COLORS.map((c) => {
                    const selected = frameColor === c.value
                    return (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setFrameColor(c.value)}
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
        </motion.div>
      )}
    </AnimatePresence>
  )
}
