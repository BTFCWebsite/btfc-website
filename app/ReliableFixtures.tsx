'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { getFixtures, getMatchFeeds } from './lib/sanity.client'
import { fullTimeWidgetDocument, loadFullTimeWidgetMatches, type FullTimeFixture } from './lib/fulltime.browser'

type TeamId = 'first' | 'reserves' | 'u17s'
type ViewId = 'matches' | 'table'

type Fixture = FullTimeFixture & { programmeUrl?: string }

type FeedConfig = {
  team: string
  widgets: string[]
  division: string
}

const DEFAULTS: Record<TeamId, FeedConfig> = {
  first: { team: 'First XI', widgets: ['969980533'], division: '320568525' },
  reserves: { team: 'Reserves', widgets: ['625925242', '681011209'], division: '222455275' },
  u17s: { team: 'Under 17s', widgets: [], division: '' },
}

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

function OfficialWidget({ widget }: { widget: string }) {
  if (widget === '969980533') {
    return <iframe src="/full-time/first-team.html" title="Official First XI Full-Time fixtures" style={{ width: '100%', minHeight: 1450, border: 0, background: '#fff', borderRadius: 10 }} />
  }
  return (
    <iframe
      srcDoc={fullTimeWidgetDocument(widget)}
      title={`Official Full-Time fixtures ${widget}`}
      style={{ width: '100%', minHeight: 1450, border: 0, background: '#fff', borderRadius: 10 }}
    />
  )
}

