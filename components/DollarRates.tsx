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
    const fetchRates = async () => {
      try {
        // Primary API
        const res = await fetch('https://dolarapi.com/v1/dolares')
        if (!res.ok) throw new Error('Primary API failed')
        const data = await res.json()
        setRates(data)
        setLoading(false)
      } catch (error) {
        try {
          // Fallback API 1
          const res = await fetch('https://api.bluelytics.com.ar/v2/latest')
          if (!res.ok) throw new Error('Fallback API 1 failed')
          const data = await res.json()

          // Transform fallback data to match primary format
          const transformedRates = [
            { nombre: 'oficial', compra: data.oficial.compra, venta: data.oficial.venta },
            { nombre: 'blue', compra: data.blue.compra, venta: data.blue.venta },
          ]
          setRates(transformedRates)
          setLoading(false)
        } catch (fallbackError) {
          try {
            // Fallback API 2
            const res = await fetch('https://api.yadio.io/json')
            if (!res.ok) throw new Error('Fallback API 2 failed')
            const data = await res.json()

            // Transform yadio data to match primary format
            const transformedRates = [
              { nombre: 'oficial', compra: data.ARS.oficial.buy, venta: data.ARS.oficial.sell },
              { nombre: 'blue', compra: data.ARS.blue.buy, venta: data.ARS.blue.sell },
            ]
            setRates(transformedRates)
            setLoading(false)
          } catch (secondFallbackError) {
            console.error('All APIs failed:', secondFallbackError)
            setLoading(false)
          }
        }
      }
    }

    fetchRates()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-2 flex items-center text-sm space-x-4 whitespace-nowrap">
        <span>Cargando cotizaciones...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-2 flex items-center text-sm space-x-4 whitespace-nowrap h-12">
      {SHOW_RATES.map((rateKey) => {
        const rate = rates.find((r) => r.nombre.toLowerCase() === rateKey)
        return rate ? (
          <span key={rateKey} className="flex items-center h-full">
            Dólar {RATE_LABELS[rateKey]} $
            <strong>
              {rate.venta.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </strong>
          </span>
        ) : null
      })}
      <div className="flex-1"></div>
    </div>
  )
}
