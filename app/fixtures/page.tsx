'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getFixtures, getMatchFeeds } from '../lib/sanity.client'

type TeamId = 'first' | 'reserves' | 'u17s'
type ViewId = 'matches' | 'table'

type Fixture = {
  _id: string
  date: string
  opponent: string
  team: string
  venue: string
  competition: string
  kickoff: string
  btfcScore?: number
  opponentScore?: number
  played: boolean
  sourceUrl?: string
  source?: string
  location?: string
}

type LeagueRow = {
  position: number
  team: string
  played: number
  won: number
  drawn: number
  lost: number
  goalDifference: number
  points: number
}

const teamDetails = {
  first: {
    label: 'First XI',
    sanityName: 'First XI',
    heading: 'BTFC First XI',
  },
  reserves: {
    label: 'Reserves',
    sanityName: 'Reserves',
    heading: 'BTFC Reserves',
  },
  u17s: {
    label: 'Under 17s',
    sanityName: 'Under 17s',
    heading: 'BTFC Under 17s',
  },
} as const

// Verified opening table for U17 Division 1 (Full-Time division 761524402).
// Used only when Full-Time blocks the live server request; live rows take priority.
const under17OpeningTable: LeagueRow[] = [
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

function LeagueTable({ rows, teamName }: { rows: LeagueRow[]; teamName: string }) {
  return (
    <section
      aria-labelledby="first-team-full-time"
      style={{
        background: '#fff',
        border: '1px solid #DCE3F1',
        borderRadius: 10,
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(4,27,95,0.08)',
      }}
    >
      <div
        style={{
          background: '#041B5F',
          borderBottom: '5px solid #1149D8',
          padding: '20px 26px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <img
          src="/branding/crest.png"
          alt=""
          style={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            border: '2px solid #fff',
            flexShrink: 0,
          }}
        />
        <div>
          <h2
            id="first-team-full-time"
            style={{
              margin: 0,
              fontFamily: "'Barlow Condensed',sans-serif",
              fontWeight: 800,
              fontSize: 30,
              lineHeight: 1,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#fff',
            }}
          >
            League Table
          </h2>
          <div
            style={{
              marginTop: 7,
              fontFamily: "'Montserrat',sans-serif",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.68)',
            }}
          >
            {teamName}
          </div>
        </div>
      </div>
      <div className="league-table-scroll" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: 650, borderCollapse: 'collapse', fontFamily: "'Montserrat',sans-serif", color: '#172554' }}>
          <thead><tr style={{ background: '#EEF3FC' }}>
            {['Pos', 'Team', 'P', 'W', 'D', 'L', 'GD', 'Pts'].map((heading, index) => <th key={heading} style={{ padding: '14px 12px', textAlign: index === 1 ? 'left' : 'center', color: '#041B5F', fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>{heading}</th>)}
          </tr></thead>
          <tbody>{rows.map(row => {
            const isBtfc = row.team === 'Brimscombe & Thrupp'
            return <tr key={row.team} style={{ background: isBtfc ? '#E8F0FF' : '#fff', borderBottom: '1px solid #DCE3F1' }}>
              <td style={{ padding: '13px 12px', textAlign: 'center', fontWeight: 800 }}>{row.position}</td>
              <td style={{ padding: '13px 12px', fontWeight: isBtfc ? 900 : 700, color: isBtfc ? '#1149D8' : '#172554' }}>{row.team}</td>
              {[row.played, row.won, row.drawn, row.lost, row.goalDifference, row.points].map((value, index) => <td key={index} style={{ padding: '13px 12px', textAlign: 'center', fontWeight: index === 5 ? 900 : 600 }}>{value}</td>)}
            </tr>
          })}</tbody>
        </table>
        {rows.length === 0 && <div style={{ padding: '42px 24px', textAlign: 'center', color: '#6B7280', fontFamily: "'Montserrat',sans-serif", fontSize: 13 }}>The league table is temporarily unavailable.</div>}
      </div>
    </section>
  )
}

function LeagueTablePlaceholder({ teamName }: { teamName: string }) {
  return (
    <section
      style={{
        background: '#fff',
        border: '1px solid #DCE3F1',
        borderRadius: 10,
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(4,27,95,0.08)',
      }}
    >
      <div style={{ background: '#041B5F', borderBottom: '5px solid #1149D8', padding: '20px 26px' }}>
        <h2 style={{ margin: 0, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 30, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#fff' }}>
          League Table
        </h2>
        <div style={{ marginTop: 7, fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)' }}>
          {teamName}
        </div>
      </div>
      <div style={{ padding: '42px 24px', textAlign: 'center', fontFamily: "'Montserrat',sans-serif", color: '#6B7280', fontSize: 13 }}>
        The Full-Time league table will appear here once this team&apos;s code is supplied.
      </div>
    </section>
  )
}

function OfficialFullTimeWidget({ title, snippet }: { title: string; snippet: string }) {
  const document = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;background:#fff;font-family:Arial,sans-serif}#full-time-widget{width:100%;overflow-x:auto}</style></head><body><div id="full-time-widget">${snippet}</div></body></html>`
  return (
    <section style={{ marginTop: 24 }} aria-label={title}>
      <h2 style={{ margin: '0 0 12px', color: '#041B5F', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {title}
      </h2>
      <iframe srcDoc={document} title={title} style={{ width: '100%', minHeight: 1400, border: 0, background: '#fff', borderRadius: 10 }} />
    </section>
  )
}

function fixtureMonth(date: string) {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return 'Date TBC'
  return parsed.toLocaleDateString('en-GB', { month: 'long' })
}

function fixtureDay(date: string) {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return 'TBC'
  return parsed.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })
}

function resultFor(fixture: Fixture) {
  if (!fixture.played) return '—'
  const btfc = fixture.btfcScore ?? '-'
  const opponent = fixture.opponentScore ?? '-'
  return fixture.venue === 'Home'
    ? String(btfc) + '-' + String(opponent)
    : String(opponent) + '-' + String(btfc)
}

function formFor(fixture: Fixture) {
  if (!fixture.played || fixture.btfcScore == null || fixture.opponentScore == null) return null
  if (fixture.btfcScore > fixture.opponentScore) return 'W'
  if (fixture.btfcScore < fixture.opponentScore) return 'L'
  return 'D'
}

export default function FixturesPage() {
  const [team, setTeam] = useState<TeamId>('first')
  const [view, setView] = useState<ViewId>('matches')
  const [matches, setMatches] = useState<Fixture[]>([])
  const [fullTimeMatches, setFullTimeMatches] = useState<Fixture[]>([])
  const [leagueTables, setLeagueTables] = useState<Record<string, LeagueRow[]>>({})
  const [feedSnippets, setFeedSnippets] = useState<Record<string, string>>({})
  const [officialWidgetFallbacks, setOfficialWidgetFallbacks] = useState<Record<string, { matches: boolean; table: boolean }>>({})

  useEffect(() => {
    async function loadFixtures() {
      try {
        const [data, feeds] = await Promise.all([getFixtures(), getMatchFeeds()])
        setMatches(
          (data || []).filter((match: any) =>
            match &&
            match.date &&
            match.opponent &&
            match.team &&
            match.venue
          )
        )

        const canonicalTeam = (value = '') => {
          const normalised = value.toLowerCase().replace(/[^a-z0-9]/g, '')
          if (normalised.includes('u17') || normalised.includes('under17')) return 'Under 17s'
          if (normalised.includes('reserve')) return 'Reserves'
          if (normalised.includes('first')) return 'First XI'
          return value
        }
        const activeFeeds = (feeds || [])
          .map((feed: any) => ({ team: canonicalTeam(feed?.team), snippet: feed?.snippet || '' }))
          .filter((feed: any) => feed.team && feed.snippet)
        setFeedSnippets(Object.fromEntries(activeFeeds.map((feed: any) => [feed.team, feed.snippet])))

        const results = await Promise.all(activeFeeds.map(async (feed: any) => {
          const widgetCode = feed.snippet.match(/\blrcode\s*=\s*['\"](\d+)['\"]/i)?.[1]
          const divisionSeason = feed.snippet.match(/[?&]divisionseason=(\d+)/i)?.[1]
          const params = new URLSearchParams({ team: feed.team })
          if (widgetCode) params.set('widget', widgetCode)
          if (divisionSeason) params.set('division', divisionSeason)
          const [matchesResponse, tableResponse] = await Promise.all([
            fetch(`/api/full-time?${params.toString()}&kind=matches`),
            fetch(`/api/full-time?${params.toString()}&kind=table`),
          ])
          const matchData = matchesResponse.ok ? await matchesResponse.json() : { matches: [] }
          const tableData = tableResponse.ok ? await tableResponse.json() : { table: [] }
          return {
            team: feed.team,
            matches: matchData.matches || [],
            table: tableData.table || [],
            matchesFallback: !matchesResponse.ok,
            tableFallback: !tableResponse.ok,
          }
        }))
        setFullTimeMatches(results.flatMap(result => result.matches))
        setLeagueTables(Object.fromEntries(results.map(result => [result.team, result.table])))
        setOfficialWidgetFallbacks(Object.fromEntries(results.map(result => [result.team, {
          matches: result.matchesFallback,
          table: result.tableFallback,
        }])))
      } catch (error) {
        console.error('Failed to load fixtures:', error)
        setOfficialWidgetFallbacks({
          'First XI': { matches: true, table: true },
          Reserves: { matches: true, table: true },
          'Under 17s': { matches: true, table: true },
        })
      }
    }

    loadFixtures()
  }, [])

  const selectedTeam = teamDetails[team]
  const liveLeagueRows = leagueTables[selectedTeam.sanityName] || []
  const displayedLeagueRows = liveLeagueRows.length
    ? liveLeagueRows
    : selectedTeam.sanityName === 'Under 17s'
      ? under17OpeningTable
      : []
  const combinedMatches = [...matches, ...fullTimeMatches]
  const teamMatches = combinedMatches
    .filter((match) => match.team === selectedTeam.sanityName)
    .filter((match, index, all) => all.findIndex(candidate => candidate._id === match._id || (candidate.date === match.date && candidate.opponent === match.opponent)) === index)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const matchesByMonth = teamMatches.reduce<Record<string, Fixture[]>>((groups, match) => {
    const month = fixtureMonth(match.date)
    if (!groups[month]) groups[month] = []
    groups[month].push(match)
    return groups
  }, {})

  const teamTabs = [
    { id: 'first', label: 'First XI' },
    { id: 'reserves', label: 'Reserves' },
    { id: 'u17s', label: 'Under 17s' },
  ] as const

  const viewTabs = [
    { id: 'matches', label: 'Fixtures & Results' },
    { id: 'table', label: 'League Table' },
  ] as const

  return (
    <main style={{ background: '#F2F2F2', minHeight: '100vh', padding: '52px 24px 90px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 18, flexWrap: 'wrap' }}>
          {teamTabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTeam(id)}
              style={{
                padding: '10px 24px',
                borderRadius: 6,
                cursor: 'pointer',
                fontFamily: "'Barlow Condensed',sans-serif",
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: team === id ? '#1149D8' : '#fff',
                color: team === id ? '#fff' : '#041B5F',
                border: '2px solid #1149D8',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 36, flexWrap: 'wrap' }}>
          {viewTabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              style={{
                padding: '8px 20px',
                borderRadius: 6,
                cursor: 'pointer',
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 800,
                fontSize: 12,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: view === id ? '#041B5F' : '#fff',
                color: view === id ? '#fff' : '#041B5F',
                border: '1px solid #041B5F',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {view === 'matches' && (
          <section>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 16,
                flexWrap: 'wrap',
                marginBottom: 20,
              }}
            >
              <div>
                <h1
                  style={{
                    margin: 0,
                    fontFamily: "'Barlow Condensed',sans-serif",
                    fontWeight: 800,
                    fontSize: 'clamp(30px, 5vw, 42px)',
                    lineHeight: 1,
                    letterSpacing: '0.03em',
                    textTransform: 'uppercase',
                    color: '#041B5F',
                  }}
                >
                  {selectedTeam.heading} Fixtures &amp; Results
                </h1>
                <div style={{ width: 90, height: 5, background: '#1149D8', marginTop: 12 }} />
              </div>
              <div
                style={{
                  background: '#fff',
                  border: '2px solid #1149D8',
                  borderRadius: 6,
                  padding: '10px 16px',
                  fontFamily: "'Montserrat',sans-serif",
                  fontSize: 12,
                  fontWeight: 800,
                  color: '#041B5F',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Season 2026/27
              </div>
            </div>

            <div
              className="fixtures-desktop-table"
              style={{
                background: '#fff',
                border: '1px solid #DCE3F1',
                borderTop: '5px solid #1149D8',
                borderRadius: 8,
                overflowX: 'auto',
                boxShadow: '0 8px 24px rgba(4,27,95,0.06)',
              }}
            >
              <table
                style={{
                  width: '100%',
                  minWidth: 900,
                  borderCollapse: 'collapse',
                  fontFamily: "'Montserrat',sans-serif",
                  color: '#172554',
                }}
              >
                <thead>
                  <tr style={{ background: '#041B5F' }}>
                    {['Date', 'KO', 'Home/Away', 'Opponent', 'Competition', 'Result', 'Form', 'Match Report'].map((heading) => (
                      <th
                        key={heading}
                        style={{
                          padding: '16px 14px',
                          textAlign: 'left',
                          color: '#fff',
                          fontFamily: "'Barlow Condensed',sans-serif",
                          fontSize: 15,
                          fontWeight: 800,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(matchesByMonth).map(([month, monthMatches]) => (
                    <FragmentRows key={month} month={month} matches={monthMatches} />
                  ))}
                </tbody>
              </table>

              {teamMatches.length === 0 && (
                <div style={{ padding: '44px 24px', textAlign: 'center', fontFamily: "'Montserrat',sans-serif", fontSize: 13, color: '#6B7280' }}>
                  No fixtures have been published for this team yet.
                </div>
              )}
            </div>

            <div className="fixtures-mobile-list">
              {Object.entries(matchesByMonth).map(([month, monthMatches]) => (
                <section key={month} style={{ marginBottom: 22 }}>
                  <h2 style={{ margin: '0 0 10px', color: '#041B5F', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 21, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {month}
                  </h2>
                  <div style={{ display: 'grid', gap: 10 }}>
                    {monthMatches.map(match => <MobileFixtureCard key={match._id} match={match} />)}
                  </div>
                </section>
              ))}
              {teamMatches.length === 0 && (
                <div style={{ padding: '34px 20px', textAlign: 'center', background: '#fff', border: '1px solid #DCE3F1', borderRadius: 8, fontFamily: "'Montserrat',sans-serif", fontSize: 13, color: '#6B7280' }}>
                  No fixtures have been published for this team yet.
                </div>
              )}
            </div>
            {officialWidgetFallbacks[selectedTeam.sanityName]?.matches && feedSnippets[selectedTeam.sanityName] && (
              <OfficialFullTimeWidget title="Official League Fixtures & Results" snippet={feedSnippets[selectedTeam.sanityName]} />
            )}
          </section>
        )}

        {view === 'table' && (
          displayedLeagueRows.length
            ? <LeagueTable rows={displayedLeagueRows} teamName={selectedTeam.heading} />
            : feedSnippets[selectedTeam.sanityName]
              ? <OfficialFullTimeWidget title="Official League Table" snippet={feedSnippets[selectedTeam.sanityName]} />
              : <LeagueTablePlaceholder teamName={selectedTeam.heading} />
        )}
      </div>
    </main>
  )
}

function MobileFixtureCard({ match }: { match: Fixture }) {
  const form = formFor(match)
  const formColour = form === 'W' ? '#22C55E' : form === 'L' ? '#EF4444' : '#F59E0B'

  return (
    <article style={{ background: '#fff', border: '1px solid #DCE3F1', borderLeft: '5px solid #1149D8', borderRadius: 8, padding: 16, boxShadow: '0 5px 16px rgba(4,27,95,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div>
          <div style={{ color: '#6B7280', fontFamily: "'Montserrat',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {fixtureDay(match.date)} · {match.kickoff || 'TBC'} · {match.venue}
          </div>
          <h3 style={{ margin: '6px 0 3px', color: '#041B5F', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 22, fontWeight: 800, lineHeight: 1.05 }}>
            {match.opponent}
          </h3>
          <div style={{ color: '#6B7280', fontFamily: "'Montserrat',sans-serif", fontSize: 11, lineHeight: 1.35 }}>
            {match.competition || 'Competition TBC'}
          </div>
        </div>
        <div style={{ flexShrink: 0, textAlign: 'center' }}>
          <div style={{ color: '#041B5F', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 25, fontWeight: 800, lineHeight: 1 }}>
            {resultFor(match)}
          </div>
          {form && <span style={{ display: 'inline-flex', width: 28, height: 28, marginTop: 7, alignItems: 'center', justifyContent: 'center', background: formColour, color: '#fff', borderRadius: 4, fontFamily: "'Montserrat',sans-serif", fontSize: 12, fontWeight: 800 }}>{form}</span>}
        </div>
      </div>
      {match.played && (
        match.sourceUrl
          ? <a href={match.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 13, color: '#1149D8', fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 800, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full-Time details →</a>
          : <Link href={'/match-report/' + encodeURIComponent(match._id)} style={{ display: 'inline-block', marginTop: 13, color: '#1149D8', fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 800, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Match Report →</Link>
      )}
    </article>
  )
}

function FragmentRows({ month, matches }: { month: string; matches: Fixture[] }) {
  return (
    <>
      <tr>
        <th
          colSpan={8}
          style={{
            padding: '13px 14px',
            textAlign: 'left',
            background: '#EEF3FC',
            borderTop: '1px solid #DCE3F1',
            borderBottom: '1px solid #DCE3F1',
            color: '#041B5F',
            fontFamily: "'Barlow Condensed',sans-serif",
            fontSize: 17,
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {month}
        </th>
      </tr>
      {matches.map((match) => {
        const form = formFor(match)
        const formColour = form === 'W' ? '#22C55E' : form === 'L' ? '#EF4444' : '#F59E0B'

        return (
          <tr key={match._id} style={{ borderBottom: '1px solid #E5E7EB' }}>
            <td style={cellStyle}>{fixtureDay(match.date)}</td>
            <td style={cellStyle}>{match.kickoff || 'TBC'}</td>
            <td style={cellStyle}>{match.venue}</td>
            <td style={{ ...cellStyle, fontWeight: 700, color: '#041B5F' }}>{match.opponent}</td>
            <td style={cellStyle}>{match.competition || 'TBC'}</td>
            <td style={{ ...cellStyle, fontWeight: 800 }}>{resultFor(match)}</td>
            <td style={cellStyle}>
              {form ? (
                <span
                  style={{
                    display: 'inline-flex',
                    width: 32,
                    height: 32,
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: formColour,
                    color: '#fff',
                    borderRadius: 4,
                    fontWeight: 800,
                  }}
                >
                  {form}
                </span>
              ) : '—'}
            </td>
            <td style={cellStyle}>
              {match.played ? (
                match.sourceUrl
                  ? <a href={match.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#1149D8', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>Full-Time details</a>
                  : <Link href={'/match-report/' + encodeURIComponent(match._id)} style={{ color: '#1149D8', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>Match Report</Link>
              ) : '—'}
            </td>
          </tr>
        )
      })}
    </>
  )
}

const cellStyle = {
  padding: '15px 14px',
  fontSize: 13,
  lineHeight: 1.4,
  verticalAlign: 'middle' as const,
  whiteSpace: 'nowrap' as const,
}
