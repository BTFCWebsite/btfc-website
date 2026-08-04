'use client'

import { useEffect } from 'react'

type ProgrammeFixture = {
  _id: string
  date: string
  opponent: string
  team: string
  venue: string
  kickoff?: string
  programmeUrl?: string
}

function fixtureDay(date: string) {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })
}

function fixtureDate(date: string) {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function programmeLink(url: string, compact = false) {
  const link = document.createElement('a')
  link.href = url
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  link.textContent = compact ? '📖 Programme' : '📖 Matchday Programme →'
  link.dataset.programmeLink = 'true'
  Object.assign(link.style, {
    display: 'inline-block',
    marginTop: compact ? '10px' : '13px',
    marginRight: '14px',
    color: '#1149D8',
    fontFamily: "'Montserrat',sans-serif",
    fontSize: compact ? '11px' : '12px',
    fontWeight: '800',
    textDecoration: 'none',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
  })
  return link
}

function addFixtureLinks(fixtures: ProgrammeFixture[]) {
  const containers = Array.from(document.querySelectorAll('tr, article')) as HTMLElement[]

  fixtures.forEach((fixture) => {
    const opponent = fixture.opponent.toLowerCase()
    const day = fixtureDay(fixture.date).toLowerCase()

    containers.forEach((container) => {
      const text = (container.textContent || '').toLowerCase()
      if (!text.includes(opponent) || !text.includes('home') || (day && !text.includes(day))) return
      if (container.querySelector('[data-programme-link="true"]')) return

      if (container.tagName === 'TR') {
        const cells = container.querySelectorAll('td')
        const target = cells[cells.length - 1] as HTMLElement | undefined
        if (target) {
          const existing = target.textContent?.trim()
          if (existing === '—') target.textContent = ''
          target.appendChild(programmeLink(fixture.programmeUrl || '', true))
        }
      } else {
        container.appendChild(programmeLink(fixture.programmeUrl || ''))
      }
    })
  })
}

function addHomepageProgramme(fixtures: ProgrammeFixture[]) {
  const cards = document.querySelector('.hero-cards') as HTMLElement | null
  if (!cards || document.querySelector('[data-home-programme="true"]')) return

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const nextProgramme = fixtures
    .filter((fixture) => fixture.team === 'First XI' && fixture.venue === 'Home' && new Date(fixture.date).getTime() >= today.getTime())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]

  if (!nextProgramme?.programmeUrl) return

  const link = document.createElement('a')
  link.href = nextProgramme.programmeUrl
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  link.dataset.homeProgramme = 'true'
  Object.assign(link.style, {
    display: 'block',
    width: '100%',
    maxWidth: cards.style.maxWidth || '1100px',
    marginTop: '16px',
    padding: '16px 22px',
    boxSizing: 'border-box',
    border: '1px solid rgba(255,255,255,.34)',
    borderLeft: '4px solid #FBBF24',
    borderRadius: '8px',
    background: 'rgba(4,27,95,.70)',
    color: '#fff',
    textDecoration: 'none',
    textAlign: 'left',
    boxShadow: '0 8px 24px rgba(0,0,0,.20)',
  })
  link.innerHTML = `
    <div style="font-family:'Montserrat',sans-serif;font-weight:700;font-size:9px;color:rgba(255,255,255,.75);letter-spacing:.16em;text-transform:uppercase;margin-bottom:6px">Official Matchday Programme</div>
    <div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:22px;letter-spacing:.03em;line-height:1.08">BTFC vs ${nextProgramme.opponent}</div>
    <div style="font-family:'Montserrat',sans-serif;font-size:11px;color:rgba(255,255,255,.78);margin-top:7px">${fixtureDate(nextProgramme.date)}${nextProgramme.kickoff ? ` · ${nextProgramme.kickoff}` : ''} · Read free online →</div>
  `
  cards.insertAdjacentElement('afterend', link)
}

export default function ProgrammeLinks() {
  useEffect(() => {
    let cancelled = false

    async function loadProgrammes() {
      try {
        const response = await fetch('/api/content?type=fixtures', { cache: 'no-store' })
        if (!response.ok) return
        const data: ProgrammeFixture[] = await response.json()
        if (cancelled) return

        const programmes = (data || []).filter((fixture) =>
          fixture?.programmeUrl && fixture.team === 'First XI' && fixture.venue === 'Home'
        )

        addHomepageProgramme(programmes)

        let attempts = 0
        const timer = window.setInterval(() => {
          addFixtureLinks(programmes)
          attempts += 1
          if (attempts >= 12) window.clearInterval(timer)
        }, 500)
      } catch (error) {
        console.error('Unable to load matchday programmes:', error)
      }
    }

    loadProgrammes()
    return () => { cancelled = true }
  }, [])

  return null
}
