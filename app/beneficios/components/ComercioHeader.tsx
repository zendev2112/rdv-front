import Image from 'next/image'
import Link from 'next/link'
import { Comercio } from '../types'

export default function ComercioHeader({ comercio }: { comercio: Comercio }) {
  return (
    <section className="bg-dark-gray px-4 pb-8 pt-6 sm:px-6">
      <div className="mx-auto max-w-2xl">
        {/* Back */}
        <Link
          href="/beneficios"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-neutral-gray transition-colors hover:text-white"
        >
          ← Volver a beneficios
        </Link>

        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10">
            {comercio.logo_url ? (
              <Image
                src={comercio.logo_url}
                alt={comercio.nombre}
                width={56}
                height={56}
                className="h-12 w-12 object-contain"
              />
            ) : (
              <span className="text-2xl font-bold text-white">
                {comercio.nombre.charAt(0)}
              </span>
            )}
          </div>

          <div className="flex-1">
            <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-neutral-gray">
              {comercio.categoria.icono && (
                <span>{comercio.categoria.icono}</span>
              )}
              {comercio.categoria.nombre}
            </span>

            <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
              {comercio.nombre}
            </h1>

            {comercio.descripcion && (
              <p className="mt-1 text-sm text-neutral-gray">
                {comercio.descripcion}
              </p>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-gray">
          {comercio.direccion && (
            <span className="flex items-center gap-1.5">
              📍 {comercio.direccion}
            </span>
          )}
          {comercio.telefono && (
            <a
              href={`tel:${comercio.telefono}`}
              className="flex items-center gap-1.5 transition-colors hover:text-white"
            >
              📞 {comercio.telefono}
            </a>
          )}
          {comercio.website && (
            <a
              href={comercio.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-white"
            >
              🌐 Sitio web
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
