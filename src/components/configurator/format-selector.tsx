'use client'

import { useConfigurator, PRICES } from '@/store/configurator'
import { formatEuro } from '@/lib/utils'
import type { Format } from '@/types'

const OPTIONS: { value: Format; label: string; description: string; price: number }[] = [
  { value: 'digital', label: 'Digitaal',  description: 'Hoge-resolutie PDF, direct te downloaden.', price: PRICES.digital },
  { value: 'printed', label: 'Gedrukt',   description: '30 × 40 cm, premium mat papier.',           price: PRICES.printed },
]

export function FormatSelector() {
  const { format, setFormat } = useConfigurator()

  return (
    <div>
      <p className="mb-4 text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">Formaat</p>
      <div className="grid grid-cols-2 gap-3">
        {OPTIONS.map((opt) => {
          const selected = format === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFormat(opt.value)}
              className={[
                'rounded-lg border p-5 text-left transition-colors',
                selected
                  ? 'border-[var(--foreground)] bg-[var(--surface)]'
                  : 'border-[var(--border)] hover:border-[var(--muted)]',
              ].join(' ')}
            >
              <p className="mb-1.5 text-[13px] font-medium text-[var(--foreground)]">{opt.label}</p>
              <p className="mb-3 text-[12px] leading-relaxed text-[var(--muted)]">{opt.description}</p>
              <p className="text-[12px] text-[var(--foreground)]">{formatEuro(opt.price)}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
