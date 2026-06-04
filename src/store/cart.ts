'use client'

import { create } from 'zustand'
import {
  getCartItems,
  addCartItem,
  removeCartItem,
  clearCart as clearStorage,
  type CartItem,
} from '@/lib/cart'

interface CartStore {
  items: CartItem[]
  load: () => void
  add: (opts: Omit<CartItem, 'id'>) => CartItem
  remove: (id: string) => void
  clear: () => void
}

export const useCart = create<CartStore>()((set) => ({
  items: [],

  load() {
    set({ items: getCartItems() })
  },

  add(opts) {
    const item = addCartItem(opts)
    set((s) => ({ items: [...s.items, item] }))
    return item
  },

  remove(id) {
    removeCartItem(id)
    set((s) => ({ items: s.items.filter((i) => i.id !== id) }))
  },

  clear() {
    clearStorage()
    set({ items: [] })
  },
}))
