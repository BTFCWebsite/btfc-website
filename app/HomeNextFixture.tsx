'use client'

import { useEffect } from 'react'

type Fixture = {
  date?: string
  opponent?: string
  venue?: string
  competition?: string
  kickoff?: string
  played?: boolean
  btfcScore?: number
  opponentScore?: number
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

function findFixtureCard(labelText: string) {
  const label = Array.from(document.querySelectorAll('div')).find(
    element => element.textContent?.trim() === labelText
  )
  return label?.parentElement as HTMLElement | null
}

function updateLatestResult(fixtures: Fixture[]) {
  const latest = fixtures
    .filter((fixture) =>
      fixture?.played === true &&
      fixture?.date &&
      fixture?.opponent &&
      fixture.btfcScore != null &&
      fixture.opponentScore != null
    )
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())[0]

  if (!latest?.date || !latest?.opponent) return

  const card = findFixtureCard('Latest Result')
  if (!card) return

  const rows = Array.from(card.children) as HTMLElement[]
  const title = rows[1]
  const details = rows[2]
  if (!title || !details) return

  const score = document.createElement('span')
  score.style.color = '#EF4444'
  score.textContent = `${latest.btfcScore}–${latest.opponentScore}`
  title.replaceChildren(
    document.createTextNode('BTFC '),
    score,
    document.createTextNode(` ${latest.opponent}`)
  )

  details.textContent = `${formatDate(latest.date)}${latest.competition ? ` · ${latest.competition}` : ''}`
}

function updateNextFixture(fixtures: Fixture[]) {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const next = fixtures
    .filter((fixture) => {
      if (!fixture?.date || !fixture?.opponent || fixture.played === true) return false
      const fixtureDate = new Date(fixture.date).getTime()
      return Number.isFinite(fixtureDate) && fixtureDate >= startOfToday.getTime()
    })
    .sort((a, b) =>
      new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()
    )[0]

  if (!next?.date || !next?.opponent) return

  const card = findFixtureCard('Next Fixture')
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
}

export default function HomeNextFixture() {
  useEffect(() => {
    let cancelled = false

    async function loadHomepageFixtures() {
      try {
        const response = await fetch(
          '/api/full-time?team=First%20XI&widget=969980533&division=320568525&kind=matches',
          { cache: 'no-store' }
        )
        if (!response.ok || cancelled) return

        const payload = await response.json()
        if (cancelled) return

        const fixtures = (payload?.matches || []) as Fixture[]
        updateLatestResult(fixtures)
        updateNextFixture(fixtures)
      } catch (error) {
        console.error('Unable to load the homepage fixtures', error)
      }
    }

    loadHomepageFixtures()
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
