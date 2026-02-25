export default function EmptyState() {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 text-4xl">
        🏪
      </div>
      <p className="text-xl font-bold text-dark-gray">
        No hay beneficios disponibles
      </p>
      <p className="mt-2 max-w-sm text-sm text-neutral-gray">
        Volvé pronto, estamos sumando comercios a la red de Volga Beneficios.
      </p>
    </div>
  )
}
