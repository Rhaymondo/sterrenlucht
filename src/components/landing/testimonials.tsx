'use client'

import { useRef, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const REVIEWS: { name: string; stars: number; quote: React.ReactNode }[] = [
  {
    name: 'Sophie G.',
    stars: 5,
    quote: <>Erg <em>mooie poster</em>, snel geleverd.</>,
  },
  {
    name: 'Judith v.',
    stars: 5,
    quote: <>De poster die we voor de geboorte van onze zoon hebben besteld is <em>prachtig!</em> Een mooie sterrenlicht om dit moment vastgelegd te hebben. Subtiel design waardoor het <em>mooi in huis hangt</em> — zeker een aanrader voor andere speciale momenten!</>,
  },
  {
    name: 'Yvonne N.',
    stars: 5,
    quote: <>Het is een <em>heel mooi en persoonlijk cadeau</em>. Dank jullie wel!</>,
  },
]

const AUTOPLAY_MS = 5000

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)

  useGSAP(() => {
    gsap.from('[data-carousel]', {
      opacity: 0,
      y: 20,
      filter: 'blur(8px)',
      duration: 1.0,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '[data-carousel]',
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    })

    gsap.from('[data-title-line]', {
      opacity: 0,
      y: '0.2em',
      filter: 'blur(10px)',
      duration: 1.1,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '[data-title-wrap]',
        start: 'top 86%',
        toggleActions: 'play none none none',
      },
    })
  }, { scope: sectionRef })

  // Autoplay
  useEffect(() => {
    const id = setInterval(() => {
      setDirection(1)
      setActive((prev) => (prev + 1) % REVIEWS.length)
    }, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [])

  function go(delta: number) {
    setDirection(delta)
    setActive((prev) => (prev + delta + REVIEWS.length) % REVIEWS.length)
  }

  const review = REVIEWS[active]

  return (
    <section ref={sectionRef} className="px-6 py-24 lg:px-8" style={{ backgroundColor: 'oklch(100% 0 0)' }}>
      <div className="mx-auto max-w-2xl text-center">

        {/* Title */}
        <div data-title-wrap className="mb-16">
          <p
            data-title-line
            className="text-3xl font-light leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Met <em>liefde</em> gegeven,
          </p>
          <p
            data-title-line
            className="text-3xl font-light leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            met <em>liefde</em> ontvangen.
          </p>
        </div>

        {/* Carousel */}
        <div data-carousel className="relative flex min-h-[240px] items-center justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              initial={{ opacity: 0, x: direction * 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -32 }}
              transition={{ duration: 0.45, ease: [0.25, 0, 0, 1] }}
              className="w-full"
            >
              <p
                className="mb-5 text-[13px] tracking-[0.06em]"
                style={{ color: 'var(--foreground)' }}
                aria-label={`${review.stars} sterren`}
              >
                {'★'.repeat(review.stars)}
              </p>

              <blockquote
                className="mb-6 text-[23px] leading-relaxed"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
              >
                &ldquo;{review.quote}&rdquo;
              </blockquote>

              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
                {review.name}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-10 flex items-center justify-center">
          <div className="flex gap-2">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { setDirection(i > active ? 1 : -1); setActive(i) }}
                aria-label={`Review ${i + 1}`}
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: i === active ? '1.5rem' : '0.375rem',
                  backgroundColor: i === active ? 'var(--foreground)' : 'var(--border)',
                }}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
