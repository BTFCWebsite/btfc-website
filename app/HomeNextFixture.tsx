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

function findNextFixtureCard() {
  const label = Array.from(document.querySelectorAll('div')).find(
    element => element.textContent?.trim() === 'Next Fixture'
  )
  return label?.parentElement as HTMLElement | null
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

        const card = findNextFixtureCard()
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
        card.classList.add('next-fixture-loaded')
      } catch (error) {
        console.error('Unable to load the homepage fixture', error)
      }
    }

    loadNextFixture()
    return () => { cancelled = true }
  }, [])

  return (
    <style>{`
      .hero-cards > div:nth-child(2) {
        position: relative;
      }
      .hero-cards > div:nth-child(2) > div:nth-child(2),
      .hero-cards > div:nth-child(2) > div:nth-child(3) {
        visibility: hidden;
      }
      .hero-cards > div:nth-child(2)::after {
        content: 'Loading next fixture…';
        display: block;
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 18px;
        font-weight: 800;
        color: #fff;
        letter-spacing: .03em;
        line-height: 1.2;
      }
      .hero-cards > div:nth-child(2).next-fixture-loaded > div:nth-child(2),
      .hero-cards > div:nth-child(2).next-fixture-loaded > div:nth-child(3) {
        visibility: visible;
      }
      .hero-cards > div:nth-child(2).next-fixture-loaded::after {
        display: none;
      }
    `}</style>
  )
}
