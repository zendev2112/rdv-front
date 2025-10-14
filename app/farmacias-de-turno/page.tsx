'use client'

import { pharmacies } from '@/components/FarmaciasDeTurno'
import Link from 'next/link'

export default function FarmaciasDeTurnoPage() {
  return (
    <section className="container mx-auto px-4 py-6">
      {/* Page Title */}
      <div className="mb-6 border-b border-light-gray pb-2 flex items-center">
        <div className="h-5 w-1 bg-primary-red mr-3"></div>
        <h2 className="text-xl font-bold uppercase">Farmacias de turno</h2>
      </div>

      {/* Organized by Day */}
      <div className="grid grid-cols-1 gap-6">
        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
          const pharmacy = pharmacies.find((p) => p.day === day)

          if (!pharmacy) return null

          return (
            <div
              key={day}
              className="border border-gray-200 shadow-md bg-white rounded-lg overflow-hidden"
            >
              {/* Pharmacy Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={pharmacy.image}
                  alt={`Farmacia ${pharmacy.name}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Pharmacy Information */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-primary-red mb-2">
                  Día {day}: {pharmacy.name}
                </h3>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Dirección:</strong> {pharmacy.address}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Teléfono:</strong> {pharmacy.phone}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
