import { type NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { shippingNotificationHtml } from '@/lib/email/shipping-notification'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key')
  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json() as {
    email:        string
    customerName: string
    trackingUrl:  string
    carrier?:     string
  }

  const { email, customerName, trackingUrl, carrier } = body

  if (!email || !customerName || !trackingUrl) {
    return NextResponse.json({ error: 'email, customerName en trackingUrl zijn verplicht.' }, { status: 400 })
  }

  const result = await resend.emails.send({
    from:    'Sterrenlucht <onboarding@resend.dev>',
    to:      email,
    subject: 'Je poster is onderweg!',
    html:    shippingNotificationHtml({ customerName, trackingUrl, carrier }),
  })

  if (result.error) {
    console.error('[ShippingNotification] E-mail verzenden mislukt:', result.error)
    return NextResponse.json({ error: 'E-mail verzenden mislukt.' }, { status: 500 })
  }

  return NextResponse.json({ sent: true, id: result.data?.id })
}
