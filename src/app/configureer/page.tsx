import { Configurator } from '@/components/configurator'
import { CartPopover } from '@/components/cart/cart-popover'
import Link from 'next/link'
import { SterrenluchtLogo } from '@/components/sterrenlucht-logo'

export const metadata = {
  title: 'Configureer jouw poster — Sterrenlucht',
}

export default function ConfigureerPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <nav
        className="flex items-center justify-between border-b px-8 py-5"
        style={{ borderColor: 'var(--border)' }}
      >
        <Link href="/" aria-label="Sterrenlucht">
          <SterrenluchtLogo width={120} height={17} />
        </Link>
        <CartPopover />
      </nav>
      <Configurator />
    </main>
  )
}
