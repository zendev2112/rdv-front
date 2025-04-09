import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Rss, ExternalLink } from "lucide-react";
import { Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 pt-8 pb-4">
      {/* Main footer content with navigation and social media */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* First column - Sections */}
          <div>
            <h4 className="font-bold text-sm uppercase mb-4">Secciones</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-blue-800">Política</Link></li>
              <li><Link href="#" className="hover:text-blue-800">Economía</Link></li>
              <li><Link href="#" className="hover:text-blue-800">Sociedad</Link></li>
              <li><Link href="#" className="hover:text-blue-800">Mundo</Link></li>
              <li><Link href="#" className="hover:text-blue-800">Opinión</Link></li>
              <li><Link href="#" className="hover:text-blue-800">Deportes</Link></li>
              <li><Link href="#" className="hover:text-blue-800">Lifestyle</Link></li>
              <li><Link href="#" className="hover:text-blue-800">Espectáculos</Link></li>
            </ul>
          </div>
          
          {/* Second column - Magazines and special sections */}
          <div>
            <h4 className="font-bold text-sm uppercase mb-4">Revistas</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-blue-800">Living</Link></li>
              <li><Link href="#" className="hover:text-blue-800">OHLALÁ!</Link></li>
              <li><Link href="#" className="hover:text-blue-800">Jardín</Link></li>
              <li><Link href="#" className="hover:text-blue-800">Brando</Link></li>
              <li><Link href="#" className="hover:text-blue-800">Rolling Stone</Link></li>
            </ul>
            
            <h4 className="font-bold text-sm uppercase mt-6 mb-4">Club LA NACION</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-blue-800">Beneficios</Link></li>
              <li><Link href="#" className="hover:text-blue-800">Círculo de Lectores</Link></li>
              <li><Link href="#" className="hover:text-blue-800">Colecciones</Link></li>
            </ul>
          </div>
          
          {/* Third column - Services */}
          <div>
            <h4 className="font-bold text-sm uppercase mb-4">Servicios</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-blue-800">Newsletters</Link></li>
              <li><Link href="#" className="hover:text-blue-800">Alertas y novedades</Link></li>
              <li><Link href="#" className="hover:text-blue-800">LN Radio</Link></li>
              <li><Link href="#" className="hover:text-blue-800">Centro de ayuda</Link></li>
              <li><Link href="#" className="hover:text-blue-800">Términos y condiciones</Link></li>
              <li><Link href="#" className="hover:text-blue-800">¿Cómo anunciar?</Link></li>
              <li><Link href="#" className="hover:text-blue-800">Suscribirse al diario</Link></li>
            </ul>
          </div>
          
          {/* Fourth column - Social media and app downloads */}
          <div>
            <h4 className="font-bold text-sm uppercase mb-4">Redes sociales</h4>
            <div className="flex space-x-4 mb-6">
              <Link href="#" className="text-gray-700 hover:text-blue-800">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-700 hover:text-blue-800">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-700 hover:text-blue-800">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-700 hover:text-blue-800">
                <Rss className="w-5 h-5" />
              </Link>
            </div>
            
            <h4 className="font-bold text-sm uppercase mb-4">Aplicaciones</h4>
            <div className="flex flex-col space-y-3">
              <Link href="#">
                <Image 
                  src="/placeholder.svg?height=40&width=120" 
                  alt="App Store" 
                  width={120} 
                  height={40} 
                  className="h-10 w-auto" 
                />
              </Link>
              <Link href="#">
                <Image 
                  src="/placeholder.svg?height=40&width=120" 
                  alt="Google Play" 
                  width={120} 
                  height={40} 
                  className="h-10 w-auto" 
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Captura del sitio - LA NACION */}
      <div className="container mx-auto px-4 pt-8 pb-4 mt-6 border-t border-gray-300">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Image 
              src="/placeholder.svg?height=60&width=200" 
              alt="LA NACION" 
              width={200} 
              height={60} 
              className="h-8 w-auto"
              style={{
                filter: "invert(19%) sepia(99%) saturate(1453%) hue-rotate(181deg) brightness(96%) contrast(101%)",
              }}
            />
          </div>
          <div className="text-xs text-gray-600">
            <p>Captura del sitio: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      
      {/* Legal information */}
      <div className="container mx-auto px-4 pt-6 mt-4 border-t border-gray-300">
        <div className="text-xs text-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="mb-2">LA NACION S.A.</p>
              <p>Número de edición: 02142015040638</p>
            </div>
            <div>
              <p className="mb-2">Domicilio: Av. Del Libertador 101, Ciudad Autónoma de Buenos Aires</p>
              <p>CUIT: 30-70057343-9</p>
            </div>
            <div>
              <p>Fundación: 4 de enero de 1870</p>
              <p>Director: José Del Rio</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-300">
            <p className="mb-2">
              Las notas firmadas expresan la opinión de sus autores. LA NACION se reserva el derecho de publicar o no artículos y correcciones que los lectores envíen al correo de lectores.
            </p>
            <p className="mb-2">
              © LA NACION S.A. 2005-2025. Todos los derechos reservados.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <Link href="#" className="text-gray-600 hover:text-blue-800 flex items-center">
                Política de protección de datos personales <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-blue-800 flex items-center">
                Normas de confidencialidad <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-blue-800 flex items-center">
                Términos y condiciones <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-blue-800 flex items-center">
                Cómo anunciar <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}