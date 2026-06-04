'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'

gsap.registerPlugin(ScrollTrigger)

export function CtaSection() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.from('[data-cta-line]', {
      yPercent: 110,
      duration: 0.9,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
    })

    gsap.from('[data-cta-fade]', {
      opacity: 0,
      y: 10,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 78%',
        toggleActions: 'play none none none',
      },
    })
  }, { scope: ref })

  return (
    <section
      ref={ref}
      className="overflow-hidden px-6 py-24 text-center lg:px-8"
      style={{ backgroundColor: 'var(--surface)' }}
    >
      <div className="mx-auto max-w-lg">
        <h2 style={{ fontFamily: 'var(--font-serif)' }}>
          <div className="overflow-hidden">
            <span
              data-cta-line
              className="block text-3xl font-light leading-snug sm:text-4xl"
            >
              Klaar om jouw
            </span>
          </div>
          <div className="overflow-hidden">
            <em
              data-cta-line
              className="block text-3xl font-light leading-snug sm:text-4xl"
            >
              moment vast te leggen?
            </em>
          </div>
        </h2>

        <p data-cta-fade className="mb-10 mt-6 text-[14px] text-[var(--muted)]">
          Van herinnering naar sterrenluchtposter.<br />Persoonlijk gemaakt, speciaal voor jullie.
        </p>

        <Link
          data-cta-fade
          href="/configureer"
          className="inline-block rounded-full bg-[var(--foreground)] px-9 py-4 text-[11px] uppercase tracking-[0.2em] text-[var(--background)] transition-opacity hover:opacity-70"
        >
          Maak jouw poster
        </Link>
      </div>
    </section>
  )
}
