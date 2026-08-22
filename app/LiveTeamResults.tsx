'use client'

import {useEffect} from 'react'
import {loadFullTimeWidgetMatches, type FullTimeFixture} from './lib/fulltime.browser'

const TEAM_WIDGETS: Record<string, {widget: string; team: string} | null> = {
  'First XI': {widget: '969980533', team: 'First XI'},
  'Reserves': {widget: '681011209', team: 'Reserves'},
  'Under 17s': null,
}

function resultLetter(fixture: FullTimeFixture) {
  if (fixture.btfcScore == null || fixture.opponentScore == null) return null
  if (fixture.btfcScore > fixture.opponentScore) return 'W'
  if (fixture.btfcScore < fixture.opponentScore) return 'L'
  return 'D'
}

function findResultsCard() {
  const heading = Array.from(document.querySelectorAll('div')).find((element) => {
    const text = element.textContent?.trim()
    return text === 'Last 8 Results' || text === 'Last 10 Results'
  }) as HTMLElement | undefined

  if (!heading) return null
  return {
    heading,
    row: heading.nextElementSibling as HTMLElement | null,
  }
}

function selectedTeamLabel() {
  const buttons = Array.from(document.querySelectorAll('button')) as HTMLButtonElement[]
  const selected = buttons.find((button) => {
    const text = button.textContent || ''
    if (!/First XI|Reserves|Under 17s/.test(text)) return false
    const background = button.style.background || button.style.backgroundColor
    return background.includes('1149D8') || background.includes('rgb(17, 73, 216)')
  })

  const text = selected?.textContent || ''
  if (text.includes('Reserves')) return 'Reserves'
  if (text.includes('Under 17s')) return 'Under 17s'
  return 'First XI'
}

function paintResults(fixtures: FullTimeFixture[]) {
  const card = findResultsCard()
  if (!card?.row) return

  card.heading.textContent = 'Last 10 Results'
  const latest = fixtures
    .filter((fixture) => fixture.played && fixture.date && fixture.btfcScore != null && fixture.opponentScore != null)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10)

  card.row.replaceChildren()

  if (!latest.length) {
    const empty = document.createElement('span')
    empty.textContent = 'No results published yet.'
    Object.assign(empty.style, {fontSize: '12px', color: '#9CA3AF'})
    card.row.appendChild(empty)
    return
  }

  for (const fixture of latest) {
    const result = resultLetter(fixture)
    if (!result) continue
    const badge = document.createElement('div')
    badge.textContent = result
    badge.title = `${fixture.date} · ${fixture.opponent} · BTFC ${fixture.btfcScore}-${fixture.opponentScore}`
    Object.assign(badge.style, {
      width: '38px',
      height: '38px',
      borderRadius: '6px',
      background: result === 'W' ? '#22C55E' : result === 'D' ? '#F59E0B' : '#EF4444',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Barlow Condensed',sans-serif",
      fontWeight: '800',
      fontSize: '17px',
      color: '#fff',
    })
    card.row.appendChild(badge)
  }
}

export default function LiveTeamResults() {
  useEffect(() => {
    if (window.location.pathname !== '/teams') return

    let cancelled = false
    let activeTeam = ''
    const cache = new Map<string, FullTimeFixture[]>()

    async function refresh() {
      const card = findResultsCard()
      if (card) card.heading.textContent = 'Last 10 Results'

      const label = selectedTeamLabel()
      if (label === activeTeam && cache.has(label)) {
        paintResults(cache.get(label) || [])
        return
      }
      activeTeam = label

      const config = TEAM_WIDGETS[label]
      if (!config) return

      try {
        const fixtures = cache.get(label) || await loadFullTimeWidgetMatches(config.widget, config.team, 18000)
        if (cancelled || activeTeam !== label) return
        cache.set(label, fixtures)
        paintResults(fixtures)
      } catch (error) {
        console.error(`Unable to load live ${label} results`, error)
      }
    }

    const observer = new MutationObserver(() => {
      window.clearTimeout((refresh as any)._timer)
      ;(refresh as any)._timer = window.setTimeout(refresh, 80)
    })
    observer.observe(document.body, {childList: true, subtree: true, attributes: true, attributeFilter: ['style']})

    const onClick = (event: MouseEvent) => {
      const button = (event.target as HTMLElement | null)?.closest('button')
      if (button && /First XI|Reserves|Under 17s/.test(button.textContent || '')) {
        window.setTimeout(refresh, 40)
      }
    }
    document.addEventListener('click', onClick)

    refresh()
    return () => {
      cancelled = true
      observer.disconnect()
      document.removeEventListener('click', onClick)
      window.clearTimeout((refresh as any)._timer)
    }
  }, [])

  return null
}
