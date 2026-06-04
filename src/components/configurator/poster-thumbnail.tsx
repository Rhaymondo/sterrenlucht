import type { Format, PrintColor, FrameColor } from '@/types'

const IMAGES: Record<string, string> = {
  'taupe-none':  '/images/posters/taupe.webp',
  'black-none':  '/images/posters/black.jpg',
  'white-none':  '/images/posters/white.jpg',
  'taupe-black': '/images/posters/taupe-frame-black.jpg',
  'black-black': '/images/posters/black-frame-black.jpg',
  'white-black': '/images/posters/white-frame-black.jpg',
  'taupe-white': '/images/posters/taupe-frame-white.jpg',
  'black-white': '/images/posters/black-frame-white.jpg',
  'white-white': '/images/posters/white-frame-white.jpg',
}

interface PosterThumbnailProps {
  format: Format
  printColor: PrintColor | null
  hasFrame: boolean
  frameColor: FrameColor | null
  className?: string
}

export function PosterThumbnail({ format, printColor, hasFrame, frameColor, className }: PosterThumbnailProps) {
  const colorKey = format === 'digital' ? 'taupe' : (printColor ?? 'taupe')
  const frameKey = hasFrame && frameColor ? frameColor : 'none'
  const src = IMAGES[`${colorKey}-${frameKey}`]

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Poster preview"
      className={className}
    />
  )
}
