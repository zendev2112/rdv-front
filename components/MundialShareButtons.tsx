'use client'

import { FaWhatsapp, FaFacebook, FaXTwitter } from 'react-icons/fa6'
import type { PartidoConResultado } from '@/lib/mundial2026Api'

const SHARE_URL = 'https://www.radiodelvolga.com.ar/mundial-2026'

// Build share text from the match state (live / finished / upcoming).
function buildText(p: PartidoConResultado): string {
  const tieneResult = p.golLocal !== null && p.golVisitante !== null

  if (p.enVivo && tieneResult) {
    return `🔴 EN VIVO · ${p.local} ${p.golLocal}-${p.golVisitante} ${p.visitante}${p.minuto ? ` (${p.minuto})` : ''} · Mundial 2026`
  }
  if (p.finalizado && tieneResult) {
    return `${p.local} ${p.golLocal}-${p.golVisitante} ${p.visitante} · Mundial 2026`
  }
  return `${p.local} vs. ${p.visitante} · Mundial 2026 · ${p.hora} hs${
    p.tv.length ? ` · TV: ${p.tv.join(', ')}` : ''
  }`
}

export default function MundialShareButtons({
  p,
  compact = false,
}: {
  p: PartidoConResultado
  compact?: boolean
}) {
  const text = buildText(p)
  const icon = compact ? 'w-3.5 h-3.5' : 'w-4 h-4'

  const wa = `https://wa.me/?text=${encodeURIComponent(`${text}\n\n${SHARE_URL}`)}`
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}`
  const tw = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(SHARE_URL)}`

  return (
    <div className="flex items-center gap-2.5">
      {!compact && (
        <span className="text-[10px] text-gray-400 font-medium">Compartir:</span>
      )}
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-green-600 transition-colors"
        title="Compartir por WhatsApp"
        aria-label="Compartir por WhatsApp"
      >
        <FaWhatsapp className={icon} />
      </a>
      <a
        href={fb}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-blue-600 transition-colors"
        title="Compartir en Facebook"
        aria-label="Compartir en Facebook"
      >
        <FaFacebook className={icon} />
      </a>
      <a
        href={tw}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-gray-900 transition-colors"
        title="Compartir en X"
        aria-label="Compartir en X"
      >
        <FaXTwitter className={icon} />
      </a>
    </div>
  )
}
