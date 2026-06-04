'use client'

import { useState, useCallback } from 'react'
import { Typewriter } from '@/components/ui/typewriter'
import { ScrollVideo } from '@/components/ui/scroll-video'

const PHRASES = [
  { normal: 'Voor momenten die je ',      italic: 'nooit wilt vergeten'      },
  { normal: 'Toen jullie ',               italic: 'elkaar ontmoetten'         },
  { normal: 'De ',                        italic: 'eerste kus'                },
  { normal: 'De ',                        italic: 'trouwdag'                  },
  { normal: 'De geboorte van ',           italic: 'jullie kindje'             },
  { normal: 'Het ',                       italic: 'eerste huis'               },
  { normal: 'Een bijzonder ',             italic: 'jubileum'                  },
  { normal: 'Een herinnering ',           italic: 'om te koesteren'           },
]

export function VideoSection() {
  const [sequenceDone, setSequenceDone] = useState(false)

  const handleSequenceComplete = useCallback(() => setSequenceDone(true), [])

  return (
    <ScrollVideo
      src="/videos/hero-video.mp4"
      overlay={(showOverlay) => (
        <>
          <div className="px-6 text-center">
            <h2
              className="text-4xl font-light leading-[1.06] tracking-tight text-white md:text-5xl lg:text-6xl"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {showOverlay && (
                <Typewriter
                  words={PHRASES}
                  speed={65}
                  delayBetweenWords={2200}
                  cursor
                  cursorChar="|"
                  onComplete={handleSequenceComplete}
                />
              )}
            </h2>
          </div>

          {sequenceDone && (
            <p className="absolute bottom-8 animate-pulse text-xs uppercase tracking-[0.22em] text-white/40">
              Scroll om verder te gaan
            </p>
          )}
        </>
      )}
    />
  )
}
