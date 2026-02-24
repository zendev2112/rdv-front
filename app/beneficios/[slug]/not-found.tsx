import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
      <p className="text-6xl">🏪</p>
      <h1 className="mt-4 text-2xl font-extrabold text-dark-gray">
        Comercio no encontrado
      </h1>
      <p className="mt-2 max-w-xs text-sm text-neutral-gray">
        Este comercio no existe o ya no forma parte del programa.
      </p>
      <Link
        href="/beneficios"
        className="mt-6 rounded-xl bg-primary-red px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-red-600"
      >
        Ver todos los beneficios
      </Link>
    </main>
  )
}
