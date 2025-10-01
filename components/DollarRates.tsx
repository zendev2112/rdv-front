'use client'

import { useEffect, useState } from 'react'

type Rate = {
  nombre: string
  compra: number
  venta: number
}

const RATE_LABELS: Record<string, string> = {
  oficial: 'Oficial',
  blue: 'Blue',
  mep: 'MEP',
  tarjeta: 'Tarjeta',
  ccl: 'CCL',
}

const SHOW_RATES = ['oficial', 'blue', 'mep', 'tarjeta', 'ccl']

export default function DollarRates() {
  const [rates, setRates] = useState<Rate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://api.bluelytics.com.ar/v2/latest')
      .then((res) => res.json())
      .then((data) => {
        setRates(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-2 flex items-center text-sm space-x-4 whitespace-nowrap">
        <span>Cargando cotizaciones...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-2 flex items-center text-sm space-x-4 whitespace-nowrap">
      {SHOW_RATES.map((rateKey) => {
        const rate = rates.find((r) => r.nombre.toLowerCase() === rateKey)
        return rate ? (
          <span key={rateKey}>
            Dólar {RATE_LABELS[rateKey]}{' '}
            <strong>
              $
              {rate.venta.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </strong>
          </span>
        ) : null
      })}
      <div className="flex-1"></div>
    </div>
  )
}
