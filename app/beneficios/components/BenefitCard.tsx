'use client'

import { useState } from 'react'
import { Benefit, Comercio } from '../types'
import ExpiryBadge from './ExpiryBadge'
import SolicitarModal from './SolicitarModal'

export default function BenefitCard({
  benefit,
  comercio,
}: {
  benefit: Benefit
  comercio: Comercio
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md">
        <div className="p-5 sm:p-6">
          {/* Title + expiry */}
          <div className="mb-3 flex items-start justify-between gap-3">
            <h3 className="text-lg font-bold text-dark-gray">
              {benefit.titulo}
            </h3>
            <ExpiryBadge fechaFin={benefit.fecha_fin} />
          </div>

          {benefit.descripcion && (
            <p className="mb-3 text-sm leading-relaxed text-neutral-gray">
              {benefit.descripcion}
            </p>
          )}

          {benefit.condiciones && (
            <div className="mb-4 rounded-xl bg-cream px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-gray">
                Condiciones
              </p>
              <p className="mt-1 text-sm text-dark-gray">
                {benefit.condiciones}
              </p>
            </div>
          )}

          {/* Limit badge */}
          {benefit.limite_tipo !== 'ilimitado' && benefit.limite_cantidad && (
            <p className="mb-4 text-xs text-neutral-gray">
              ⚡ Límite: {benefit.limite_cantidad}{' '}
              {benefit.limite_tipo === 'por_dia' && 'por día'}
              {benefit.limite_tipo === 'por_semana' && 'por semana'}
              {benefit.limite_tipo === 'por_mes' && 'por mes'}
              {benefit.limite_tipo === 'total' && 'en total'}
            </p>
          )}

          <button
            onClick={() => setOpen(true)}
            className="w-full rounded-xl bg-primary-red px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-primary-red/20 transition-all hover:bg-primary-red/90 hover:shadow-lg hover:shadow-primary-red/30 active:scale-[0.98]"
          >
            Quiero este beneficio
          </button>
        </div>
      </div>

      {open && (
        <SolicitarModal
          benefit={benefit}
          comercio={comercio}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
