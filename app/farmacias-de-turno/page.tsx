'use client'

import { pharmacies } from '@/components/FarmaciasDeTurno'
import Link from 'next/link'
import Header from '@/components/Header'
import SidelinesLayout from '@/components/SidelinesLayout'
import { MapPin, Phone, Clock } from 'lucide-react'

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
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const pharmacy = pharmacies.find((p) => p.day === day)

              if (!pharmacy) return null

              return (
                <article
                  key={day}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Pharmacy Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={pharmacy.image}
                      alt={`Farmacia ${pharmacy.name}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {/* Day Badge */}
                    <div className="absolute top-4 left-4 bg-primary-red text-white px-3 py-1 rounded-full font-bold text-sm">
                      Día {day}
                    </div>
                  </div>

                  {/* Pharmacy Information */}
                  <div className="p-5">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">
                      Farmacia {pharmacy.name}
                    </h2>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-start text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-primary-red mt-0.5 mr-2 flex-shrink-0" />
                        <span>{pharmacy.address}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-primary-red mr-2 flex-shrink-0" />
                        <span>{pharmacy.phone}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-primary-red mr-2 flex-shrink-0" />
                        <span>Atención las 24 horas</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
                      <span className="font-medium text-primary-red">
                        DE TURNO
                      </span>
                      <span>
                        {day} de{' '}
                        {new Date().toLocaleString('es-ES', { month: 'long' })}
                      </span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {/* Info Box */}
          <div className="mt-12 bg-gray-50 rounded-lg p-6 border border-gray-200">
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
