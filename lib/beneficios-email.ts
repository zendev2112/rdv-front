import { Resend } from 'resend'
import { qrPngBuffer } from './beneficios-qr'

// Sends the cupón by email so a member can use it later / offline. The QR is an
// INLINE image (cid:), so it renders inside the message body — not as a separate
// downloadable file — while still being saved with the email for offline use. The
// human `codigo` is shown as a fallback and a link opens the live cupón.
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

  await resend.emails.send({
    from,
    to: opts.to,
    subject: `Tu cupón ${opts.codigo} — ${opts.merchantNombre}`,
    html: cuponEmailHtml(opts),
    // contentId makes the QR an inline image referenced as cid:qr-cupon in the
    // HTML, so it shows in the body instead of as a separate attachment file.
    attachments: [
      { filename: `cupon-${opts.codigo}.png`, content: png, contentId: 'qr-cupon' },
    ],
  })
}

// Branded, self-contained HTML for the cupón email. All styles are inline (email
// clients strip <style>), the layout is centered and card-based, and the QR is
// referenced as cid:qr-cupon so it renders inline within the body.
function cuponEmailHtml(opts: {
  codigo: string
  merchantNombre: string
  descuento: string
  cuponUrl: string
}): string {
  const brand = '#8B0000'
  return `
  <div style="margin:0;padding:0;background:#f4f4f5">
    <div style="max-width:480px;margin:0 auto;padding:24px 16px;font-family:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
      <div style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08)">

        <div style="background:${brand};padding:18px 24px;text-align:center">
          <p style="margin:0;color:#ffffff;font-size:18px;font-weight:800;letter-spacing:0.5px">Volga Beneficios</p>
        </div>

        <div style="padding:28px 24px;text-align:center">
          <p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:2px;color:#9aa">Tu cupón</p>
          <h1 style="margin:0 0 2px;font-size:24px;font-weight:800;color:#1a1a1a;line-height:1.2">${opts.descuento}</h1>
          <p style="margin:0 0 22px;font-size:15px;color:#666">en <strong style="color:${brand}">${opts.merchantNombre}</strong></p>

          <div style="display:inline-block;background:#ffffff;border:1px solid #eee;border-radius:16px;padding:14px">
            <img src="cid:qr-cupon" width="200" height="200" alt="Código QR del cupón" style="display:block;width:200px;height:200px" />
          </div>

          <div style="margin:20px auto 0;max-width:280px;background:#fff6f6;border:1px dashed ${brand};border-radius:12px;padding:12px">
            <p style="margin:0 0 2px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#b06a6a">Código</p>
            <p style="margin:0;font-size:26px;font-weight:800;letter-spacing:5px;font-family:'Courier New',monospace;color:${brand}">${opts.codigo}</p>
          </div>

          <p style="margin:22px 0 4px;font-size:14px;color:#444;line-height:1.5">
            Mostrá este QR en <strong>${opts.merchantNombre}</strong>: el comercio lo escanea y te aplica el beneficio.
          </p>
          <p style="margin:0 0 22px;font-size:12px;color:#999">Funciona sin internet — queda guardado en este correo.</p>

          <a href="${opts.cuponUrl}" style="display:inline-block;background:${brand};color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:12px;font-weight:700;font-size:15px">Ver mi cupón online</a>
          <br />
          <a href="${opts.cuponUrl}/pdf" style="display:inline-block;margin-top:12px;color:${brand};text-decoration:none;padding:10px 22px;border:1px solid ${brand};border-radius:12px;font-weight:700;font-size:14px">⬇ Descargar cupón (PDF)</a>
        </div>
      </div>

      <p style="text-align:center;margin:16px 0 0;font-size:12px;color:#aaa">Volga Beneficios · Coronel Suárez</p>
    </div>
  </div>`
}
