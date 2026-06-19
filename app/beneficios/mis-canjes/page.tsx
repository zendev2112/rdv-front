import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Ticket } from 'lucide-react'
import { createBeneficiosServerClient } from '@/lib/supabase-beneficios-server'
import { supabaseBeneficiosAdmin } from '@/lib/supabase-beneficios'
import BeneficiosHeader from '../components/BeneficiosHeader'
import BeneficiosFooter from '../components/BeneficiosFooter'
import CanjeCard, { CanjeCardData } from '../components/CanjeCard'
import BackButton from '../components/BackButton'

export const dynamic = 'force-dynamic'

// "Mis canjes" — same grid/visual as Favoritos. Redemptions are read with the
// user-scoped client (RLS = own rows); benefit/business/category display data is
// non-sensitive and resolved via the admin client so even canjes of now-inactive
// benefits still render. Pending canjes link to their cupón; used ones are marked.
export default async function MisCanjesPage() {
  const supabase = createBeneficiosServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/beneficios/cuenta?next=/beneficios/mis-canjes')

  const { data: canjes } = await supabase
    .from('redemptions')
    .select('id, benefit_id, business_id, estado, codigo, created_at')
    .order('created_at', { ascending: false })

  const rows = canjes ?? []

  // Resolve display data in bulk via the admin client.
  const benefitIds = Array.from(new Set(rows.map((r) => r.benefit_id)))
  const businessIds = Array.from(new Set(rows.map((r) => r.business_id)))

  const [{ data: bens }, { data: bizs }] = await Promise.all([
    benefitIds.length
      ? supabaseBeneficiosAdmin.from('benefits').select('id, titulo').in('id', benefitIds)
      : Promise.resolve({ data: [] as { id: string; titulo: string }[] }),
    businessIds.length
      ? supabaseBeneficiosAdmin
          .from('businesses')
          .select('id, nombre, logo_url, categoria_id')
          .in('id', businessIds)
      : Promise.resolve({
          data: [] as {
            id: string
            nombre: string
            logo_url: string | null
            categoria_id: number
          }[],
        }),
  ])

  const catIds = Array.from(new Set((bizs ?? []).map((b) => b.categoria_id)))
  const { data: cats } = catIds.length
    ? await supabaseBeneficiosAdmin
        .from('categorias')
        .select('id, nombre, slug, icono')
        .in('id', catIds)
    : { data: [] as { id: number; nombre: string; slug: string; icono: string | null }[] }

  const benById = new Map((bens ?? []).map((b) => [b.id, b]))
  const bizById = new Map((bizs ?? []).map((b) => [b.id, b]))
  const catById = new Map((cats ?? []).map((c) => [c.id, c]))

  const canjeCards: CanjeCardData[] = rows.map((r) => {
    const biz = bizById.get(r.business_id)
    const cat = biz ? catById.get(biz.categoria_id) : undefined
    return {
      redemptionId: r.id,
      estado: r.estado,
      titulo: benById.get(r.benefit_id)?.titulo ?? 'Beneficio',
      businessNombre: biz?.nombre ?? 'Comercio',
      categoriaNombre: cat?.nombre ?? '',
      categoriaSlug: cat?.slug ?? '',
      categoriaIcono: cat?.icono ?? '🏷️',
      logoUrl: biz?.logo_url ?? null,
      codigo: r.codigo,
      createdAt: r.created_at,
    }
  })

  return (
    <>
      <BeneficiosHeader />
      <main className="min-h-dvh bg-cream px-4 py-8 pb-24 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <BackButton className="mb-4" />
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-dark-gray sm:text-3xl">
            <Ticket size={24} className="text-brand" />
            Mis canjes
          </h1>
          <p className="mt-1 text-sm text-neutral-gray">Lo que fuiste usando.</p>

          {canjeCards.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-neutral-gray/30 bg-white p-8 text-center text-sm text-neutral-gray">
              Todavía no usaste ningún beneficio.
              <div className="mt-4">
                <Link href="/beneficios" className="font-bold text-brand">
                  Explorar beneficios
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {canjeCards.map((c) => (
                <CanjeCard key={c.redemptionId} {...c} />
              ))}
            </div>
          )}
        </div>
      </main>
      <BeneficiosFooter />
    </>
  )
}
