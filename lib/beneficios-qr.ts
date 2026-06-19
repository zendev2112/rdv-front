import QRCode from 'qrcode'
import { headers } from 'next/headers'

// The merchant scans this; their phone camera opens it directly (no scanner app).
// The token is the redemption's unguessable UUID — never the short human `codigo`.
export function validarPath(redemptionId: string): string {
  return `/beneficios/comercio/validar/${redemptionId}`
}

// Canonical public origin. Used to build the cupón QR/email links so they always
// point at the real domain — never a Vercel deployment alias (rdv-*.vercel.app),
// which is what the request host would otherwise be on a preview/prod URL.
const CANONICAL = 'https://www.radiodelvolga.com.ar'

// Absolute origin for building scannable URLs from a Server Component / route
// handler. Env override wins; otherwise localhost in dev, canonical in production.
export function siteOrigin(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL
  if (env) return env.replace(/\/$/, '')
  const host = headers().get('host') ?? ''
  if (host.startsWith('localhost') || host.startsWith('127.0.0.1')) return `http://${host}`
  return CANONICAL
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
