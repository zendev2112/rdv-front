import Link from 'next/link'
import Image from 'next/image'
import { Comercio } from '../types'

interface Props {
  comercio: Comercio
}

export default function ComercioHeader({ comercio }: Props) {
  return (
    <div className="bg-dark-gray">
      <div className="px-4 pt-4">
        <Link
          href="/beneficios"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-gray transition-colors hover:text-white"
        >
          ← Volver a beneficios
        </Link>
      </div>

      <div className="px-4 pb-8 pt-4">
        <div className="flex items-start gap-4">
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-white/10 bg-white/5">
            {comercio.logo_url ? (
              <Image
                src={comercio.logo_url}
                alt={comercio.nombre}
                fill
                className="object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-4xl">
                {comercio.categoria.icono}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-primary-red/10 px-2.5 py-0.5 text-xs font-medium text-primary-red">
              {comercio.categoria.icono} {comercio.categoria.nombre}
            </span>
            <h1 className="text-xl font-extrabold leading-tight text-white">
              {comercio.nombre}
            </h1>
            {comercio.descripcion && (
              <p className="mt-1 text-sm leading-relaxed text-neutral-gray">
                {comercio.descripcion}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {comercio.direccion && (
            <MetaPill icon="📍" text={comercio.direccion} />
          )}
          {comercio.telefono && <MetaPill icon="📞" text={comercio.telefono} />}
          {comercio.website && (
            <a
              href={comercio.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs text-neutral-gray transition-colors hover:text-white"
            >
              🌐 <span>Sitio web</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function MetaPill({ icon, text }: { icon: string; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs text-neutral-gray">
      {icon} {text}
    </span>
  )
}
