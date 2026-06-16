import Link from 'next/link'

// Placeholder for the retroactivo claim flow. The full flow (ticket photo + OCR +
// auto-credit) lands in Phase 2 (BUILD-phase-2-beneficios.md). The benefit detail
// already links here so the two-CTA layout matches the prototype.
export default function ReclamarPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-red/10 text-3xl">
        📷
      </div>
      <h1 className="mt-4 text-xl font-extrabold text-dark-gray">Cargar compra con foto</h1>
      <p className="mt-2 max-w-xs text-sm text-neutral-gray">
        Muy pronto vas a poder subir la foto del ticket y te acreditamos el beneficio, aunque no lo
        hayas mostrado en el local. «Si pisaste el comercio, cumpliste.»
      </p>
      <Link
        href="/beneficios"
        className="mt-6 rounded-xl bg-primary-red px-6 py-3 text-sm font-bold text-white hover:bg-primary-red/90"
      >
        Volver a Beneficios
      </Link>
    </main>
  )
}
