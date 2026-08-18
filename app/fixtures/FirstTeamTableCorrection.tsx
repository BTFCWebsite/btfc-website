'use client'

import { useEffect } from 'react'

type Row = {
  team: string
  played: number
  won: number
  drawn: number
  lost: number
  goalDifference: number
  points: number
}

const FIRST_XI_TABLE_WIDGET = '251176067'

function clean(value: string | null | undefined) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function normalise(value: string) {
  return clean(value).toLowerCase().replace(/[^a-z0-9]/g, '')
}

function integer(value: string) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? Math.trunc(parsed) : 0
}

function widgetDocument(widget: string) {
  return `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="lrep${widget}">Data loading....</div><script>var lrcode='${widget}'</script><script src="https://fulltime.thefa.com/client/api/cs1.js"></script></body></html>`
}

function parseTable(doc: Document): Row[] {
  const output: Row[] = []

  for (const tr of Array.from(doc.querySelectorAll('tr'))) {
    const cells = Array.from(tr.children).filter(
      (node) => node.tagName === 'TD' || node.tagName === 'TH'
    ) as HTMLTableCellElement[]

    if (cells.length < 8) continue
    const values = cells.map((cell) => clean(cell.textContent))
    if (!/^\d+$/.test(values[0]) || !values[1]) continue

    // The Hellenic Full-Time table has a trailing empty action cell. Filtering
    // to numeric cells avoids that blank shifting the Overall block by one.
    const stats = values.slice(2).filter((value) => /^-?\d+(?:\.\d+)?$/.test(value))
    if (stats.length < 8) continue

    let played = 0
    let won = 0
    let drawn = 0
    let lost = 0
    let goalDifference = 0
    let points = 0

    if (stats.length >= 15) {
      // Expanded Hellenic layout:
      // P | Home W D L F A | Away W D L F A | Overall W D L F A GD PPG PTS
      played = integer(stats[0])
      const overall = stats.slice(-8)
      won = integer(overall[0])
      drawn = integer(overall[1])
      lost = integer(overall[2])
      goalDifference = integer(overall[5])
      points = integer(overall[7])
    } else {
      // Compact layout: P W D L F A GD PTS.
      played = integer(stats[0])
      won = integer(stats[1])
      drawn = integer(stats[2])
      lost = integer(stats[3])
      goalDifference = integer(stats[stats.length - 2])
      points = integer(stats[stats.length - 1])
    }

    output.push({
      team: values[1],
      played,
      won,
      drawn,
      lost,
      goalDifference,
      points,
    })
  }

  return output
}

function loadFirstTeamTable(): Promise<Row[]> {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe')
    iframe.setAttribute('aria-hidden', 'true')
    iframe.tabIndex = -1
    iframe.style.position = 'fixed'
    iframe.style.left = '-10000px'
    iframe.style.top = '0'
    iframe.style.width = '1200px'
    iframe.style.height = '1600px'
    iframe.style.opacity = '0'
    iframe.style.pointerEvents = 'none'
    iframe.style.border = '0'
    iframe.srcdoc = widgetDocument(FIRST_XI_TABLE_WIDGET)
    document.body.appendChild(iframe)

    const started = Date.now()
    const timer = window.setInterval(() => {
      try {
        const doc = iframe.contentDocument
        if (doc) {
          const rows = parseTable(doc)
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

      if (Date.now() - started > 18000) {
        window.clearInterval(timer)
        iframe.remove()
        reject(new Error('First XI table widget did not render in time'))
      }
    }, 300)
  })
}

function applyRows(rows: Row[]) {
  const heading = Array.from(document.querySelectorAll('h1')).find((element) =>
    clean(element.textContent).toUpperCase().includes('BTFC FIRST XI LEAGUE TABLE')
  )
  if (!heading) return

  const section = heading.closest('section')
  const table = section?.querySelector('table')
  if (!table) return

  const byTeam = new Map(rows.map((row) => [normalise(row.team), row]))

  for (const tr of Array.from(table.querySelectorAll('tbody tr'))) {
    const cells = Array.from(tr.querySelectorAll('td'))
    if (cells.length < 8) continue
    const row = byTeam.get(normalise(cells[1].textContent || ''))
    if (!row) continue

    cells[2].textContent = String(row.played)
    cells[3].textContent = String(row.won)
    cells[4].textContent = String(row.drawn)
    cells[5].textContent = String(row.lost)
    cells[6].textContent = String(row.goalDifference)
    cells[7].textContent = String(row.points)
  }
}

export default function FirstTeamTableCorrection() {
  useEffect(() => {
    let active = true
    let rows: Row[] = []

    const observer = new MutationObserver(() => {
      if (active && rows.length) applyRows(rows)
    })
    observer.observe(document.body, { childList: true, subtree: true })

    loadFirstTeamTable()
      .then((loadedRows) => {
        if (!active) return
        rows = loadedRows
        applyRows(rows)
      })
      .catch((error) => console.error('Unable to correct First XI table data', error))

    return () => {
      active = false
      observer.disconnect()
    }
  }, [])

  return null
}
