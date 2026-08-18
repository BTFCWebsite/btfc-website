'use client'

import { useEffect, useMemo, useState } from 'react'
import { getFixtures, getMatchFeeds } from './lib/sanity.client'
import {
  loadFullTimeWidgetMatches,
  loadFullTimeWidgetTable,
  type FullTimeFixture,
  type FullTimeLeagueRow,
} from './lib/fulltime.browser'

type TeamId = 'first' | 'reserves' | 'u17s'
type ViewId = 'matches' | 'table'
type Fixture = FullTimeFixture & { programmeUrl?: string }
type LeagueRow = FullTimeLeagueRow

type FeedConfig = {
  team: string
  widgets: string[]
  division: string
}

const DEFAULTS: Record<TeamId, FeedConfig> = {
  first: { team: 'First XI', widgets: ['969980533'], division: '320568525' },
  reserves: { team: 'Reserves', widgets: ['681011209'], division: '222455275' },
  u17s: { team: 'Under 17s', widgets: [], division: '761524402' },
}

const TABLE_WIDGETS: Partial<Record<TeamId, string>> = {
  first: '251176067',
  reserves: '625925242',
}

const UNDER17_OPENING_TABLE: LeagueRow[] = [
  { position: 1, team: 'Brimscombe & Thrupp U17', played: 0, won: 0, drawn: 0, lost: 0, goalDifference: 0, points: 0 },
  { position: 2, team: 'FC Lakeside Youth U17 Whites', played: 0, won: 0, drawn: 0, lost: 0, goalDifference: 0, points: 0 },
  { position: 3, team: 'Kempsey Colts U17 Falcons', played: 0, won: 0, drawn: 0, lost: 0, goalDifference: 0, points: 0 },
  { position: 4, team: 'Leckhampton Rovers Youth U17', played: 0, won: 0, drawn: 0, lost: 0, goalDifference: 0, points: 0 },
  { position: 5, team: 'Longlevens Youth U17', played: 0, won: 0, drawn: 0, lost: 0, goalDifference: 0, points: 0 },
  { position: 6, team: 'Perdiswell Colts U17 Tigers', played: 0, won: 0, drawn: 0, lost: 0, goalDifference: 0, points: 0 },
  { position: 7, team: 'Prestbury Phantoms Youth U17 Jets', played: 0, won: 0, drawn: 0, lost: 0, goalDifference: 0, points: 0 },
  { position: 8, team: 'Southside Star Youth U17', played: 0, won: 0, drawn: 0, lost: 0, goalDifference: 0, points: 0 },
  { position: 9, team: 'Stonehouse Town Youth U17', played: 0, won: 0, drawn: 0, lost: 0, goalDifference: 0, points: 0 },
  { position: 10, team: 'Westfields Youth U17', played: 0, won: 0, drawn: 0, lost: 0, goalDifference: 0, points: 0 },
]

const TEAM_DETAILS = {
  first: { label: 'First XI', heading: 'BTFC First XI' },
  reserves: { label: 'Reserves', heading: 'BTFC Reserves' },
  u17s: { label: 'Under 17s', heading: 'BTFC Under 17s' },
} as const

function canonicalTeam(value = ''): TeamId | null {
  const normalised = value.toLowerCase().replace(/[^a-z0-9]/g, '')
  if (normalised.includes('u17') || normalised.includes('under17')) return 'u17s'
  if (normalised.includes('reserve')) return 'reserves'
  if (normalised.includes('first')) return 'first'
  return null
}

