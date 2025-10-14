'use client'

import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Clock, Phone, ChevronRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'

function getGoogleMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const defaultImage = '/images/pharmacies/farmacia.jpg'
const defaultProducts = [

  {
    name: 'Perpiel Aqua Crema Gel Hidratante Matificante Facial 80 ml',
    price: 12185,
    originalPrice: 20309,
    discount: 40,
    image: '/images/pharmacies-products/perpiel.jpeg',
  },
  {
    name: 'Dermaglos Crema Protectora Con Fps30 50 gr',
    price: 17276,
    originalPrice: 23035,
    discount: 25,
    image: '/images/pharmacies-products/dermaglos.jpeg',
  },
  {
    name: 'Loreal Paris Revitalift Crema Ojos Acido Hialulronico 15 ml',
    price: 19139,
    originalPrice: 27342,
    discount: 30,
    image: '/images/pharmacies-products/loreal.jpeg',
  },
  {
    name: 'Aveno Crema Hidratante Facial Piel Sensible Seca 50 gr',
    price: 21871,
    originalPrice: 31245,
    discount: 30,
    image: '/images/pharmacies-products/aveno.jpeg',
  },
]

const pharmacies = [
  {
    day: 1,
    name: 'JAIME',
    address: 'Brandsen y Brown',
    phone: '422254',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 2,
    name: 'MENNA',
    address: 'Av. Sixto Rodríguez y Alem',
    phone: '431467',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 3,
    name: 'PASTEUR',
    address: 'Belgrano y Junín',
    phone: '422156',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 4,
    name: 'PERRIG',
    address: 'Av. Balcarce 459',
    phone: '15408697',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 5,
    name: 'SANTOMAURO',
    address: 'Las Heras 1242',
    phone: '421261',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 6,
    name: 'SCHUVAB',
    address: 'Belgrano y Sarmiento',
    phone: '422045',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 7,
    name: 'SOTELO',
    address: 'Hipólito Irigoyen 855',
    phone: '421739',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 8,
    name: 'MATTA',
    address: 'Lamadrid y Conturbi',
    phone: '15492303',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 9,
    name: 'CORONEL SUÁREZ',
    address: 'Avellaneda y Lavalle',
    phone: '430019',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 10,
    name: 'FETTER',
    address: 'Mitre y San Martín',
    phone: '422778',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 11,
    name: 'DE LA CIUDAD',
    address: 'Las Heras y Garibaldi',
    phone: '431666',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 12,
    name: 'DEL PUEBLO',
    address: 'Mitre y Brandsen',
    phone: '424338',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 13,
    name: 'FONZO',
    address: 'Belgrano 1269',
    phone: '422230',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 14,
    name: 'GÓMEZ',
    address: 'Av. San Martín 218',
    phone: '431713',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 15,
    name: 'MENNA',
    address: 'Av. Sixto Rodríguez y Alem',
    phone: '431467',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 16,
    name: 'PASTEUR',
    address: 'Belgrano y Junín',
    phone: '422156',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 17,
    name: 'PERRIG',
    address: 'Av. Balcarce 459',
    phone: '15408697',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 18,
    name: 'SANTOMAURO',
    address: 'Las Heras 1242',
    phone: '421261',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 19,
    name: 'SCHUVAB',
    address: 'Belgrano y Sarmiento',
    phone: '422045',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 20,
    name: 'SOTELO',
    address: 'Hipólito Irigoyen 855',
    phone: '421739',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 21,
    name: 'MATTA',
    address: 'Lamadrid y Conturbi',
    phone: '15492303',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 22,
    name: 'CORONEL SUÁREZ',
    address: 'Avellaneda y Lavalle',
    phone: '430019',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 23,
    name: 'FETTER',
    address: 'Mitre y San Martín',
    phone: '422778',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 24,
    name: 'DE LA CIUDAD',
    address: 'Las Heras y Garibaldi',
    phone: '431666',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 25,
    name: 'DEL PUEBLO',
    address: 'Mitre y Brandsen',
    phone: '424338',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 26,
    name: 'PERRIG',
    address: 'Av. Balcarce 459',
    phone: '15408697',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 27,
    name: 'GÓMEZ',
    address: 'Av. San Martín 218',
    phone: '431713',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 28,
    name: 'JAIME',
    address: 'Brandsen y Brown',
    phone: '422254',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 29,
    name: 'PASTEUR',
    address: 'Belgrano y Junín',
    phone: '422156',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 30,
    name: 'PERRIG',
    address: 'Av. Balcarce 459',
    phone: '15408697',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
  {
    day: 31,
    name: 'SANTOMAURO',
    address: 'Las Heras 1242',
    phone: '421261',
    image: defaultImage,
    featuredProducts: defaultProducts,
  },
]

export default function FarmaciasDeTurno() {
  const today = new Date()
  const todayDay = today.getDate()
  const currentMonth = today.toLocaleString('es-ES', { month: 'long' }) // Get current month in Spanish
  const pharmacy = pharmacies.find((p) => p.day === todayDay)

  if (!pharmacy) {
    return (
      <div className="text-center text-red-600">
        No hay farmacia de turno para hoy.
      </div>
    )
  }

  return (
    <section className="container mx-auto px-4 py-6">
      {/* Title */}
      <div className="mb-6 border-b border-light-gray pb-2 flex items-center">
        <div className="h-5 w-1 bg-primary-red mr-3"></div>
        <h2 className="text-xl font-bold uppercase">Farmacias de turno</h2>
      </div>

      {/* Pharmacy Card */}
      <Card className="border border-gray-200 shadow-md bg-white w-full flex flex-col md:flex-row items-stretch rounded-lg overflow-hidden">
        {/* Pharmacy Image on the Left */}
        <div className="w-full md:w-1/2">
          <img
            src={pharmacy.image || defaultImage}
            alt={`Farmacia ${pharmacy.name}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = defaultImage
            }}
          />
        </div>

        {/* Pharmacy Information on the Right */}
        <CardContent className="p-6 w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-primary-red mb-4">
              {pharmacy.name}
            </h3>
            <div className="flex items-start mb-4">
              <MapPin className="w-5 h-5 text-primary-red mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-base text-gray-700">{pharmacy.address}</p>
            </div>
            <div className="flex items-center mb-4">
              <Phone className="w-5 h-5 text-primary-red mr-3 flex-shrink-0" />
              <span className="text-base text-gray-700">{pharmacy.phone}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-primary-red mr-3 flex-shrink-0" />
              <span className="text-base text-gray-700">
                Atención las 24 horas
              </span>
            </div>
          </div>

          {/* Link to Monthly Pharmacies */}
          <a
            href="#"
            className="text-primary-red font-medium text-base mt-4 hover:underline self-start"
          >
            Farmacias de Turno en {currentMonth}
          </a>
        </CardContent>
      </Card>
    </section>
  )
}
