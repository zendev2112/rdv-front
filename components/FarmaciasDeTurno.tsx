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
  const pharmacy = pharmacies.find((p) => p.day === todayDay)

  if (!pharmacy) {
    return (
      <div className="text-center text-red-600">
        No hay farmacia de turno para hoy.
      </div>
    )
  }

  const mapsUrl = getGoogleMapsUrl(pharmacy.address)

  return (
    <section className="container mx-auto px-4 py-6 border-t border-light-gray">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="h-5 w-1 bg-primary-red mr-3"></div>
        <h2 className="text-xl font-bold uppercase">FARMACIA DE TURNO</h2>
      </div>

      {/* Top Row: Pharmacy Info + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* LEFT: Pharmacy Information */}
        <div>
          <Card className="border-0 shadow-sm bg-cream h-full">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{pharmacy.name}</h3>
                <span className="bg-green-100 text-green-800 text-sm px-2 py-0.5 rounded-full">
                  DE TURNO HOY
                </span>
              </div>

              <div className="flex items-start mb-4">
                <MapPin className="w-5 h-5 text-primary-red mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">{pharmacy.address}</p>
                </div>
              </div>

              <div className="flex items-center mb-4">
                <Phone className="w-5 h-5 text-primary-red mr-2 flex-shrink-0" />
                <span className="font-medium">{pharmacy.phone}</span>
              </div>

              <div className="flex items-center mb-6">
                <Clock className="w-5 h-5 text-primary-red mr-2 flex-shrink-0" />
                <span className="font-medium">Atención las 24 horas</span>
              </div>

              {/* Pharmacy Image */}
              <div className="mb-6">
                <img
                  src={pharmacy.image || defaultImage}
                  alt={`Farmacia ${pharmacy.name}`}
                  className="w-full h-48 object-cover rounded-lg shadow-sm"
                  onError={(e) => {
                    e.currentTarget.src = defaultImage
                  }}
                />
              </div>

              <div className="mt-6 pt-6 border-t border-light-gray flex justify-between">
                <Link
                  href="#"
                  className="text-primary-red font-medium flex items-center hover:underline"
                >
                  Ver otras farmacias cercanas
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
                <Link
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-gray text-sm hover:text-primary-red flex items-center"
                >
                  Cómo llegar
                  <ExternalLink className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Google Maps */}
        <div>
          <Card className="border-0 shadow-sm h-full">
            <CardContent className="p-0 h-full">
              <div className="relative h-full min-h-[500px] bg-[#e8ecef] rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '500px' }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    pharmacy.address
                  )}&output=embed`}
                />
                <div className="absolute top-4 right-4">
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white py-2 px-3 rounded shadow-sm text-sm flex items-center hover:bg-gray-50 font-medium"
                  >
                    Abrir en Google Maps
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </div>

                {/* Pharmacy Info Overlay on Map */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-white/20">
                    <h4 className="font-bold text-gray-900">{pharmacy.name}</h4>
                    <p className="text-sm text-gray-700">{pharmacy.address}</p>
                    <p className="text-sm text-gray-600">{pharmacy.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Row: Products Section */}
      <div>
        <Card className="border-0 shadow-sm border-l-4 border-l-primary-red">
          <CardContent className="p-6">
            {/* Connection Text */}
            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-100">
              <p className="text-lg text-red-800 font-bold text-center">
                Productos seleccionados de Farmacia {pharmacy.name}
              </p>
            </div>

            {/* Featured Products - Desktop: Row, Mobile: Column */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pharmacy.featuredProducts?.slice(0, 4).map((product, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow hover:border-primary-red/30 overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="aspect-square p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg border border-gray-200"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-4 pt-0">
                    <h6 className="text-sm font-semibold text-gray-900 leading-tight mb-3 line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h6>

                    {/* Price Section */}
                    <div className="mb-3">
                      <div className="text-xl font-bold text-green-600 mb-1">
                        {formatPrice(product.price)}
                      </div>

                      {product.originalPrice && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            -{product.discount}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Availability */}
                    <div className="flex items-center text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Disponible
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Products Link */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link
                href="#"
                className="flex items-center justify-center w-full py-4 text-lg font-medium text-primary-red bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                Ver todos los productos en {pharmacy.name}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-500 mt-6 text-center">
        Información actualizada el {today.toLocaleDateString('es-AR')}. Consulte
        la disponibilidad telefónicamente antes de acudir a la farmacia.
      </p>
    </section>
  )
}
