'use client'

import { useEffect } from 'react'
import { loadFullTimeWidgetMatches, type FullTimeFixture } from './lib/fulltime.browser'

const FIRST_XI_WIDGET = '969980533'

function formatDate(value: string, long = false) {
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', long
    ? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    : { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function findFixtureCard(labelText: string) {
  const label = Array.from(document.querySelectorAll('div')).find(
    element => element.textContent?.trim() === labelText
  )
  return label?.parentElement as HTMLElement | null
}

function updateHomepage(fixtures: FullTimeFixture[]) {
  const latest = fixtures
    .filter((fixture) => fixture.played && fixture.date && fixture.opponent)
    .sort((a, b) => b.date.localeCompare(a.date))[0]

  const today = new Date().toISOString().slice(0, 10)
  const next = fixtures
    .filter((fixture) => !fixture.played && fixture.date >= today && fixture.opponent)
    .sort((a, b) => a.date.localeCompare(b.date))[0]

  if (latest) {
    const card = findFixtureCard('Latest Result')
    if (card) {
      const rows = Array.from(card.children) as HTMLElement[]
      const title = rows[1]
      const details = rows[2]
      if (title) title.textContent = `BTFC ${latest.btfcScore ?? 0}–${latest.opponentScore ?? 0} ${latest.opponent}`
      if (details) details.textContent = `${formatDate(latest.date)}${latest.competition ? ` · ${latest.competition}` : ''}`
      if (latest.sourceUrl) {
        const link = card.closest('a') as HTMLAnchorElement | null
        if (link) {
          link.href = latest.sourceUrl
          link.target = '_blank'
          link.rel = 'noopener noreferrer'
        }
      }
    }
  }

  if (next) {
    const card = findFixtureCard('Next Fixture')
    if (card) {
      const rows = Array.from(card.children) as HTMLElement[]
      const title = rows[1]
      const details = rows[2]
      if (title) title.textContent = next.venue === 'Away' ? `${next.opponent} vs BTFC` : `BTFC vs ${next.opponent}`
      if (details) details.textContent = `${formatDate(next.date)}${next.kickoff ? ` · ${next.kickoff}` : ''}`
      card.classList.add('next-fixture-loaded')
    }
  }
}

function updateMatchday(fixtures: FullTimeFixture[]) {
  const today = new Date().toISOString().slice(0, 10)
  const nextHome = fixtures
    .filter((fixture) => !fixture.played && fixture.venue === 'Home' && fixture.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))[0]
  if (!nextHome) return

  const marker = Array.from(document.querySelectorAll('div')).find(
    element => element.textContent?.trim() === 'Your Matchday · Next Home Fixture'
  )
  const card = marker?.parentElement as HTMLElement | null
  if (!card) return

  const heading = card.querySelector('h1') as HTMLElement | null
  const details = Array.from(card.querySelectorAll('p')).find((element) => element.textContent?.includes('📅')) as HTMLElement | undefined
  if (heading) heading.textContent = `BTFC v ${nextHome.opponent}`
  if (details) details.textContent = `📅 ${formatDate(nextHome.date, true)} · ⏰ ${nextHome.kickoff || 'TBC'} · 📍 Brackenfern Meadow`
}

export default function HomeNextFixture() {
  useEffect(() => {
    const path = window.location.pathname
    if (path !== '/' && path !== '/matchday') return

    let cancelled = false
    let timers: number[] = []

    async function loadOfficialFixtures() {
      try {
        const fixtures = await loadFullTimeWidgetMatches(FIRST_XI_WIDGET, 'First XI', 18000)
        if (cancelled) return

        const apply = () => {
          if (cancelled) return
          if (window.location.pathname === '/') updateHomepage(fixtures)
          if (window.location.pathname === '/matchday') updateMatchday(fixtures)
        }

        apply()
        timers = [500, 1500, 3000].map((delay) => window.setTimeout(apply, delay))
      } catch (error) {
        console.error('Unable to load the official Full-Time browser widget', error)
      }
    }

    loadOfficialFixtures()
    return () => {
      cancelled = true
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  return (
    <style>{`
      .hero-cards > :nth-child(2) {
        position: relative;
      }
      .hero-cards > :nth-child(2) > div:nth-child(2),
      .hero-cards > :nth-child(2) > div:nth-child(3) {
        visibility: hidden;
      }
      .hero-cards > :nth-child(2)::after {
        content: 'Loading next fixture…';
        display: block;
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 18px;
        font-weight: 800;
        color: #fff;
        letter-spacing: .03em;
        line-height: 1.2;
      }
      .hero-cards > :nth-child(2).next-fixture-loaded > div:nth-child(2),
      .hero-cards > :nth-child(2).next-fixture-loaded > div:nth-child(3) {
        visibility: visible;
      }
      .hero-cards > :nth-child(2).next-fixture-loaded::after {
        display: none;
      }
    `}</style>
  )
}
