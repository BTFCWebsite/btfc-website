'use client'

import { useEffect } from 'react'

type Fixture = {
  date?: string
  opponent?: string
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
        const response = await fetch(
          '/api/full-time?team=First%20XI&widget=969980533&division=320568525&kind=matches',
          { cache: 'no-store' }
        )
        if (!response.ok) return

        const payload = await response.json()
        const startOfToday = new Date()
        startOfToday.setHours(0, 0, 0, 0)

        const next = (payload?.matches || [])
          .filter((fixture: Fixture) => {
            if (!fixture?.date || !fixture?.opponent || fixture.played === true) return false
            const fixtureDate = new Date(fixture.date).getTime()
            return Number.isFinite(fixtureDate) && fixtureDate >= startOfToday.getTime()
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
