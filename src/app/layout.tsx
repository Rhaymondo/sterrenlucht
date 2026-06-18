import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Playfair_Display } from 'next/font/google'
import { ConditionalFooter } from '@/components/conditional-footer'
import { AnnouncementBar } from '@/components/announcement-bar'
import './globals.css'

const BASE_URL = 'https://www.sterrenlucht.nl'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const playfair = Playfair_Display({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'Sterrenlucht — Jouw persoonlijke sterrenhemel poster',
  description:
    'Een gepersonaliseerde poster van de sterrenlucht zoals die schitterde tijdens jullie bijzondere moment.',
  openGraph: {
    title: 'Sterrenlucht — Jouw persoonlijke sterrenkaart poster',
    description:
      'Maak een persoonlijke sterrenkaart poster van jouw bijzondere moment. Op maat gemaakt, snel geleverd.',
    type: 'website',
    url: BASE_URL,
    images: [{ url: '/images/og-card.jpg', width: 1200, height: 630 }],
    siteName: 'Sterrenlucht',
    locale: 'nl_NL',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sterrenlucht — Jouw persoonlijke sterrenkaart poster',
    description:
      'Maak een persoonlijke sterrenkaart poster van jouw bijzondere moment.',
    images: ['/images/og-card.jpg'],
  },
  alternates: {
    canonical: BASE_URL,
    languages: { nl: BASE_URL, 'nl-NL': BASE_URL },
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Sterrenlucht',
  url: BASE_URL,
  description:
    'Persoonlijke sterrenkaart posters voor jouw bijzondere moment. Op maat gemaakt, voor altijd.',
  founders: [
    { '@type': 'Person', name: 'Kristel' },
    { '@type': 'Person', name: 'Angelo' },
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Sterrenlucht',
  url: BASE_URL,
  inLanguage: 'nl-NL',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${geist.variable} ${playfair.variable} antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        <AnnouncementBar />
        <div className="h-[112px]" />
        {children}
        <ConditionalFooter />
      </body>
    </html>
  )
}
