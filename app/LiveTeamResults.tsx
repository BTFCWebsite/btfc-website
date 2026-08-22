'use client'

import {useEffect} from 'react'
import {getMatchFeeds, getTeamsContent} from './lib/sanity.client'
import {
  loadFullTimeWidgetMatches,
  loadFullTimeWidgetTable,
  type FullTimeFixture,
  type FullTimeLeagueRow,
} from './lib/fulltime.browser'

type TeamLabel = 'First XI' | 'Reserves' | 'Under 17s'

type TeamConfig = {
  fixtureWidget?: string
  tableWidget?: string
  division: string
  team: TeamLabel
}

const BASE_CONFIG: Record<TeamLabel, TeamConfig> = {
  'First XI': {fixtureWidget: '969980533', tableWidget: '251176067', division: '320568525', team: 'First XI'},
  'Reserves': {fixtureWidget: '681011209', tableWidget: '625925242', division: '222455275', team: 'Reserves'},
  'Under 17s': {division: '761524402', team: 'Under 17s'},
}

function normalise(value = '') {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, '')
}

function labelFromText(text = ''): TeamLabel {
  if (text.includes('Reserves')) return 'Reserves'
  if (text.includes('Under 17s')) return 'Under 17s'
  return 'First XI'
}

function selectedTeamLabel(): TeamLabel {
  const buttons = Array.from(document.querySelectorAll('button')) as HTMLButtonElement[]
  const selected = buttons.find((button) => {
    const text = button.textContent || ''
    if (!/First XI|Reserves|Under 17s/.test(text)) return false
    const background = button.style.background || button.style.backgroundColor
    return background.includes('1149D8') || background.includes('rgb(17, 73, 216)')
  })
  return labelFromText(selected?.textContent || '')
}

function resultLetter(fixture: any) {
  if (fixture.btfcScore == null || fixture.opponentScore == null) return null
  const btfc = Number(fixture.btfcScore)
  const opponent = Number(fixture.opponentScore)
  if (!Number.isFinite(btfc) || !Number.isFinite(opponent)) return null
  if (btfc > opponent) return 'W'
  if (btfc < opponent) return 'L'
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

function isLeagueFixture(fixture: any) {
  const competition = normalise(fixture?.competition || '')
  if (!competition) return true
  if (
    competition.includes('friendly') ||
    competition.includes('cup') ||
    competition.includes('vase') ||
    competition.includes('trophy') ||
    competition.includes('shield')
  ) return false
  return true
}

function leagueResults(fixtures: any[]) {
  return fixtures
    .filter((fixture) => fixture?.played === true && fixture?.date && fixture?.btfcScore != null && fixture?.opponentScore != null)
    .filter(isLeagueFixture)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 10)
}

function clearResults(message = 'Loading league results…') {
  const card = findResultsCard()
  if (!card?.row) return
  card.heading.textContent = 'Last 10 League Results'
  card.row.replaceChildren()
  const text = document.createElement('span')
  text.textContent = message
  Object.assign(text.style, {fontSize: '12px', color: '#9CA3AF'})
  card.row.appendChild(text)
}

function clearLeagueStats() {
  const grid = findLeagueStatsGrid()
  if (!grid) return
  for (const tile of Array.from(grid.children) as HTMLElement[]) {
    const value = tile.children[0] as HTMLElement | undefined
    if (value) value.textContent = '—'
  }
}

