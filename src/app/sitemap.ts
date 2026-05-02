// app/sitemap.ts
import { MetadataRoute } from 'next'
import { fetchNewsContent, parseNewsData, fetchEsportContent, parseEsportData } from '@/lib/newsHelper'
import { getClanData } from '@/lib/coc'
import { createClient } from '@libsql/client'

const baseUrl = 'https://3agang.pro'
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

async function getNewsArticles() {
  try {
    const newsData = await fetchNewsContent()
    const articles = parseNewsData(newsData)
    return articles.map(article => ({
      url: `${baseUrl}/news/article/${article.id}`,
      lastModified: new Date(article.postDate),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error fetching news for sitemap:', error)
    return []
  }
}

async function getEsportArticles() {
  try {
    const esportData = await fetchEsportContent()
    const articles = parseEsportData(esportData)
    return articles.map(article => ({
      url: `${baseUrl}/news/esports/${article.id}`,
      lastModified: new Date(article.postDate),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error fetching esports for sitemap:', error)
    return []
  }
}

async function getLayouts() {
  try {
    const result = await client.execute({
      sql: 'SELECT id, upload_date FROM layouts WHERE is_active = 1',
    })
    return result.rows.map(row => ({
      url: `${baseUrl}/layout/${row.id}`,
      lastModified: new Date(String(row.upload_date)),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error fetching layouts for sitemap:', error)
    return []
  }
}

async function getClanMembers() {
  try {
    const clan = await getClanData()
    if (!clan || !Array.isArray(clan.memberList)) return []

    return clan.memberList.map((member: any) => ({
      url: `${baseUrl}/members/${encodeURIComponent(member.tag)}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error fetching members for sitemap:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [newsArticles, esportArticles, layouts, members] = await Promise.all([
    getNewsArticles(),
    getEsportArticles(),
    getLayouts(),
    getClanMembers(),
  ])

  const baseRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sigma`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/members`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/warlog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tentang`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/layout`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/termsofservice`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/dmca`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  return [...baseRoutes, ...newsArticles, ...esportArticles, ...layouts, ...members]
}