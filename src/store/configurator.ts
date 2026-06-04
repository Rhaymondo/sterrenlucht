'use client'

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { Format, PrintColor, FrameColor, LocationResult } from '@/types'
import type { CartItem } from '@/lib/cart'

export const PRICES = {
  digital:  1000,
  printed:  1800,
  frame:    1500,
  giftCard: 295,
} as const

// ── State & Actions ───────────────────────────────────────────────────────────

interface Derived {
  totalPrice: number
  isComplete: boolean
}

interface ConfigState {
  format: Format
  printColor: PrintColor | null
  hasFrame: boolean
  frameColor: FrameColor | null
  hasGiftCard: boolean
  location: LocationResult | null
  date: string | null
  time: string
  message: string
  giftCardText: string
  editingId: string | null
  totalPrice: number
  isComplete: boolean
}

interface ConfigActions {
  setFormat: (f: Format) => void
  setPrintColor: (c: PrintColor) => void
  setHasFrame: (v: boolean) => void
  setFrameColor: (c: FrameColor) => void
  setHasGiftCard: (v: boolean) => void
  setLocation: (l: LocationResult | null) => void
  setDate: (d: string | null) => void
  setTime: (t: string) => void
  setMessage: (m: string) => void
  setGiftCardText: (t: string) => void
  loadFromCartItem: (item: CartItem) => void
  reset: () => void
}

type ConfiguratorStore = ConfigState & ConfigActions

function derive(s: Omit<ConfigState, keyof Derived>): Derived {
  let totalPrice = s.format === 'digital' ? PRICES.digital : PRICES.printed
  if (s.hasFrame) totalPrice += PRICES.frame
  if (s.hasGiftCard) totalPrice += PRICES.giftCard

  const formatComplete =
    s.format === 'digital'
      ? true
      : !!s.printColor && (!s.hasFrame || !!s.frameColor)

  const isComplete =
    formatComplete &&
    !!s.location &&
    !!s.date &&
    s.time.length >= 4 &&
    (!s.hasGiftCard || s.giftCardText.trim().length > 0)

  return { totalPrice, isComplete }
}

const defaults: Omit<ConfigState, keyof Derived> = {
  format: 'digital',
  printColor: null,
  hasFrame: false,
  frameColor: null,
  hasGiftCard: false,
  location: null,
  date: null,
  time: '20:00',
  message: '',
  giftCardText: '',
  editingId: null,
}

export const useConfigurator = create<ConfiguratorStore>()(
  immer((set) => ({
    ...defaults,
    ...derive(defaults),

    setFormat: (format) =>
      set((s) => {
        s.format = format
        if (format === 'digital') {
          s.hasFrame = false
          s.frameColor = null
        }
        Object.assign(s, derive(s))
      }),

    setPrintColor: (c) =>
      set((s) => {
        s.printColor = c
        Object.assign(s, derive(s))
      }),

    setHasFrame: (v) =>
      set((s) => {
        s.hasFrame = v
        if (!v) s.frameColor = null
        Object.assign(s, derive(s))
      }),

    setFrameColor: (c) =>
      set((s) => {
        s.frameColor = c
        Object.assign(s, derive(s))
      }),

    setHasGiftCard: (v) =>
      set((s) => {
        s.hasGiftCard = v
        if (!v) s.giftCardText = ''
        Object.assign(s, derive(s))
      }),

    setLocation: (l) =>
      set((s) => {
        s.location = l
        Object.assign(s, derive(s))
      }),

    setDate: (d) =>
      set((s) => {
        s.date = d
        Object.assign(s, derive(s))
      }),

    setTime:         (t) => set((s) => { s.time = t }),
    setMessage:      (m) => set((s) => { s.message = m }),
    setGiftCardText: (t) => set((s) => { s.giftCardText = t; Object.assign(s, derive(s)) }),

    loadFromCartItem: (item) =>
      set((s) => {
        s.format      = item.format
        s.printColor  = item.printColor
        s.hasFrame    = item.hasFrame
        s.frameColor  = item.frameColor
        s.hasGiftCard = item.hasGiftCard
        s.location    = item.location
        s.date        = item.date
        s.time        = item.time
        s.message     = item.message
        s.giftCardText = item.giftCardText
        s.editingId   = item.id
        Object.assign(s, derive(s))
      }),

    reset: () => set((s) => { Object.assign(s, defaults); Object.assign(s, derive(defaults)) }),
  }))
)
