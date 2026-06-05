'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'motion/react'
import Link from 'next/link'
import { Nav } from '@/components/nav'
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
    >
      {/* Page heading */}
      <div className="mb-2">
        <h1
          className="text-4xl font-light italic tracking-tight text-[var(--foreground)]"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {succeeded ? 'Bestelling ontvangen' : 'Betaling mislukt'}
        </h1>
      </div>

      <div className="mt-10 max-w-lg border-t border-[var(--border)] pt-10">
        {succeeded ? (
          <>
            <div className="mb-6 flex items-center gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center border border-[var(--border)] bg-[var(--surface)]">
                <Check className="size-4 text-[var(--foreground)]" />
              </div>
              <p className="text-[13px] font-medium text-[var(--foreground)]">
                Betaling geslaagd
              </p>
            </div>

            <p className="text-[13px] leading-relaxed text-[var(--muted)]">
              Bedankt voor je bestelling. We gaan direct aan de slag met jouw poster.
              Je ontvangt een bevestiging per e-mail.
            </p>
          </>
        ) : (
          <>
            <div className="mb-6 flex items-center gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center border border-red-200 bg-red-50">
                <AlertCircle className="size-4 text-red-500" />
              </div>
              <p className="text-[13px] font-medium text-[var(--foreground)]">
                Betaling niet voltooid
              </p>
            </div>

            <p className="text-[13px] leading-relaxed text-[var(--muted)]">
              De betaling is nog niet afgerond of werd onderbroken.
              Ga terug naar je winkelwagen en probeer het opnieuw.
            </p>
          </>
        )}

        <div className="mt-10">
          <Link
            href={succeeded ? '/' : '/winkelwagen'}
            className="inline-flex items-center justify-center bg-[var(--foreground)] px-8 py-4 text-[11px] uppercase tracking-[0.2em] text-[var(--background)] transition-opacity hover:opacity-75"
          >
            {succeeded ? 'Terug naar home' : 'Terug naar winkelwagen'}
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function BevestigingPage() {
  return (
    <>
      <Nav />
      <main className="px-8 pb-24 pt-28">
        <Suspense>
          <BevestigingContent />
        </Suspense>
      </main>
    </>
  )
}
