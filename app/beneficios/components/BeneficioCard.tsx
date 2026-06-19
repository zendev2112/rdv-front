'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BeneficioActivo } from '../types'
import { cn } from '@/lib/utils'
import { badgeFor, tintFor } from './cardDisplay'
import FavoritoButton from './FavoritoButton'
import ShareButton from './ShareButton'

interface Props {
  beneficio: BeneficioActivo
  dark?: boolean
}

export default function BeneficioCard({ beneficio, dark = false }: Props) {
  const href = `/beneficios/${beneficio.categoria_slug}/${beneficio.business_slug}`
  const badge = badgeFor(beneficio.titulo)

  return (
    <div
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-1 active:translate-y-0',
        dark
          ? 'bg-white/[0.06] ring-1 ring-white/10 hover:bg-white/[0.09]'
          : 'bg-white shadow-sm ring-1 ring-black/[0.06] hover:shadow-lg hover:shadow-black/10',
      )}
    >
      {/* Stretched link — whole card is clickable; action buttons sit above it. */}
      <Link
        href={href}
        aria-label={`Ver beneficio de ${beneficio.business_nombre}`}
        className="absolute inset-0 z-10"
      />

      {/* Action buttons */}
      <div className="absolute right-2 top-2 z-20 flex gap-1.5">
        <FavoritoButton benefitId={beneficio.benefit_id} variant="overlay" />
        <ShareButton
          path={href}
          nombre={beneficio.business_nombre}
          variant="overlay"
        />
      </div>

      {/* Media */}
      <div
        className="relative aspect-[16/10] w-full overflow-hidden"
        style={{
          backgroundColor: beneficio.logo_url
            ? dark
              ? 'rgba(255,255,255,0.04)'
              : '#ffffff'
            : tintFor(beneficio.categoria_slug),
        }}
      >
        {beneficio.logo_url ? (
          <Image
            src={beneficio.logo_url}
            alt={beneficio.business_nombre}
            fill
            className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 78vw, (max-width: 1200px) 40vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl transition-transform duration-300 group-hover:scale-110">
            {beneficio.categoria_icono}
          </div>
        )}

        {/* Discount badge — the focal point */}
        <span className="font-display absolute left-3 top-3 rounded-xl bg-brand px-3 py-1 text-base font-extrabold tabular-nums text-white shadow-sm shadow-brand/30">
          {badge}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-0.5 p-4">
        <p
          className={cn(
            'text-[11px] font-semibold uppercase tracking-wide',
            dark ? 'text-white/50' : 'text-neutral-gray',
          )}
        >
          {beneficio.categoria_nombre}
        </p>
        <h3
          className={cn(
            'truncate text-[15px] font-bold',
            dark ? 'text-white' : 'text-dark-gray',
          )}
        >
          {beneficio.business_nombre}
        </h3>
        <p
          className={cn(
            'line-clamp-2 text-pretty text-xs leading-relaxed',
            dark ? 'text-white/60' : 'text-neutral-gray',
          )}
        >
          {beneficio.titulo}
        </p>
      </div>
    </div>
  )
}
