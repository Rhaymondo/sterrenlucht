'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { getCartItems } from '@/lib/cart'
import { CheckoutWrapper } from './checkout-form'

export function CheckoutInitialiser() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const [originalAmount, setOriginalAmount] = useState<number>(0)
  const [requiresShipping, setRequiresShipping] = useState(false)
  const [requiresEmail, setRequiresEmail] = useState(false)
  const [hasDigital, setHasDigital] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const items = getCartItems()

      if (items.length === 0) {
        setError('Geen winkelwagen gevonden.')
        setLoading(false)
        return
      }

      setRequiresShipping(items.some((i) => i.format !== 'digital'))
      setRequiresEmail(true)
      setHasDigital(items.some((i) => i.format === 'digital'))

      try {
        const res = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items }),
        })

        if (!res.ok) {
          const body = await res.json().catch(() => ({})) as { error?: string }
          throw new Error(body.error ?? 'Betaalsessie aanmaken mislukt.')
        }

        const data = await res.json() as { clientSecret?: string; paymentIntentId?: string }
        if (!data.clientSecret) throw new Error('Geen Stripe client secret ontvangen.')

        setClientSecret(data.clientSecret)
        setPaymentIntentId(data.paymentIntentId ?? null)
        setOriginalAmount(items.reduce((sum, i) => sum + (i.totalPrice ?? 0), 0))
      } catch (err) {
        console.error('[Checkout] Initialisatie mislukt:', err)
        setError(
          err instanceof Error ? err.message : 'Checkout initialisatie mislukt.',
        )
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="size-5 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--foreground)]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
        <div className="mb-4 flex justify-center">
          <ShoppingBag className="size-8 text-[var(--muted)]" />
        </div>

        <p className="text-[13px] font-medium text-[var(--foreground)]">
          Afrekenen kon niet worden gestart
        </p>

        <p className="mt-1 text-[12px] text-[var(--muted)]">
          {error}
        </p>

        <Link
          href="/winkelwagen"
          className="mt-6 inline-block text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] transition-opacity hover:opacity-60"
        >
          ← Terug naar winkelwagen
        </Link>
      </div>
    )
  }

  if (!clientSecret) return null

  return (
    <CheckoutWrapper
      clientSecret={clientSecret}
      paymentIntentId={paymentIntentId ?? ''}
      originalAmount={originalAmount}
      requiresShipping={requiresShipping}
      requiresEmail={requiresEmail}
      hasDigital={hasDigital}
    />
  )
}
