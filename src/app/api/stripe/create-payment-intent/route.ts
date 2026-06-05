import { type NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import type { CartItem } from '@/lib/cart'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '')

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { items?: CartItem[] }
    const items = body.items ?? []

    if (items.length === 0) {
      return NextResponse.json({ error: 'Winkelwagen is leeg.' }, { status: 400 })
    }

    const totalPrice = items.reduce((sum, i) => sum + (i.totalPrice ?? 0), 0)

    if (totalPrice <= 0) {
      return NextResponse.json({ error: 'Ongeldig bedrag.' }, { status: 400 })
    }

    const first = items[0]
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        item_count:         String(items.length),
        format:             first.format,
        print_color:        first.printColor              ?? '',
        has_frame:          String(first.hasFrame),
        frame_color:        first.frameColor              ?? '',
        has_gift_card:      String(first.hasGiftCard),
        location_label:     first.location?.label         ?? '',
        poster_label:       first.posterLabel || (first.location?.label ?? ''),
        location_lat:       String(first.location?.lat    ?? ''),
        location_lng:       String(first.location?.lng    ?? ''),
        location_mapbox_id: first.location?.mapboxId      ?? '',
        date:               first.date                    ?? '',
        time:               first.time                    ?? '',
        message:            first.message                 ?? '',
        gift_card_text:     first.giftCardText            ?? '',
        items_json:         JSON.stringify(items.map(i => ({
          f: i.format,
          l: i.location?.label ?? '',
          d: i.date ?? '',
          t: i.time,
          p: i.totalPrice,
        }))),
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id })
  } catch (err) {
    console.error('[Stripe] create-payment-intent mislukt:', err)
    return NextResponse.json(
      { error: 'Betaalsessie aanmaken mislukt.' },
      { status: 500 },
    )
  }
}
