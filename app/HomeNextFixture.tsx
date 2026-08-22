'use client'

import { useEffect } from 'react'
import { loadFullTimeWidgetMatches, type FullTimeFixture } from './lib/fulltime.browser'

const FIRST_XI_WIDGET = '969980533'
const FIXTURE_CACHE_KEY = 'btfc:first-xi-fixtures:v1'
const FIXTURE_CACHE_MAX_AGE = 24 * 60 * 60 * 1000

function formatDate(value: string, long = false) {
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', long
    ? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    : { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function readFixtureCache(): FullTimeFixture[] {
  try {
    const raw = window.localStorage.getItem(FIXTURE_CACHE_KEY)
    if (!raw) return []
    const cached = JSON.parse(raw)
    if (!cached?.savedAt || !Array.isArray(cached?.fixtures)) return []
    if (Date.now() - Number(cached.savedAt) > FIXTURE_CACHE_MAX_AGE) return []
    return cached.fixtures as FullTimeFixture[]
  } catch {
    return []
  }
}

function writeFixtureCache(fixtures: FullTimeFixture[]) {
  try {
    window.localStorage.setItem(FIXTURE_CACHE_KEY, JSON.stringify({ savedAt: Date.now(), fixtures }))
  } catch {
    // Browsers with storage disabled can still use the live Full-Time widget.
  }
}

function findFixtureCard(labelText: string) {
  const label = Array.from(document.querySelectorAll('div')).find(
    element => element.textContent?.trim() === labelText
  )
  return label?.parentElement as HTMLElement | null
}

function resizeHomepageFixtureCards() {
  if (window.innerWidth <= 768) return
  const container = document.querySelector('.hero-cards') as HTMLElement | null
  if (!container) return

  const cards = Array.from(container.children).filter(
    (element) => element instanceof HTMLElement
  ) as HTMLElement[]
  if (!cards.length) return

  let totalWidth = 0
  for (const card of cards) {
    const title = card.children[1] as HTMLElement | undefined
    if (!title) continue

    const range = document.createRange()
    range.selectNodeContents(title)
    const textWidth = Math.ceil(range.getBoundingClientRect().width)
    range.detach()

    const requiredWidth = textWidth + 64
    const cardWidth = Math.min(460, Math.max(350, requiredWidth))
    card.style.flex = '0 0 auto'
    card.style.width = `${cardWidth}px`
    card.style.maxWidth = 'none'
    totalWidth += cardWidth
  }

  const gap = cards.length > 1 ? 16 * (cards.length - 1) : 0
  container.style.width = `${totalWidth + gap}px`
  container.style.maxWidth = 'calc(100vw - 48px)'
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

  window.requestAnimationFrame(resizeHomepageFixtureCards)
}

function updateMatchday(fixtures: FullTimeFixture[]) {
  const today = new Date().toISOString().slice(0, 10)
  const nextHome = fixtures
    .filter((fixture) => !fixture.played && fixture.venue === 'Home' && fixture.date >= today && fixture.opponent)
    .sort((a, b) => a.date.localeCompare(b.date))[0]
  if (!nextHome) return

  const competition = document.querySelector('.matchday-fixture-competition') as HTMLElement | null
  const heading = document.querySelector('.matchday-fixture-title') as HTMLElement | null
  const details = document.querySelector('.matchday-fixture-details') as HTMLElement | null

  if (competition) competition.textContent = nextHome.competition || 'First XI'
  if (heading) heading.textContent = `BTFC v ${nextHome.opponent}`
  if (details) details.textContent = `📅 ${formatDate(nextHome.date, true)} · ⏰ ${nextHome.kickoff || 'TBC'} · 📍 Brackenfern Meadow`
}

export default function HomeNextFixture() {
  useEffect(() => {
    const path = window.location.pathname
    if (path !== '/' && path !== '/matchday' && path !== '/fixtures') return

    let cancelled = false
    let timers: number[] = []

    const cachedFixtures = readFixtureCache()
    if (cachedFixtures.length) {
      if (path === '/') updateHomepage(cachedFixtures)
      if (path === '/matchday') updateMatchday(cachedFixtures)
    }

    const handleResize = () => {
      if (window.location.pathname === '/') resizeHomepageFixtureCards()
    }
    window.addEventListener('resize', handleResize)

    async function loadOfficialFixtures() {
      try {
        const fixtures = await loadFullTimeWidgetMatches(FIRST_XI_WIDGET, 'First XI', 18000)
        if (cancelled) return
        writeFixtureCache(fixtures)

        const apply = () => {
          if (cancelled) return
          const currentPath = window.location.pathname
          if (currentPath === '/') updateHomepage(fixtures)
          if (currentPath === '/matchday') updateMatchday(fixtures)
        }

        apply()
        if (path !== '/fixtures') {
          timers = [500, 1500, 3000].map((delay) => window.setTimeout(apply, delay))
        }
      } catch (error) {
        console.error('Unable to load the official Full-Time browser widget', error)
      }
    }

    if (path === '/') window.requestAnimationFrame(resizeHomepageFixtureCards)
    loadOfficialFixtures()
    return () => {
      cancelled = true
      timers.forEach((timer) => window.clearTimeout(timer))
      window.removeEventListener('resize', handleResize)
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
      @media(max-width:768px) {
        .hero-cards {
          width: 100% !important;
          max-width: none !important;
        }
        .hero-cards > * {
          width: 100% !important;
          max-width: none !important;
          flex: 1 1 auto !important;
        }
      }
    `}</style>
  )
}
