export type FullTimeFixture = {
  _id: string
  date: string
  opponent: string
  team: string
  venue: 'Home' | 'Away'
  competition: string
  kickoff: string
  btfcScore?: number
  opponentScore?: number
  played: boolean
  location?: string
  sourceUrl?: string
  source: 'Full-Time'
}

export type FullTimeLeagueRow = {
  position: number
  team: string
  played: number
  won: number
  drawn: number
  lost: number
  goalDifference: number
  points: number
}

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
}

const inflightFixtureLoads = new Map<string, Promise<FullTimeFixture[]>>()
const inflightTableLoads = new Map<string, Promise<FullTimeLeagueRow[]>>()

const TABLE_API: Record<string, { division: string; team: string }> = {
  '251176067': { division: '320568525', team: 'First XI' },
  '625925242': { division: '222455275', team: 'Reserves' },
}

function normalise(value: string) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

function cleanText(value: string | null | undefined) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function isBtfc(value: string) {
  const cleaned = normalise(value)
  return cleaned.includes('brimscombe') && cleaned.includes('thrupp')
}

function parseDateLabel(value: string) {
  const text = cleanText(value).replace(/\bSept\b/i, 'Sep').replace(/,/g, ' ')
  const match = text.match(/(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)?\s*(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})(?:\s+(\d{1,2})[:.](\d{2}))?/i)
  if (!match) return null

  const day = Number(match[1])
  const month = MONTHS[match[2].toLowerCase()]
  const year = Number(match[3])
  if (!day || !month || !year) return null

  return {
    date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    kickoff: match[4] && match[5]
      ? `${String(Number(match[4])).padStart(2, '0')}:${match[5]}`
      : 'TBC',
  }
}

function parseWidgetFixtures(doc: Document, team: string): FullTimeFixture[] {
  const fixtures: FullTimeFixture[] = []
  let currentDate: { date: string; kickoff: string } | null = null

  for (const row of Array.from(doc.querySelectorAll('tr'))) {
    const cells = Array.from(row.children).filter(
      (node) => node.tagName === 'TD' || node.tagName === 'TH'
    ) as HTMLTableCellElement[]

    if (cells.length === 1) {
      const parsed = parseDateLabel(cells[0].textContent || '')
      if (parsed) currentDate = parsed
      continue
    }

    if (!currentDate || cells.length < 5) continue

    const values = cells.map((cell) => cleanText(cell.textContent))
    const competition = values[0]
    let homeTeam = ''
    let awayTeam = ''
    let homeScore = ''
    let awayScore = ''
    let played = false
    let location = values[values.length - 1] || ''

    if (cells.length >= 7) {
      homeTeam = values[1]
      homeScore = values[2]
      const separator = values[3].toLowerCase()
      awayScore = values[4]
      awayTeam = values[5]
      location = values[6] || location
      played = (separator === '-' || separator === '–') && /^\d+$/.test(homeScore) && /^\d+$/.test(awayScore)
    } else {
      homeTeam = values[1]
      awayTeam = values[values.length - 2]
      const middle = values.slice(2, -2).join(' ')
      const score = middle.match(/(\d+)\s*[-–]\s*(\d+)/)
      if (score) {
        homeScore = score[1]
        awayScore = score[2]
        played = true
      }
    }

    const isHome = isBtfc(homeTeam)
    const isAway = isBtfc(awayTeam)
    if (!isHome && !isAway) continue

    const link = row.querySelector('a[href]') as HTMLAnchorElement | null
    const sourceUrl = link?.href
    const sourceId = sourceUrl?.match(/[?&]id=(\d+)/)?.[1]
    const opponent = isHome ? awayTeam : homeTeam

    fixtures.push({
      _id: sourceId ? `full-time-${sourceId}` : `full-time-${team}-${currentDate.date}-${normalise(opponent)}`,
      date: currentDate.date,
      opponent,
      team,
      venue: isHome ? 'Home' : 'Away',
      competition: competition || 'League',
      kickoff: currentDate.kickoff,
      btfcScore: played ? Number(isHome ? homeScore : awayScore) : undefined,
      opponentScore: played ? Number(isHome ? awayScore : homeScore) : undefined,
      played,
      location,
      sourceUrl,
      source: 'Full-Time',
    })
  }

  return fixtures.filter((fixture, index, all) =>
    all.findIndex((candidate) =>
      candidate._id === fixture._id ||
      (candidate.date === fixture.date && normalise(candidate.opponent) === normalise(fixture.opponent))
    ) === index
  )
}

