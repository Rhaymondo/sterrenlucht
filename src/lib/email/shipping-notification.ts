import { LOGO_SVG } from './logo'

interface ShippingNotificationParams {
  customerName: string
  trackingUrl:  string
  carrier?:     string
}

export function shippingNotificationHtml(params: ShippingNotificationParams): string {
  const { customerName, trackingUrl, carrier } = params
  const firstName = customerName.split(' ')[0]
  const carrierNote = carrier ? ` via ${carrier}` : ''

  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Je poster is onderweg!</title>
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

              <p style="margin:0 0 6px;font-size:10px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#7c7974;">Verzonden</p>
              <h1 style="margin:0 0 8px;font-size:20px;font-weight:600;color:#1a1714;letter-spacing:-.01em;">Goed nieuws, ${firstName}!</h1>
              <p style="margin:0 0 32px;font-size:13px;color:#7c7974;line-height:1.6;">
                Je poster is onderweg${carrierNote}. Gebruik de knop hieronder om je pakket te volgen en de bezorging in de gaten te houden.
              </p>

              <!-- Track & trace button -->
              <a href="${trackingUrl}" target="_blank" style="display:inline-block;background-color:#1a1714;color:#f9f8f6;font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;text-decoration:none;padding:14px 28px;border-radius:8px;">
                Volg je pakket
              </a>

              <p style="margin:32px 0 0;font-size:12px;color:#7c7974;line-height:1.6;">
                Werkt de knop niet? Kopieer dan deze link:<br>
                <a href="${trackingUrl}" style="color:#1a1714;word-break:break-all;">${trackingUrl}</a>
              </p>

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
