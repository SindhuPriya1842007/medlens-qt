import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://medlens-swart.vercel.app'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/patient/',
        '/reports/',
        '/labs/',
        '/medications/',
        '/allergies/',
        '/timeline/',
        '/audit/',
        '/verification/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}