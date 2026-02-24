import Link from 'next/link'
import Image from 'next/image'
import { BeneficioActivo } from '../types'

interface Props {
  comercio: BeneficioActivo
}

export default function ComercioCard({ comercio }: Props) {
  return (
    <Link
      href={`/beneficios/${comercio.business_slug}`}
      className="group flex items-center gap-4 rounded-2xl border border-light-gray bg-white p-4 transition-all hover:border-primary-red/30 hover:shadow-md active:scale-[0.98]"
    >
      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-light-gray">
        {comercio.logo_url ? (
          <Image
            src={comercio.logo_url}
            alt={comercio.business_nombre}
            fill
            className="object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-2xl">
            {comercio.categoria_icono}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-dark-gray transition-colors group-hover:text-primary-red">
          {comercio.business_nombre}
        </p>
        <p className="mt-0.5 truncate text-sm text-neutral-gray">
          {comercio.titulo}
        </p>
        {comercio.direccion && (
          <p className="mt-1 flex items-center gap-1 text-xs text-neutral-gray">
            <span>📍</span>
            <span className="truncate">{comercio.direccion}</span>
          </p>
        )}
      </div>

      <span className="flex-shrink-0 text-lg text-light-gray transition-colors group-hover:text-primary-red">
        →
      </span>
    </Link>
  )
}
