import { Store } from 'lucide-react'
import SalirButton from './SalirButton'

// The Volga Comercios app header — its own identity, distinct from the consumer
// Beneficios chrome. Shows the app name, the merchant's business, and logout.
export default function ComercioAppHeader({ businessNombre }: { businessNombre: string }) {
  return (
    <header className="sticky top-0 z-20 bg-brand text-white shadow-sm">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
            <Store size={18} />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-extrabold">
              Volga <span className="font-medium text-white/80">Comercios</span>
            </p>
            <p className="text-[11px] text-white/70">{businessNombre}</p>
          </div>
        </div>
        <SalirButton />
      </div>
    </header>
  )
}
