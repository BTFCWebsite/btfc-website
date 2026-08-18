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

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
}

function normalise(value: string) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

function isBtfc(value: string) {
  const cleaned = normalise(value)
  return cleaned.includes('brimscombe') && cleaned.includes('thrupp')
}

function parseDateLabel(value: string) {
  const text = String(value || '').replace(/\bSept\b/i, 'Sep').replace(/,/g, ' ').replace(/\s+/g, ' ').trim()
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

function parseWidgetDocument(doc: Document, team: string): FullTimeFixture[] {
  const fixtures: FullTimeFixture[] = []
  let currentDate: { date: string; kickoff: string } | null = null

  for (const row of Array.from(doc.querySelectorAll('tr'))) {
    const cells = Array.from(row.children).filter((node) => node.tagName === 'TD') as HTMLTableCellElement[]
    if (cells.length === 1) {
      const parsed = parseDateLabel(cells[0].textContent || '')
      if (parsed) currentDate = parsed
      continue
    }

    if (!currentDate || cells.length < 7) continue

    const text = (index: number) => String(cells[index]?.textContent || '').replace(/\s+/g, ' ').trim()
    const competition = text(0)
    const homeTeam = text(1)
    const homeScore = text(2)
    const separator = text(3).toLowerCase()
    const awayScore = text(4)
    const awayTeam = text(5)
    const location = text(6)
    const isHome = isBtfc(homeTeam)
    const isAway = isBtfc(awayTeam)
    if (!isHome && !isAway) continue

    const played = (separator === '-' || separator === '–') && /^\d+$/.test(homeScore) && /^\d+$/.test(awayScore)
    const link = cells[0].querySelector('a[href]') as HTMLAnchorElement | null
      || cells[1].querySelector('a[href]') as HTMLAnchorElement | null
      || cells[5].querySelector('a[href]') as HTMLAnchorElement | null
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

export function fullTimeWidgetDocument(widgetCode: string) {
  const safeCode = /^\d+$/.test(widgetCode) ? widgetCode : ''
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;background:#fff;font-family:Arial,sans-serif}body{overflow-x:auto}div[id^="lrep"]{width:100%!important}table{max-width:100%}</style></head><body><div id="lrep${safeCode}" style="width:100%;">Data loading....<br><br><a href="https://www.thefa.com/FULL-TIME">FULL-TIME Home</a></div><script>var lrcode='${safeCode}'</script><script src="https://fulltime.thefa.com/client/api/cs1.js"></script></body></html>`
}

export function loadFullTimeWidgetMatches(widgetCode: string, team: string, timeoutMs = 15000): Promise<FullTimeFixture[]> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined' || !/^\d+$/.test(widgetCode)) {
      reject(new Error('A valid Full-Time widget code is required'))
      return
    }

    const iframe = document.createElement('iframe')
    iframe.setAttribute('aria-hidden', 'true')
    iframe.tabIndex = -1
    iframe.style.position = 'fixed'
    iframe.style.left = '-10000px'
    iframe.style.top = '0'
    iframe.style.width = '760px'
    iframe.style.height = '1400px'
    iframe.style.border = '0'
    iframe.style.opacity = '0'
    iframe.style.pointerEvents = 'none'
    iframe.srcdoc = fullTimeWidgetDocument(widgetCode)
    document.body.appendChild(iframe)

    const started = Date.now()
    const timer = window.setInterval(() => {
      try {
        const doc = iframe.contentDocument
        if (doc) {
          const fixtures = parseWidgetDocument(doc, team)
          if (fixtures.length > 0) {
            window.clearInterval(timer)
            iframe.remove()
            resolve(fixtures)
            return
          }
        }
      } catch {
        // Keep polling until the official widget has finished rendering.
      }

      if (Date.now() - started >= timeoutMs) {
        window.clearInterval(timer)
        iframe.remove()
        reject(new Error(`Full-Time widget ${widgetCode} did not render in time`))
      }
    }, 300)
  })
}
