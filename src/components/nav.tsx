'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'motion/react'
import { SterrenluchtLogo } from '@/components/sterrenlucht-logo'
import { CartPopover } from '@/components/cart/cart-popover'

export function Nav() {
  const { scrollY } = useScroll()
  const bgOpacity     = useTransform(scrollY, [0, 64], [0, 0.94])
  const borderOpacity = useTransform(scrollY, [0, 64], [0, 1])

  return (
    <motion.header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        className="absolute inset-0 backdrop-blur-sm"
        style={{
          opacity: bgOpacity,
          backgroundColor: 'oklch(99% 0.003 80)',
        }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ opacity: borderOpacity, backgroundColor: 'var(--border)' }}
      />
      <div className="relative flex items-center justify-between px-8 py-5">
        <Link href="/" aria-label="Sterrenlucht">
          <SterrenluchtLogo width={120} height={17} />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/over-ons"
            className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
          >
            Over ons
          </Link>
          <Link
            href="/configureer"
            className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
          >
            Bestellen
          </Link>
          <CartPopover />
        </div>
      </div>
    </motion.header>
  )
}
