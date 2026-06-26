'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Menu, X, LayoutGrid, ScanLine, LogOut } from 'lucide-react'
import { createBeneficiosBrowserClient } from '@/lib/supabase-beneficios-browser'

// Hamburger menu for the Volga Comercios app: a slide-out with the merchant's
// screens (Panel, Validar) and logout. Replaces the standalone Salir button so
// navigation lives in one place on mobile.
const NAV = [
  { label: 'Panel', href: '/beneficios/comercio/panel', icon: LayoutGrid },
  { label: 'Validar código', href: '/beneficios/comercio/validar', icon: ScanLine },
]

export default function ComercioMenu({ businessNombre }: { businessNombre: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saliendo, setSaliendo] = useState(false)

  async function salir() {
    setSaliendo(true)
    const supabase = createBeneficiosBrowserClient()
    await supabase.auth.signOut()
    router.push('/beneficios/comercio/ingresar')
    router.refresh()
  }

  return (
    <>
      <button
        aria-label="Menú"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-white/90 hover:bg-white/15"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/50"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute right-0 top-0 bottom-0 flex w-72 max-w-[80%] flex-col bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <div className="leading-tight">
                <p className="text-sm font-extrabold text-gray-900">Volga Comercios</p>
                <p className="text-xs text-gray-500">{businessNombre}</p>
              </div>
              <button
                aria-label="Cerrar menú"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 p-2">
              {NAV.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold text-gray-800 hover:bg-gray-50"
                >
                  <Icon size={18} className="text-brand" />
                  {label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-gray-100 p-2">
              <button
                onClick={salir}
                disabled={saliendo}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-60"
              >
                <LogOut size={18} />
                {saliendo ? 'Saliendo…' : 'Salir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
