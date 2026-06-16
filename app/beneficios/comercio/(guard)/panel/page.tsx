import { createBeneficiosServerClient } from '@/lib/supabase-beneficios-server'

export const dynamic = 'force-dynamic'

// Phase 0 placeholder: a logged-in merchant reaches an (intentionally empty)
// panel. The real dashboard — stats, beneficio activo, canjes recientes, retro
// queue — lands in Phase 3.
export default async function PanelPage() {
  const supabase = createBeneficiosServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-extrabold text-gray-900">Mi comercio</h1>
        <p className="mt-1 text-sm text-gray-500">
          Sesión iniciada{user?.email ? ` como ${user.email}` : ''}.
        </p>
        <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
          El panel del comercio llega en la Fase 3 (estadísticas, beneficio activo,
          canjes recientes y reclamos retroactivos).
        </div>
      </div>
    </main>
  )
}
