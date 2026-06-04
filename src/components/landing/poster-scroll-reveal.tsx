'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'

gsap.registerPlugin(ScrollTrigger)

function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

const r4 = (n: number) => Math.round(n * 10000) / 10000

const DOTS = Array.from({ length: 24 }, (_, i) => ({
  depth:   ((i % 5) * 0.18 + 0.2).toFixed(2),
  width:   r4(seededRand(i * 5 + 0) * 2 + 0.8),
  height:  r4(seededRand(i * 5 + 1) * 2 + 0.8),
  left:    r4(5 + seededRand(i * 5 + 2) * 90),
  top:     r4(5 + seededRand(i * 5 + 3) * 90),
  opacity: r4(seededRand(i * 5 + 4) * 0.5 + 0.2),
}))

export function PosterScrollReveal() {
  const sectionRef = useRef<HTMLElement>(null)
  const posterRef  = useRef<HTMLDivElement>(null)
  const captionRef = useRef<HTMLDivElement>(null)
  const glowRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=260%',
        pin: true,
        pinSpacing: true,
      })

      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=160%',
          scrub: 1.5,
        },
      }).fromTo(
        posterRef.current,
        { scale: 0.22, opacity: 0, rotateY: 28, z: -700 },
        { scale: 1,    opacity: 1, rotateY: 0,  z: 0,    ease: 'power2.out' },
      )

      gsap.fromTo(
        glowRef.current,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: '+=60%',
            end: '+=160%',
            scrub: true,
          },
        },
      )

      gsap.fromTo(
        captionRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: '+=120%',
            end: '+=200%',
            scrub: true,
          },
        },
      )

      sectionRef.current?.querySelectorAll<HTMLElement>('[data-depth]').forEach((el) => {
        const depth = parseFloat(el.dataset.depth ?? '0.5')
        gsap.to(el, {
          y: () => -100 * depth,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=260%',
            scrub: 0.5 + depth * 0.6,
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden"
      style={{ perspective: '1400px', backgroundColor: 'oklch(8% 0.018 255)' }}
    >
      {/* Parallax star dots */}
      {DOTS.map((dot, i) => (
        <span
          key={i}
          data-depth={dot.depth}
          className="pointer-events-none absolute rounded-full bg-white/60"
          style={{
            width:   `${dot.width}px`,
            height:  `${dot.height}px`,
            left:    `${dot.left}%`,
            top:     `${dot.top}%`,
            opacity: dot.opacity,
          }}
        />
      ))}

      {/* Ambient glow */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute h-[600px] w-[440px] rounded-full opacity-0"
        style={{
          background: 'radial-gradient(ellipse, oklch(85% 0.004 80 / 18%) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Poster card */}
      <motion.div
        ref={posterRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="relative aspect-[3/4] w-64 overflow-hidden sm:w-80"
          style={{
            borderRadius: '8px',
            boxShadow: '0 0 80px oklch(85% 0.004 80 / 20%), 0 40px 80px oklch(0% 0 0 / 70%)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/posters/taupe.webp"
            alt="Sterrenlucht sterrenkaart poster"
            className="h-full w-full object-cover"
          />
        </div>
      </motion.div>

      {/* Caption */}
      <div ref={captionRef} className="absolute bottom-14 z-10 text-center opacity-0">
        <p
          className="mb-4 text-[11px] uppercase tracking-[0.28em]"
          style={{ color: 'oklch(70% 0.008 78)' }}
        >
          Jouw moment. Voor altijd vastgelegd.
        </p>
        <Link
          href="/configureer"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm transition-opacity hover:opacity-70"
          style={{
            border: '1px solid oklch(30% 0.015 255)',
            backgroundColor: 'oklch(12% 0.018 255 / 80%)',
            color: 'oklch(90% 0.005 78)',
            backdropFilter: 'blur(8px)',
          }}
        >
          Maak jouw poster
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </section>
  )
}
