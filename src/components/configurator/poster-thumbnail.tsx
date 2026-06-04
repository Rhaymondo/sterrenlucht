import type { Format, PrintColor, FrameColor } from '@/types'

const BASE = 'https://sterrenlucht.nl/cdn/shop/files'

const IMAGES: Record<string, string> = {
  'taupe-none':  `${BASE}/poster-eigen-boodschap-taupe.jpg?v=1731193027&width=400`,
  'black-none':  `${BASE}/poster-eigen-boodschap-zwart.jpg?v=1731193027&width=400`,
  'white-none':  `${BASE}/poster-eigen-boodschap-wit.jpg?v=1731193027&width=400`,
  'taupe-black': `${BASE}/poster-eigen-boodschap-taupe-lijst-zwart_569bfe7e-b4ae-4b7c-b797-81255bf575a2.jpg?v=1751312887&width=400`,
  'black-black': `${BASE}/poster-eigen-boodschap-zwart-lijst-zwart_04445b6e-2b26-4e76-8b6e-03348c27fea6.jpg?v=1751313492&width=400`,
  'white-black': `${BASE}/poster-eigen-boodschap-wit-lijst-zwart_5d3a66eb-3905-47b7-9514-79a718f5493c.jpg?v=1751313521&width=400`,
  'taupe-white': `${BASE}/poster-eigen-boodschap-taupe-lijst-wit_9da6955f-224a-4b7a-990a-df08642fb269.jpg?v=1751312992&width=400`,
  'black-white': `${BASE}/poster-eigen-boodschap-zwart-lijst-wit_43e04982-7e7f-451e-96fd-f911524b932d.jpg?v=1751313504&width=400`,
  'white-white': `${BASE}/poster-eigen-boodschap-wit-lijst-wit_6e212868-122b-4d5b-bb1e-a04df75246e2.jpg?v=1751313536&width=400`,
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
