import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import MobileNavBar from '@/components/MobileNavBar'
import Footer from "@/components/Footer"


const inter = Inter({ subsets: ["latin"] })

export const metadata = {
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
        {/* Remove styled-jsx and use a regular style tag */}
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
        {/* <GlobalMobileNav /> */}
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

