import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import MobileNavBar from '@/components/MobileNavBar'
import Script from 'next/script'
import RegisterSW from './register-sw'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Radio del Volga',
  description: 'Radio del Volga - Tu radio local',
  manifest: '/manifest.json',
  icons: {
    icon: '/images/logo-red.png',
    apple: '/images/logo-red.png',
  },
  themeColor: '#dc2626',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
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
        `,
          }}
        />
      </head>
      <body className={inter.className}>
        <RegisterSW />
        <Header />
        {children}
        <Script src="https://www.instagram.com/embed.js" strategy="lazyOnload" />
        <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" />
        <MobileNavBar />
      </body>
    </html>
  )
}

