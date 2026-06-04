import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Playfair_Display } from 'next/font/google'
import { ConditionalFooter } from '@/components/conditional-footer'
import './globals.css'

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
  title: 'Sterrenlucht - Jouw persoonlijke sterrenkaart',
  description:
    'Vereewig het nachtelijke hemelgewelf boven jouw bijzondere moment. Op maat gemaakt, voor altijd.',
  openGraph: {
    title: 'Sterrenlucht',
    description: 'Jouw persoonlijke sterrenkaart poster',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${geist.variable} ${playfair.variable} antialiased`}>
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        {children}
        <ConditionalFooter />
      </body>
    </html>
  )
}
