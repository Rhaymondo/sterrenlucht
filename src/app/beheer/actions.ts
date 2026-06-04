'use server'

import { cookies } from 'next/headers'
import { createHash } from 'crypto'
import { Resend } from 'resend'
import Stripe from 'stripe'
import { shippingNotificationHtml } from '@/lib/email/shipping-notification'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '')

function hashPassword(pw: string) {
  return createHash('sha256').update(pw).digest('hex')
}

async function isAuthed(): Promise<boolean> {
  const store = await cookies()
  const token = store.get('sl_beheer')?.value
  const expected = hashPassword(process.env.BEHEER_PASSWORD ?? '')
  return token === expected
}

export async function login(_: unknown, formData: FormData): Promise<{ error?: string }> {
  const password = formData.get('password') as string
  const expected = hashPassword(process.env.BEHEER_PASSWORD ?? '')
  const correct  = hashPassword(password) === expected

  // Always wait 1s to slow brute force — even on success to avoid timing attacks
  await new Promise(r => setTimeout(r, 1000))

  if (!correct) {
    return { error: 'Ongeldig wachtwoord.' }
  }

  const store = await cookies()
  store.set('sl_beheer', expected, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   60 * 60 * 24 * 30, // 30 days
    path:     '/',
  })

  return {}
}

export async function sendShipping(
  _: unknown,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  if (!(await isAuthed())) return { error: 'Niet ingelogd.' }

  const email        = (formData.get('email')        as string).trim()
  const customerName = (formData.get('customerName') as string).trim()
  const trackingUrl  = (formData.get('trackingUrl')  as string).trim()
  const carrier      = (formData.get('carrier')      as string | null)?.trim() || undefined

  if (!email || !customerName || !trackingUrl) {
    return { error: 'Vul alle verplichte velden in.' }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const result = await resend.emails.send({
    from:    'Sterrenlucht <noreply@sterrenlucht.nl>',
    to:      email,
    subject: 'Je poster is onderweg!',
    html:    shippingNotificationHtml({ customerName, trackingUrl, carrier }),
  })

  if (result.error) {
    console.error('[Beheer] E-mail verzenden mislukt:', result.error)
    return { error: 'E-mail verzenden mislukt. Probeer opnieuw.' }
  }

  return { success: true }
}

export async function logout() {
  const store = await cookies()
  store.delete('sl_beheer')
}

export interface Order {
  id:            string
  amount:        number
  created:       number
  customerEmail: string | null
  customerName:  string | null
  itemCount:     number
  hasPhysical:   boolean
  items:         Array<{ f: string; l: string; d: string; t: string; p: number }>
  shipping:      { name: string | null; line1: string | null; city: string | null; postal_code: string | null } | null
}

// ── Discount codes ────────────────────────────────────────────────────────────

export interface DiscountCode {
  id:            string   // promotion code ID
  couponId:      string
  code:          string
  type:          'percentage' | 'fixed'
  value:         number   // percent_off or amount_off in cents
  active:        boolean
  timesRedeemed: number
  maxRedemptions: number | null
  expiresAt:     number | null  // unix timestamp
}

export async function getCodes(): Promise<DiscountCode[]> {
  if (!(await isAuthed())) return []

  const list = await stripe.promotionCodes.list({
    limit: 50,
    expand: ['data.coupon'],
  })

  return list.data.map(pc => {
    const coupon = pc.coupon as Stripe.Coupon
    return {
      id:             pc.id,
      couponId:       coupon.id,
      code:           pc.code,
      type:           coupon.percent_off ? 'percentage' : 'fixed',
      value:          coupon.percent_off ?? coupon.amount_off ?? 0,
      active:         pc.active,
      timesRedeemed:  coupon.times_redeemed,
      maxRedemptions: pc.max_redemptions ?? null,
      expiresAt:      pc.expires_at ?? null,
    }
  })
}

export async function createCode(
  _: unknown,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  if (!(await isAuthed())) return { error: 'Niet ingelogd.' }

  const code      = (formData.get('code') as string).trim().toUpperCase()
  const type      = formData.get('type') as string
  const value     = Number(formData.get('value'))
  const maxUses   = formData.get('maxUses') ? Number(formData.get('maxUses')) : undefined
  const expiresAt = formData.get('expiresAt') ? Math.floor(new Date(formData.get('expiresAt') as string).getTime() / 1000) : undefined

  if (!code || !value || value <= 0) return { error: 'Vul een geldige code en waarde in.' }
  if (type === 'percentage' && value > 100) return { error: 'Percentage kan niet hoger dan 100 zijn.' }

  try {
    const coupon = await stripe.coupons.create({
      ...(type === 'percentage'
        ? { percent_off: value }
        : { amount_off: Math.round(value * 100), currency: 'eur' }),
      duration:       'once',
      max_redemptions: maxUses,
      redeem_by:       expiresAt,
    })

    await stripe.promotionCodes.create({
      coupon: coupon.id,
      code,
      max_redemptions: maxUses,
      expires_at:      expiresAt,
    })

    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Aanmaken mislukt.'
    if (msg.includes('already exists')) return { error: `Code "${code}" bestaat al.` }
    return { error: msg }
  }
}

export async function toggleCode(id: string, active: boolean): Promise<void> {
  if (!(await isAuthed())) return
  await stripe.promotionCodes.update(id, { active })
}

export async function deleteCode(couponId: string): Promise<void> {
  if (!(await isAuthed())) return
  await stripe.coupons.del(couponId)
}

// ── Orders ────────────────────────────────────────────────────────────────────

export async function getOrders(): Promise<Order[]> {
  if (!(await isAuthed())) return []

  const list = await stripe.paymentIntents.list({
    limit: 25,
    expand: ['data.charges'],
  })

  return list.data
    .filter(pi => pi.status === 'succeeded')
    .map(pi => {
      const charges = (pi as unknown as Stripe.PaymentIntent & { charges: Stripe.ApiList<Stripe.Charge> }).charges
      const customerEmail = charges?.data?.[0]?.billing_details?.email ?? pi.receipt_email ?? null
      const meta = pi.metadata ?? {}

      let items: Order['items'] = []
      try { items = JSON.parse(meta.items_json ?? '[]') } catch { /* empty */ }

      const hasPhysical = items.some(i => i.f === 'printed') || meta.format === 'printed'

      return {
        id:            pi.id,
        amount:        pi.amount,
        created:       pi.created,
        customerEmail,
        customerName:  pi.shipping?.name ?? null,
        itemCount:     Number(meta.item_count ?? 1),
        hasPhysical,
        items,
        shipping:      pi.shipping
          ? { name: pi.shipping.name ?? null, line1: pi.shipping.address?.line1 ?? null, city: pi.shipping.address?.city ?? null, postal_code: pi.shipping.address?.postal_code ?? null }
          : null,
      }
    })
}
