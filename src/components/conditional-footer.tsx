'use client'

import { usePathname } from 'next/navigation'
import { SiteFooter } from './site-footer'

export function ConditionalFooter() {
  const pathname = usePathname()
  if (pathname.startsWith('/beheer')) return null
  return <SiteFooter />
}
