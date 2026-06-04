'use client'

import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
  AddressElement,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useState } from 'react'
import { Loader2, Lock, Tag, X, CheckCircle2 } from 'lucide-react'
import { motion } from 'motion/react'
import { useDiscount } from '@/store/discount'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
)

interface CheckoutWrapperProps {
  clientSecret:     string
  paymentIntentId:  string
  originalAmount:   number
  requiresShipping: boolean
  requiresEmail:    boolean
  hasDigital:       boolean
}

export function CheckoutWrapper({
  clientSecret,
  paymentIntentId,
  originalAmount,
  requiresShipping,
  requiresEmail,
  hasDigital,
}: CheckoutWrapperProps) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        locale: 'nl',
        appearance: {
          theme: 'stripe',
          variables: {
            fontFamily:
              'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSizeBase: '14px',
            fontLineHeight: '1.5',
            borderRadius: '8px',
            colorPrimary: '#1a1714',
            colorBackground: '#f9f8f6',
            colorText: '#1a1714',
            colorTextSecondary: '#7c7974',
            colorDanger: '#dc2626',
            colorSuccess: '#166534',
            spacingUnit: '4px',
          },
          rules: {
            '.Input': {
              backgroundColor: '#f9f8f6',
              border: '1px solid #e5e0d8',
              boxShadow: 'none',
            },
            '.Input:focus': {
              border: '1px solid #1a1714',
              boxShadow: 'none',
            },
            '.Label': {
              color: '#7c7974',
              fontSize: '11px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
            },
            '.Tab': {
              border: '1px solid #e5e0d8',
              backgroundColor: '#f9f8f6',
              boxShadow: 'none',
            },
            '.Tab--selected': {
              border: '1px solid #1a1714',
              backgroundColor: '#f9f8f6',
              boxShadow: 'none',
            },
            '.Block': {
              backgroundColor: '#f9f8f6',
              boxShadow: 'none',
            },
          },
        },
      }}
    >
      <CheckoutForm
        paymentIntentId={paymentIntentId}
        originalAmount={originalAmount}
        requiresShipping={requiresShipping}
        requiresEmail={requiresEmail}
        hasDigital={hasDigital}
      />
    </Elements>
  )
}

interface DiscountState {
  code:           string
  discountAmount: number
  newTotal:       number
}

function formatMoney(cents: number) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(cents / 100)
}

