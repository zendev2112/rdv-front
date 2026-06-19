import { Store } from 'lucide-react'

// Branded loading splash for the Volga Comercios app — shown while the panel
// resolves the session/business (and on PWA launch, after the OS splash). Distinct
// from the consumer Beneficios chrome.
export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand text-white">
      <span className="flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-white/15">
        <Store size={32} />
      </span>
      <p className="mt-4 text-lg font-extrabold">
        Volga <span className="font-medium text-white/80">Comercios</span>
      </p>
      <span className="mt-5 h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
    </main>
  )
}
