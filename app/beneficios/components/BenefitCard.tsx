import { Benefit, Comercio } from '../types'
import ExpiryBadge from './ExpiryBadge'
import UsarBeneficioButton from './UsarBeneficioButton'
import FavoritoButton from './FavoritoButton'
import ShareButton from './ShareButton'

export default function BenefitCard({
  benefit,
  comercio,
}: {
  benefit: Benefit
  comercio: Comercio
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md">
      <div className="p-5 sm:p-6">
        {/* Title + expiry + favorite */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-dark-gray">{benefit.titulo}</h3>
          <div className="flex shrink-0 items-center gap-2">
            <ExpiryBadge fechaFin={benefit.fecha_fin} />
            <ShareButton
              path={`/beneficios/beneficio/${benefit.id}`}
              nombre={comercio.nombre}
              variant="inline"
            />
            <FavoritoButton benefitId={benefit.id} variant="inline" />
          </div>
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
      </div>
    </div>
  )
}
