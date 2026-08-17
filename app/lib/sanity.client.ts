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

export async function getSiteSettings() { return fetchContent<any>('settings') }
export async function getNewsArticles() { return fetchContent<any[]>('news') }
export async function getFixtures() {
  const [manualResult, firstTeamResult] = await Promise.allSettled([
    fetchContent<any[]>('fixtures'),
    fetch('/api/full-time?team=First%20XI&widget=969980533&division=320568525&kind=matches', { cache: 'no-store' })
      .then(response => response.ok ? response.json() : { matches: [] }),
  ])

  const manualFixtures = manualResult.status === 'fulfilled' ? (manualResult.value || []) : []
  const liveFirstTeam = firstTeamResult.status === 'fulfilled' && Array.isArray(firstTeamResult.value?.matches)
    ? firstTeamResult.value.matches
    : []

  if (!liveFirstTeam.length) return manualFixtures

  const combined = [...liveFirstTeam, ...manualFixtures]
  return combined.filter((fixture: any, index: number, all: any[]) =>
    all.findIndex((candidate: any) =>
      candidate?._id === fixture?._id ||
      (candidate?.date === fixture?.date && candidate?.team === fixture?.team && String(candidate?.opponent || '').toLowerCase() === String(fixture?.opponent || '').toLowerCase())
    ) === index
  )
}
export async function getMatchFeeds() {
  try {
    return await fetchContent<any[]>('matchFeeds')
  } catch (error) {
    console.warn('Match feed configuration could not be loaded; using First XI fallback.', error)
    return [
      {
        team: 'First XI',
        snippet: `<div><a href="https://fulltime.thefa.com/index.html?divisionseason=320568525">First XI</a></div>\n<script>var lrcode = '969980533'</script>`,
      },
    ]
  }
}
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
