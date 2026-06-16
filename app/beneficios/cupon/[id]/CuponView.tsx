'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// The "mostrá la pantalla" cupón. Shows merchant + discount + a big human code +
// the philosophy line. "Listo, lo usé" self-reports the canje (PATCH) and swaps
// to the success state. The code is cached in localStorage so the screen still
// renders if signal drops at the counter (the SW precache lands with the home pass).
export default function CuponView({
  id,
  codigo,
  estado,
  merchantNombre,
  descuentoLabel,
}: {
  id: string
  codigo: string
  estado: string
  merchantNombre: string
  descuentoLabel: string
}) {
  const [usado, setUsado] = useState(estado === 'usado')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(
        `vb-cupon-${id}`,
        JSON.stringify({ codigo, merchantNombre, descuentoLabel }),
      )
    } catch {
      // private mode / storage full — the server render still shows the cupón.
    }
  }, [id, codigo, merchantNombre, descuentoLabel])

  async function confirmar() {
    setGuardando(true)
    try {
      await fetch(`/api/beneficios/canje/${id}`, { method: 'PATCH' })
    } catch {
      // self-reported — even if the network blips, show the user success.
    }
    setUsado(true)
    setGuardando(false)
  }

  if (usado) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-red text-4xl text-white shadow-lg shadow-primary-red/30">
          ✓
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-dark-gray">¡Listo, disfrutalo!</h1>
        <p className="mt-2 max-w-xs text-sm text-neutral-gray">
          Aplicaste tu beneficio <strong className="text-dark-gray">{descuentoLabel}</strong> en{' '}
          <strong className="text-dark-gray">{merchantNombre}</strong>.
        </p>

        <div className="mt-8 w-full max-w-xs space-y-2">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `Aproveché ${descuentoLabel} en ${merchantNombre} con Volga Beneficios 🎟️`,
            )}`}
            target="_blank"
            rel="noreferrer"
            className="block rounded-xl border border-neutral-gray/30 bg-white px-4 py-3 text-sm font-bold text-dark-gray hover:bg-cream"
          >
            Compartir con un amigo
          </a>
          <Link
            href="/beneficios"
            className="block rounded-xl bg-primary-red px-4 py-3 text-sm font-bold text-white hover:bg-primary-red/90"
          >
            Ver más beneficios
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 py-10 text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-neutral-gray">Tu beneficio</p>
      <h1 className="mt-1 text-2xl font-extrabold text-dark-gray">{merchantNombre}</h1>
      {descuentoLabel && (
        <span className="mt-2 inline-block rounded-full bg-primary-red/10 px-4 py-1 text-sm font-extrabold text-primary-red">
          {descuentoLabel}
        </span>
      )}

      <div className="mt-7 rounded-2xl border-2 border-dashed border-primary-red bg-white px-8 py-5">
        <p className="font-mono text-4xl font-extrabold tracking-[0.2em] text-dark-gray">{codigo}</p>
      </div>

      <p className="mt-4 text-sm font-bold text-dark-gray">📲 Mostrá esta pantalla en el local</p>
      <p className="mt-2 max-w-xs text-sm italic text-neutral-gray">
        «Con que estés acá, el beneficio es tuyo.» Vos pisás, nosotros cumplimos.
      </p>

      <button
        onClick={confirmar}
        disabled={guardando}
        className="mt-8 rounded-xl bg-primary-red px-10 py-3 text-sm font-bold text-white shadow-md shadow-primary-red/20 hover:bg-primary-red/90 disabled:opacity-60"
      >
        {guardando ? 'Guardando…' : 'Listo, lo usé'}
      </button>
    </main>
  )
}
