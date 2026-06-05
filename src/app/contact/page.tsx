import type { Metadata } from 'next'
import { ContactContent } from './contact-content'

export const metadata: Metadata = {
  title: 'Contact — Sterrenlucht',
  description: 'Neem contact op met Sterrenlucht. We helpen je graag met vragen over jouw persoonlijke sterrenluchtposter.',
}

export default function ContactPage() {
  return <ContactContent />
}
