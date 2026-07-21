'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getFixtures } from '../lib/sanity.client'

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

function FirstTeamFullTime() {
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
            Fixtures, Results &amp; League Table
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
            First XI · Hellenic League Division One
          </div>
        </div>
      </div>
      <div style={{ padding: '18px 20px 8px' }}>
        <iframe
          title="First XI fixtures, results and Hellenic League Division One table"
          src="/full-time/first-team.html"
          style={{
            display: 'block',
            width: '100%',
            height: 1400,
            border: 0,
            background: '#fff',
          }}
        />
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

  useEffect(() => {
    async function loadFixtures() {
      try {
        const data = await getFixtures()
        setMatches(
          (data || []).filter((match: any) =>
            match &&
            match.date &&
            match.opponent &&
            match.team &&
            match.venue
          )
        )
      } catch (error) {
        console.error('Failed to load fixtures:', error)
        setMatches([])
      }
    }

    loadFixtures()
  }, [])

  const selectedTeam = teamDetails[team]
  const teamMatches = matches
    .filter((match) => match.team === selectedTeam.sanityName)
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
    { id: 'table', label: 'Full-Time' },
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
          </section>
        )}

        {view === 'table' && (
          team === 'first'
            ? <FirstTeamFullTime />
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
        <Link href={'/match-report/' + encodeURIComponent(match._id)} style={{ display: 'inline-block', marginTop: 13, color: '#1149D8', fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 800, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Match Report →
        </Link>
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
                <Link
                  href={'/match-report/' + encodeURIComponent(match._id)}
                  style={{ color: '#1149D8', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}
                >
                  Match Report
                </Link>
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
