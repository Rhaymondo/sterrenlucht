import Link from 'next/link'
import { Nav } from '@/components/nav'
import { CheckoutInitialiser } from './checkout-initialiser'
import { OrderSummary } from './order-summary'

export const metadata = { title: 'Afrekenen — Sterrenlucht' }

export default function AfrekenPage() {
  return (
    <>
      <Nav />
      <main className="px-8 pb-24 pt-28">

        {/* Heading */}
        <div className="mb-2">
          <h1
            className="text-4xl font-light italic tracking-tight text-[var(--foreground)]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Afrekenen
          </h1>
        </div>
        <Link
          href="/winkelwagen"
          className="text-[12px] text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
        >
          ← Winkelwagen
        </Link>

        {/* Two-column layout */}
        <div className="mt-10 grid grid-cols-1 gap-16 lg:grid-cols-[1fr_400px]">

          {/* Left — payment form */}
          <div>
            <CheckoutInitialiser />
          </div>

          {/* Right — order summary */}
          <div>
            <div className="sticky top-28">
              <OrderSummary />
            </div>
          </div>

        </div>
      </main>
    </>
  )
}
