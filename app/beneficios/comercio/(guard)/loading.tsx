// Branded loading splash for the Volga Comercios app — shown while the panel
// resolves the session/business (and on in-app navigation). A large wordmark over
// the maroon brand color with three pulsing dots; distinct from the consumer chrome.
export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand text-white">
      <div className="text-center leading-none">
        <p className="font-display text-5xl font-extrabold tracking-tight">VOLGA</p>
        <p className="mt-2 text-base font-medium uppercase tracking-[0.35em] text-white/75">
          Comercios
        </p>
      </div>
      <div className="mt-8 flex gap-2">
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-white/80 [animation-delay:-0.3s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-white/80 [animation-delay:-0.15s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-white/80" />
      </div>
    </main>
  )
}
