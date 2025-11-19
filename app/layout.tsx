import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import MobileNavBar from '@/components/MobileNavBar'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Radio del Volga',
  description: 'Radio del Volga',
  icons: [
    {
      rel: 'icon',
      url: '/logo.svg',
      media: '(prefers-color-scheme: light)',
      type: 'image/svg+xml',
    },
    {
      rel: 'icon',
      url: '/logo-dark.svg',
      media: '(prefers-color-scheme: dark)',
      type: 'image/svg+xml',
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
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
        <script async src="https://www.instagram.com/embed.js"></script>
        <script
          async
          src="https://platform.twitter.com/widgets.js"
          charSet="utf-8"
        ></script>
        <MobileNavBar />
      </body>
    </html>
  )
}

