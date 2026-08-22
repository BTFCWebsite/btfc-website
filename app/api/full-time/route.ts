import { NextRequest, NextResponse } from 'next/server'

const FULL_TIME_ORIGIN = 'https://fulltime.thefa.com'
const FALLBACK_WIDGET_CODE = '969980533'
const FALLBACK_DIVISION_SEASON = '320568525'
const BTFC = 'Brimscombe & Thrupp'

export const revalidate = 300

function textFromHtml(value: string) {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
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
  const match = value.match(/href="([^"]+)"/i)
  if (!match) return undefined
  return match[1].startsWith('http') ? match[1] : FULL_TIME_ORIGIN + match[1]
}

function isBtfcTeam(value: string) {
  return value.toLowerCase().includes(BTFC.toLowerCase())
}

function parseMatches(script: string, team: string) {
  const matches = []
  const rowPattern = /<tr[^>]*>\s*<td[^>]*colspan="7"[^>]*>([\s\S]*?)<\/td>\s*<\/tr>\s*<tr[^>]*>([\s\S]*?)<\/tr>/gi
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

    const played = separator === '-' && /^\d+$/.test(homeScore) && /^\d+$/.test(awayScore)
    const sourceUrl = hrefFromHtml(cells[0]) || hrefFromHtml(cells[1])
    const sourceId = sourceUrl?.match(/[?&]id=(\d+)/)?.[1]

    matches.push({
      _id: sourceId ? `full-time-${sourceId}` : `full-time-${parsedDate.date.getTime()}`,
      date: parsedDate.dateValue,
      opponent: isHome ? awayTeam : homeTeam,
      team,
      venue: isHome ? 'Home' : 'Away',
      competition: competition || 'Hellenic League Division One',
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

function numeric(value: string) {
  const cleaned = value.replace(/[^0-9.-]/g, '')
  if (!cleaned || cleaned === '-' || cleaned === '.') return 0
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : 0
}

function parseTable(html: string) {
  const section = html.match(/<section id="league-table">([\s\S]*?)<\/section>/i)?.[1] || html
  const table = section.match(/<table[^>]*>([\s\S]*?)<\/table>/i)?.[1]
  const body = table?.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i)?.[1]
  if (!body) return []

  return Array.from(body.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)).flatMap(row => {
    const cells = Array.from(row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)).map(cell => textFromHtml(cell[1]))
    if (cells.length < 8 || !/^\d+$/.test(cells[0]) || !cells[1]) return []

    const stats = cells.slice(2).filter(value => /^-?\d+(?:\.\d+)?$/.test(value))
    if (stats.length < 6) return []

    const position = numeric(cells[0])
    const team = cells[1]
    let played = 0
    let won = 0
    let drawn = 0
    let lost = 0
    let goalDifference = 0
    let points = 0

    if (stats.length >= 15) {
      // Expanded FA layout:
      // P | Home W D L F A | Away W D L F A | Overall W D L F A GD PPG PTS
      played = numeric(stats[0])
      const overall = stats.slice(-8)
      won = numeric(overall[0])
      drawn = numeric(overall[1])
      lost = numeric(overall[2])
      goalDifference = numeric(overall[5])
      points = numeric(overall[7])
    } else if (stats.length >= 8) {
      // Compact layout: P W D L F A GD PTS
      played = numeric(stats[0])
      won = numeric(stats[1])
      drawn = numeric(stats[2])
      lost = numeric(stats[3])
      goalDifference = numeric(stats[stats.length - 2])
      points = numeric(stats[stats.length - 1])
    } else {
      // Minimal layout: P W D L GD PTS
      played = numeric(stats[0])
      won = numeric(stats[1])
      drawn = numeric(stats[2])
      lost = numeric(stats[3])
      goalDifference = numeric(stats[4])
      points = numeric(stats[5])
    }

    return [{
      position,
      team,
      played,
      won,
      drawn,
      lost,
      goalDifference,
      points,
    }]
  })
}

const publicHeaders = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=1800',
  'Access-Control-Allow-Origin': '*',
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

    const requestOptions = {
      headers: { 'User-Agent': 'BTFCWebsite/1.0 (+https://brimscombeandthruppfc.co.uk)' },
      next: { revalidate: 300 },
    }

    let matches: ReturnType<typeof parseMatches> = []
    let table: ReturnType<typeof parseTable> = []

    if (kind === 'matches') {
      const response = await fetch(`${FULL_TIME_ORIGIN}/js/cs1.html?cs=${widgetCode}`, requestOptions)
      if (!response.ok) throw new Error('Full-Time fixtures request failed')
      matches = parseMatches(await response.text(), team)
    } else if (kind === 'table') {
      const response = await fetch(`${FULL_TIME_ORIGIN}/table.html?divisionseason=${divisionSeason}`, requestOptions)
      if (!response.ok) throw new Error('Full-Time table request failed')
      table = parseTable(await response.text())
    } else {
      throw new Error('A Full-Time data kind is required')
    }

    return NextResponse.json({ matches, table }, { headers: publicHeaders })
  } catch (error) {
    console.error('Unable to refresh Full-Time data:', error)
    return NextResponse.json({
      matches: [], table: [], error: 'Full-Time data is temporarily unavailable.',
      upstreamError: error instanceof Error ? error.message : 'Unknown upstream error',
    }, { status: 502, headers: { 'Access-Control-Allow-Origin': '*' } })
  }
}
