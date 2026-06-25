import { redirect } from 'next/navigation'
import { createBeneficiosServerClient } from '@/lib/supabase-beneficios-server'
import CuentaForm from './CuentaForm'
import NuevaClaveForm from './NuevaClaveForm'

// Member account page (Phase 1a, SPEC §0b): Google OAuth + email/password.
// Register-to-redeem — `?next=` carries where to return after auth.
export const dynamic = 'force-dynamic'

function safeNext(raw: string | undefined): string {
  if (!raw || !raw.startsWith('/beneficios') || raw.startsWith('//')) return '/beneficios'
  return raw
}

export default async function CuentaPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string; reset?: string; updated?: string }
}) {
  const next = safeNext(searchParams.next)
  const supabase = createBeneficiosServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Password-recovery link lands here logged in with ?reset=1 → set a new password.
  if (user && searchParams.reset) {
    return (
      <Shell>
        <NuevaClaveForm />
      </Shell>
    )
  }
  // Already a member → straight to the intended destination.
  if (user) redirect(next)

  return (
    <Shell>
      <CuentaForm
        next={next}
        errorFlag={searchParams.error === 'auth'}
        updatedFlag={searchParams.updated === '1'}
      />
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-extrabold text-gray-900">Volga Beneficios</h1>
        <p className="mt-1 text-sm text-gray-500">
          Entrá o creá tu cuenta para usar tus beneficios.
        </p>
        {children}
      </div>
    </main>
  )
}
