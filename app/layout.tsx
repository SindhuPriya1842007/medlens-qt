import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { Suspense } from 'react'
import { AuthProvider } from '@/components/auth-provider'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

// export const metadata: Metadata = {
//   title: 'MedLens — AI Clinical Information Intelligence',
//   description:
//     'Turn complex medical information into a clear, connected record. MedLens structures medical reports and patient information into traceable, reviewable records with responsible AI assistance.',
//   generator: 'v0.app',
//   keywords: [
//     'medical records',
//     'health data',
//     'lab results',
//     'clinical intelligence',
//     'responsible AI',
//     'healthcare SaaS',
//   ],
// }

export const metadata: Metadata = {
  metadataBase: new URL('https://medlens-swart.vercel.app'),

  title: {
    default: 'MedLens — AI Clinical Information Intelligence',
    template: '%s | MedLens',
  },

  description:
    'MedLens turns complex medical information into a clear, connected record with structured medical reports, lab trends, provenance tracking, and responsible AI assistance.',

  keywords: [
    'medical records',
    'medical report analysis',
    'lab results',
    'health records',
    'clinical information',
    'responsible AI',
    'healthcare AI',
  ],

  authors: [
    {
      name: 'MedLens',
    },
  ],

  creator: 'MedLens',

  openGraph: {
    type: 'website',
    url: 'https://medlens-swart.vercel.app',
    siteName: 'MedLens',
    title: 'MedLens — AI Clinical Information Intelligence',
    description:
      'Turn complex medical information into a clear, connected medical record with responsible AI assistance.',
  },

  twitter: {
    card: 'summary',
    title: 'MedLens — AI Clinical Information Intelligence',
    description:
      'Structured, traceable medical information with responsible AI assistance.',
  },

  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7fafb' },
    { media: '(prefers-color-scheme: dark)', color: '#141a24' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`bg-background ${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased">
        <Suspense fallback={null}>
          <AuthProvider>{children}</AuthProvider>
        </Suspense>
        <Toaster />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
