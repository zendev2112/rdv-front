// "Sumar comercio" — the prototype's 3rd tab. Merchant acquisition: the CTA opens
// WhatsApp to Geraldine (reuses BENEFICIOS_WHATSAPP_NUMBER). Distinct from the
// user→business lead flow (SPEC §0 / OQ-2).
const FEATURES = [
  { emoji: '👀', titulo: 'Te ven los vecinos', desc: 'Aparecés en la vidriera + te promocionan en vivo.' },
  { emoji: '🤝', titulo: 'Clientes nuevos', desc: 'El beneficio trae gente que no te conocía a tu local.' },
  { emoji: '📊', titulo: 'Medís lo que pasa', desc: 'Ves cuántos canjearon tu beneficio, mes a mes.' },
  { emoji: '⭐', titulo: 'Precio fundador', desc: 'Sumate ahora y te queda congelado 12 meses.' },
]

export default function SumarComercioPage() {
  const numero = process.env.BENEFICIOS_WHATSAPP_NUMBER ?? ''
  const texto = encodeURIComponent('Hola! Quiero sumar mi comercio a Volga Beneficios.')
  const href = numero ? `https://wa.me/${numero}?text=${texto}` : `https://wa.me/?text=${texto}`

  return (
    <main className="min-h-screen bg-cream">
      <div className="bg-brand px-6 py-10 text-white">
        <div className="mx-auto max-w-md">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl">
            🏪
          </div>
          <h1 className="text-2xl font-extrabold">¿Tenés un comercio?</h1>
          <p className="mt-1 text-sm text-white/85">Sumate a Volga Beneficios</p>
        </div>
      </div>

      <div className="mx-auto max-w-md px-6 py-8">
        <ul className="space-y-5">
          {FEATURES.map((f) => (
            <li key={f.titulo} className="flex items-start gap-3">
              <span className="text-2xl">{f.emoji}</span>
              <div>
                <p className="font-bold text-dark-gray">{f.titulo}</p>
                <p className="text-sm text-neutral-gray">{f.desc}</p>
              </div>
            </li>
          ))}
        </ul>

        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="mt-8 block rounded-xl bg-brand px-4 py-3.5 text-center text-sm font-bold text-white shadow-md shadow-brand/20 hover:bg-brand/90"
        >
          Quiero sumar mi comercio
        </a>
      </div>
    </main>
  )
}
