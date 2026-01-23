import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
    ],
    sitemap: [
      'https://www.radiodelvolga.com.ar/sitemap.xml',
      'https://radiodelvolga.com.ar/sitemap.xml',
    ],
  }
}
