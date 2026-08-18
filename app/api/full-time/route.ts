import { NextRequest, NextResponse } from 'next/server'

const FULL_TIME_ORIGIN = 'https://fulltime.thefa.com'
const FALLBACK_WIDGET_CODE = '969980533'
const FALLBACK_DIVISION_SEASON = '320568525'
const BTFC = 'Brimscombe & Thrupp'

export const dynamic = 'force-dynamic'

function textFromHtml(value: string) {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&ndash;|&#8211;/g, '–')
    .replace(/&minus;|&#8722;/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
}

function parseFullTimeDate(value: string) {
  const cleaned = value.replace(/\bSept\b/i, 'Sep').replace(/,/g, ' ')
  const match = cleaned.match(/\b(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})(?:\s+(\d{1,2})[:.](\d{2}))?/i)
  if (!match) return null

  const day = Number(match[1])
  const month = MONTHS[match[2].toLowerCase()]
  const year = Number(match[3])
  const hour = match[4] ? Number(match[4]) : null
  const minute = match[5] ? Number(match[5]) : null
  if (!day || !month || !year) return null

  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
  const dateValue = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const kickoff = hour !== null && minute !== null
    ? `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    : 'TBC'
  return { date, dateValue, kickoff }
}

function hrefFromHtml(value: string) {
  const match = value.match(/href=["']([^"']+)["']/i)
  if (!match) return undefined
  return match[1].startsWith('http') ? match[1] : FULL_TIME_ORIGIN + match[1]
}

function isBtfcTeam(value: string) {
  const clean = value.toLowerCase()
  return clean.includes('brimscombe') && clean.includes('thrupp')
}

function parseMatches(script: string, team: string) {
  const matches = []
  const rowPattern = /<tr[^>]*>\s*<td[^>]*colspan=["']?7["']?[^>]*>([\s\S]*?)<\/td>\s*<\/tr>\s*<tr[^>]*>([\s\S]*?)<\/tr>/gi
  let row: RegExpExecArray | null

  while ((row = rowPattern.exec(script))) {
    const dateLabel = textFromHtml(row[1])
    const parsedDate = parseFullTimeDate(dateLabel)
    if (!parsedDate || parsedDate.date < new Date('2026-07-01T00:00:00Z')) continue

    const cells = Array.from(row[2].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)).map(match => match[1])
    if (cells.length < 7) continue

    const competition = textFromHtml(cells[0])
    const homeTeam = textFromHtml(cells[1])
    const homeScore = textFromHtml(cells[2])
    const separator = textFromHtml(cells[3])
    const awayScore = textFromHtml(cells[4])
    const awayTeam = textFromHtml(cells[5])
    const location = textFromHtml(cells[6])
    const isHome = isBtfcTeam(homeTeam)
    const isAway = isBtfcTeam(awayTeam)
    if (!isHome && !isAway) continue

    const played = (separator === '-' || separator === '–') && /^\d+$/.test(homeScore) && /^\d+$/.test(awayScore)
    const sourceUrl = hrefFromHtml(cells[0]) || hrefFromHtml(cells[1]) || hrefFromHtml(cells[5])
    const sourceId = sourceUrl?.match(/[?&]id=(\d+)/)?.[1]

    matches.push({
      _id: sourceId ? `full-time-${sourceId}` : `full-time-${parsedDate.date.getTime()}`,
      date: parsedDate.dateValue,
      opponent: isHome ? awayTeam : homeTeam,
      team,
      venue: isHome ? 'Home' : 'Away',
      competition: competition || 'League',
      kickoff: parsedDate.kickoff,
      btfcScore: played ? Number(isHome ? homeScore : awayScore) : undefined,
      opponentScore: played ? Number(isHome ? awayScore : homeScore) : undefined,
      played,
      location,
      sourceUrl,
      source: 'Full-Time',
    })
  }

  return matches
}

function normaliseHeader(value: string) {
  return textFromHtml(value).toLowerCase().replace(/[^a-z0-9]/g, '')
}

function findHeaderIndex(headers: string[], names: string[]) {
  return headers.findIndex(header => names.includes(header))
}

function numberAt(cells: string[], index: number, fallback = 0) {
  if (index < 0 || index >= cells.length) return fallback
  const value = Number(String(cells[index]).replace(/[^0-9-]/g, ''))
  return Number.isFinite(value) ? value : fallback
}

function parseTable(html: string) {
  const tables = Array.from(html.matchAll(/<table[^>]*>([\s\S]*?)<\/table>/gi)).map(match => match[1])
  let best: any[] = []

  for (const table of tables) {
    const rowBlocks = Array.from(table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)).map(match => match[1])
    let headers: string[] = []
    const rows: any[] = []

    for (const row of rowBlocks) {
      const th = Array.from(row.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)).map(cell => cell[1])
      if (th.length) {
        headers = th.map(normaliseHeader)
        continue
      }

      const rawCells = Array.from(row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)).map(cell => cell[1])
      if (rawCells.length < 7) continue
      const cells = rawCells.map(textFromHtml)

      const posIndex = findHeaderIndex(headers, ['pos','position']) >= 0 ? findHeaderIndex(headers, ['pos','position']) : 0
      const teamIndex = findHeaderIndex(headers, ['team','club']) >= 0 ? findHeaderIndex(headers, ['team','club']) : 1
      const playedIndex = findHeaderIndex(headers, ['p','pl','played']) >= 0 ? findHeaderIndex(headers, ['p','pl','played']) : 2
      const wonIndex = findHeaderIndex(headers, ['w','won']) >= 0 ? findHeaderIndex(headers, ['w','won']) : 3
      const drawnIndex = findHeaderIndex(headers, ['d','drawn']) >= 0 ? findHeaderIndex(headers, ['d','drawn']) : 4
      const lostIndex = findHeaderIndex(headers, ['l','lost']) >= 0 ? findHeaderIndex(headers, ['l','lost']) : 5
      let gdIndex = findHeaderIndex(headers, ['gd','goaldifference','diff'])
      let ptsIndex = findHeaderIndex(headers, ['pts','points','point'])

      if (ptsIndex < 0) ptsIndex = cells.length - 1
      if (gdIndex < 0) gdIndex = Math.max(6, ptsIndex - 1)

      const position = numberAt(cells, posIndex, NaN)
      const team = cells[teamIndex] || ''
      const played = numberAt(cells, playedIndex, NaN)
      if (!Number.isFinite(position) || position <= 0 || !team || !Number.isFinite(played)) continue

      rows.push({
        position,
        team,
        played,
        won: numberAt(cells, wonIndex),
        drawn: numberAt(cells, drawnIndex),
        lost: numberAt(cells, lostIndex),
        goalDifference: numberAt(cells, gdIndex),
        points: numberAt(cells, ptsIndex),
      })
    }

    if (rows.length > best.length) best = rows
  }

  return best
}

const publicHeaders = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=1800',
  'Access-Control-Allow-Origin': '*',
}

async function fetchFullTimeHtml(url: string) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/142 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-GB,en;q=0.9',
      'Referer': 'https://fulltime.thefa.com/',
    },
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Full-Time request failed (${response.status})`)
  return response.text()
}

