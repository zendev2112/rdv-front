import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabaseBeneficios } from '@/lib/supabase-beneficios'
import { BeneficioActivo } from '../../types'
import BeneficiosHeader from '../../components/BeneficiosHeader'
import BeneficiosFooter from '../../components/BeneficiosFooter'
import BackButton from '../../components/BackButton'
import UsarBeneficioButton from '../../components/UsarBeneficioButton'
import FavoritoButton from '../../components/FavoritoButton'
import ShareButton from '../../components/ShareButton'
import { badgeFor, tintFor } from '../../components/cardDisplay'

// Individual benefit page — what a benefit card opens. Shows the single benefit with
// its "Usar beneficio" action, distinct from the comercio page (which lists all of a
// business's benefits). ISR so newly added/edited benefits surface within a minute.
export const revalidate = 60

async function getBeneficio(id: string): Promise<BeneficioActivo | null> {
  const { data } = await supabaseBeneficios
    .from('beneficios_activos')
    .select('*')
    .eq('benefit_id', id)
    .maybeSingle()
  return (data as BeneficioActivo | null) ?? null
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const b = await getBeneficio(params.id)
  if (!b) return { title: 'Beneficio | Volga Beneficios' }
  return {
    title: `${b.titulo} — ${b.business_nombre} | Volga Beneficios`,
    description: b.benefit_descripcion ?? `Beneficio en ${b.business_nombre}, Coronel Suárez.`,
  }
}

const LIMITE_LABEL: Record<string, string> = {
  por_dia: 'por día',
  por_semana: 'por semana',
  por_mes: 'por mes',
  total: 'en total',
}

export default async function BeneficioPage({ params }: { params: { id: string } }) {
  const b = await getBeneficio(params.id)
  if (!b) notFound()

  const comercioHref = `/beneficios/${b.categoria_slug}/${b.business_slug}`
  const selfPath = `/beneficios/beneficio/${b.benefit_id}`
  const limite =
    b.limite_tipo && b.limite_tipo !== 'ilimitado' && b.limite_cantidad
      ? `${b.limite_cantidad} ${LIMITE_LABEL[b.limite_tipo] ?? ''}`.trim()
      : null

  return (
    <>
      <BeneficiosHeader />
      <main className="min-h-dvh bg-cream px-4 py-8 pb-24 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <BackButton className="mb-4" />

          <article className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
            {/* Media */}
            <div
              className="relative aspect-[16/9] w-full overflow-hidden"
              style={{ backgroundColor: b.logo_url ? '#ffffff' : tintFor(b.categoria_slug) }}
            >
              {b.logo_url ? (
                <Image
                  src={b.logo_url}
                  alt={b.business_nombre}
                  fill
                  className="object-contain p-8"
                  sizes="(max-width: 768px) 100vw, 640px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-7xl">
                  {b.categoria_icono}
                </div>
              )}
              <span className="font-display absolute left-4 top-4 rounded-xl bg-brand px-4 py-1.5 text-xl font-extrabold tabular-nums text-white shadow-sm shadow-brand/30">
                {badgeFor(b.titulo)}
              </span>
              <div className="absolute right-3 top-3 flex gap-1.5">
                <FavoritoButton benefitId={b.benefit_id} variant="overlay" />
                <ShareButton path={selfPath} nombre={b.business_nombre} variant="overlay" />
              </div>
            </div>

            <div className="p-6">
              <Link
                href={comercioHref}
                className="text-xs font-semibold uppercase tracking-wide text-neutral-gray hover:text-brand"
              >
                {b.categoria_icono} {b.categoria_nombre} · {b.business_nombre}
              </Link>

              <h1 className="mt-1 text-2xl font-extrabold text-dark-gray sm:text-3xl">
                {b.titulo}
              </h1>

              {b.benefit_descripcion && (
                <p className="mt-3 text-sm leading-relaxed text-neutral-gray">
                  {b.benefit_descripcion}
                </p>
              )}

              {b.condiciones && (
                <div className="mt-4 rounded-xl bg-cream px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-gray">
                    Condiciones
                  </p>
                  <p className="mt-1 text-sm text-dark-gray">{b.condiciones}</p>
                </div>
              )}

              <div className="mt-3 rounded-xl bg-cream px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-gray">
                  Cómo se usa
                </p>
                <p className="mt-1 text-sm text-dark-gray">
                  Tocá «Usar beneficio», mostrá el QR en el local y el comercio lo escanea. Con
                  que estés ahí, te lo cumplimos.
                </p>
              </div>

              {limite && (
                <p className="mt-3 text-xs text-neutral-gray">⚡ Límite: {limite} por persona</p>
              )}

              <div className="mt-5">
                <UsarBeneficioButton benefitId={b.benefit_id} />
              </div>

              <Link
                href={comercioHref}
                className="mt-4 block text-center text-sm font-semibold text-brand hover:underline"
              >
                Ver más de {b.business_nombre} ›
              </Link>
            </div>
          </article>
        </div>
      </main>
      <BeneficiosFooter />
    </>
  )
}
