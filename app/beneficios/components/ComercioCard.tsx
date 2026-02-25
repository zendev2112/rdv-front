import Link from 'next/link'
import Image from 'next/image'

interface Props {
  slug: string
  nombre: string
  descripcion: string | null
  logo_url: string | null
  categoria_nombre: string
  categoria_icono: string | null
  benefitCount: number
}

export default function ComercioCard({
  slug,
  nombre,
  descripcion,
  logo_url,
  categoria_nombre,
  categoria_icono,
  benefitCount,
}: Props) {
  return (
    <Link
      href={`/beneficios/${slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-primary-red to-primary-red/60" />

      <div className="flex flex-1 flex-col p-5">
        {/* Logo + Category */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-neutral-50 border border-neutral-100">
            {logo_url ? (
              <Image
                src={logo_url}
                alt={nombre}
                width={48}
                height={48}
                className="h-10 w-10 object-contain"
              />
            ) : (
              <span className="text-2xl font-bold text-primary-red">
                {nombre.charAt(0)}
              </span>
            )}
          </div>

          <span className="flex items-center gap-1 rounded-full bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-gray">
            {categoria_icono && <span>{categoria_icono}</span>}
            {categoria_nombre}
          </span>
        </div>

        {/* Info */}
        <h3 className="mb-1 text-lg font-bold text-dark-gray group-hover:text-primary-red transition-colors">
          {nombre}
        </h3>

        {descripcion && (
          <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-neutral-gray">
            {descripcion}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-4">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-primary-red">
            🎁 {benefitCount} beneficio{benefitCount !== 1 ? 's' : ''}
          </span>

          <span className="text-xs font-medium text-neutral-gray group-hover:text-primary-red transition-colors">
            Ver más →
          </span>
        </div>
      </div>
    </Link>
  )
}
