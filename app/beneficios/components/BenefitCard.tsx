import Link from 'next/link'
import { Benefit, Comercio } from '../types'
import ExpiryBadge from './ExpiryBadge'
import UsarBeneficioButton from './UsarBeneficioButton'

// Benefit detail card. The two prototype CTAs: primary "Usar beneficio ahora"
// (records a canje, → cupón) and a ghost "Ya compré · cargar con foto" that
// routes to the retroactivo flow (lands fully in Phase 2). The legacy lead-gen
// SolicitarModal stays in the tree but is no longer the primary path (SPEC C-2).
export default function BenefitCard({
  benefit,
}: {
  benefit: Benefit
  comercio: Comercio
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md">
      <div className="p-5 sm:p-6">
        {/* Title + expiry */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-dark-gray">{benefit.titulo}</h3>
          <ExpiryBadge fechaFin={benefit.fecha_fin} />
        </div>

        {benefit.descripcion && (
          <p className="mb-3 text-sm leading-relaxed text-neutral-gray">{benefit.descripcion}</p>
        )}

        {benefit.condiciones && (
          <div className="mb-4 rounded-xl bg-cream px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-gray">
              Condiciones
            </p>
            <p className="mt-1 text-sm text-dark-gray">{benefit.condiciones}</p>
          </div>
        )}

        {/* How to use — "mostrá la pantalla" */}
        <div className="mb-4 rounded-xl bg-cream px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-gray">
            Cómo se usa
          </p>
          <p className="mt-1 text-sm text-dark-gray">
            Tocá «Usar beneficio» y mostrá la pantalla en la caja. Con que estés ahí, te lo
            cumplimos. No hace falta cupón ni código impreso.
          </p>
        </div>

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

        <UsarBeneficioButton benefitId={benefit.id} />

        <Link
          href="/beneficios/reclamar"
          className="mt-2 block w-full rounded-xl border border-neutral-gray/30 bg-white px-4 py-3 text-center text-sm font-bold text-dark-gray transition-colors hover:bg-cream"
        >
          Ya compré · cargar después con foto
        </Link>
      </div>
    </div>
  )
}
