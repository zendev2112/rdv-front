import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 pt-8 pb-4 mt-12 md:mt-16 border-t border-gray-300">
      {/* Main footer content */}
      <div className="container mx-auto px-4">
        {/* Mobile: Single column */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* First column - Sections */}
          <div>
            <h4 className="font-bold text-sm uppercase mb-4">Secciones</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-primary-red">Inicio</Link></li>
              <li><Link href="/coronel-suarez" className="hover:text-primary-red">Coronel Suárez</Link></li>
              <li><Link href="/pueblos-alemanes" className="hover:text-primary-red">Pueblos Alemanes</Link></li>
              <li><Link href="/huanguelen" className="hover:text-primary-red">Huanguelén</Link></li>
              <li><Link href="/la-sexta" className="hover:text-primary-red">La Sexta</Link></li>
              <li><Link href="/agro" className="hover:text-primary-red">Agro</Link></li>
              <li><Link href="/lifestyle" className="hover:text-primary-red">Lifestyle</Link></li>
              <li><Link href="/farmacias-de-turno" className="hover:text-primary-red">Farmacias de Turno</Link></li>
            </ul>
          </div>
          

          
          {/* Third column - Social media */}
          <div>
            <h4 className="font-bold text-sm uppercase mb-4">Redes sociales</h4>
            <div className="flex space-x-4 mb-6">
              <Link 
                href="https://twitter.com/radiodelvolga" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-700 hover:text-primary-red transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link 
                href="https://facebook.com/radiodelvolga" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-700 hover:text-primary-red transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link 
                href="https://instagram.com/radiodelvolga" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-700 hover:text-primary-red transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link 
                href="https://youtube.com/@volgatvok" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-700 hover:text-primary-red transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Logo and copyright */}
      <div className="container mx-auto px-4 pt-8 pb-4 mt-6 border-t border-gray-300">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <Image 
              src="/images/logo.svg" 
              alt="Radio del Volga" 
              width={160} 
              height={40} 
              className="h-8 w-auto"
            />
          </div>
          <div className="text-xs text-gray-600 text-center md:text-right">
            <p>© {new Date().getFullYear()} Radio del Volga. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
      
      {/* Legal information */}
      <div className="container mx-auto px-4 pt-6 mt-4 border-t border-gray-300">
        <div className="text-xs text-gray-600 text-center md:text-left">
          <div className="flex flex-col md:flex-row flex-wrap gap-2 md:gap-4 justify-center md:justify-start">
            <Link href="/terminos-y-condiciones" className="text-gray-600 hover:text-primary-red">
              Términos y condiciones
            </Link>
            <span className="hidden md:inline">|</span>
            <Link href="/politica-de-privacidad" className="text-gray-600 hover:text-primary-red">
              Política de privacidad
            </Link>
            <span className="hidden md:inline">|</span>
            <Link href="/contacto" className="text-gray-600 hover:text-primary-red">
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}