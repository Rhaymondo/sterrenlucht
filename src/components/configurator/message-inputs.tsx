'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useConfigurator, PRICES } from '@/store/configurator'
import { formatEuro } from '@/lib/utils'

const textareaClass =
  'w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted)] transition-colors focus:border-[var(--foreground)] focus:outline-none'

export function MessageInputs() {
  const { message, setMessage, hasGiftCard, setHasGiftCard, giftCardText, setGiftCardText } =
    useConfigurator()

  return (
    <div className="space-y-8">
      {/* Personal message */}
      <div>
        <label className="mb-3 block text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">
          Persoonlijke boodschap{' '}
          <span className="normal-case tracking-normal">(optioneel)</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          maxLength={120}
          placeholder="De nacht waarop alles begon…"
          className={textareaClass}
        />
        <p className="mt-1.5 text-right text-[10px] text-[var(--muted)]">
          {message.length}/120
        </p>
      </div>

      {/* Gift card add-on */}
      <div>
        <button
          type="button"
          onClick={() => setHasGiftCard(!hasGiftCard)}
          className={[
            'flex w-full items-center justify-between rounded-lg border px-5 py-4 text-left transition-colors',
            hasGiftCard
              ? 'border-[var(--foreground)] bg-[var(--surface)]'
              : 'border-[var(--border)] hover:border-[var(--muted)]',
          ].join(' ')}
        >
          <div>
            <p className="mb-0.5 text-[13px] font-medium text-[var(--foreground)]">
              Handgeschreven cadeaukaart
            </p>
            <p className="text-[12px] text-[var(--muted)]">Wij schrijven jouw tekst met de hand</p>
          </div>
          <span className="ml-4 shrink-0 text-[12px] text-[var(--foreground)]">
            + {formatEuro(PRICES.giftCard)}
          </span>
        </button>

        <AnimatePresence initial={false}>
          {hasGiftCard && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-5">
                <label className="mb-3 block text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">
                  Tekst op de kaart
                </label>
                <textarea
                  value={giftCardText}
                  onChange={(e) => setGiftCardText(e.target.value)}
                  rows={4}
                  maxLength={200}
                  placeholder="Lieve…"
                  className={textareaClass}
                />
                <p className="mt-1.5 text-right text-[10px] text-[var(--muted)]">
                  {giftCardText.length}/200
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
