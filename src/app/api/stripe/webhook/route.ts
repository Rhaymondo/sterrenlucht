import { type NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'
import { orderConfirmationHtml } from '@/lib/email/order-confirmation'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '')
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? ''
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature') ?? ''

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('[Webhook] Signature verificatie mislukt:', err)
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent

    try {
      // Expand charges to get billing email
      const expanded = await stripe.paymentIntents.retrieve(paymentIntent.id, {
        expand: ['charges'],
      })

      const charges = (expanded as unknown as Stripe.PaymentIntent & { charges: Stripe.ApiList<Stripe.Charge> }).charges
      const customerEmail =
        charges?.data?.[0]?.billing_details?.email ??
        expanded.receipt_email ??
        null


      const meta = paymentIntent.metadata
      const shipping = paymentIntent.shipping

      const payload = {
        payment_intent_id: paymentIntent.id,
        customer_email:    customerEmail,
        shipping_address:  shipping
          ? {
              name:    shipping.name,
              line1:   shipping.address?.line1,
              line2:   shipping.address?.line2,
              city:    shipping.address?.city,
              postal_code: shipping.address?.postal_code,
              country: shipping.address?.country,
            }
          : null,
        format:            meta.format,
        print_color:       meta.print_color        || null,
        has_frame:         meta.has_frame === 'true',
        frame_color:       meta.frame_color         || null,
        has_gift_card:     meta.has_gift_card === 'true',
        location_label:    meta.location_label      || null,
        location_lat:      meta.location_lat ? Number(meta.location_lat) : null,
        location_lng:      meta.location_lng ? Number(meta.location_lng) : null,
        location_mapbox_id: meta.location_mapbox_id || null,
        date:              meta.date               || null,
        time:              meta.time               || null,
        message:           meta.message            || null,
        gift_card_text:    meta.gift_card_text      || null,
      }

      const apiKey = process.env.POSTER_API_KEY
      const res = await fetch('https://api.sterrenlucht.nl/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'x-api-key': apiKey } : {}),
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        console.error('[Webhook] Poster API fout:', res.status, await res.text())
      }

      if (customerEmail) {
        let items: Array<{ f: string; l: string; d: string; t: string; p: number }> = []
        try {
          items = JSON.parse(meta.items_json ?? '[]')
        } catch {
          // Fallback to single item from metadata
          items = [{ f: meta.format, l: meta.location_label ?? '', d: meta.date ?? '', t: meta.time ?? '', p: paymentIntent.amount }]
        }

        const emailResult = await resend.emails.send({
          from: 'Sterrenlucht <noreply@sterrenlucht.nl>',
          to:   customerEmail,
          subject: 'Bevestiging van je bestelling – Sterrenlucht',
          html: orderConfirmationHtml({
            paymentIntentId: paymentIntent.id,
            customerEmail,
            items,
            amountCents: paymentIntent.amount,
            shipping: payload.shipping_address
              ? {
                  name:        payload.shipping_address.name,
                  line1:       payload.shipping_address.line1,
                  line2:       payload.shipping_address.line2,
                  city:        payload.shipping_address.city,
                  postal_code: payload.shipping_address.postal_code,
                  country:     payload.shipping_address.country,
                }
              : null,
          }),
        })

        if (emailResult.error) {
          console.error('[Webhook] E-mail verzenden mislukt:', emailResult.error)
        }
      }
    } catch (err) {
      console.error('[Webhook] Verwerking payment_intent.succeeded mislukt:', err)
    }
  }

  return NextResponse.json({ received: true })
}
