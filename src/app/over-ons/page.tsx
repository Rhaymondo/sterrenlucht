'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { Nav } from '@/components/nav'
import { ScrollVideo } from '@/components/ui/scroll-video'

export default function OverOnsPage() {
  const heroRef = useRef<HTMLElement>(null)

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
  }, { scope: heroRef })

  return (
    <>
      <Nav />

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative flex min-h-[80dvh] flex-col items-center justify-center px-6 pb-24 pt-32 text-center"
      >
        <div className="w-full max-w-4xl">
          <h1
            className="mb-8 text-5xl font-light leading-[1.06] tracking-tight sm:text-6xl lg:text-[5.5rem]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <em data-hero-line className="block">Over ons.</em>
          </h1>

          <p data-hero-fade className="mx-auto max-w-[44ch] text-[15px] leading-relaxed text-[var(--muted)]">
            Wij zijn Kristel en Angelo en hebben samen twee dochters, Lodi en Juma. Als gezin weten we hoe waardevol herinneringen zijn, van kleine momenten thuis tot de grote gebeurtenissen die je leven vormen.
          </p>
        </div>
      </section>

      {/* Video */}
      <ScrollVideo src="/videos/over-ons.mov" minHeight="200vh" loop={false} />

      {/* Body content */}
      <section className="mx-auto max-w-2xl px-8 py-20 space-y-8">
        <p className="text-[15px] leading-relaxed text-[var(--muted)]">
          Die liefde voor herinneringen bracht ons op een idee: hoe mooi zou het zijn om een bijzonder moment vast te leggen in de sterrenlucht van dat exacte moment? Toen we dat zelf wilden doen, ontdekten we dat dit vaak lastig te vinden én kostbaar is. En dat voelde niet goed. Want zulke herinneringen zouden voor iedereen toegankelijk moeten zijn.
        </p>

        <p className="text-[15px] leading-relaxed text-[var(--muted)]">
          Daarom zijn we Sterrenlucht begonnen. Een plek waar je eenvoudig een persoonlijke sterrenluchtposter maakt van een moment dat voor jou belangrijk is. Met dezelfde aandacht voor kwaliteit als dure alternatieven, maar dan toegankelijker en persoonlijker.
        </p>

        <div>
          <p className="mb-4 text-[15px] leading-relaxed text-[var(--foreground)]">
            Wat je van ons kunt verwachten:
          </p>
          <ul className="space-y-2">
            {[
              'Een unieke sterrenluchtposter op basis van jouw locatie, datum en tijd',
              'Hoogwaardige materialen en een premium afwerking',
              'Eenvoudig samen te stellen en snel geleverd',
              'Een persoonlijk cadeau met echte betekenis',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-[var(--muted)]">
                <span className="mt-[0.4em] h-1 w-1 shrink-0 rounded-full bg-[var(--muted)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[15px] leading-relaxed text-[var(--muted)]">
          Voor jezelf, of om iemand anders te verrassen met een bijzonder gebaar.
        </p>

        <div className="pt-4">
          <a
            href="/configureer"
            className="inline-block rounded-full bg-[var(--foreground)] px-9 py-4 text-[11px] uppercase tracking-[0.2em] text-[var(--background)] transition-opacity hover:opacity-70"
          >
            Maak nu jouw poster
          </a>
        </div>
      </section>
    </>
  )
}
