import { Resend } from 'resend'
import { qrPngBuffer } from './beneficios-qr'

// Sends the cupón by email so a member can use it later / offline: the QR rides
// along as an attachment (saved with the message, viewable without signal), the
// human `codigo` is in the body as a fallback, and a link opens the live cupón.
//
// Best-effort by design — gated on the API key, fully wrapped in try/catch by the
// caller, and a send failure must NEVER fail the canje. Deliverability needs a
// verified Resend domain in BENEFICIOS_EMAIL_FROM; without it we skip silently.
export async function sendCuponEmail(opts: {
  to: string
  codigo: string
  merchantNombre: string
  descuento: string
  validarUrl: string
  cuponUrl: string
}): Promise<void> {
  const apiKey = process.env.BENEFICIOS_RESEND_API_KEY
  if (!apiKey || !opts.to) return

  const from = process.env.BENEFICIOS_EMAIL_FROM ?? 'Volga Beneficios <onboarding@resend.dev>'
  const resend = new Resend(apiKey)
  const png = await qrPngBuffer(opts.validarUrl)

  const html = `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:480px;margin:0 auto;color:#1a1a1a">
    <h1 style="font-size:20px;margin:0 0 4px">Tu cupón de Volga Beneficios</h1>
    <p style="margin:0 0 16px;color:#666">${opts.descuento} en <strong>${opts.merchantNombre}</strong></p>
    <div style="background:#fff;border:2px dashed #8B0000;border-radius:16px;padding:20px;text-align:center">
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:2px;color:#999;text-transform:uppercase">Código</p>
      <p style="margin:0;font-size:32px;font-weight:800;letter-spacing:6px;font-family:monospace">${opts.codigo}</p>
    </div>
    <p style="margin:16px 0 4px;font-weight:700">📲 Mostrá el QR adjunto en el local</p>
    <p style="margin:0 0 16px;color:#666;font-size:14px">El comercio lo escanea para aplicar tu beneficio. Funciona sin internet: el QR queda guardado en este correo.</p>
    <a href="${opts.cuponUrl}" style="display:inline-block;background:#8B0000;color:#fff;text-decoration:none;padding:12px 20px;border-radius:12px;font-weight:700">Ver mi cupón online</a>
  </div>`

  await resend.emails.send({
    from,
    to: opts.to,
    subject: `Tu cupón ${opts.codigo} — ${opts.merchantNombre}`,
    html,
    attachments: [{ filename: `cupon-${opts.codigo}.png`, content: png }],
  })
}
