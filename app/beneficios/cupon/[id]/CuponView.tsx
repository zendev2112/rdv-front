'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import BackButton from '../../components/BackButton'

// The "mostrá la pantalla" cupón. Shows the QR the merchant scans to validate, plus
// a big human code as the manual-entry fallback. The canje is no longer self-reported
// by the customer — the merchant confirms it from their own device (SPEC-comercios),
// so this screen is read-only: pendiente shows the QR; usado/validado shows "ya usado".
// The code is cached in localStorage so the screen still renders if signal drops.
const USED = new Set(['usado', 'validado'])

export default function CuponView({
  id,
  codigo,
  estado,
  qrSrc,
  merchantNombre,
  descuentoLabel,
}: {
  id: string
  codigo: string
  estado: string
  qrSrc: string
  merchantNombre: string
  descuentoLabel: string
}) {
  const [usado, setUsado] = useState(USED.has(estado))

  useEffect(() => {
    try {
      localStorage.setItem(
        `vb-cupon-${id}`,
        JSON.stringify({ codigo, merchantNombre, descuentoLabel, qrSrc }),
      )
    } catch {
      // private mode / storage full — the server render still shows the cupón.
    }
  }, [id, codigo, merchantNombre, descuentoLabel, qrSrc])

  // Live update: while the cupón is pending, poll its status so the member's screen
  // flips to "ya usado" on its own the moment the merchant validates it.
  useEffect(() => {
    if (usado) return
    const tick = async () => {
      try {
        const res = await fetch(`/api/beneficios/canje/${id}`, { cache: 'no-store' })
        const data = await res.json().catch(() => ({}))
        if (USED.has(data.estado)) setUsado(true)
      } catch {
        // offline / transient — keep polling
      }
    }
    const t = setInterval(tick, 4000)
    return () => clearInterval(t)
  }, [id, usado])

  if (usado) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
        <BackButton
          fallback="/beneficios/mis-canjes"
          className="absolute left-4 top-4"
        />
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand text-4xl text-white shadow-lg shadow-brand/30">
          ✓
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-dark-gray">¡Listo, disfrutalo!</h1>
        <p className="mt-2 max-w-xs text-sm text-neutral-gray">
          Usaste tu beneficio <strong className="text-dark-gray">{descuentoLabel}</strong> en{' '}
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
            className="block rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand/90"
          >
            Ver más beneficios
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-cream px-6 py-10 text-center">
      <BackButton
        fallback="/beneficios/mis-canjes"
        className="absolute left-4 top-4"
      />
      <p className="text-xs font-bold uppercase tracking-widest text-neutral-gray">Tu beneficio</p>
      <h1 className="mt-1 text-2xl font-extrabold text-dark-gray">{merchantNombre}</h1>
      {descuentoLabel && (
        <span className="mt-2 inline-block rounded-full bg-brand/10 px-4 py-1 text-sm font-extrabold text-brand">
          {descuentoLabel}
        </span>
      )}

      {/* The merchant scans this to validate. */}
      <div className="mt-6 rounded-2xl border-2 border-brand bg-white p-4 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element -- data URI; custom next/image loader would mangle it */}
        <img src={qrSrc} alt="Código QR del cupón" width={220} height={220} className="h-[220px] w-[220px]" />
      </div>

      <p className="mt-4 text-sm font-bold text-dark-gray">📲 Mostrá esta pantalla en el local</p>

      {/* Manual-entry fallback when the camera can't read the QR. */}
      <div className="mt-4 rounded-xl border border-dashed border-neutral-gray/40 bg-white px-6 py-3">
        <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-gray">Código</p>
        <p className="font-mono text-2xl font-extrabold tracking-[0.2em] text-dark-gray">{codigo}</p>
      </div>

      {/* Save/print the whole cupón as a PDF. */}
      <a
        href={`/beneficios/cupon/${id}/pdf`}
        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-brand bg-white px-5 py-2.5 text-sm font-bold text-brand hover:bg-brand/5"
      >
        ⬇ Descargar cupón (PDF)
      </a>

      <p className="mt-4 max-w-xs text-sm italic text-neutral-gray">
        «Con que estés acá, el beneficio es tuyo.» Vos pisás, nosotros cumplimos.
      </p>
    </main>
  )
}