function CheckoutForm({
  paymentIntentId,
  originalAmount,
  requiresShipping,
  requiresEmail,
  hasDigital,
}: {
  paymentIntentId:  string
  originalAmount:   number
  requiresShipping: boolean
  requiresEmail:    boolean
  hasDigital:       boolean
}) {
  const stripe   = useStripe()
  const elements = useElements()
  const [loading, setLoading]             = useState(false)
  const [error, setError]                 = useState<string | null>(null)
  const [email, setEmail]                 = useState('')
  const [discountCode, setDiscountCode]   = useState('')
  const [discountLoading, setDiscountLoading] = useState(false)
  const [discountError, setDiscountError] = useState<string | null>(null)
  const [discount, setDiscount]           = useState<DiscountState | null>(null)
  const discountStore = useDiscount()

  const applyDiscount = async () => {
    if (!discountCode.trim()) return
    setDiscountLoading(true)
    setDiscountError(null)

    const res = await fetch('/api/stripe/validate-discount', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: discountCode.trim(), paymentIntentId, originalAmount }),
    })

    const data = await res.json() as {
      valid: boolean; error?: string
      discountAmount?: number; newTotal?: number
    }

    if (!data.valid) {
      setDiscountError(data.error ?? 'Ongeldige kortingscode.')
    } else {
      const applied = { code: discountCode.trim().toUpperCase(), discountAmount: data.discountAmount!, newTotal: data.newTotal! }
      setDiscount(applied)
      discountStore.set(applied.code, applied.discountAmount)
      setDiscountCode('')
    }
    setDiscountLoading(false)
  }

  const removeDiscount = async () => {
    await fetch('/api/stripe/validate-discount', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentIntentId, originalAmount }),
    })
    setDiscount(null)
    setDiscountError(null)
    discountStore.clear()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    if (requiresEmail && !email.includes('@')) {
      setError('Vul een geldig e-mailadres in.')
      return
    }

    setLoading(true)
    setError(null)

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message ?? 'Controleer je gegevens.')
      setLoading(false)
      return
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/bevestiging`,
        receipt_email: email,
        payment_method_data: {
          billing_details: {
            email,
            phone: '',
            address: { country: 'NL', postal_code: '', line1: '', line2: '', city: '', state: '' },
          },
        },
      },
    })

    if (confirmError) {
      setError(confirmError.message ?? 'Betaling mislukt. Probeer opnieuw.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {requiresEmail && (
        <section className="space-y-3">
          <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[var(--foreground)]">
            E-mailadres
          </p>
          <p className="text-[12px] text-[var(--muted)]">
            {hasDigital ? 'Hierop ontvang je jouw digitale poster.' : 'Hierop ontvang je je bestellingsbevestiging.'}
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jouw@email.nl"
            required
            className="w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--foreground)] focus:outline-none"
          />
        </section>
      )}

      {requiresShipping && (
        <section className="space-y-3">
          <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[var(--foreground)]">
            Bezorgadres
          </p>
          <div className="border border-[var(--border)] bg-[var(--surface)] p-4">
            <AddressElement
              options={{
                mode: 'shipping',
                allowedCountries: ['NL'],
                defaultValues: { address: { country: 'NL' } },
                fields: { phone: 'never' },
              }}
            />
          </div>
        </section>
      )}

      {/* Discount code */}
      <section className="space-y-3">
        <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[var(--foreground)]">
          Kortingscode
        </p>

        {discount ? (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between rounded border border-[#ddd4c5] bg-[#f5f0e8] px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-[#9c8b7a]" />
              <span className="text-[12px] font-medium text-[#7a6b5d]">{discount.code}</span>
              <span className="text-[12px] text-[#9c8b7a]">−{formatMoney(discount.discountAmount)}</span>
            </div>
            <button type="button" onClick={removeDiscount} className="text-green-500 hover:text-green-700 transition-colors">
              <X className="size-3.5" />
            </button>
          </motion.div>
        ) : (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[var(--muted)]" />
              <input
                type="text"
                value={discountCode}
                onChange={(e) => { setDiscountCode(e.target.value.toUpperCase()); setDiscountError(null) }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyDiscount() } }}
                placeholder="CODE"
                className="w-full border border-[var(--border)] bg-[var(--surface)] py-3 pl-9 pr-4 text-[13px] uppercase tracking-widest text-[var(--foreground)] placeholder:text-[var(--muted)] placeholder:normal-case placeholder:tracking-normal focus:border-[var(--foreground)] focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={applyDiscount}
              disabled={!discountCode.trim() || discountLoading}
              className="border border-[var(--border)] bg-[var(--surface)] px-4 text-[11px] uppercase tracking-[0.18em] text-[var(--foreground)] transition-opacity hover:opacity-70 disabled:opacity-30"
            >
              {discountLoading ? <Loader2 className="size-3.5 animate-spin" /> : 'Toepassen'}
            </button>
          </div>
        )}

        {discountError && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[12px] text-red-500">
            {discountError}
          </motion.p>
        )}

        {discount && (
          <div className="space-y-1 border-t border-[var(--border)] pt-3">
            <div className="flex justify-between text-[12px] text-[var(--muted)]">
              <span>Subtotaal</span>
              <span>{formatMoney(originalAmount)}</span>
            </div>
            <div className="flex justify-between text-[12px] text-[#9c8b7a]">
              <span>Korting</span>
              <span>−{formatMoney(discount.discountAmount)}</span>
            </div>
            <div className="flex justify-between text-[13px] font-semibold text-[var(--foreground)]">
              <span>Totaal</span>
              <span>{formatMoney(discount.newTotal)}</span>
            </div>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[var(--foreground)]">
          Betaalmethode
        </p>
        <div className="border border-[var(--border)] bg-[var(--surface)] p-4">
          <PaymentElement
            options={{
              layout: { type: 'tabs', defaultCollapsed: false },
              paymentMethodOrder: ['ideal', 'klarna', 'card'],
              fields: {
                billingDetails: { email: 'never', phone: 'never', address: 'never' },
              },
            }}
          />
        </div>
      </section>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-600"
        >
          {error}
        </motion.p>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-[var(--foreground)] py-4 text-[11px] uppercase tracking-[0.25em] text-[var(--background)] transition-opacity hover:opacity-75 disabled:opacity-30"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="size-3.5 animate-spin" />
            Verwerken…
          </span>
        ) : (
          'Bestelling afronden'
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-[11px] text-[var(--muted)]">
        <Lock className="size-3.5" />
        <span>Beveiligd betalen met Stripe</span>
      </div>
    </form>
  )
}
