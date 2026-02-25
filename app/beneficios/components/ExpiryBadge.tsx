export default function ExpiryBadge({ fechaFin }: { fechaFin: string | null }) {
  if (!fechaFin) return null

  const end = new Date(fechaFin)
  const now = new Date()
  const diffDays = Math.ceil(
    (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  )

  const formatted = end.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
  })

  const isUrgent = diffDays <= 7

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        isUrgent ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'
      }`}
    >
      ⏳ {isUrgent ? `¡Últimos ${diffDays} días!` : `Hasta ${formatted}`}
    </span>
  )
}
