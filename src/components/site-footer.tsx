import Link from 'next/link'
import { SterrenluchtLogo } from '@/components/sterrenlucht-logo'

export function SiteFooter() {
  return (
    <footer>
      {/* Payment methods */}
      <div className="border-t py-10 text-center" style={{ borderColor: 'var(--border)' }}>
        <p className="mb-6 text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
          Betaal gemakkelijk met
        </p>
        <div className="flex items-center justify-center gap-4">
          {/* iDEAL */}
          <div className="flex h-[48px] w-[80px] items-center justify-center overflow-hidden rounded-xl" style={{ backgroundColor: '#fff48d' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://d1twnm33rljaon.cloudfront.net/Logos/iDEAL-Wero/iDEAL_Wero_Lockup_Yellow_Horizontal_RGB.svg"
              alt="iDEAL"
              className="h-full w-full object-contain"
            />
          </div>
          {/* Klarna */}
          <div
            className="flex h-[48px] w-[80px] items-center justify-center rounded-xl"
            style={{ backgroundColor: '#ffb3c7' }}
          >
            <span className="text-[14px] font-semibold tracking-tight" style={{ color: '#1a0a10' }}>
              Klarna.
            </span>
          </div>
          {/* Creditcard */}
          <div
            className="flex h-[48px] w-[80px] items-center justify-center gap-1 rounded-xl border"
            style={{ backgroundColor: '#f9f8f6', borderColor: 'var(--border)' }}
          >
            <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="13" height="10" rx="1.5" stroke="#7c7974"/>
              <rect x="0.5" y="2.5" width="13" height="2" fill="#7c7974"/>
            </svg>
            <span className="text-[11px] font-medium" style={{ color: '#7c7974' }}>Kaart</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t px-8 pb-12 pt-10 text-center" style={{ borderColor: 'var(--border)' }}>
        <p className="mb-2 text-[13px] text-[var(--muted)]">
          Op naar de sterren en daar voorbij!
        </p>
        <p className="mb-6 text-[11px] text-[var(--muted)]">
          KVK 92659209 ·{' '}
          Onderdeel van{' '}
          <a
            href="https://rhaymondo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            rhaymondo.com
          </a>
          {' '}·{' '}
          <Link
            href="/configureer"
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            Bestellen
          </Link>
          {' '}·{' '}
          <a
            href="https://instagram.com/sterrenlucht.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            Instagram
          </a>
        </p>
        <p className="mb-10 text-[11px] text-[var(--muted)]">
          <Link href="/policies/refund-policy" className="underline underline-offset-2 transition-opacity hover:opacity-60">
            Retourbeleid
          </Link>
          {' '}·{' '}
          <Link href="/policies/shipping-policy" className="underline underline-offset-2 transition-opacity hover:opacity-60">
            Verzendbeleid
          </Link>
          {' '}·{' '}
          <Link href="/policies/terms-of-service" className="underline underline-offset-2 transition-opacity hover:opacity-60">
            Voorwaarden
          </Link>
          {' '}·{' '}
          <Link href="/policies/privacy-policy" className="underline underline-offset-2 transition-opacity hover:opacity-60">
            Privacybeleid
          </Link>
        </p>

        <div className="flex justify-center" style={{ color: 'var(--foreground)' }}>
          <SterrenluchtLogo width={180} height={26} />
        </div>
      </div>
    </footer>
  )
}
