import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/beheer/',
      },
    ],
    sitemap: 'https://www.sterrenlucht.nl/sitemap.xml',
  }
}