function numeric(value: string) {
  const cleaned = cleanText(value).replace(/[^0-9.-]/g, '')
  if (!cleaned || cleaned === '-' || cleaned === '.') return 0
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : 0
}

function parseWidgetTable(doc: Document): FullTimeLeagueRow[] {
  const rows: FullTimeLeagueRow[] = []

  for (const row of Array.from(doc.querySelectorAll('tr'))) {
    const cells = Array.from(row.children).filter(
      (node) => node.tagName === 'TD' || node.tagName === 'TH'
    ) as HTMLTableCellElement[]
    if (cells.length < 8) continue

    const values = cells.map((cell) => cleanText(cell.textContent))
    if (!/^\d+$/.test(values[0]) || !values[1]) continue

    const stats = values.slice(2).filter((value) => /^-?\d+(?:\.\d+)?$/.test(value))
    if (stats.length < 6) continue

    let played = 0
    let won = 0
    let drawn = 0
    let lost = 0
    let goalDifference = 0
    let points = 0

    if (stats.length >= 15) {
      played = numeric(stats[0])
      const overall = stats.slice(-8)
      won = numeric(overall[0])
      drawn = numeric(overall[1])
      lost = numeric(overall[2])
      goalDifference = numeric(overall[5])
      points = numeric(overall[7])
    } else if (stats.length >= 8) {
      played = numeric(stats[0])
      won = numeric(stats[1])
      drawn = numeric(stats[2])
      lost = numeric(stats[3])
      goalDifference = numeric(stats[stats.length - 2])
      points = numeric(stats[stats.length - 1])
    } else {
      played = numeric(stats[0])
      won = numeric(stats[1])
      drawn = numeric(stats[2])
      lost = numeric(stats[3])
      goalDifference = numeric(stats[4])
      points = numeric(stats[5])
    }

    rows.push({
      position: numeric(values[0]),
      team: values[1],
      played,
      won,
      drawn,
      lost,
      goalDifference,
      points,
    })
  }

  return rows.filter((row, index, all) =>
    all.findIndex((candidate) => candidate.position === row.position && normalise(candidate.team) === normalise(row.team)) === index
  )
}

export function fullTimeWidgetDocument(widgetCode: string) {
  const safeCode = /^\d+$/.test(widgetCode) ? widgetCode : ''
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;background:#fff;font-family:Arial,sans-serif}body{overflow-x:auto}div[id^="lrep"]{width:100%!important}table{max-width:100%}</style></head><body><div id="lrep${safeCode}" style="width:100%;">Data loading....<br><br><a href="https://www.thefa.com/FULL-TIME">FULL-TIME Home</a></div><script>var lrcode='${safeCode}'</script><script src="https://fulltime.thefa.com/client/api/cs1.js"></script></body></html>`
}

function createHiddenWidget(widgetCode: string) {
  if (typeof document === 'undefined' || !/^\d+$/.test(widgetCode)) {
    throw new Error('A valid Full-Time widget code is required')
  }

  const iframe = document.createElement('iframe')
  iframe.setAttribute('aria-hidden', 'true')
  iframe.tabIndex = -1
  iframe.style.position = 'fixed'
  iframe.style.left = '-10000px'
  iframe.style.top = '0'
  iframe.style.width = '1100px'
  iframe.style.height = '1600px'
  iframe.style.border = '0'
  iframe.style.opacity = '0'
  iframe.style.pointerEvents = 'none'
  iframe.srcdoc = fullTimeWidgetDocument(widgetCode)
  document.body.appendChild(iframe)
  return iframe
}