function normalise(value = '') {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function dateInfo(date: string) {
  const parsed = new Date(`${date}T12:00:00`)
  if (Number.isNaN(parsed.getTime())) return { month: 'Date TBC', day: 'TBC' }
  return {
    month: parsed.toLocaleDateString('en-GB', { month: 'long' }),
    day: parsed.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' }),
  }
}

function resultFor(fixture: Fixture) {
  if (!fixture.played) return '—'
  const btfc = fixture.btfcScore ?? '-'
  const opponent = fixture.opponentScore ?? '-'
  return fixture.venue === 'Home' ? `${btfc}-${opponent}` : `${opponent}-${btfc}`
}

function formFor(fixture: Fixture) {
  if (!fixture.played || fixture.btfcScore == null || fixture.opponentScore == null) return null
  if (fixture.btfcScore > fixture.opponentScore) return 'W'
  if (fixture.btfcScore < fixture.opponentScore) return 'L'
  return 'D'
}

export default function ReliableFixtures() {
  const [team, setTeam] = useState<TeamId>('first')
  const [view, setView] = useState<ViewId>('matches')
  const [configs, setConfigs] = useState<Record<TeamId, FeedConfig>>(DEFAULTS)
  const [configReady, setConfigReady] = useState(false)
  const [manualFixtures, setManualFixtures] = useState<any[]>([])
  const [liveFixtures, setLiveFixtures] = useState<Record<TeamId, Fixture[]>>({ first: [], reserves: [], u17s: [] })
  const [loading, setLoading] = useState<Record<TeamId, boolean>>({ first: true, reserves: true, u17s: true })
  const [failed, setFailed] = useState<Record<TeamId, boolean>>({ first: false, reserves: false, u17s: false })
  const [tableRows, setTableRows] = useState<LeagueRow[]>([])
  const [tableLoading, setTableLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadConfiguration() {
      try {
        const [feeds, manual] = await Promise.all([getMatchFeeds(), getFixtures()])
        if (cancelled) return
        setManualFixtures(manual || [])

        const next: Record<TeamId, FeedConfig> = {
          first: { ...DEFAULTS.first },
          reserves: { ...DEFAULTS.reserves },
          u17s: { ...DEFAULTS.u17s },
        }

        for (const feed of feeds || []) {
          const id = canonicalTeam(String(feed?.team || ''))
          if (!id || !feed?.snippet) continue
          const snippet = String(feed.snippet)
          const widget = snippet.match(/\blrcode\s*=\s*['\"](\d+)['\"]/i)?.[1] || ''
          const division = snippet.match(/[?&]divisionseason=(\d+)/i)?.[1] || ''

          if (id === 'reserves') continue
          next[id] = {
            team: DEFAULTS[id].team,
            widgets: widget ? [widget] : DEFAULTS[id].widgets,
            division: division || DEFAULTS[id].division,
          }
        }

        setConfigs(next)
      } catch (error) {
        console.error('Unable to load Full-Time feed configuration', error)
      } finally {
        if (!cancelled) setConfigReady(true)
      }
    }

    loadConfiguration()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!configReady) return
    let cancelled = false

    async function loadTeam(teamId: TeamId) {
      const config = configs[teamId]
      if (!config.widgets.length) {
        if (!cancelled) {
          setLoading((state) => ({ ...state, [teamId]: false }))
          setFailed((state) => ({ ...state, [teamId]: true }))
        }
        return
      }

      setLoading((state) => ({ ...state, [teamId]: true }))
      const results = await Promise.allSettled(
        config.widgets.map((widget) => loadFullTimeWidgetMatches(widget, config.team, 18000))
      )
      if (cancelled) return

      const fixtures = results.flatMap((result) => result.status === 'fulfilled' ? result.value : []) as Fixture[]
      const deduped = fixtures.filter((fixture, index, all) =>
        all.findIndex((candidate) =>
          candidate._id === fixture._id ||
          (candidate.date === fixture.date && normalise(candidate.opponent) === normalise(fixture.opponent))
        ) === index
      )

      setLiveFixtures((state) => ({ ...state, [teamId]: deduped }))
      setFailed((state) => ({ ...state, [teamId]: deduped.length === 0 }))
      setLoading((state) => ({ ...state, [teamId]: false }))
    }

    loadTeam('first')
    loadTeam('reserves')
    loadTeam('u17s')
    return () => { cancelled = true }
  }, [configs, configReady])

  useEffect(() => {
    let cancelled = false

    async function loadApiTable(teamId: TeamId) {
      const config = configs[teamId]
      if (!config.division) return [] as LeagueRow[]
      const response = await fetch(`/api/full-time?kind=table&division=${config.division}&team=${encodeURIComponent(config.team)}`, { cache: 'no-store' })
      if (!response.ok) return [] as LeagueRow[]
      const payload = await response.json()
      return Array.isArray(payload?.table) ? payload.table as LeagueRow[] : []
    }

    async function loadTable() {
      setTableRows([])
      if (view !== 'table') {
        setTableLoading(false)
        return
      }

      setTableLoading(true)
      try {
        let rows: LeagueRow[] = []
        const widget = TABLE_WIDGETS[team]

        if (widget) {
          try {
            rows = await loadFullTimeWidgetTable(widget, 18000)
          } catch {
            rows = await loadApiTable(team)
          }
        } else {
          rows = await loadApiTable(team)
        }

        if (!cancelled) {
          if (team === 'u17s' && rows.length === 0) setTableRows(UNDER17_OPENING_TABLE)
          else setTableRows(rows)
        }
      } catch {
        if (!cancelled) setTableRows(team === 'u17s' ? UNDER17_OPENING_TABLE : [])
      } finally {
        if (!cancelled) setTableLoading(false)
      }
    }

    loadTable()
    return () => { cancelled = true }
  }, [team, view, configs])

  const selected = TEAM_DETAILS[team]
  const combined = useMemo(() => {
    const manual = (manualFixtures || []).filter((fixture: any) => fixture?.team === configs[team].team)
    const all = [...manual, ...(liveFixtures[team] || [])]
    return all
      .filter((fixture: any) => fixture?.date && fixture?.opponent)
      .filter((fixture: any, index: number, list: any[]) =>
        list.findIndex((candidate) =>
          candidate._id === fixture._id ||
          (candidate.date === fixture.date && normalise(candidate.opponent) === normalise(fixture.opponent))
        ) === index
      )
      .sort((a: any, b: any) => String(a.date).localeCompare(String(b.date))) as Fixture[]
  }, [manualFixtures, liveFixtures, team, configs])

  const grouped = combined.reduce<Record<string, Fixture[]>>((groups, fixture) => {
    const month = dateInfo(fixture.date).month
    if (!groups[month]) groups[month] = []
    groups[month].push(fixture)
    return groups
  }, {})

  return (
    <main style={{ background: '#F2F2F2', minHeight: '100vh', padding: '52px 24px 90px' }}>
      <style>{`
        .reliable-mobile { display:none; }
        @media(max-width:768px) {
          .reliable-desktop { display:none !important; }
          .reliable-mobile { display:block !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 18, flexWrap: 'wrap' }}>
          {(Object.keys(TEAM_DETAILS) as TeamId[]).map((id) => (
            <button key={id} onClick={() => setTeam(id)} style={{ padding: '10px 24px', borderRadius: 6, cursor: 'pointer', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: '0.08em', textTransform: 'uppercase', background: team === id ? '#1149D8' : '#fff', color: team === id ? '#fff' : '#041B5F', border: '2px solid #1149D8' }}>
              {TEAM_DETAILS[id].label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 36, flexWrap: 'wrap' }}>
          <button onClick={() => setView('matches')} style={{ padding: '8px 20px', borderRadius: 6, cursor: 'pointer', fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', background: view === 'matches' ? '#041B5F' : '#fff', color: view === 'matches' ? '#fff' : '#041B5F', border: '1px solid #041B5F' }}>Fixtures &amp; Results</button>
          <button onClick={() => setView('table')} style={{ padding: '8px 20px', borderRadius: 6, cursor: 'pointer', fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', background: view === 'table' ? '#041B5F' : '#fff', color: view === 'table' ? '#fff' : '#041B5F', border: '1px solid #041B5F' }}>League Table</button>
        </div>

        {view === 'matches' && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
              <div>
                <h1 style={{ margin: 0, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 'clamp(30px,5vw,42px)', color: '#041B5F', textTransform: 'uppercase' }}>{selected.heading} Fixtures &amp; Results</h1>
                <div style={{ width: 90, height: 5, background: '#1149D8', marginTop: 12 }} />
              </div>
              <div style={{ background: '#fff', border: '2px solid #1149D8', borderRadius: 6, padding: '10px 16px', fontFamily: "'Montserrat',sans-serif", fontSize: 12, fontWeight: 800, color: '#041B5F', textTransform: 'uppercase' }}>Season 2026/27</div>
            </div>

            {loading[team] && combined.length === 0 && (
              <DataMessage>Loading official fixtures…</DataMessage>
            )}

            {combined.length > 0 && (
              <>
                <div className="reliable-desktop" style={{ background: '#fff', border: '1px solid #DCE3F1', borderTop: '5px solid #1149D8', borderRadius: 8, overflowX: 'auto', boxShadow: '0 8px 24px rgba(4,27,95,.06)' }}>
                  <table style={{ width: '100%', minWidth: 900, borderCollapse: 'collapse', fontFamily: "'Montserrat',sans-serif", color: '#172554' }}>
                    <thead><tr style={{ background: '#041B5F' }}>{['Date','KO','Home/Away','Opponent','Competition','Result','Form','Details'].map((heading) => <th key={heading} style={{ padding: '16px 14px', textAlign: 'left', color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 15, fontWeight: 800, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{heading}</th>)}</tr></thead>
                    <tbody>{Object.entries(grouped).map(([month, fixtures]) => <DesktopRows key={month} month={month} fixtures={fixtures} />)}</tbody>
                  </table>
                </div>
                <div className="reliable-mobile">{Object.entries(grouped).map(([month, fixtures]) => <MobileMonth key={month} month={month} fixtures={fixtures} />)}</div>
              </>
            )}

            {!loading[team] && combined.length === 0 && failed[team] && (
              <DataMessage>The official fixture feed is temporarily unavailable.</DataMessage>
            )}
          </section>
        )}

        {view === 'table' && (
          <section>
            <h1 style={{ margin: '0 0 20px', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 'clamp(30px,5vw,42px)', color: '#041B5F', textTransform: 'uppercase' }}>{selected.heading} League Table</h1>
            {tableLoading && <DataMessage>Loading league table…</DataMessage>}
            {!tableLoading && tableRows.length > 0 && <LeagueTable rows={tableRows} />}
            {!tableLoading && tableRows.length === 0 && <DataMessage>The official league table is temporarily unavailable.</DataMessage>}
          </section>
        )}
      </div>
    </main>
  )
}

function DataMessage({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: 40, background: '#fff', border: '1px solid #DCE3F1', borderRadius: 8, textAlign: 'center', fontFamily: "'Montserrat',sans-serif", fontSize: 13, color: '#6B7280' }}>{children}</div>
}

function MobileMonth({ month, fixtures }: { month: string; fixtures: Fixture[] }) {
  return <section style={{ marginBottom: 22 }}><h2 style={{ margin: '0 0 10px', color: '#041B5F', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 21, fontWeight: 800, textTransform: 'uppercase' }}>{month}</h2><div style={{ display: 'grid', gap: 10 }}>{fixtures.map((fixture) => <MobileCard key={fixture._id} fixture={fixture} />)}</div></section>
}

function MobileCard({ fixture }: { fixture: Fixture }) {
  const form = formFor(fixture)
  const colour = form === 'W' ? '#22C55E' : form === 'L' ? '#EF4444' : '#F59E0B'
  const info = dateInfo(fixture.date)
  return <article style={{ background: '#fff', border: '1px solid #DCE3F1', borderLeft: '5px solid #1149D8', borderRadius: 8, padding: 16, boxShadow: '0 5px 16px rgba(4,27,95,.06)' }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><div><div style={{ color: '#6B7280', fontFamily: "'Montserrat',sans-serif", fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>{info.day} · {fixture.kickoff || 'TBC'} · {fixture.venue}</div><h3 style={{ margin: '6px 0 3px', color: '#041B5F', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 22, fontWeight: 800 }}>{fixture.opponent}</h3><div style={{ color: '#6B7280', fontFamily: "'Montserrat',sans-serif", fontSize: 11 }}>{fixture.competition || 'Competition TBC'}</div></div><div style={{ flexShrink: 0, textAlign: 'center' }}><div style={{ color: '#041B5F', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 25, fontWeight: 800 }}>{resultFor(fixture)}</div>{form && <span style={{ display: 'inline-flex', width: 28, height: 28, marginTop: 7, alignItems: 'center', justifyContent: 'center', background: colour, color: '#fff', borderRadius: 4, fontWeight: 800 }}>{form}</span>}</div></div>{fixture.played && fixture.sourceUrl && <a href={fixture.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 13, color: '#1149D8', fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 800, textDecoration: 'none', textTransform: 'uppercase' }}>Match Details →</a>}</article>
}

function DesktopRows({ month, fixtures }: { month: string; fixtures: Fixture[] }) {
  return <><tr><th colSpan={8} style={{ padding: '13px 14px', textAlign: 'left', background: '#EEF3FC', color: '#041B5F', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 17, fontWeight: 800, textTransform: 'uppercase' }}>{month}</th></tr>{fixtures.map((fixture) => { const form = formFor(fixture); const colour = form === 'W' ? '#22C55E' : form === 'L' ? '#EF4444' : '#F59E0B'; const info = dateInfo(fixture.date); return <tr key={fixture._id} style={{ borderBottom: '1px solid #E5E7EB' }}><td style={cell}>{info.day}</td><td style={cell}>{fixture.kickoff || 'TBC'}</td><td style={cell}>{fixture.venue}</td><td style={{ ...cell, fontWeight: 700, color: '#041B5F' }}>{fixture.opponent}</td><td style={cell}>{fixture.competition || 'TBC'}</td><td style={{ ...cell, fontWeight: 800 }}>{resultFor(fixture)}</td><td style={cell}>{form ? <span style={{ display: 'inline-flex', width: 32, height: 32, alignItems: 'center', justifyContent: 'center', background: colour, color: '#fff', borderRadius: 4, fontWeight: 800 }}>{form}</span> : '—'}</td><td style={cell}>{fixture.played && fixture.sourceUrl ? <a href={fixture.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#1149D8', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>Match Details</a> : '—'}</td></tr> })}</>
}

function LeagueTable({ rows }: { rows: LeagueRow[] }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #DCE3F1', borderRadius: 8, overflowX: 'auto', boxShadow: '0 8px 24px rgba(4,27,95,.06)' }}>
      <table style={{ width: '100%', minWidth: 650, borderCollapse: 'collapse', fontFamily: "'Montserrat',sans-serif" }}>
        <thead><tr style={{ background: '#041B5F' }}>{['Pos','Team','P','W','D','L','GD','Pts'].map((heading) => <th key={heading} style={{ padding: '14px 12px', color: '#fff', textAlign: heading === 'Team' ? 'left' : 'center', fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>{heading}</th>)}</tr></thead>
        <tbody>{rows.map((row) => {
          const isBtfc = normalise(row.team).includes('brimscombe') && normalise(row.team).includes('thrupp')
          return <tr key={`${row.position}-${row.team}`} style={{ borderBottom: '1px solid #E5E7EB', background: isBtfc ? '#E8F0FF' : '#fff' }}><td style={tableCell}>{row.position}</td><td style={{ ...tableCell, textAlign: 'left', fontWeight: isBtfc ? 900 : 700, color: isBtfc ? '#1149D8' : '#172554' }}>{row.team}</td><td style={tableCell}>{row.played}</td><td style={tableCell}>{row.won}</td><td style={tableCell}>{row.drawn}</td><td style={tableCell}>{row.lost}</td><td style={tableCell}>{row.goalDifference}</td><td style={{ ...tableCell, fontWeight: 800 }}>{row.points}</td></tr>
        })}</tbody>
      </table>
    </div>
  )
}

const cell = { padding: '15px 14px', fontSize: 13, lineHeight: 1.4, verticalAlign: 'middle' as const, whiteSpace: 'nowrap' as const }
const tableCell = { padding: '13px 12px', textAlign: 'center' as const, fontSize: 13 }