function paintResults(fixtures: any[]) {
  const card = findResultsCard()
  if (!card?.row) return
  card.heading.textContent = 'Last 10 League Results'

  const latest = leagueResults(fixtures)
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

function btfcLeagueRow(rows: FullTimeLeagueRow[], label: TeamLabel) {
  const candidates = rows.filter((row) => {
    const team = normalise(row.team)
    return team.includes('brimscombe') && team.includes('thrupp')
  })

  if (label === 'Reserves') {
    return candidates.find((row) => normalise(row.team).includes('reserve')) || candidates[0] || null
  }

  if (label === 'Under 17s') {
    return candidates.find((row) => {
      const team = normalise(row.team)
      return team.includes('u17') || team.includes('under17')
    }) || candidates[0] || null
  }

  return candidates.find((row) => {
    const team = normalise(row.team)
    return !team.includes('reserve') && !team.includes('u17') && !team.includes('under17')
  }) || candidates[0] || null
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

async function resolveConfigs() {
  const configs: Record<TeamLabel, TeamConfig> = {
    'First XI': {...BASE_CONFIG['First XI']},
    'Reserves': {...BASE_CONFIG.Reserves},
    'Under 17s': {...BASE_CONFIG['Under 17s']},
  }

  try {
    const feeds = await getMatchFeeds()
    for (const feed of feeds || []) {
      const teamName = normalise(String(feed?.team || ''))
      if (!teamName.includes('u17') && !teamName.includes('under17')) continue
      const snippet = String(feed?.snippet || '')
      const widget = snippet.match(/\blrcode\s*=\s*['\"](\d+)['\"]/i)?.[1]
      const division = snippet.match(/[?&]divisionseason=(\d+)/i)?.[1]
      if (widget) configs['Under 17s'].fixtureWidget = widget
      if (division) configs['Under 17s'].division = division
    }
  } catch {
    // Keep the known U17 division and use Sanity fixtures if no widget config is available.
  }

  return configs
}

async function loadTable(config: TeamConfig) {
  if (config.tableWidget) {
    try {
      const rows = await loadFullTimeWidgetTable(config.tableWidget, 18000)
      if (rows.length) return rows
    } catch {
      // Fall through to the same API table source used by the Matches page.
    }
  }

  const params = new URLSearchParams({
    kind: 'table',
    division: config.division,
    team: config.team,
  })
  const response = await fetch(`/api/full-time?${params.toString()}`, {cache: 'no-store'})
  if (!response.ok) return [] as FullTimeLeagueRow[]
  const payload = await response.json()
  return Array.isArray(payload?.table) ? payload.table as FullTimeLeagueRow[] : []
}

export default function LiveTeamResults() {
  useEffect(() => {
    if (window.location.pathname !== '/teams') return

    let cancelled = false
    let requestVersion = 0
    let configs: Record<TeamLabel, TeamConfig> | null = null
    let manualFixtures: any[] | null = null
    const fixtureCache = new Map<TeamLabel, any[]>()
    const tableCache = new Map<TeamLabel, FullTimeLeagueRow[]>()

    async function getManualFixtures() {
      if (manualFixtures) return manualFixtures
      try {
        const data = await getTeamsContent()
        manualFixtures = Array.isArray(data?.fixtures) ? data.fixtures : []
      } catch {
        manualFixtures = []
      }
      return manualFixtures
    }

    async function refresh(forcedLabel?: TeamLabel) {
      const version = ++requestVersion
      const label = forcedLabel || selectedTeamLabel()
      clearLeagueStats()
      clearResults()

      if (!configs) configs = await resolveConfigs()
      if (cancelled || version !== requestVersion) return
      const config = configs[label]

      const fixturePromise = (async () => {
        if (fixtureCache.has(label)) return fixtureCache.get(label) || []
        if (config.fixtureWidget) {
          try {
            const loaded = await loadFullTimeWidgetMatches(config.fixtureWidget, config.team, 18000)
            if (loaded.length) {
              fixtureCache.set(label, loaded)
              return loaded
            }
          } catch {
            // Use the same Sanity/manual fixture fallback that feeds the Matches page.
          }
        }
        const manual = await getManualFixtures()
        const selected = manual.filter((fixture: any) => normalise(fixture?.team || '') === normalise(config.team))
        fixtureCache.set(label, selected)
        return selected
      })()

      const tablePromise = tableCache.has(label)
        ? Promise.resolve(tableCache.get(label) || [])
        : loadTable(config)

      const [fixturesResult, tableResult] = await Promise.allSettled([fixturePromise, tablePromise])
      if (cancelled || version !== requestVersion) return

      if (fixturesResult.status === 'fulfilled') {
        paintResults(fixturesResult.value)
      } else {
        clearResults('League results are temporarily unavailable.')
      }

      if (tableResult.status === 'fulfilled' && tableResult.value.length) {
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
      if (!button || !/First XI|Reserves|Under 17s/.test(button.textContent || '')) return
      const label = labelFromText(button.textContent || '')
      requestVersion += 1
      clearLeagueStats()
      clearResults()
      window.setTimeout(() => refresh(label), 40)
    }
    document.addEventListener('click', onClick)

    return () => {
      cancelled = true
      requestVersion += 1
      initialObserver?.disconnect()
      document.removeEventListener('click', onClick)
    }
  }, [])

  return null
}
