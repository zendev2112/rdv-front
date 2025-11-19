import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import MobileNavBar from '@/components/MobileNavBar'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'
import Script from 'next/script'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Radio del Volga',
  description: 'Noticias de Coronel Suárez y el sudoeste bonaerense',
  manifest: '/manifest.json',
  icons: {
    icon: '/images/icon-192.png',
    apple: '/images/icon-192.png',
  },
  themeColor: '#ff0808',
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
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <link rel="icon" href="/images/logo-red.png" type="image/png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#dc2626" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Radio del Volga" />
        <link rel="apple-touch-icon" href="/images/logo-red.png" />
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
      </head>
      <body className={inter.className}>
        <Header />
        {children}
        <Script src="https://www.instagram.com/embed.js" strategy="lazyOnload" />
        <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" />
        <PWAInstallPrompt />
        <MobileNavBar />
      </body>
    </html>
  )
}

