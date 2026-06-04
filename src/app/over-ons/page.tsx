import type { Metadata } from 'next'
import { OverOnsContent } from './over-ons-content'

export const metadata: Metadata = {
  title: 'Over ons — Het verhaal achter Sterrenlucht',
  description:
    'Kristel en Angelo maken persoonlijke sterrenlucht posters van jouw mooiste momenten. Lees ons verhaal en ontdek onze passie voor herinneringen.',
  alternates: { canonical: 'https://www.sterrenlucht.nl/over-ons' },
  openGraph: {
    title: 'Over ons — Het verhaal achter Sterrenlucht',
    description:
      'Kristel en Angelo maken persoonlijke sterrenlucht posters van jouw mooiste momenten. Lees ons verhaal en ontdek onze passie voor herinneringen.',
    url: 'https://www.sterrenlucht.nl/over-ons',
    images: [{ url: 'https://www.sterrenlucht.nl/images/og-card.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Over ons — Het verhaal achter Sterrenlucht',
    description:
      'Kristel en Angelo maken persoonlijke sterrenlucht posters van jouw mooiste momenten.',
    images: ['https://www.sterrenlucht.nl/images/og-card.jpg'],
  },
}

export default function OverOnsPage() {
  return <OverOnsContent />
}
