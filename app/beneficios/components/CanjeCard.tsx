import Image from 'next/image'
import Link from 'next/link'
import { Check, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { badgeFor, tintFor } from './cardDisplay'

export type CanjeCardData = {
  redemptionId: string
  estado: string
  titulo: string
  businessNombre: string
  categoriaNombre: string
  categoriaSlug: string
  categoriaIcono: string | null
  logoUrl: string | null
  codigo: string
  createdAt: string
}

const USED = new Set(['usado', 'validado'])

// A canje rendered with the same visual as BeneficioCard. If still pending, the
// whole card links to its cupón so the member can access/show it; if already
// used, it's marked "Usado" and not actionable.
export default function CanjeCard(p: CanjeCardData) {
  const used = USED.has(p.estado)
  const badge = badgeFor(p.titulo)
  const fecha = new Date(p.createdAt).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
  })

  const inner = (
    <>
      {/* Media */}
      <div
        className="relative aspect-[16/10] w-full overflow-hidden"
        style={{ backgroundColor: p.logoUrl ? '#ffffff' : tintFor(p.categoriaSlug) }}
      >
        {p.logoUrl ? (
          <Image
            src={p.logoUrl}
            alt={p.businessNombre}
            fill
            className={cn('object-contain p-6', used && 'opacity-60 grayscale')}
            sizes="(max-width: 768px) 78vw, (max-width: 1200px) 40vw, 25vw"
          />
        ) : (
          <div
            className={cn(
              'flex h-full items-center justify-center text-5xl',
              used && 'opacity-50 grayscale',
            )}
          >
            {p.categoriaIcono}
          </div>
        )}

        <span className="font-display absolute left-3 top-3 rounded-xl bg-brand px-3 py-1 text-base font-extrabold tabular-nums text-white shadow-sm shadow-brand/30">
          {badge}
        </span>

        {used && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-dark-gray/85 px-2.5 py-1 text-xs font-bold text-white">
            <Check size={13} /> Usado
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-0.5 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-gray">
          {p.categoriaNombre}
        </p>
        <h3 className="truncate text-[15px] font-bold text-dark-gray">
          {p.businessNombre}
        </h3>
        <p className="line-clamp-2 text-pretty text-xs leading-relaxed text-neutral-gray">
          {p.titulo}
        </p>

        <div className="mt-2 flex items-center justify-between gap-2">
          {used ? (
            <span className="text-xs text-neutral-gray">Usado · {fecha}</span>
          ) : (
            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-brand">
              Ver cupón
              <ChevronRight size={14} />
            </span>
          )}
          <span className="font-mono text-[11px] font-bold text-neutral-gray">
            {p.codigo}
          </span>
        </div>
      </div>
    </>
  )

  const cardCls = cn(
    'group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.06] transition-all',
    used ? '' : 'shadow-sm hover:-translate-y-1 hover:shadow-lg',
  )

  if (used) return <div className={cardCls}>{inner}</div>

  return (
    <Link
      href={`/beneficios/cupon/${p.redemptionId}`}
      aria-label={`Ver cupón de ${p.businessNombre}`}
      className={cardCls}
    >
      {inner}
    </Link>
  )
}
