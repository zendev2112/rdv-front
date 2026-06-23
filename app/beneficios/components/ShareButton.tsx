'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

// WhatsApp share for a comercio/benefit. Opens wa.me with a prefilled message +
// the public detail URL. Falls back to the native share sheet when available
// (mobile), and to clipboard if neither opens.
//   variant="header"  — pill on the dark ComercioHeader
//   variant="overlay" — small floating button over a card image
//   variant="inline"  — sits beside the favorite on a white benefit card
export default function ShareButton({
  path,
  nombre,
  variant = 'header',
}: {
  path: string
  nombre: string
  variant?: 'header' | 'overlay' | 'inline'
}) {
  const [copied, setCopied] = useState(false)

  async function share(e: React.MouseEvent) {
    e.stopPropagation()
    const url = window.location.origin + path
    const text = `¡Mirá este beneficio de ${nombre} en Volga Beneficios! ${url}`

    // Native share sheet (mobile) — user can pick WhatsApp from there.
    if (navigator.share) {
      try {
        await navigator.share({ title: nombre, text, url })
        return
      } catch {
        return // user dismissed
      }
    }

    // Desktop: open WhatsApp Web/Desktop directly.
    const wa = `https://wa.me/?text=${encodeURIComponent(text)}`
    const win = window.open(wa, '_blank', 'noopener,noreferrer')
    if (!win) {
      // popup blocked — copy the link as a last resort
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      } catch {
        /* no-op */
      }
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      aria-label={`Compartir ${nombre} por WhatsApp`}
      title="Compartir"
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full transition-colors',
        variant === 'header' &&
          'size-10 bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/20',
        variant === 'overlay' &&
          'size-8 bg-white/90 text-neutral-gray shadow-sm ring-1 ring-black/5 backdrop-blur-sm hover:bg-white',
        variant === 'inline' &&
          'size-9 bg-cream text-neutral-gray ring-1 ring-black/5 hover:bg-gray-100',
      )}
    >
      {copied ? (
        <Check size={variant === 'header' ? 20 : 16} className="text-brand" />
      ) : (
        <Share2 size={variant === 'header' ? 20 : 16} />
      )}
    </button>
  )
}
