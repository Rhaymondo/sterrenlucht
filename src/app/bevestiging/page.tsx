'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'motion/react'
import Link from 'next/link'
import { clearCart } from '@/lib/cart'
import { Check, AlertCircle } from 'lucide-react'

function BevestigingContent() {
  const params = useSearchParams()
  const redirectStatus = params.get('redirect_status')
  const succeeded = redirectStatus === 'succeeded'

  useEffect(() => {
    if (succeeded) clearCart()
  }, [succeeded])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--surface)] p-8 text-center"
    >
      {succeeded ? (
        <>
          <div className="mb-6 flex justify-center">
            <div className="flex size-14 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)]">
              <Check className="size-5 text-[var(--foreground)]" />
            </div>
          </div>

          <h1 className="text-[13px] font-medium text-[var(--foreground)]">
            Bestelling ontvangen
          </h1>

          <p className="mt-2 text-[12px] leading-6 text-[var(--muted)]">
            Bedankt voor je bestelling. We gaan direct aan de slag met jouw poster.
          </p>

          <p className="mt-1 text-[12px] leading-6 text-[var(--muted)]">
            Je ontvangt een bevestiging per e-mail.
          </p>
        </>
      ) : (
        <>
          <div className="mb-6 flex justify-center">
            <div className="flex size-14 items-center justify-center rounded-full border border-red-200 bg-red-50">
              <AlertCircle className="size-5 text-red-500" />
            </div>
          </div>

          <h1 className="text-[13px] font-medium text-[var(--foreground)]">
            Betaling niet voltooid
          </h1>

          <p className="mt-2 text-[12px] leading-6 text-[var(--muted)]">
            De betaling is nog niet afgerond of werd onderbroken.
          </p>

          <p className="mt-1 text-[12px] leading-6 text-[var(--muted)]">
            Ga terug naar je winkelwagen en probeer het opnieuw.
          </p>
        </>
      )}

      <div className="mt-8 flex items-center justify-center">
        <Link
          href={succeeded ? '/' : '/winkelwagen'}
          className="rounded-full bg-[var(--foreground)] px-8 py-4 text-[11px] uppercase tracking-[0.2em] text-[var(--background)] transition-opacity hover:opacity-75"
        >
          {succeeded ? 'Terug naar home' : 'Terug naar winkelwagen'}
        </Link>
      </div>
    </motion.div>
  )
}

export default function BevestigingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-8 py-16">
      <Suspense>
        <BevestigingContent />
      </Suspense>
    </div>
  )
}
