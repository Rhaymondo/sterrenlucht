import type { Format, PrintColor, FrameColor, LocationResult } from '@/types'

const CART_KEY = 'sl_cart_v2'

export interface CartItem {
  id: string
  format: Format
  printColor: PrintColor | null
  hasFrame: boolean
  frameColor: FrameColor | null
  hasGiftCard: boolean
  location: LocationResult | null
  posterLabel: string
  date: string | null
  time: string
  message: string
  giftCardText: string
  totalPrice: number
}

// Legacy alias kept for checkout pages
export type CartData = CartItem

function readItems(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(CART_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    if (Array.isArray(parsed)) return parsed as CartItem[]
    // Migrate old single-item format
    return [{ id: crypto.randomUUID(), ...(parsed as Omit<CartItem, 'id'>) }]
  } catch {
    return []
  }
}

function writeItems(items: CartItem[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export function getCartItems(): CartItem[] {
  return readItems()
}

export function addCartItem(opts: Omit<CartItem, 'id'>): CartItem {
  const item: CartItem = { id: crypto.randomUUID(), ...opts }
  writeItems([...readItems(), item])
  return item
}

export function removeCartItem(id: string): void {
  writeItems(readItems().filter((i) => i.id !== id))
}

export function clearCart(): void {
  if (typeof window !== 'undefined') localStorage.removeItem(CART_KEY)
}

// Legacy helpers used by checkout pages
export function getCart(): CartItem | null {
  return readItems()[0] ?? null
}
