'use client'

import {useEffect} from 'react'
import {
  loadFullTimeWidgetMatches,
  loadFullTimeWidgetTable,
  type FullTimeFixture,
  type FullTimeLeagueRow,
} from './lib/fulltime.browser'

const TEAM_CONFIG: Record<string, {fixtureWidget: string; tableWidget: string; team: string} | null> = {
  'First XI': {fixtureWidget: '969980533', tableWidget: '251176067', team: 'First XI'},
  'Reserves': {fixtureWidget: '681011209', tableWidget: '625925242', team: 'Reserves'},
  'Under 17s': null,
}

function normalise(value = '') {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, '')
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
    return text === 'Last 8 Results' || text === 'Last 10 Results' || text === 'Last 10 League Results'
  }) as HTMLElement | undefined

  if (!heading) return null
  return {
    heading,
    row: heading.nextElementSibling as HTMLElement | null,
    container: heading.parentElement as HTMLElement | null,
  }
}

function findLeagueStatsGrid() {
  const card = findResultsCard()
  const grid = card?.container?.previousElementSibling as HTMLElement | null
  if (!grid || grid.children.length < 6) return null
  return grid
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

function isLeagueFixture(fixture: FullTimeFixture, label: string) {
  const competition = normalise(fixture.competition)
  if (!competition) return false

  if (label === 'First XI') {
    return competition.includes('divisionone') ||
      competition.includes('division1') ||
      competition.includes('uhl1') ||
      competition === 'hl1' ||
      competition.includes('hellenicleaguedivisionone')
  }

  if (label === 'Reserves') {
    return (competition.includes('stroud') && competition.includes('division2')) ||
      competition.includes('sdfl2') ||
      competition.includes('sdl2')
  }

  return false
}

function leagueResults(fixtures: FullTimeFixture[], label: string) {
  const played = fixtures.filter((fixture) =>
    fixture.played && fixture.date && fixture.btfcScore != null && fixture.opponentScore != null
  )
  const leagueOnly = played.filter((fixture) => isLeagueFixture(fixture, label))
  return (leagueOnly.length ? leagueOnly : played)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10)
}

function paintResults(fixtures: FullTimeFixture[], label: string) {
  const card = findResultsCard()
  if (!card?.row) return

  card.heading.textContent = 'Last 10 League Results'
  const latest = leagueResults(fixtures, label)
  card.row.replaceChildren()

  if (!latest.length) {
    const empty = document.createElement('span')
    empty.textContent = 'No league results published yet.'
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

function btfcLeagueRow(rows: FullTimeLeagueRow[], label: string) {
  const candidates = rows.filter((row) => {
    const team = normalise(row.team)
    return team.includes('brimscombe') && team.includes('thrupp')
  })

  if (label === 'Reserves') {
    return candidates.find((row) => normalise(row.team).includes('reserve')) || candidates[0] || null
  }

  if (label === 'First XI') {
    return candidates.find((row) => {
      const team = normalise(row.team)
      return !team.includes('reserve') && !team.includes('u17') && !team.includes('under17')
    }) || candidates[0] || null
  }

  return candidates[0] || null
}

function paintLeagueStats(row: FullTimeLeagueRow) {
  const grid = findLeagueStatsGrid()
  if (!grid) return

  const values: Record<string, string> = {
    position: String(row.position),
    points: String(row.points),
    wins: String(row.won),
    draws: String(row.drawn),
    losses: String(row.lost),
    goaldiff: row.goalDifference > 0 ? `+${row.goalDifference}` : String(row.goalDifference),
  }

  for (const tile of Array.from(grid.children) as HTMLElement[]) {
    const value = tile.children[0] as HTMLElement | undefined
    const label = tile.children[1] as HTMLElement | undefined
    if (!value || !label) continue
    const key = normalise(label.textContent || '')
    if (values[key] != null) value.textContent = values[key]
  }
}

export default function LiveTeamResults() {
  useEffect(() => {
    if (window.location.pathname !== '/teams') return

    let cancelled = false
    let activeTeam = ''
    const fixtureCache = new Map<string, FullTimeFixture[]>()
    const tableCache = new Map<string, FullTimeLeagueRow[]>()

    async function refresh() {
      const card = findResultsCard()
      if (card) card.heading.textContent = 'Last 10 League Results'

      const label = selectedTeamLabel()
      activeTeam = label
      const config = TEAM_CONFIG[label]
      if (!config) return

      if (fixtureCache.has(label)) paintResults(fixtureCache.get(label) || [], label)
      if (tableCache.has(label)) {
        const row = btfcLeagueRow(tableCache.get(label) || [], label)
        if (row) paintLeagueStats(row)
      }

      const [fixtureResult, tableResult] = await Promise.allSettled([
        fixtureCache.has(label)
          ? Promise.resolve(fixtureCache.get(label) || [])
          : loadFullTimeWidgetMatches(config.fixtureWidget, config.team, 18000),
        tableCache.has(label)
          ? Promise.resolve(tableCache.get(label) || [])
          : loadFullTimeWidgetTable(config.tableWidget, 18000),
      ])

      if (cancelled || activeTeam !== label) return

      if (fixtureResult.status === 'fulfilled') {
        fixtureCache.set(label, fixtureResult.value)
        paintResults(fixtureResult.value, label)
      }

      if (tableResult.status === 'fulfilled') {
        tableCache.set(label, tableResult.value)
        const row = btfcLeagueRow(tableResult.value, label)
        if (row) paintLeagueStats(row)
      }
    }

    let initialObserver: MutationObserver | null = null
    if (findResultsCard()) {
      refresh()
    } else {
      initialObserver = new MutationObserver(() => {
        if (!findResultsCard()) return
        initialObserver?.disconnect()
        initialObserver = null
        refresh()
      })
      initialObserver.observe(document.body, {childList: true, subtree: true})
    }

    const onClick = (event: MouseEvent) => {
      const button = (event.target as HTMLElement | null)?.closest('button')
      if (button && /First XI|Reserves|Under 17s/.test(button.textContent || '')) {
        window.setTimeout(refresh, 60)
      }
    }
    document.addEventListener('click', onClick)

    return () => {
      cancelled = true
      initialObserver?.disconnect()
      document.removeEventListener('click', onClick)
    }
  }, [])

  return null
}
