import QRCode from 'qrcode'
import { headers } from 'next/headers'

// The merchant scans this; their phone camera opens it directly (no scanner app).
// The token is the redemption's unguessable UUID — never the short human `codigo`.
export function validarPath(redemptionId: string): string {
  return `/beneficios/comercio/validar/${redemptionId}`
}

// Best-effort absolute origin for building scannable URLs from a Server Component
// or route handler. Prefers an explicit env, else derives from the request host.
export function siteOrigin(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL
  if (env) return env.replace(/\/$/, '')
  const h = headers()
  const host = h.get('host') ?? 'localhost:3000'
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
  return `${proto}://${host}`
}

export function validarUrl(redemptionId: string): string {
  return `${siteOrigin()}${validarPath(redemptionId)}`
}

// PNG data URL for inline <img> (cupón screen). Plain <img>, not next/image — the
// project uses a custom Cloudinary image loader that would mangle a data URI.
export function qrDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, { margin: 1, width: 320, errorCorrectionLevel: 'M' })
}

// PNG buffer for email attachments (saved with the message → works offline).
export function qrPngBuffer(text: string): Promise<Buffer> {
  return QRCode.toBuffer(text, { margin: 1, width: 480, errorCorrectionLevel: 'M' })
}
