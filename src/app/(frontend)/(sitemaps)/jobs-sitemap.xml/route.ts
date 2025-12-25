import { getServerSideURL } from '@/utilities/getURL'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const GET = async () => {
  const payload = await getPayload({
    config: configPromise,
  })

  const results = await payload.find({
    collection: 'jobs',
    overrideAccess: false,
    draft: false,
    depth: 0,
    limit: 1000,
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  const dateFallback = new Date().toISOString()

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${results.docs
      .map((doc) => {
        return `
      <url>
          <loc>${getServerSideURL()}/jobs/${doc.id}</loc>
          <lastmod>${doc.updatedAt || dateFallback}</lastmod>
      </url>
    `
      })
      .join('')}
  </urlset>
  `

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'text/xml',
    },
  })
}
