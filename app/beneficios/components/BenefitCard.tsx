'use client'

import { useState } from 'react'
import { Benefit, Comercio } from '../types'
import SolicitarForm from './SolicitarForm'

interface Props {
  benefit: Benefit
  comercio: Comercio
}

function formatLimite(tipo: string, cantidad: number | null): string {
  if (tipo === 'ilimitado') return 'Sin límite de uso'
  const map: Record<string, string> = {
    por_dia: 'por día',
    por_semana: 'por semana',
    por_mes: 'por mes',
    total: 'en total',
  }
  return `${cantidad ?? 1} vez ${map[tipo] ?? tipo}`
}

function formatFechaFin(fecha: string | null): string | null {
  if (!fecha) return null
  return new Date(fecha).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function BenefitCard({ benefit, comercio }: Props) {
  const [open, setOpen] = useState(false)

  const fechaFin = formatFechaFin(benefit.fecha_fin)
  const limiteText = formatLimite(benefit.limite_tipo, benefit.limite_cantidad)

  return (
    <div className="overflow-hidden rounded-2xl border border-light-gray bg-white shadow-sm">
      <div className="h-1 bg-primary-red" />

      <div className="p-5">
        <h3 className="font-bold text-dark-gray">{benefit.titulo}</h3>

        {benefit.descripcion && (
          <p className="mt-2 text-sm leading-relaxed text-neutral-gray">
            {benefit.descripcion}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          <Tag icon="🔁" text={limiteText} />
          {fechaFin && <Tag icon="📅" text={`Hasta el ${fechaFin}`} />}
        </div>

        {benefit.condiciones && (
          <p className="mt-3 rounded-lg bg-cream px-3 py-2 text-xs leading-relaxed text-neutral-gray">
            ℹ️ {benefit.condiciones}
          </p>
        )}

        {!open ? (
          <button
            onClick={() => setOpen(true)}
            className="mt-4 w-full rounded-xl bg-primary-red px-4 py-3 text-sm font-bold text-white transition-all hover:bg-red-600 active:scale-[0.98]"
          >
            Quiero este beneficio →
          </button>
        ) : (
          <div className="mt-4 rounded-xl border border-light-gray bg-cream p-4">
            <p className="mb-3 text-sm font-semibold text-dark-gray">
              Completá tus datos para recibir el beneficio por WhatsApp
            </p>
            <SolicitarForm
              benefitId={benefit.id}
              businessId={comercio.id}
              onCancel={() => setOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function Tag({ icon, text }: { icon: string; text: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-light-gray px-2.5 py-1 text-xs text-neutral-gray">
      {icon} {text}
    </span>
  )
}