export async function GET(request: NextRequest) {
  try {
    const widgetParam = request.nextUrl.searchParams.get('widget') || ''
    const divisionParam = request.nextUrl.searchParams.get('division') || ''
    const widgetCode = /^\d+$/.test(widgetParam) ? widgetParam : FALLBACK_WIDGET_CODE
    const divisionSeason = /^\d+$/.test(divisionParam) ? divisionParam : FALLBACK_DIVISION_SEASON
    const kind = request.nextUrl.searchParams.get('kind')
    const requestedTeam = request.nextUrl.searchParams.get('team') || 'First XI'
    const team = ['First XI', 'Reserves', 'Under 17s'].includes(requestedTeam) ? requestedTeam : 'First XI'

    let matches: ReturnType<typeof parseMatches> = []
    let table: ReturnType<typeof parseTable> = []

    if (kind === 'matches') {
      const html = await fetchFullTimeHtml(`${FULL_TIME_ORIGIN}/js/cs1.html?cs=${widgetCode}`)
      matches = parseMatches(html, team)
    } else if (kind === 'table') {
      const primary = await fetchFullTimeHtml(`${FULL_TIME_ORIGIN}/table.html?divisionseason=${divisionSeason}`)
      table = parseTable(primary)
      if (!table.length) {
        const fallback = await fetchFullTimeHtml(`${FULL_TIME_ORIGIN}/index.html?divisionseason=${divisionSeason}`)
        table = parseTable(fallback)
      }
    } else {
      throw new Error('A Full-Time data kind is required')
    }

    return NextResponse.json({ matches, table }, { headers: publicHeaders })
  } catch (error) {
    console.error('Unable to refresh Full-Time data:', error)
    return NextResponse.json({
      matches: [],
      table: [],
      error: 'Full-Time data is temporarily unavailable.',
      upstreamError: error instanceof Error ? error.message : 'Unknown upstream error',
    }, { status: 502, headers: { 'Access-Control-Allow-Origin': '*' } })
  }
}
