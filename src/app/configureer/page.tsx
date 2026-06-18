import type { Metadata } from 'next'
import { Configurator } from '@/components/configurator'
import { CartPopover } from '@/components/cart/cart-popover'
import Link from 'next/link'
import { SterrenluchtLogo } from '@/components/sterrenlucht-logo'

const BASE_URL = 'https://www.sterrenlucht.nl'

export const metadata: Metadata = {
  title: 'Configureer jouw poster — Sterrenlucht',
  description:
    'Kies jouw frame, voer locatie en datum in en ontvang een op maat gemaakte sterrenkaart poster van jouw bijzondere moment.',
  alternates: { canonical: `${BASE_URL}/configureer` },
  openGraph:  {
    title: 'Configureer jouw sterrenkaart poster — Sterrenlucht',
    description:
      'Kies jouw frame, voer locatie en datum in en ontvang een op maat gemaakte sterrenkaart poster van jouw bijzondere moment.',
    url: `${BASE_URL}/configureer`,
    images: [{ url: `${BASE_URL}/images/og-card.jpg` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Configureer jouw sterrenkaart poster — Sterrenlucht',
    description:
      'Kies jouw frame, voer locatie en datum in en ontvang een op maat gemaakte sterrenkaart poster van jouw bijzondere moment.',
    images: [`${BASE_URL}/images/og-card.jpg`],
  },
}

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Persoonlijke Sterrenlucht Poster',
  description:
    'Op maat gemaakte sterrenkaart poster van jouw bijzondere moment.',
  image: `${BASE_URL}/images/og-card.jpg`,
  brand: { '@type': 'Brand', name: 'Sterrenlucht' },
  offers: {
    '@type': 'Offer',
    price: '10.00',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    url: `${BASE_URL}/configureer`,
    seller: { '@type': 'Organization', name: 'Sterrenlucht' },
  },
}

export default function ConfigureerPage() {
  return (
    <main className="flex min-h-screen flex-col -mt-[76px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <nav
        className="flex items-center justify-between border-b px-8 py-5"
        style={{ borderColor: 'var(--border)' }}
      >
        <Link href="/" aria-label="Sterrenlucht">
          <SterrenluchtLogo width={120} height={17} />
        </Link>
        <CartPopover />
      </nav>
      <h1 className="sr-only">Maak jouw sterrenluchtposter</h1>
      <Configurator />
    </main>
  )
}
