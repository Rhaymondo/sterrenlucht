'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X, ShoppingBag } from 'lucide-react'
import { getCart, type CartData } from '@/lib/cart'
import { PRICES } from '@/store/configurator'
import { formatEuro } from '@/lib/utils'
import Link from 'next/link'

function posterTitle(cart: CartData): string {
  if (cart.format === 'digital') return 'Digitale poster'
  const colors: Record<string, string> = { black: 'Zwart', taupe: 'Taupe', white: 'Wit' }
  const color = cart.printColor ? (colors[cart.printColor] ?? '') : ''
  const frame = cart.hasFrame ? ` + Lijst` : ''
  return `Gedrukte poster - ${color}${frame}`
}

export function CartDrawer() {
  const [open, setOpen] = useState(false)
  const [cart, setCart] = useState<CartData | null>(null)

  useEffect(() => {
    if (open) setCart(getCart())
  }, [open])

  const hasItems = !!cart
  const total    = cart ? cart.totalPrice : 0

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative rounded-full p-2 text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
        aria-label="Winkelwagen openen"
      >
        <ShoppingBag className="size-5" />
        {hasItems && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-[var(--foreground)] text-[9px] font-bold text-[var(--background)]">
            1
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
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-[var(--border)] bg-[var(--background)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <h2 className="text-sm font-medium text-[var(--foreground)]">Winkelwagen</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {!cart && (
                <p className="mt-8 text-center text-sm text-[var(--muted)]">
                  Je winkelwagen is leeg.
                </p>
              )}

              {cart && (
                <>
                  <div className="mb-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                    <p className="text-sm font-medium text-[var(--foreground)]">{posterTitle(cart)}</p>
                    {!!cart.location?.label && (
                      <p className="mt-1 text-xs text-[var(--muted)]">{cart.location.label}</p>
                    )}
                    {!!cart.date && (
                      <p className="text-xs text-[var(--muted)]">
                        {cart.date} · {cart.time}
                      </p>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-[var(--muted)]">× 1</span>
                      <span className="text-sm font-medium tabular-nums text-[var(--foreground)]">
                        {formatEuro(cart.format === 'digital' ? PRICES.digital : PRICES.printed + (cart.hasFrame ? PRICES.frame : 0))}
                      </span>
                    </div>
                  </div>

                  {cart.hasGiftCard && (
                    <div className="mb-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                      <p className="text-sm font-medium text-[var(--foreground)]">Handgeschreven cadeaukaart</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-[var(--muted)]">× 1</span>
                        <span className="text-sm font-medium tabular-nums text-[var(--foreground)]">
                          {formatEuro(PRICES.giftCard)}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            {cart && (
              <div className="border-t border-[var(--border)] px-5 py-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-[var(--muted)]">Totaal</span>
                  <span className="text-base font-medium tabular-nums text-[var(--foreground)]">
                    {formatEuro(total)}
                  </span>
                </div>
                <Link
                  href="/afrekenen"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center rounded-full bg-[var(--foreground)] py-3.5 text-[11px] uppercase tracking-[0.2em] text-[var(--background)] transition-opacity hover:opacity-70"
                >
                  Afrekenen
                </Link>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
