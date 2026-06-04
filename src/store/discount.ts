import { create } from 'zustand'

interface DiscountStore {
  code:           string | null
  discountAmount: number
  set: (code: string, discountAmount: number) => void
  clear: () => void
}

export const useDiscount = create<DiscountStore>((set) => ({
  code:           null,
  discountAmount: 0,
  set:   (code, discountAmount) => set({ code, discountAmount }),
  clear: ()                     => set({ code: null, discountAmount: 0 }),
}))
