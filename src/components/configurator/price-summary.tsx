'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useConfigurator, PRICES } from '@/store/configurator'
import { formatEuro } from '@/lib/utils'

export function PriceSummary() {
  const { format, hasFrame, hasGiftCard, totalPrice } = useConfigurator()

  const lines = [
    { label: format === 'digital' ? 'Digitale poster' : 'Gedrukte poster (30×40)', amount: format === 'digital' ? PRICES.digital : PRICES.printed, show: true },
    { label: 'Lijst',       amount: PRICES.frame,    show: hasFrame    },
    { label: 'Cadeaukaart', amount: PRICES.giftCard, show: hasGiftCard },
  ]

  return (
    <div
      className="rounded-lg border p-5"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="mb-4 space-y-2.5">
        {lines.map((line) =>
          line.show ? (
            <div key={line.label} className="flex justify-between text-[13px]">
              <span className="text-[var(--muted)]">{line.label}</span>
              <span className="text-[var(--foreground)]">{formatEuro(line.amount)}</span>
            </div>
          ) : null,
        )}
      </div>

      <div
        className="flex justify-between border-t pt-4"
        style={{ borderColor: 'var(--border)' }}
      >
        <span className="text-[13px] font-medium text-[var(--foreground)]">Totaal</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={totalPrice}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18 }}
            className="text-[13px] font-medium text-[var(--foreground)]"
          >
            {formatEuro(totalPrice)}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  )
}
