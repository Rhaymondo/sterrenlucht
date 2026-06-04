'use client'

import { useEffect } from 'react'
import { useCart } from '@/store/cart'
import { PRICES } from '@/store/configurator'
import { formatEuro } from '@/lib/utils'
import { PosterThumbnail } from '@/components/configurator/poster-thumbnail'
import { useDiscount } from '@/store/discount'
import type { CartItem } from '@/lib/cart'

const COLOR_LABELS: Record<string, string> = { black: 'Zwart', taupe: 'Taupe', white: 'Wit' }
const SHIPPING = 595

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-[12px] leading-snug">
      <span className="font-semibold text-[var(--foreground)]">{label}: </span>
      <span className="text-[var(--muted)]">{value}</span>
    </p>
  )
}

function ItemRow({ item }: { item: CartItem }) {
  return (
    <div className="flex gap-4 border-b border-[var(--border)] py-5">
      <div className="w-14 shrink-0">
        <PosterThumbnail
          format={item.format}
          printColor={item.printColor}
          hasFrame={item.hasFrame}
          frameColor={item.frameColor}
          className="w-full object-contain"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between gap-2">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[13px] font-bold text-[var(--foreground)]">
            {item.format === 'digital' ? 'Digitale Poster' : 'Gedrukte Poster'}
          </p>
          <p className="shrink-0 text-[13px] font-bold tabular-nums text-[var(--foreground)]">
            {formatEuro(item.totalPrice)}
          </p>
        </div>

        <div className="space-y-0.5">
          <Detail
            label="Formaat"
            value={item.format === 'digital' ? 'Digitaal' : 'Gedrukt 30×40 cm'}
          />
          {item.printColor && (
            <Detail label="Kleur" value={COLOR_LABELS[item.printColor] ?? item.printColor} />
          )}
          {item.hasFrame && item.frameColor && (
            <Detail label="Lijst" value={COLOR_LABELS[item.frameColor] ?? item.frameColor} />
          )}
          {item.location?.label && (
            <Detail label="Locatie" value={item.location.label} />
          )}
          {item.date && (
            <Detail label="Datum" value={`${item.date} · ${item.time}`} />
          )}
          {item.message && (
            <Detail label="Bericht" value={`"${item.message}"`} />
          )}
          {item.hasGiftCard && (
            <Detail label="Cadeaukaart" value={`Handgeschreven · ${formatEuro(PRICES.giftCard)}`} />
          )}
        </div>
      </div>
    </div>
  )
}

export function OrderSummary() {
  const { items, load } = useCart()
  const { code: discountCode, discountAmount } = useDiscount()

  useEffect(() => { load() }, [load])

  const hasPhysical = items.some((i) => i.format !== 'digital')
  const subtotal    = items.reduce((sum, i) => sum + i.totalPrice, 0)
  const shipping    = hasPhysical ? SHIPPING : 0
  const total       = subtotal + shipping - discountAmount

  return (
    <div className="bg-[var(--surface)] p-8">
      <h2 className="text-[12px] font-bold uppercase tracking-[0.22em] text-[var(--foreground)]">
        Bestelling
      </h2>

      {/* Items */}
      <div className="mt-4">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </div>

      {/* Totals */}
      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[var(--foreground)]">Subtotaal</span>
          <span className="text-[13px] tabular-nums text-[var(--foreground)]">
            {formatEuro(subtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[var(--foreground)]">Verzending</span>
          <span className="text-[13px] tabular-nums text-[var(--foreground)]">
            {hasPhysical ? formatEuro(SHIPPING) : 'Gratis'}
          </span>
        </div>
        {discountCode && discountAmount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#9c8b7a]">{discountCode}</span>
            <span className="text-[13px] tabular-nums text-[#9c8b7a]">−{formatEuro(discountAmount)}</span>
          </div>
        )}
      </div>

      <div className="mt-5 border-t border-[var(--border)] pt-5">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-bold uppercase tracking-[0.18em] text-[var(--foreground)]">
            Totaal
          </span>
          <span className="text-[22px] font-bold tabular-nums text-[var(--foreground)]">
            {formatEuro(total)}
          </span>
        </div>
      </div>
    </div>
  )
}
