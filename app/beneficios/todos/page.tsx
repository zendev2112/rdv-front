import type { Metadata } from 'next'
import Link from 'next/link'
import { BeneficioActivo } from '../types'
import BeneficiosHeader from '../components/BeneficiosHeader'
import BeneficiosFooter from '../components/BeneficiosFooter'
import BeneficioCard from '../components/BeneficioCard'
import { supabaseBeneficios } from '@/lib/supabase-beneficios'

export const metadata: Metadata = {
  title: 'Todos los beneficios de Coronel Suárez | Volga Beneficios',
  description:
    'Todos los descuentos y beneficios activos en comercios de Coronel Suárez.',
  alternates: { canonical: 'https://radiodelvolga.com.ar/beneficios/todos' },
}

export const dynamic = 'force-dynamic'

export default async function TodosPage() {
  const { data } = await supabaseBeneficios
    .from('beneficios_activos')
    .select('*')
    .order('business_nombre', { ascending: true })

  const beneficios = (data ?? []) as BeneficioActivo[]

  return (
    <>
      <BeneficiosHeader />
      <main
        style={{ background: 'var(--rdv-bg-page)' }}
        className="min-h-dvh pb-24"
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
          <h1 className="text-balance text-2xl font-extrabold text-dark-gray sm:text-3xl">
            Todos los beneficios de Coronel Suárez
          </h1>
          <p className="mt-1 text-sm text-neutral-gray">
            {beneficios.length}{' '}
            {beneficios.length === 1 ? 'beneficio activo' : 'beneficios activos'}
            .
          </p>

          {beneficios.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-neutral-gray/30 bg-white p-8 text-center text-sm text-neutral-gray">
              No hay beneficios activos en este momento.
              <div className="mt-4">
                <Link href="/beneficios" className="font-bold text-brand">
                  Volver al inicio
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {beneficios.map((b) => (
                <BeneficioCard key={b.benefit_id} beneficio={b} />
              ))}
            </div>
          )}
        </div>
      </main>
      <BeneficiosFooter />
    </>
  )
}
