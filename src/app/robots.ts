import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/', 
        '/settings/', 
        '/focus/', 
        '/calendar/', 
        '/tasks/', 
        '/courses/', 
        '/academic-planning/',
        '/self-learning/',
        '/reflections/'
      ],
    },
    sitemap: 'https://studyflow-frontend-roan.vercel.app/sitemap.xml',
  }
}
