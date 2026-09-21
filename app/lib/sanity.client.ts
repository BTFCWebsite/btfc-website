import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: 'vm0n9zl5',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  token: undefined,
})

async function fetchContent<T>(type: string, params?: Record<string, string>): Promise<T> {
  if (typeof window === 'undefined') {
    throw new Error('The same-origin content endpoint is intended for browser requests')
  }

  const search = new URLSearchParams({ type, ...(params || {}) })
  const needsFreshData = ['settings', 'players', 'staff', 'player', 'programmes', 'news'].includes(type)
  const response = await fetch(`/api/content?${search.toString()}`, {
    cache: needsFreshData ? 'no-store' : 'default',
  })
  if (!response.ok) throw new Error(`Content request failed (${response.status})`)
  return response.json()
}

// Editorial announcement published in code while the regular news feed remains in Sanity.
// Remove this item if the story is subsequently added to Sanity, to avoid a duplicate.
const HELLENIC_LEAGUE_ANNOUNCEMENT = {
  _id: 'announcement-hellenic-league-new-website-2026',
  title: 'Hellenic League launches new website',
  category: 'Announcements',
  date: '2026-09-21',
  summary: 'The league has a new official website. Please update your bookmarks and use the new address for league news, fixtures, results and tables.',
  slug: 'hellenic-league-new-website',
  showUntil: '2026-11-01',
}

export async function getSiteSettings() { return fetchContent<any>('settings') }
export async function getNewsArticles() {
  const news = await fetchContent<any[]>('news')
  return [HELLENIC_LEAGUE_ANNOUNCEMENT, ...(Array.isArray(news) ? news.filter(item => item.slug !== HELLENIC_LEAGUE_ANNOUNCEMENT.slug) : [])]
}
export async function getFixtures() { return fetchContent<any[]>('fixtures') }
export async function getMatchFeeds() { return fetchContent<any[]>('matchFeeds') }
export async function getMatchdayProgrammes() { return fetchContent<any[]>('programmes') }
export async function getSponsors() { return fetchContent<any[]>('sponsors') }
export async function getSponsorshipPackages() { return fetchContent<any[]>('sponsorshipPackages') }
export async function getPlayers() { return fetchContent<any[]>('players') }
export async function getTeamStaff() { return fetchContent<any[]>('staff') }
export async function getTeamsContent() {
  return fetchContent<{ players: any[]; staff: any[]; fixtures: any[]; settings: any }>('teams')
}
export async function getPlayer(id: string) {
  return fetchContent<any | null>('player', { id })
}

export async function getLatestNews() {
  return client.fetch(
    `*[_type == "fixture"] | order(date asc) {
      _id, title, category, date, summary,
      "imageUrl": image.asset->url
    }`,
    {},
    { next: { revalidate: 60 } }
  )
}
