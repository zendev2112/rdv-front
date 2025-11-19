import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import MobileNavBar from '@/components/MobileNavBar'
import Script from 'next/script'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Radio del Volga',
  description: 'Radio del Volga',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/logo-dark.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)" />
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
        <Header />
        {children}
        <Script src="https://www.instagram.com/embed.js" strategy="lazyOnload" />
        <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" />
        <MobileNavBar />
      </body>
    </html>
  )
}

