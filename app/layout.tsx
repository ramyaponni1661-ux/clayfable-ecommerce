import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { CartProvider } from "@/contexts/CartContext"
import { WishlistProvider } from "@/contexts/WishlistContext"
import { SessionProvider } from "@/components/providers/session-provider"
import { Toaster } from "sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "Clayfable - Authentic Terracotta Crafted with Heritage | EST. 1952",
  description:
    "Discover premium terracotta cookware and serveware from Clayfable. 72 years of craftsmanship excellence, serving 50,000+ customers worldwide with authentic Indian terracotta products.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <SessionProvider>
          <CartProvider>
            <WishlistProvider>
              <Suspense fallback={null}>
                {children}
                <Analytics />
              </Suspense>
            </WishlistProvider>
          </CartProvider>
        </SessionProvider>
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: 'white',
              border: '1px solid #e5e7eb',
              color: '#374151',
            },
          }}
        />
      </body>
    </html>
  )
}
