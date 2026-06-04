import { type NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '')

export async function POST(req: NextRequest) {
  try {
    const { code, paymentIntentId, originalAmount } = await req.json() as {
      code:             string
      paymentIntentId:  string
      originalAmount:   number
    }

    if (!code || !paymentIntentId || !originalAmount) {
      return NextResponse.json({ valid: false, error: 'Ongeldige aanvraag.' }, { status: 400 })
    }

    const list = await stripe.promotionCodes.list({
      code:   code.toUpperCase(),
      active: true,
      limit:  1,
      expand: ['data.coupon'],
    })

    const invalid = { valid: false, error: 'Kortingscode is niet geldig.' }

    const promoCode = list.data[0]
    if (!promoCode) return NextResponse.json(invalid)

    const coupon = promoCode.coupon as Stripe.Coupon

    // Check expiry and usage limit — same generic error to prevent enumeration
    if (coupon.redeem_by && coupon.redeem_by < Math.floor(Date.now() / 1000)) {
      return NextResponse.json(invalid)
    }
    if (coupon.max_redemptions != null && coupon.times_redeemed >= coupon.max_redemptions) {
      return NextResponse.json(invalid)
    }

    // Calculate discount
    let discountAmount: number
    if (coupon.percent_off) {
      discountAmount = Math.round(originalAmount * (coupon.percent_off / 100))
    } else if (coupon.amount_off) {
      discountAmount = coupon.amount_off
    } else {
      return NextResponse.json(invalid)
    }

    const newTotal = Math.max(50, originalAmount - discountAmount) // Stripe minimum €0.50

    await stripe.paymentIntents.update(paymentIntentId, {
      amount: newTotal,
      metadata: {
        discount_code:   code.toUpperCase(),
        discount_amount: String(discountAmount),
      },
    })

    return NextResponse.json({
      valid:          true,
      discountType:   coupon.percent_off ? 'percentage' : 'fixed',
      discountValue:  coupon.percent_off ?? coupon.amount_off,
      discountAmount,
      newTotal,
    })
  } catch (err) {
    console.error('[Discount] Validatie mislukt:', err)
    return NextResponse.json({ valid: false, error: 'Validatie mislukt. Probeer opnieuw.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { paymentIntentId, originalAmount } = await req.json() as {
      paymentIntentId: string
      originalAmount:  number
    }

    await stripe.paymentIntents.update(paymentIntentId, {
      amount: originalAmount,
      metadata: { discount_code: '', discount_amount: '' },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Discount] Verwijderen mislukt:', err)
    return NextResponse.json({ error: 'Verwijderen mislukt.' }, { status: 500 })
  }
}
