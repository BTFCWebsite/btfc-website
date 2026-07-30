'use client'

import { useEffect } from 'react'
import { getMatchFeeds } from './lib/sanity.client'

type Fixture = {
  date?: string
  opponent?: string
  team?: string
  venue?: string
  kickoff?: string
  played?: boolean
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function HomeNextFixture() {
  useEffect(() => {
    let cancelled = false

    async function loadNextFixture() {
      try {
        const feeds = await getMatchFeeds()
        const firstTeamFeed = (feeds || []).find((feed: any) => {
          const team = String(feed?.team || '').toLowerCase().replace(/[^a-z0-9]/g, '')
          return team.includes('first')
        })

        const snippet = firstTeamFeed?.snippet || ''
        const widget = snippet.match(/\blrcode\s*=\s*['\"](\d+)['\"]/i)?.[1]
        const division = snippet.match(/[?&]divisionseason=(\d+)/i)?.[1]
        if (!widget) return

        const params = new URLSearchParams({
          team: 'First XI',
          widget,
          kind: 'matches',
        })
        if (division) params.set('division', division)

        const response = await fetch(`/api/full-time?${params.toString()}`)
        if (!response.ok) return

        const payload = await response.json()
        const now = Date.now()
        const next = (payload?.matches || [])
          .filter((fixture: Fixture) => {
            if (!fixture?.date || !fixture?.opponent || fixture.played === true) return false
            const date = new Date(fixture.date).getTime()
            return Number.isFinite(date) && date >= now
          })
          .sort((a: Fixture, b: Fixture) =>
            new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()
          )[0]

        if (cancelled || !next?.date || !next?.opponent) return

        const label = Array.from(document.querySelectorAll('div')).find(
          element => element.textContent?.trim() === 'Next Fixture'
        )
        const card = label?.parentElement
        if (!card) return

        const rows = Array.from(card.children) as HTMLElement[]
        const title = rows[1]
        const details = rows[2]
        if (!title || !details) return

        title.textContent = next.venue === 'Away'
          ? `${next.opponent} vs BTFC`
          : `BTFC vs ${next.opponent}`

        const time = next.kickoff ? ` · ${next.kickoff}` : ''
        details.textContent = `${formatDate(next.date)}${time}`
      } catch (error) {
        console.error('Unable to load the homepage fixture', error)
      }
    }

    loadNextFixture()
    return () => { cancelled = true }
  }, [])

  return null
}
