'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'

gsap.registerPlugin(ScrollTrigger)

const PANELS = [
  {
    title: 'De sterren van jouw moment',
    body: 'Elke sterrenluchtposter vertelt een persoonlijk verhaal. Uniek voor jouw moment en gemaakt om nog jarenlang van te genieten.',
  },
  {
    title: 'Kies jouw stijl',
    body: 'Jouw herinnering, jouw stijl. Kies de kleur, het formaat en de afwerking die past bij het moment dat je wilt bewaren.',
  },
  {
    title: 'Voeg een persoonlijke boodschap toe',
    body: 'Soms zeggen een paar woorden alles. Voeg een naam, datum of persoonlijke boodschap toe en maak jouw sterrenluchtposter nog persoonlijker.',
  },
  {
    title: 'Premium kwaliteit',
    body: 'Een bijzondere herinnering verdient een blijvende plek. Daarom maken we elke sterrenluchtposter met zorg en hoogwaardige materialen, met een tijdloze uitstraling.',
  },
]

export function PosterSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const panels = gsap.utils.toArray<HTMLElement>('[data-poster-panel]')

    panels.forEach((panel, i) => {
      gsap.set(panel, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 24 })

      if (i === 0) return

      ScrollTrigger.create({
        trigger: panel,
        start: 'top 65%',
        end: 'bottom 35%',
        onEnter:     () => gsap.to(panel, { opacity: 1, y: 0,   duration: 0.7, ease: 'power2.out' }),
        onLeave:     () => gsap.to(panel, { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' }),
        onEnterBack: () => gsap.to(panel, { opacity: 1, y: 0,   duration: 0.7, ease: 'power2.out' }),
        onLeaveBack: () => gsap.to(panel, { opacity: 0, y: 24,  duration: 0.4, ease: 'power2.in' }),
      })
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef}>
      {/* Mobile: show image once at the top */}
      <div className="lg:hidden">
        <img
          src="/images/mockup-poster.jpg"
          alt="Sterrenlucht poster mockup"
          className="w-full object-cover aspect-[3/4]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">

        {/* Left: scrolling panels */}
        <div className="px-8 lg:pl-[max(3rem,calc((100vw-80rem)/2+3rem))] lg:pr-16">
          {PANELS.map((panel) => (
            <div
              key={panel.title}
              data-poster-panel
              className="flex lg:min-h-[100dvh] items-center py-16 lg:py-32"
            >
              <div className="max-w-sm">
                <h2
                  className="mb-5 text-3xl font-light leading-snug sm:text-4xl"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {panel.title}
                </h2>
                <p className="text-[15px] leading-relaxed text-[var(--muted)]">
                  {panel.body}
                </p>
                {panel.title === 'Premium kwaliteit' && (
                  <Link
                    href="/configureer"
                    className="mt-8 inline-block rounded-full bg-[var(--foreground)] px-7 py-4 text-[11px] uppercase tracking-[0.2em] text-[var(--background)] transition-opacity hover:opacity-70"
                  >
                    Maak jouw poster
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right: sticky poster image */}
        <div className="hidden lg:block">
          <div className="sticky top-0 h-[100dvh]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/mockup-poster.jpg"
              alt="Sterrenlucht poster mockup"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  )
}
