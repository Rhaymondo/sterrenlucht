'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, Pencil, ShoppingBag } from 'lucide-react'
import { useCart } from '@/store/cart'
import { useConfigurator } from '@/store/configurator'
import { PRICES } from '@/store/configurator'
import { formatEuro } from '@/lib/utils'
import { Nav } from '@/components/nav'
import { PosterThumbnail } from '@/components/configurator/poster-thumbnail'
import type { CartItem } from '@/lib/cart'

const COLOR_LABELS: Record<string, string> = { black: 'Zwart', taupe: 'Taupe', white: 'Wit' }
const SHIPPING = 595 // €5,95 in cents

function InlineDetail({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-[13px] leading-snug">
      <span className="font-semibold text-[var(--foreground)]">{label}: </span>
      <span className="text-[var(--muted)]">{value}</span>
    </p>
  )
}

function ItemRow({
  item,
  onEdit,
  onRemove,
}: {
  item: CartItem
  onEdit: () => void
  onRemove: () => void
}) {
  return (
    <div className="flex gap-8 border-b border-[var(--border)] py-10">
      {/* Poster image */}
      <div className="w-36 shrink-0 lg:w-44">
        <PosterThumbnail
          format={item.format}
          printColor={item.printColor}
          hasFrame={item.hasFrame}
          frameColor={item.frameColor}
          className="w-full object-contain"
        />
      </div>

      {/* Details + price */}
      <div className="flex flex-1 flex-col justify-between">
        {/* Top */}
        <div>
          <p className="text-[15px] font-bold text-[var(--foreground)]">
            {item.format === 'digital' ? 'Digitale Poster' : 'Gedrukte Poster'}
          </p>

          <div className="mt-3 space-y-1.5">
            <InlineDetail
              label="Formaat"
              value={item.format === 'digital' ? 'Digitaal' : 'Gedrukt 30×40 cm'}
            />
            {item.printColor && (
              <InlineDetail label="Kleur" value={COLOR_LABELS[item.printColor] ?? item.printColor} />
            )}
            {item.hasFrame && item.frameColor && (
              <InlineDetail label="Lijst" value={COLOR_LABELS[item.frameColor] ?? item.frameColor} />
            )}
            {item.location?.label && (
              <InlineDetail label="Locatie" value={item.location.label} />
            )}
            {item.posterLabel && item.posterLabel !== item.location?.label && (
              <InlineDetail label="Locatie op poster" value={item.posterLabel} />
            )}
            {item.date && (
              <InlineDetail label="Datum" value={`${item.date} · ${item.time}`} />
            )}
            {item.message && (
              <InlineDetail label="Bericht" value={`"${item.message}"`} />
            )}
            {item.hasGiftCard && (
              <InlineDetail
                label="Cadeaukaart"
                value={`Handgeschreven · ${formatEuro(PRICES.giftCard)}`}
              />
            )}
          </div>
        </div>

        {/* Bottom — actions + price */}
        <div className="mt-6 flex items-end justify-between">
          <div className="flex gap-5">
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-1.5 text-[12px] text-[var(--muted)] underline underline-offset-2 transition-colors hover:text-[var(--foreground)]"
            >
              <Pencil className="size-3" />
              Bewerken
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="flex items-center gap-1.5 text-[12px] text-[var(--muted)] underline underline-offset-2 transition-colors hover:text-red-500"
            >
              <Trash2 className="size-3" />
              Verwijder
            </button>
          </div>

          <p className="text-[15px] font-bold tabular-nums text-[var(--foreground)]">
            {formatEuro(item.totalPrice)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function WinkelwagenPage() {
  const { items, remove, load } = useCart()
  const { loadFromCartItem } = useConfigurator()
  const router = useRouter()

  useEffect(() => { load() }, [load])

  function handleEdit(item: CartItem) {
    loadFromCartItem(item)
    router.push('/configureer')
  }

  const hasPhysical = items.some((i) => i.format !== 'digital')
  const subtotal    = items.reduce((sum, i) => sum + i.totalPrice, 0)
  const shipping    = hasPhysical ? SHIPPING : 0
  const total       = subtotal + shipping

  /* ── Empty state ─────────────────────────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <>
        <Nav />
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
          <ShoppingBag className="size-10 text-[var(--muted)]" />
          <div className="space-y-1.5">
            <p className="text-[13px] font-medium text-[var(--foreground)]">Je winkelwagen is leeg</p>
            <p className="text-[12px] text-[var(--muted)]">Configureer jouw poster om te beginnen.</p>
          </div>
          <Link
            href="/configureer"
            className="bg-[var(--foreground)] px-8 py-3.5 text-[11px] uppercase tracking-[0.2em] text-[var(--background)] transition-opacity hover:opacity-75"
          >
            Maak mijn poster
          </Link>
        </div>
      </>
    )
  }

  /* ── Filled cart ─────────────────────────────────────────────────────────── */
  return (
    <>
      <Nav />
      <main className="px-8 pb-24 pt-28">

        {/* Page heading */}
        <div className="mb-2">
          <h1 className="text-4xl font-bold uppercase tracking-tight text-[var(--foreground)]">
            Winkelwagen
          </h1>
        </div>
        <Link
          href="/configureer"
          className="text-[12px] text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
        >
          ← Verder winkelen
        </Link>

        {/* Two-column layout */}
        <div className="mt-10 grid grid-cols-1 gap-16 lg:grid-cols-[1fr_360px]">

          {/* Left — items */}
          <div>
            <div className="border-t border-[var(--border)]">
              {items.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  onEdit={() => handleEdit(item)}
                  onRemove={() => remove(item.id)}
                />
              ))}
            </div>

            <Link
              href="/configureer"
              className="mt-6 inline-block text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
            >
              + Nog een poster toevoegen
            </Link>
          </div>

          {/* Right — summary */}
          <div>
            <div className="sticky top-28 bg-[var(--surface)] p-8">
              <h2 className="text-[12px] font-bold uppercase tracking-[0.22em] text-[var(--foreground)]">
                Samenvatting
              </h2>

              <div className="mt-6 space-y-3">
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
              </div>

              <div className="mt-6 border-t border-[var(--border)] pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold uppercase tracking-[0.18em] text-[var(--foreground)]">
                    Totaal
                  </span>
                  <span className="text-[22px] font-bold tabular-nums text-[var(--foreground)]">
                    {formatEuro(total)}
                  </span>
                </div>
              </div>

              <Link
                href="/afrekenen"
                className="mt-6 flex w-full items-center justify-center bg-[var(--foreground)] py-4 text-[11px] uppercase tracking-[0.25em] text-[var(--background)] transition-opacity hover:opacity-75"
              >
                Afrekenen
              </Link>

              {/* Payment methods */}
              <div className="mt-6">
                <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                  Wij accepteren
                </p>
                <div className="flex items-center gap-3">
                  {/* iDEAL */}
                  <div className="flex h-7 w-[54px] items-center justify-center overflow-hidden rounded" style={{ backgroundColor: '#fff48d' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://d1twnm33rljaon.cloudfront.net/Logos/iDEAL-Wero/iDEAL_Wero_Lockup_Yellow_Horizontal_RGB.svg"
                      alt="iDEAL"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  {/* Klarna */}
                  <div
                    className="flex h-7 w-[54px] items-center justify-center rounded"
                    style={{ backgroundColor: '#ffb3c7' }}
                  >
                    <span className="text-[11px] font-semibold tracking-tight" style={{ color: '#1a0a10' }}>
                      Klarna.
                    </span>
                  </div>
                  {/* Creditcard */}
                  <div
                    className="flex h-7 w-[54px] items-center justify-center gap-1 rounded border"
                    style={{ backgroundColor: '#f9f8f6', borderColor: 'var(--border)' }}
                  >
                    <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="0.5" y="0.5" width="11" height="8" rx="1.5" stroke="#7c7974"/>
                      <rect x="0.5" y="2" width="11" height="2" fill="#7c7974"/>
                    </svg>
                    <span className="text-[10px] font-medium" style={{ color: '#7c7974' }}>Kaart</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  )
}
