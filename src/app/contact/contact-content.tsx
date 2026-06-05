'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import Link from 'next/link'
import { Nav } from '@/components/nav'

export function ContactContent() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.fromTo(
      '[data-contact-line]',
      { opacity: 0, y: '0.2em', filter: 'blur(12px)' },
      { opacity: 1, y: '0em', filter: 'blur(0px)', duration: 1.6, stagger: 0.14, ease: 'power3.out' },
    )
    gsap.fromTo(
      '[data-contact-fade]',
      { opacity: 0, filter: 'blur(6px)' },
      { opacity: 1, filter: 'blur(0px)', duration: 1.2, stagger: 0.1, delay: 0.5, ease: 'power2.out' },
    )
  }, { scope: sectionRef })

  return (
    <>
      <Nav />
      <section
        ref={sectionRef}
        className="relative flex min-h-[85dvh] flex-col items-center justify-center px-6 pb-24 pt-32 text-center"
      >
        <div className="w-full max-w-3xl">
          <h1
            className="mb-8 text-5xl font-light leading-[1.06] tracking-tight sm:text-6xl lg:text-[5.5rem]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            <em data-contact-line className="block">Contact.</em>
          </h1>

          <p
            data-contact-fade
            className="mx-auto mb-16 max-w-[42ch] text-[15px] leading-relaxed text-[var(--muted)]"
          >
            Heb je een vraag over je bestelling of jouw poster? We helpen je graag en reageren zo snel mogelijk.
          </p>

          {/* Contact pair */}
          <div
            data-contact-fade
            className="mx-auto mb-14 flex items-stretch justify-center border-y border-[var(--border)]"
          >
            <div className="px-10 py-8 text-left">
              <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                E-mail
              </p>
              <a
                href="mailto:angelo@sterrenlucht.nl"
                className="text-[15px] text-[var(--foreground)] underline underline-offset-4 transition-opacity hover:opacity-55"
              >
                angelo@sterrenlucht.nl
              </a>
            </div>

            <div className="w-px bg-[var(--border)]" />

            <div className="px-10 py-8 text-left">
              <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                Instagram
              </p>
              <a
                href="https://instagram.com/sterrenlucht.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] text-[var(--foreground)] underline underline-offset-4 transition-opacity hover:opacity-55"
              >
                @sterrenlucht.nl
              </a>
            </div>
          </div>

          <div data-contact-fade>
            <Link
              href="/configureer"
              className="inline-flex items-center justify-center bg-[var(--foreground)] px-8 py-4 text-[11px] uppercase tracking-[0.2em] text-[var(--background)] transition-opacity hover:opacity-75"
            >
              Maak jouw poster
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
