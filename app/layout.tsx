import type React from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import MobileNavBar from '@/components/MobileNavBar'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#ff0808',
}

export const metadata: Metadata = {
  title: 'Radio del Volga',
  description: 'Noticias de Coronel Suárez y el sudoeste bonaerense',
  manifest: '/manifest.json',
  icons: {
    icon: '/images/icon-192.png',
    apple: '/images/icon-192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Radio del Volga',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'Radio del Volga',
    alternateName: 'RDV',
    url: 'https://www.radiodelvolga.com.ar',
    logo: 'https://www.radiodelvolga.com.ar/logo.png',
    description:
      'Noticias de Coronel Suárez y región. Radio del Volga, tu fuente de información local.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Coronel Suárez',
      addressRegion: 'Buenos Aires',
      addressCountry: 'AR',
    },
    areaServed: {
      '@type': 'City',
      name: 'Coronel Suárez',
    },
  }

  return (
    <html lang="es-AR" className="overflow-x-hidden">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://dolarapi.com" />
        <link rel="preconnect" href="https://api.open-meteo.com" />
        {/* manifest / theme-color / apple-web-app / icons are emitted by the
            `metadata` + `viewport` exports above, so route segments (e.g. the
            merchant app) can override them with their own manifest. */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .border-border {
            border-color: #e5e5e5 !important;
          }
          
          html, body {
            max-width: 100vw;
            overflow-x: hidden;
          }

          @keyframes slide-in {
            from {
              transform: translateX(400px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          .animate-slide-in {
            animation: slide-in 0.3s ease-out;
          }
        `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <Header />
        {children}
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6THME29QR7"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6THME29QR7');
          `}
        </Script>
        <MobileNavBar />
        <Analytics />
      </body>
    </html>
  )
}
