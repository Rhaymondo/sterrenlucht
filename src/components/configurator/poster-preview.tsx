'use client'

import { motion } from 'motion/react'
import { useConfigurator } from '@/store/configurator'

const POSTER_BG: Record<string, string> = {
  taupe: 'rgb(219 214 204)',
  white: '#ffffff',
  black: 'rgb(35 31 32)',
}

const POSTER_TEXT: Record<string, string> = {
  taupe: '#2a2520',
  white: '#1a1a1a',
  black: '#e8e4df',
}

const POSTER_MUTED: Record<string, string> = {
  taupe: 'rgba(42 37 32 / 0.5)',
  white: 'rgba(26 26 26 / 0.45)',
  black: 'rgba(232 228 223 / 0.5)',
}

const FRAME_OUTER: Record<string, string> = {
  black: '#1a1818',
  white: '#e8e6e2',
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

export function PosterPreview() {
  const { printColor, hasFrame, frameColor, posterLabel, date, time, message } = useConfigurator()

  const colorKey  = printColor ?? 'taupe'
  const bgColor   = POSTER_BG[colorKey]    ?? POSTER_BG.taupe
  const textColor = POSTER_TEXT[colorKey]  ?? POSTER_TEXT.taupe
  const mutedColor = POSTER_MUTED[colorKey] ?? POSTER_MUTED.taupe

  const frameOuter = hasFrame && frameColor ? FRAME_OUTER[frameColor] : null

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-[var(--surface)] p-8 lg:p-12">
      {/* Poster shell */}
      <div
        className="relative h-full max-h-full [overflow:clip] [container-type:inline-size]"
        style={{
          aspectRatio: '5.3/7',
          backgroundColor: bgColor,
          ...(colorKey === 'taupe' && !frameOuter ? { boxShadow: '0 0 0 20px white' } : {}),
          ...(frameOuter ? {
            boxShadow: `${frameOuter} 0px 0px 2px 1cqi inset, #ffffff 0px 0px 0px 2.5cqi inset`,
          } : {}),
        }}
      >

        {/* Star map circle */}
        <motion.div
          className="absolute overflow-hidden rounded-full"
          style={hasFrame
            ? { top: '14cqi', left: '17cqi', width: '66cqi', height: '66cqi' }
            : { top: '7cqi', left: '11cqi', width: '78cqi', height: '78cqi' }
          }
          animate={{ rotate: date ? 55 : 0 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src="/images/starmap-round.png"
            alt=""
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* Text area */}
        <div
          className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center text-center"
          style={{ top: '65%', paddingBottom: hasFrame ? '6cqi' : '5cqi', gap: '0.8cqi', color: textColor }}
        >
          {/* Message */}
          <p
            style={{
              fontFamily: 'var(--font-geist-sans)',
              fontSize: 'clamp(8px, 2.8cqi, 17px)',
              marginBottom: '2.2cqi',
              maxWidth: '80%',
              color: message ? textColor : mutedColor,
            }}
          >
            {message || 'Jouw eigen boodschap'}
          </p>

          {/* Location */}
          <p style={{
            fontSize: 'clamp(6px, 1.6cqi, 11px)',
            letterSpacing: '0.3em',
            color: posterLabel ? textColor : mutedColor,
          }}>
            {(posterLabel || 'LOCATIE').toUpperCase()}
          </p>

          {/* Date */}
          <p style={{
            fontSize: 'clamp(6px, 1.6cqi, 11px)',
            letterSpacing: '0.22em',
            color: date ? textColor : mutedColor,
          }}>
            {date ? formatDate(date) : '01.01.2024'}
          </p>

          {/* Time */}
          <p style={{
            fontSize: 'clamp(6px, 1.6cqi, 11px)',
            letterSpacing: '0.22em',
            color: date ? textColor : mutedColor,
          }}>
            {date ? time : '20:00'}
          </p>
        </div>
      </div>
    </div>
  )
}
