'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/store/cart'
import { useConfigurator } from '@/store/configurator'
import { PRICES } from '@/store/configurator'
import { formatEuro } from '@/lib/utils'
import { PosterThumbnail } from '@/components/configurator/poster-thumbnail'
import type { CartItem } from '@/lib/cart'

const COLOR_LABELS: Record<string, string> = { black: 'Zwart', taupe: 'Taupe', white: 'Wit' }

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--foreground)]">
        {label}
      </p>
      <p className="text-[12px] text-[var(--muted)]">{value}</p>
    </div>
  )
}

function ItemDetails({ item }: { item: CartItem }) {
  return (
    <div className="mt-3 space-y-2">
      <Detail label="Formaat" value={item.format === 'digital' ? 'Digitaal' : 'Gedrukt 30×40 cm'} />
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
  )
}

export function CartPopover() {
  const [open, setOpen] = useState(false)
  const { items, remove, load } = useCart()
  const { loadFromCartItem } = useConfigurator()
  const router = useRouter()

  useEffect(() => { load() }, [load])

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  function handleEdit(item: CartItem) {
    loadFromCartItem(item)
    setOpen(false)
    router.push('/configureer')
  }

  const count = items.length
  const total = items.reduce((sum, i) => sum + i.totalPrice, 0)

  return (
    <>
      {/* Nav trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative rounded-full p-2 text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
        aria-label="Winkelwagen openen"
      >
        <ShoppingBag className="size-5" />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-[var(--foreground)] text-[9px] font-bold text-[var(--background)]">
            {count}
          </span>
        )}
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer panel */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 40 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-[var(--background)] sm:max-w-[480px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] px-8 py-6">
              <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-[var(--foreground)]">
                Winkelwagen
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
              >
                Sluit
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-8 py-8">
              {count === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
                  <p className="text-[13px] text-[var(--muted)]">Je winkelwagen is leeg.</p>
                  <Link
                    href="/configureer"
                    onClick={() => setOpen(false)}
                    className="text-[11px] uppercase tracking-[0.2em] text-[var(--foreground)] underline underline-offset-4 transition-opacity hover:opacity-60"
                  >
                    Maak mijn poster
                  </Link>
                </div>
              ) : (
                <ul className="space-y-10">
                  {items.map((item) => (
                    <li key={item.id}>
                      <div className="flex items-start gap-5">
                        {/* Thumbnail */}
                        <div className="w-[72px] shrink-0 overflow-hidden rounded-md">
                          <PosterThumbnail
                            format={item.format}
                            printColor={item.printColor}
                            hasFrame={item.hasFrame}
                            frameColor={item.frameColor}
                            className="h-full w-full object-contain"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          {/* Title row */}
                          <div className="flex items-start justify-between gap-4">
                            <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[var(--foreground)]">
                              {item.format === 'digital' ? 'Digitale Poster' : 'Gedrukte Poster'}
                            </p>
                            <p className="shrink-0 text-[13px] font-bold tabular-nums text-[var(--foreground)]">
                              {formatEuro(item.totalPrice)}
                            </p>
                          </div>

                          {/* Detail rows */}
                          <ItemDetails item={item} />

                          {/* Actions row */}
                          <div className="mt-3 flex gap-4">
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              className="text-[11px] text-[var(--muted)] underline underline-offset-2 transition-colors hover:text-[var(--foreground)]"
                            >
                              Bewerken
                            </button>
                            <button
                              type="button"
                              onClick={() => remove(item.id)}
                              className="text-[11px] text-[var(--muted)] underline underline-offset-2 transition-colors hover:text-red-500"
                            >
                              Verwijder
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Divider between items */}
                      <div className="mt-10 border-t border-[var(--border)]" />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {count > 0 && (
              <div className="border-t border-[var(--border)] px-8 pb-10 pt-6 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold uppercase tracking-[0.2em] text-[var(--foreground)]">
                    Totaal
                  </span>
                  <span className="text-[20px] font-bold tabular-nums text-[var(--foreground)]">
                    {formatEuro(total)}
                  </span>
                </div>

                <Link
                  href="/afrekenen"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center bg-[var(--foreground)] py-4 text-[11px] uppercase tracking-[0.25em] text-[var(--background)] transition-opacity hover:opacity-75"
                >
                  Afrekenen
                </Link>

                <Link
                  href="/winkelwagen"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center py-2 text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
                >
                  Bekijk winkelwagen
                </Link>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
