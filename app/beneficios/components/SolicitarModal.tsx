'use client'

import { useState, useEffect } from 'react'
import { Benefit, Comercio } from '../types'

type Step = 'form' | 'loading' | 'success' | 'error'

export default function SolicitarModal({
  benefit,
  comercio,
  onClose,
}: {
  benefit: Benefit
  comercio: Comercio
  onClose: () => void
}) {
  const [step, setStep] = useState<Step>('form')
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')
  const [whatsappUrl, setWhatsappUrl] = useState('')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep('loading')

    try {
      const res = await fetch('/api/beneficios/solicitar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          telefono,
          email: email || undefined,
          benefit_id: benefit.id,
          business_id: comercio.id,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setWhatsappUrl(data.whatsappUrl)
      setStep('success')
    } catch {
      setStep('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-gray transition-colors hover:bg-neutral-200"
        >
          ✕
        </button>

        {step === 'form' && (
          <>
            <h2 className="mb-1 text-xl font-bold text-dark-gray">
              Solicitar beneficio
            </h2>
            <p className="mb-5 text-sm text-neutral-gray">
              <span className="font-medium text-dark-gray">
                {benefit.titulo}
              </span>{' '}
              en {comercio.nombre}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-gray">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-dark-gray outline-none transition-all focus:border-primary-red focus:ring-2 focus:ring-primary-red/10"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-gray">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  required
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Ej: 2926123456"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-dark-gray outline-none transition-all focus:border-primary-red focus:ring-2 focus:ring-primary-red/10"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-gray">
                  Email{' '}
                  <span className="font-normal normal-case tracking-normal">
                    (opcional)
                  </span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-dark-gray outline-none transition-all focus:border-primary-red focus:ring-2 focus:ring-primary-red/10"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-primary-red px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-primary-red/20 transition-all hover:bg-primary-red/90 active:scale-[0.98]"
              >
                Solicitar por WhatsApp
              </button>
            </form>
          </>
        )}

        {step === 'loading' && (
          <div className="flex flex-col items-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-primary-red" />
            <p className="mt-4 text-sm font-medium text-neutral-gray">
              Procesando tu solicitud...
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-3xl">
              ✅
            </div>
            <h3 className="mb-2 text-xl font-bold text-dark-gray">
              ¡Listo, {nombre}!
            </h3>
            <p className="mb-6 text-sm text-neutral-gray">
              Tu solicitud fue registrada. Tocá el botón para contactar al
              comercio por WhatsApp y canjear tu beneficio.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-xl bg-green-500 px-4 py-3.5 text-center text-sm font-bold text-white shadow-md transition-all hover:bg-green-600 active:scale-[0.98]"
            >
              💬 Abrir WhatsApp
            </a>
            <button
              onClick={onClose}
              className="mt-3 text-sm text-neutral-gray transition-colors hover:text-dark-gray"
            >
              Cerrar
            </button>
          </div>
        )}

        {step === 'error' && (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-3xl">
              ❌
            </div>
            <h3 className="mb-2 text-xl font-bold text-dark-gray">
              Algo salió mal
            </h3>
            <p className="mb-6 text-sm text-neutral-gray">
              No pudimos procesar tu solicitud. Por favor intentá de nuevo.
            </p>
            <button
              onClick={() => setStep('form')}
              className="w-full rounded-xl bg-primary-red px-4 py-3.5 text-sm font-bold text-white transition-all hover:bg-primary-red/90"
            >
              Reintentar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
