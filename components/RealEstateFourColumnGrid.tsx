import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Property {
  titleHighlight: string;
  titleRegular: string;
  imageUrl: string;
  author?: string;
  badgeText?: string;
}

interface AdContent {
  price: string;
  imageUrl: string;
  ctaText: string;
}

interface RealEstateFourColumnGridProps {
  properties: Property[];
  adContent: AdContent;
}

export default function RealEstateFourColumnGrid({
  properties,
  adContent,
}: RealEstateFourColumnGridProps) {
  return (
    <section className="container mx-auto px-4 py-6 border-t border-gray-200">
      {/* Section header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h2 className="text-blue-800 font-bold text-lg">LN | propiedades</h2>
          </div>
          <div className="flex space-x-4 text-sm text-gray-600">
            <Link href="#" className="hover:text-blue-800">
              COMPRAR
            </Link>
            <Link href="#" className="hover:text-blue-800">
              ALQUILAR
            </Link>
            <Link href="#" className="hover:text-blue-800">
              PROYECTOS
            </Link>
            <Link href="#" className="hover:text-blue-800">
              CONSEJOS
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* First 3 columns: Property listings */}
        {properties.slice(0, 3).map((property, index) => (
          <article key={index} className="mb-6">
            <div className="relative mb-3">
              <Image
                src={property.imageUrl}
                alt={`${property.titleHighlight} ${property.titleRegular}`}
                width={300}
                height={200}
                className="w-full h-32 object-cover"
              />
              {property.badgeText && (
                <div className="absolute bottom-2 left-2 bg-black text-white text-xs px-2 py-1">
                  {property.badgeText}
                </div>
              )}
            </div>
            <h3 className="mb-2 leading-tight">
              <Link href="#" className="hover:underline">
                <span className="text-blue-800 font-bold">{property.titleHighlight}.</span>{" "}
                <span className="font-serif">{property.titleRegular}</span>
              </Link>
            </h3>
            {property.author && (
              <p className="text-xs text-gray-500">
                Por {property.author}
              </p>
            )}
          </article>
        ))}
        
        {/* 4th column: Ad */}
        <div className="bg-purple-100 rounded-lg overflow-hidden flex flex-col">
          <div className="text-center pt-6 px-4 mb-2">
            <Image
              src="/placeholder.svg?height=60&width=120"
              alt="Adobe Creative Cloud"
              width={120}
              height={60}
              className="h-8 w-auto mx-auto"
            />
          </div>
          
          <div className="px-4 text-center">
            <p className="text-sm mb-1">Plan Creative Cloud completo</p>
            <p className="text-xl font-bold mb-3">{adContent.price}/mes*</p>
          </div>
          
          <div className="flex justify-center mb-4 relative">
            <div className="absolute top-0 right-10 w-12 h-12 rounded-full bg-purple-300"></div>
            <div className="absolute bottom-6 left-10 w-8 h-8 rounded-full bg-purple-200"></div>
            <Image
              src={adContent.imageUrl}
              alt="Adobe Creative"
              width={180}
              height={180}
              className="relative z-10"
            />
          </div>
          
          <div className="text-center px-4 mb-4">
            <p className="text-sm mb-4">Crea lo que quieras, donde quieras</p>
            <button className="bg-purple-700 text-white py-2 px-6 rounded-full text-sm hover:bg-purple-800">
              {adContent.ctaText}
            </button>
          </div>
          
          <div className="bg-purple-700 text-white text-xs p-2 mt-auto text-center">
            * Precio válido por 3 meses
          </div>
        </div>
      </div>
      
      {/* LN Campo section preview */}
      <div className="mt-8 border-t border-gray-200 pt-4">
        <div className="flex items-center mb-4">
          <h3 className="text-green-700 font-bold text-lg mr-6">LN campo</h3>
          <div className="flex space-x-4 text-sm">
            <Link href="#" className="text-gray-600 hover:text-green-700">
              AGRICULTURA
            </Link>
            <Link href="#" className="text-gray-600 hover:text-green-700">
              GANADERÍA
            </Link>
            <Link href="#" className="text-gray-600 hover:text-green-700">
              ECONOMÍA
            </Link>
            <Link href="#" className="text-gray-600 hover:text-green-700">
              CLIMA
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}