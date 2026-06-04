'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import Link from 'next/link'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.fromTo(
      '[data-hero-line]',
      { opacity: 0, y: '0.2em', filter: 'blur(14px)' },
      { opacity: 1, y: '0em', filter: 'blur(0px)', duration: 1.8, stagger: 0.18, ease: 'power3.out' },
    )

    gsap.fromTo(
      '[data-hero-fade]',
      { opacity: 0, filter: 'blur(8px)' },
      { opacity: 1, filter: 'blur(0px)', duration: 1.4, stagger: 0.12, delay: 0.6, ease: 'power2.out' },
    )
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[80dvh] flex-col items-center justify-center px-6 pb-24 pt-32 text-center"
    >
      <div className="w-full max-w-4xl">
        <h1
          className="mb-8 text-5xl font-light leading-[1.06] tracking-tight sm:text-6xl lg:text-[5.5rem]"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          <span data-hero-line className="block">Jouw sterrenkaart poster,</span>
          <em data-hero-line className="block">een cadeau met een verhaal.</em>
        </h1>

        <p data-hero-fade className="mx-auto mb-12 max-w-[42ch] text-[15px] leading-relaxed text-[var(--muted)]">
          Vul een locatie, datum en tijd in en ontvang een gepersonaliseerde poster van de sterrenlucht zoals die schitterde tijdens jullie bijzondere moment.
        </p>

        <Link
          data-hero-fade
          href="/configureer"
          className="inline-block rounded-full bg-[var(--foreground)] px-8 py-4 text-[11px] uppercase tracking-[0.2em] text-[var(--background)] transition-opacity hover:opacity-70"
        >
          Maak jouw poster
        </Link>
      </div>
    </section>
  )
}