export default function ReliableFixtures() {
  const [team, setTeam] = useState<TeamId>('first')
  const [view, setView] = useState<ViewId>('matches')
  const [configs, setConfigs] = useState<Record<TeamId, FeedConfig>>(DEFAULTS)
  const [configReady, setConfigReady] = useState(false)
  const [manualFixtures, setManualFixtures] = useState<any[]>([])
  const [liveFixtures, setLiveFixtures] = useState<Record<TeamId, Fixture[]>>({ first: [], reserves: [], u17s: [] })
  const [loading, setLoading] = useState<Record<TeamId, boolean>>({ first: true, reserves: false, u17s: true })
  const [failed, setFailed] = useState<Record<TeamId, boolean>>({ first: false, reserves: false, u17s: false })
  const [tableRows, setTableRows] = useState<any[]>([])
  const [tableLoading, setTableLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadConfiguration() {
      try {
        const [feeds, manual] = await Promise.all([getMatchFeeds(), getFixtures()])
        if (cancelled) return
        setManualFixtures(manual || [])

        const next = { ...DEFAULTS }
        for (const feed of feeds || []) {
          const id = canonicalTeam(String(feed?.team || ''))
          if (!id || !feed?.snippet) continue
          const snippet = String(feed.snippet)
          const widget = snippet.match(/\blrcode\s*=\s*['\"](\d+)['\"]/i)?.[1] || ''
          const division = snippet.match(/[?&]divisionseason=(\d+)/i)?.[1] || ''
          if (id === 'reserves') {
            next.reserves = DEFAULTS.reserves
          } else {
            next[id] = {
              team: DEFAULTS[id].team,
              widgets: widget ? [widget] : DEFAULTS[id].widgets,
              division: division || DEFAULTS[id].division,
            }
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
      if (teamId === 'reserves') {
        setLoading((state) => ({ ...state, reserves: false }))
        setFailed((state) => ({ ...state, reserves: false }))
        return
      }

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
    loadTeam('u17s')
    return () => { cancelled = true }
  }, [configs, configReady])

  useEffect(() => {
    let cancelled = false
    async function loadTable() {
      if (view !== 'table') return
      const division = configs[team].division
      setTableRows([])
      if (!division) return
      setTableLoading(true)
      try {
        const response = await fetch(`/api/full-time?kind=table&division=${division}&team=${encodeURIComponent(configs[team].team)}`, { cache: 'no-store' })
        if (!cancelled && response.ok) {
          const payload = await response.json()
          setTableRows(Array.isArray(payload?.table) ? payload.table : [])
        }
      } catch {
        // The official Full-Time link below remains available.
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

            {team === 'reserves' ? (
              <>
                {combined.length > 0 && (
                  <div style={{ marginBottom: 26 }}>
                    <div className="reliable-desktop" style={{ background: '#fff', border: '1px solid #DCE3F1', borderTop: '5px solid #1149D8', borderRadius: 8, overflowX: 'auto', boxShadow: '0 8px 24px rgba(4,27,95,.06)' }}>
                      <table style={{ width: '100%', minWidth: 900, borderCollapse: 'collapse', fontFamily: "'Montserrat',sans-serif", color: '#172554' }}>
                        <thead><tr style={{ background: '#041B5F' }}>{['Date','KO','Home/Away','Opponent','Competition','Result','Form','Details'].map((heading) => <th key={heading} style={{ padding: '16px 14px', textAlign: 'left', color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 15, fontWeight: 800, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{heading}</th>)}</tr></thead>
                        <tbody>{Object.entries(grouped).map(([month, fixtures]) => <DesktopRows key={month} month={month} fixtures={fixtures} />)}</tbody>
                      </table>
                    </div>
                    <div className="reliable-mobile">{Object.entries(grouped).map(([month, fixtures]) => <MobileMonth key={month} month={month} fixtures={fixtures} />)}</div>
                  </div>
                )}
                <div style={{ background: '#fff', border: '1px solid #DCE3F1', borderRadius: 10, overflow: 'hidden', boxShadow: '0 8px 24px rgba(4,27,95,.06)' }}>
                  <iframe src="/full-time/reserves.html" title="Official BTFC Reserves fixtures and results" style={{ display: 'block', width: '100%', minHeight: 1700, border: 0, background: '#fff' }} />
                </div>
              </>
            ) : (
              <>
                {loading[team] && combined.length === 0 && <div style={{ padding: 44, background: '#fff', borderRadius: 8, textAlign: 'center', fontFamily: "'Montserrat',sans-serif", color: '#6B7280' }}>Loading official fixtures…</div>}

                {!loading[team] && combined.length > 0 && (
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

                {!loading[team] && failed[team] && (
                  <div style={{ marginTop: 24 }}>
                    <div style={{ padding: '14px 18px', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 8, marginBottom: 14, fontFamily: "'Montserrat',sans-serif", fontSize: 12, color: '#9A3412' }}>Our formatted fixture view could not read the FA feed, so the official Full-Time widget is shown below.</div>
                    {configs[team].widgets.map((widget) => <OfficialWidget key={widget} widget={widget} />)}
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {view === 'table' && (
          <section>
            <h1 style={{ margin: '0 0 20px', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 'clamp(30px,5vw,42px)', color: '#041B5F', textTransform: 'uppercase' }}>{selected.heading} League Table</h1>
            {tableLoading && <div style={{ padding: 40, background: '#fff', borderRadius: 8, textAlign: 'center' }}>Loading league table…</div>}
            {!tableLoading && tableRows.length > 0 && <LeagueTable rows={tableRows} />}
            {!tableLoading && tableRows.length === 0 && (
              <div style={{ background: '#fff', border: '1px solid #DCE3F1', borderRadius: 8, padding: 32, textAlign: 'center' }}>
                <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 13, color: '#6B7280', margin: '0 0 18px' }}>The live league table cannot currently be read by the website.</p>
                {configs[team].division && <a href={`https://fulltime.thefa.com/index.html?divisionseason=${configs[team].division}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#1149D8', color: '#fff', padding: '12px 20px', borderRadius: 6, textDecoration: 'none', fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 12 }}>View Official League Table on Full-Time →</a>}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  )
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

function LeagueTable({ rows }: { rows: any[] }) {
  return <div style={{ background: '#fff', border: '1px solid #DCE3F1', borderRadius: 8, overflowX: 'auto' }}><table style={{ width: '100%', minWidth: 650, borderCollapse: 'collapse', fontFamily: "'Montserrat',sans-serif" }}><thead><tr style={{ background: '#041B5F' }}>{['Pos','Team','P','W','D','L','GD','Pts'].map((heading) => <th key={heading} style={{ padding: '14px 12px', color: '#fff', textAlign: heading === 'Team' ? 'left' : 'center' }}>{heading}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={`${row.position}-${row.team}`} style={{ borderBottom: '1px solid #E5E7EB', background: normalise(row.team).includes('brimscombe') ? '#E8F0FF' : '#fff' }}><td style={tableCell}>{row.position}</td><td style={{ ...tableCell, textAlign: 'left', fontWeight: 700 }}>{row.team}</td><td style={tableCell}>{row.played}</td><td style={tableCell}>{row.won}</td><td style={tableCell}>{row.drawn}</td><td style={tableCell}>{row.lost}</td><td style={tableCell}>{row.goalDifference}</td><td style={{ ...tableCell, fontWeight: 800 }}>{row.points}</td></tr>)}</tbody></table></div>
}

const cell = { padding: '15px 14px', fontSize: 13, lineHeight: 1.4, verticalAlign: 'middle' as const, whiteSpace: 'nowrap' as const }
const tableCell = { padding: '13px 12px', textAlign: 'center' as const, fontSize: 13 }
