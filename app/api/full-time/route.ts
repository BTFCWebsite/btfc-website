import { NextRequest, NextResponse } from 'next/server'

const FULL_TIME_ORIGIN = 'https://fulltime.thefa.com'
const FALLBACK_WIDGET_CODE = '969980533'
const FALLBACK_DIVISION_SEASON = '320568525'
const BTFC = 'Brimscombe & Thrupp'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

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

function parseFullTimeDate(value: string) {
  const cleaned = value.replace(/\bSept\b/i, 'Sep')
  const parsed = new Date(cleaned)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function hrefFromHtml(value: string) {
  const match = value.match(/href="([^"]+)"/i)
  if (!match) return undefined
  return match[1].startsWith('http') ? match[1] : FULL_TIME_ORIGIN + match[1]
}

function parseMatches(script: string) {
  const matches = []
  const rowPattern = /<tr[^>]*>\s*<td[^>]*colspan="7"[^>]*>([\s\S]*?)<\/td>\s*<\/tr>\s*<tr[^>]*>([\s\S]*?)<\/tr>/gi
  let row: RegExpExecArray | null

  while ((row = rowPattern.exec(script))) {
    const dateLabel = textFromHtml(row[1])
    const date = parseFullTimeDate(dateLabel)
    if (!date || date < new Date('2026-07-01T00:00:00Z')) continue

    const cells = Array.from(row[2].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)).map(match => match[1])
    if (cells.length < 7) continue

    const competition = textFromHtml(cells[0])
    const homeTeam = textFromHtml(cells[1])
    const homeScore = textFromHtml(cells[2])
    const separator = textFromHtml(cells[3])
    const awayScore = textFromHtml(cells[4])
    const awayTeam = textFromHtml(cells[5])
    const location = textFromHtml(cells[6])
    const isHome = homeTeam === BTFC
    const isAway = awayTeam === BTFC
    if (!isHome && !isAway) continue

    const played = separator === '-' && /^\d+$/.test(homeScore) && /^\d+$/.test(awayScore)
    const sourceUrl = hrefFromHtml(cells[0]) || hrefFromHtml(cells[1])

    matches.push({
      _id: sourceUrl?.match(/[?&]id=(\d+)/)?.[1] ? `full-time-${sourceUrl.match(/[?&]id=(\d+)/)![1]}` : `full-time-${date.getTime()}`,
      date: date.toISOString(),
      opponent: isHome ? awayTeam : homeTeam,
      team: 'First XI',
      venue: isHome ? 'Home' : 'Away',
      competition: competition || 'Hellenic League Division One',
      kickoff: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' }),
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

function parseTable(html: string) {
  const section = html.match(/<section id="league-table">([\s\S]*?)<\/section>/i)?.[1] || html
  const table = section.match(/<table class="cell-dividers">([\s\S]*?)<\/table>/i)?.[1]
  const body = table?.match(/<tbody>([\s\S]*?)<\/tbody>/i)?.[1]
  if (!body) return []

  return Array.from(body.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)).flatMap(row => {
    const cells = Array.from(row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)).map(cell => textFromHtml(cell[1]))
    if (cells.length < 8) return []
    return [{
      position: Number(cells[0]),
      team: cells[1],
      played: Number(cells[2]),
      won: Number(cells[3]),
      drawn: Number(cells[4]),
      lost: Number(cells[5]),
      goalDifference: Number(cells[6]),
      points: Number(cells[7]),
    }]
  })
}

export async function GET(request: NextRequest) {
  try {
    const widgetParam = request.nextUrl.searchParams.get('widget') || ''
    const divisionParam = request.nextUrl.searchParams.get('division') || ''
    const widgetCode = /^\d+$/.test(widgetParam) ? widgetParam : FALLBACK_WIDGET_CODE
    const divisionSeason = /^\d+$/.test(divisionParam) ? divisionParam : FALLBACK_DIVISION_SEASON
    const kind = request.nextUrl.searchParams.get('kind')

    const requestOptions = {
      headers: { 'User-Agent': 'BTFCWebsite/1.0 (+https://btfc-website.vercel.app)' },
      next: { revalidate: 1800 },
    } as const

    let matches: ReturnType<typeof parseMatches> = []
    let table: ReturnType<typeof parseTable> = []

    if (kind === 'matches') {
      const response = await fetch(`${FULL_TIME_ORIGIN}/js/cs1.html?cs=${widgetCode}`, requestOptions)
      if (!response.ok) throw new Error('Full-Time fixtures request failed')
      matches = parseMatches(await response.text())
    } else if (kind === 'table') {
      const response = await fetch(`${FULL_TIME_ORIGIN}/table.html?divisionseason=${divisionSeason}`, requestOptions)
      if (!response.ok) throw new Error('Full-Time table request failed')
      table = parseTable(await response.text())
    } else {
      throw new Error('A Full-Time data kind is required')
    }

    return NextResponse.json(
      { matches, table },
      { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400' } }
    )
  } catch (error) {
    console.error('Unable to refresh Full-Time data:', error)
    return NextResponse.json({ matches: [], table: [], error: 'Full-Time data is temporarily unavailable.' }, { status: 502 })
  }
}
