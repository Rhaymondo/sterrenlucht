export type Format = 'digital' | 'printed'
export type PrintColor = 'black' | 'taupe' | 'white'
export type FrameColor = 'black' | 'white'

export interface LocationResult {
  label: string
  lat: number
  lng: number
  mapboxId: string
}

export interface PosterPayload {
  order_id: string
  customer_email: string
  location: { label: string; lat: number; lng: number }
  date: string
  time: string
  message: string
  gift_card_text: string | null
  format: Format
  print_color: PrintColor | null
  has_frame: boolean
  frame_color: FrameColor | null
  shipping: {
    first_name: string
    last_name: string
    address_1: string
    city: string
    postal_code: string
    country: string
  } | null
}
