import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Heart } from 'lucide-react'
import { createBeneficiosServerClient } from '@/lib/supabase-beneficios-server'
import { supabaseBeneficios } from '@/lib/supabase-beneficios'
import { BeneficioActivo } from '../types'
import BeneficiosHeader from '../components/BeneficiosHeader'
import BeneficiosFooter from '../components/BeneficiosFooter'
import BeneficioCard from '../components/BeneficioCard'
import BackButton from '../components/BackButton'

export const dynamic = 'force-dynamic'

// "Favoritos" — the individual benefits a member saved (per-benefit, not per
// comercio). Favorites are read under the member's own RLS; benefit display data
// comes from the public beneficios_activos view. A saved benefit that has since
// expired won't surface (the view only carries active ones) — acceptable for MVP.
export default async function FavoritosPage() {
  const supabase = createBeneficiosServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/beneficios/cuenta?next=/beneficios/favoritos')

  const { data: favs } = await supabase
    .from('user_favorites')
    .select('benefit_id, created_at')
    .order('created_at', { ascending: false })

  const ids = Array.from(new Set((favs ?? []).map((f) => f.benefit_id)))

  let beneficios: BeneficioActivo[] = []
  if (ids.length) {
    const { data: rows } = await supabaseBeneficios
      .from('beneficios_activos')
      .select('*')
      .in('benefit_id', ids)

    // preserve the saved order (most-recent first)
    const byId = new Map((rows ?? []).map((r) => [r.benefit_id, r]))
    beneficios = ids
      .map((id) => byId.get(id))
      .filter(Boolean) as BeneficioActivo[]
  }

  return (
    <>
      <BeneficiosHeader />
      <main className="min-h-dvh bg-cream px-4 py-8 pb-24 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <BackButton className="mb-4" />
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-dark-gray sm:text-3xl">
            <Heart size={24} className="fill-brand text-brand" />
            Favoritos
          </h1>
          <p className="mt-1 text-sm text-neutral-gray">
            Los beneficios que guardaste.
          </p>

          {beneficios.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-neutral-gray/30 bg-white p-8 text-center text-sm text-neutral-gray">
              Todavía no guardaste ningún beneficio.
              <br />
              Tocá el <Heart size={14} className="inline align-text-bottom" /> en
              cualquier beneficio para sumarlo acá.
              <div className="mt-4">
                <Link href="/beneficios" className="font-bold text-brand">
                  Explorar beneficios
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
