'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { createBeneficiosBrowserClient } from '@/lib/supabase-beneficios-browser'

// Signs the merchant out of the shared beneficios session and returns to the
// merchant login. (One identity system, so this clears the session everywhere.)
export default function SalirButton() {
  const router = useRouter()
  const [saliendo, setSaliendo] = useState(false)

  async function salir() {
    setSaliendo(true)
    const supabase = createBeneficiosBrowserClient()
    await supabase.auth.signOut()
    router.push('/beneficios/comercio/ingresar')
    router.refresh()
  }

  return (
    <button
      onClick={salir}
      disabled={saliendo}
      className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white/90 transition-colors hover:bg-white/20 disabled:opacity-60"
    >
      <LogOut size={14} />
      {saliendo ? 'Saliendo…' : 'Salir'}
    </button>
  )
}
