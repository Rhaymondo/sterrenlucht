import { LOGO_SVG } from './logo'

interface OrderItem {
  f: string  // format: 'digital' | 'printed'
  l: string  // location label
  d: string  // date
  t: string  // time
  p: number  // totalPrice in cents
}

interface ShippingAddress {
  name:        string | null | undefined
  line1:       string | null | undefined
  line2:       string | null | undefined
  city:        string | null | undefined
  postal_code: string | null | undefined
  country:     string | null | undefined
}

interface OrderConfirmationParams {
  paymentIntentId: string
  customerEmail:   string
  items:           OrderItem[]
  amountCents:     number
  shipping:        ShippingAddress | null
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '–'
  try {
    return new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

function formatMoney(cents: number): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(cents / 100)
}

export function orderConfirmationHtml(params: OrderConfirmationParams): string {
  const { paymentIntentId, items, amountCents, shipping } = params
  const orderRef = paymentIntentId.slice(-8).toUpperCase()
  const hasPhysical = items.some(i => i.f === 'printed')

  const itemRows = items.map(item => {
    const format = item.f === 'digital' ? 'Digitaal' : 'Gedrukt'
    const location = item.l || '–'
    const date = formatDate(item.d)
    return `
      <tr>
        <td style="padding:16px 0;border-bottom:1px solid #e5e0d8;">
          <p style="margin:0;font-size:13px;font-weight:500;color:#1a1714;letter-spacing:.01em;">${location}</p>
          <p style="margin:4px 0 0;font-size:12px;color:#7c7974;">${date} &middot; ${item.t} &middot; ${format}</p>
        </td>
        <td style="padding:16px 0;border-bottom:1px solid #e5e0d8;text-align:right;vertical-align:top;white-space:nowrap;">
          <p style="margin:0;font-size:13px;color:#1a1714;">${formatMoney(item.p)}</p>
        </td>
      </tr>`
  }).join('')

  const shippingBlock = shipping ? `
    <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e5e0d8;">
      <p style="margin:0 0 10px;font-size:10px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#7c7974;">Bezorgadres</p>
      <p style="margin:0;font-size:13px;color:#1a1714;line-height:1.7;">
        ${shipping.name ?? ''}<br>
        ${shipping.line1 ?? ''}${shipping.line2 ? ` ${shipping.line2}` : ''}<br>
        ${shipping.postal_code ?? ''} ${shipping.city ?? ''}
      </p>
    </div>` : ''

  const deliveryNote = hasPhysical
    ? 'Je poster wordt binnen 3–5 werkdagen bezorgd.'
    : 'Je digitale poster ontvang je binnen enkele minuten per e-mail.'

  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Bevestiging van je bestelling</title>
</head>
<body style="margin:0;padding:0;background-color:#f9f8f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f9f8f6;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:520px;">

          <!-- Logo -->
          <tr>
            <td style="padding-bottom:32px;">
              ${LOGO_SVG}
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border:1px solid #e5e0d8;border-radius:12px;padding:40px;">

              <p style="margin:0 0 6px;font-size:10px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#7c7974;">Bestelling ontvangen</p>
              <h1 style="margin:0 0 8px;font-size:20px;font-weight:600;color:#1a1714;letter-spacing:-.01em;">Bedankt voor je bestelling.</h1>
              <p style="margin:0 0 32px;font-size:13px;color:#7c7974;line-height:1.6;">${deliveryNote}</p>

              <!-- Items -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tbody>${itemRows}</tbody>
                <tfoot>
                  <tr>
                    <td style="padding-top:16px;">
                      <p style="margin:0;font-size:13px;font-weight:600;color:#1a1714;">Totaal</p>
                    </td>
                    <td style="padding-top:16px;text-align:right;">
                      <p style="margin:0;font-size:13px;font-weight:600;color:#1a1714;">${formatMoney(amountCents)}</p>
                    </td>
                  </tr>
                </tfoot>
              </table>

              ${shippingBlock}

              <!-- Order ref -->
              <p style="margin:32px 0 0;font-size:11px;color:#7c7974;letter-spacing:.04em;">Bestelnummer #${orderRef}</p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#7c7974;">
                Vragen? Mail naar <a href="mailto:info@sterrenlucht.nl" style="color:#1a1714;text-decoration:underline;">info@sterrenlucht.nl</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
