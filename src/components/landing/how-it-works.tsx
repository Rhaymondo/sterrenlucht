'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    n: '01',
    title: 'Kies jouw moment',
    body: 'Voer de locatie, datum en tijdstip in van het moment dat je wil vereeuwigen.',
  },
  {
    n: '02',
    title: 'Personaliseer',
    body: 'Kies formaat, kleur en lijst. Voeg een persoonlijke boodschap toe.',
  },
  {
    n: '03',
    title: 'Ontvang jouw poster',
    body: 'Wij genereren jouw unieke sterrenkaart en sturen hem rechtstreeks naar jouw deur.',
  },
]

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.from('[data-header-line]', {
      yPercent: 110,
      duration: 0.9,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '[data-header]',
        start: 'top 86%',
        toggleActions: 'play none none none',
      },
    })

    gsap.utils.toArray<HTMLElement>('[data-step-row]').forEach((row) => {
      const line    = row.querySelector<HTMLElement>('[data-step-line]')
      const content = row.querySelector<HTMLElement>('[data-step-content]')

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: row,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      })

      if (line)    tl.from(line,    { scaleX: 0, transformOrigin: 'left center', duration: 0.7, ease: 'power2.inOut' })
      if (content) tl.from(content, { opacity: 0, y: 14, duration: 0.65, ease: 'power2.out' }, '-=0.35')
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} id="hoe-het-werkt" className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-2xl">

        <div data-header className="mb-16">
          <div className="mb-3 overflow-hidden">
            <p
              data-header-line
              className="text-[10px] uppercase tracking-[0.32em] text-[var(--muted)]"
            >
              Zo werkt het
            </p>
          </div>
          <div className="overflow-hidden">
            <span
              data-header-line
              className="block text-3xl font-light sm:text-4xl"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Drie stappen naar
            </span>
          </div>
          <div className="overflow-hidden">
            <em
              data-header-line
              className="block text-3xl font-light sm:text-4xl"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              een uniek kunstwerk
            </em>
          </div>
        </div>

        <div>
          {STEPS.map((step) => (
            <div key={step.n} data-step-row className="relative py-8">
              <div
                data-step-line
                className="absolute top-0 left-0 h-px w-full"
                style={{ backgroundColor: 'var(--border)' }}
              />
              <div data-step-content className="grid grid-cols-[3.5rem_1fr] gap-4">
                <span
                  className="pt-0.5 text-xl font-light text-[var(--muted)]"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {step.n}
                </span>
                <div>
                  <h3 className="mb-1.5 text-[15px] font-medium text-[var(--foreground)]">
                    {step.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-[var(--muted)]">
                    {step.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div data-step-row className="relative h-px">
            <div
              data-step-line
              className="absolute top-0 left-0 h-px w-full"
              style={{ backgroundColor: 'var(--border)' }}
            />
          </div>
        </div>

      </div>
    </section>
  )
}
