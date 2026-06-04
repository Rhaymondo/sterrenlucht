'use client'

import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  r: number
  opacity: number
  twinkleSpeed: number
  twinklePhase: number
  depth: number
}

export function StarBackground({ count = 280 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let stars: Star[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.6 + 0.2,
        opacity: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        depth: Math.random(),
      }))
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const s of stars) {
        const flicker = Math.sin(t * s.twinkleSpeed * 60 + s.twinklePhase) * 0.3 + 0.7
        const alpha = s.opacity * flicker

        // Glow for brighter stars
        if (s.r > 1.1) {
          const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3.5)
          grd.addColorStop(0, `rgba(230, 220, 255, ${alpha * 0.35})`)
          grd.addColorStop(1, 'transparent')
          ctx.fillStyle = grd
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r * 3.5, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(240, 235, 255, ${alpha})`
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
    />
  )
}
