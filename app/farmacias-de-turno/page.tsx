'use client'

import { pharmacies } from '@/components/FarmaciasDeTurno'
import Link from 'next/link'
import Header from '@/components/Header'
import SidelinesLayout from '@/components/SidelinesLayout'
import { MapPin, Phone, Clock } from 'lucide-react'

function getGoogleMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`
}

export default function FarmaciasDeTurnoPage() {
  const currentMonth = new Date().toLocaleString('es-ES', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <SidelinesLayout>
      <Header />
      <div className="pt-[80px] md:pt-[100px]">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8 border-b-2 border-primary-red pb-4">
            {/* Breadcrumbs */}
            <div className="text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-primary-red font-medium">
                Inicio
              </Link>
              <span className="mx-2 text-gray-400">›</span>
              <span className="font-medium capitalize">Farmacias de Turno</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">
              Farmacias de Turno
            </h1>

            <p className="text-gray-500 text-sm mt-3">
              Calendario completo de {currentMonth}
            </p>
          </div>

          {/* Pharmacies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pharmacies.map((pharmacy) => (
              <article
                key={pharmacy.day}
                className="bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300 p-6"
              >
                {/* Day Badge */}
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-primary-red">
                    {pharmacy.name}
                  </h2>
                  <span className="bg-primary-red text-white px-3 py-1 text-sm font-semibold">
                    Día {pharmacy.day}
                  </span>
                </div>

                {/* Pharmacy Information */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary-red mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Dirección</p>
                      <a
                        href={getGoogleMapsUrl(pharmacy.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-semibold text-gray-800 hover:text-primary-red transition-colors"
                      >
                        {pharmacy.address}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary-red mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Teléfono</p>
                      <a
                        href={`tel:${pharmacy.phone}`}
                        className="text-base font-semibold text-gray-800 hover:text-primary-red transition-colors"
                      >
                        {pharmacy.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary-red mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Horario</p>
                      <p className="text-base font-semibold text-gray-800">
                        Atención las 24 horas
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
                  <span className="font-medium text-primary-red">DE TURNO</span>
                  <span>
                    {pharmacy.day} de{' '}
                    {new Date().toLocaleString('es-ES', { month: 'long' })}
                  </span>
                </div>
              </article>
            ))}
          </div>

          {/* Info Box */}
          <div className="mt-12 bg-gray-50 p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Información importante
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Las farmacias de turno están disponibles las 24 horas del día para
              atender emergencias y necesidades de medicamentos fuera del
              horario comercial habitual. Siempre verifique la disponibilidad
              antes de acudir.
            </p>
          </div>
        </div>
      </div>
    </SidelinesLayout>
  )
}