function createFixtureLoad(widgetCode: string, team: string, timeoutMs: number): Promise<FullTimeFixture[]> {
  return new Promise((resolve, reject) => {
    let iframe: HTMLIFrameElement
    try {
      iframe = createHiddenWidget(widgetCode)
    } catch (error) {
      reject(error)
      return
    }

    const started = Date.now()
    const timer = window.setInterval(() => {
      try {
        const doc = iframe.contentDocument
        if (doc) {
          const fixtures = parseWidgetFixtures(doc, team)
          if (fixtures.length > 0) {
            window.clearInterval(timer)
            iframe.remove()
            resolve(fixtures)
            return
          }
        }
      } catch {
        // Keep polling while the official widget renders.
      }

      if (Date.now() - started >= timeoutMs) {
        window.clearInterval(timer)
        iframe.remove()
        reject(new Error(`Full-Time widget ${widgetCode} did not render fixtures in time`))
      }
    }, 300)
  })
}

function createTableWidgetLoad(widgetCode: string, timeoutMs: number): Promise<FullTimeLeagueRow[]> {
  return new Promise((resolve, reject) => {
    let iframe: HTMLIFrameElement
    try {
      iframe = createHiddenWidget(widgetCode)
    } catch (error) {
      reject(error)
      return
    }

    const started = Date.now()
    const timer = window.setInterval(() => {
      try {
        const doc = iframe.contentDocument
        if (doc) {
          const rows = parseWidgetTable(doc)
          if (rows.length > 0) {
            window.clearInterval(timer)
            iframe.remove()
            resolve(rows)
            return
          }
        }
      } catch {
        // Keep polling while the official widget renders.
      }

      if (Date.now() - started >= timeoutMs) {
        window.clearInterval(timer)
        iframe.remove()
        reject(new Error(`Full-Time widget ${widgetCode} did not render a table in time`))
      }
    }, 300)
  })
}

async function loadMatchesFromApi(widgetCode: string, team: string) {
  const params = new URLSearchParams({
    kind: 'matches',
    widget: widgetCode,
    team,
  })
  const response = await fetch(`/api/full-time?${params.toString()}`, { cache: 'default' })
  if (!response.ok) throw new Error(`Full-Time matches API failed (${response.status})`)
  const payload = await response.json()
  const matches = Array.isArray(payload?.matches) ? payload.matches : []
  if (!matches.length) throw new Error('Full-Time matches API returned no fixtures')
  return matches as FullTimeFixture[]
}

async function loadTableFromApi(widgetCode: string) {
  const config = TABLE_API[widgetCode]
  if (!config) return null

  const params = new URLSearchParams({
    kind: 'table',
    division: config.division,
    team: config.team,
  })
  const response = await fetch(`/api/full-time?${params.toString()}`, { cache: 'no-store' })
  if (!response.ok) throw new Error(`Full-Time table API failed (${response.status})`)
  const payload = await response.json()
  const rows = Array.isArray(payload?.table) ? payload.table : []
  if (!rows.length) throw new Error('Full-Time table API returned no rows')
  return rows as FullTimeLeagueRow[]
}

export function loadFullTimeWidgetMatches(widgetCode: string, team: string, timeoutMs = 15000): Promise<FullTimeFixture[]> {
  const key = `${widgetCode}:${team}`
  const existing = inflightFixtureLoads.get(key)
  if (existing) return existing

  const load = (async () => {
    try {
      return await loadMatchesFromApi(widgetCode, team)
    } catch {
      // Fall back to the official browser widget only if the faster same-origin API fails.
      return createFixtureLoad(widgetCode, team, Math.min(timeoutMs, 5000))
    }
  })()

  inflightFixtureLoads.set(key, load)
  load.finally(() => {
    if (inflightFixtureLoads.get(key) === load) inflightFixtureLoads.delete(key)
  })
  return load
}

export function loadFullTimeWidgetTable(widgetCode: string, timeoutMs = 15000): Promise<FullTimeLeagueRow[]> {
  const existing = inflightTableLoads.get(widgetCode)
  if (existing) return existing

  const load = (async () => {
    try {
      const apiRows = await loadTableFromApi(widgetCode)
      if (apiRows) return apiRows
    } catch {
      // Fall back to the official browser widget only if the same-origin API fails.
    }
    return createTableWidgetLoad(widgetCode, Math.min(timeoutMs, 5000))
  })()

  inflightTableLoads.set(widgetCode, load)
  load.finally(() => {
    if (inflightTableLoads.get(widgetCode) === load) inflightTableLoads.delete(widgetCode)
  })
  return load
}
