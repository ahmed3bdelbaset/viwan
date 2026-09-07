import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { RevealProvider } from '@/components/site/reveal'
import './globals.css'
import { PageTransition }  from '@/components/motion/page-transition'
import { ScrollReveal }    from '@/components/motion/scroll-reveal'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'VIWAN — Architecture, Interiors, Landscape & Engineering',
    template: '%s — VIWAN',
  },
  description:
    'VIWAN is an integrated architecture, engineering and design consultancy based in Cairo, creating thoughtful environments through architecture, interiors, landscape and multidisciplinary engineering.',
  keywords: [
    'architecture firm Cairo',
    'interior design Egypt',
    'landscape design',
    'engineering consultancy',
    'VIWAN',
    'architecture engineering consultancy Riyadh',
  ],
  openGraph: {
    title: 'VIWAN — Integrated thinking. Precise execution.',
    description:
      'VIWAN brings architecture, engineering, interiors, landscape, and technical expertise together under one integrated consultancy.',
    type: 'website',
    images: ['/images/hero-villa.png'],
  },
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#F3F0E9',
}
import { LanguageProvider } from '@/lib/i18n'
import { GoogleAnalytics } from '@/components/site/google-analytics'

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} bg-background`}>
      <body className="antialiased">
        <GoogleAnalytics />
        <LanguageProvider>
          <RevealProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
          </RevealProvider>
        </LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
