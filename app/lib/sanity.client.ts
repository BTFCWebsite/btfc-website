import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: 'vm0n9zl5',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: undefined,
})

async function fetchContent<T>(type: string): Promise<T> {
  if (typeof window === 'undefined') {
    throw new Error('The same-origin content endpoint is intended for browser requests')
  }

  const response = await fetch(`/api/content?type=${encodeURIComponent(type)}`, {
    cache: 'no-store',
  })

  if (!response.ok) throw new Error(`Content request failed (${response.status})`)
  return response.json()
}

export async function getSiteSettings() {
  return fetchContent<any>('settings')
}

export async function getLatestNews() {
  return client.fetch(
    `*[_type == "fixture"] | order(date asc) {
      _id, title, category, date, summary,
      "imageUrl": image.asset->url
    }`,
    {},
    { cache: 'no-store' }
  )
}

export async function getNewsArticles() {
  return fetchContent<any[]>('news')
}

export async function getFixtures() {
  return fetchContent<any[]>('fixtures')
}

export async function getMatchFeeds() {
  return fetchContent<any[]>('matchFeeds')
}

export async function getSponsors() {
  return fetchContent<any[]>('sponsors')
}
export async function getPlayers() {
  return fetchContent<any[]>('players')
}

export async function getTeamStaff() {
  return fetchContent<any[]>('staff')
}
