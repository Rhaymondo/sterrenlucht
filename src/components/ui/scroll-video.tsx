'use client'

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollVideoProps {
  src: string
  overlay?: (showOverlay: boolean) => React.ReactNode
  minHeight?: string
  loop?: boolean
}

export function ScrollVideo({ src, overlay, minHeight = '300vh', loop = true }: ScrollVideoProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const wrapRef    = useRef<HTMLDivElement>(null)
  const [showOverlay, setShowOverlay] = useState(false)

  useGSAP(() => {
    gsap.fromTo(
      wrapRef.current,
      { width: '82%', borderRadius: '36px' },
      {
        width: '100%',
        borderRadius: '0px',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'top 5%',
          scrub: 1.4,
          onLeave:      () => setShowOverlay(true),
          onEnterBack:  () => setShowOverlay(false),
        },
      },
    )
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="relative" style={{ minHeight }}>
      <div
        ref={wrapRef}
        className="relative sticky top-0 mx-auto overflow-hidden"
        style={{ width: '82%', borderRadius: '36px' }}
      >
        <video
          src={src}
          autoPlay
          muted
          loop={loop}
          playsInline
          className="block w-full object-cover"
          style={{ aspectRatio: '16 / 9' }}
        />

        {overlay && (
          <div
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000"
            style={{
              opacity: showOverlay ? 1 : 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)',
            }}
          >
            {overlay(showOverlay)}
          </div>
        )}
      </div>
    </section>
  )
}
