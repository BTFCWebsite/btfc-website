'use client'

import { useEffect, useState } from 'react'
import { getFixtures } from '../lib/sanity.client'

type TeamId = 'all' | 'first' | 'reserves' | 'u17s'
type ViewId = 'all' | 'upcoming' | 'results'

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

function FirstTeamLeagueTable() {
  return (
    <section
      aria-labelledby="first-team-league-table"
      style={{
        marginTop: 40,
        background: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: 8,
        padding: '24px 20px',
      }}
    >
      <h2
        id="first-team-league-table"
        style={{
          margin: '0 0 20px',
          fontFamily: "'Barlow Condensed',sans-serif",
          fontWeight: 800,
          fontSize: 30,
          color: '#041B5F',
          textAlign: 'center',
        }}
      >
        First XI League Table
      </h2>

      <iframe
        title="First XI Hellenic League Division One table"
        src="/full-time/first-team.html"
        style={{
          display: 'block',
          width: '100%',
          height: 900,
          border: 0,
          background: '#fff',
        }}
      />
    </section>
  )
}

export default function FixturesPage() {
  const [team, setTeam] = useState<TeamId>('all')
  const [view, setView] = useState<ViewId>('all')
  const [matches, setMatches] = useState<Fixture[]>([])

  useEffect(() => {
  async function loadFixtures() {
    try {
      const data = await getFixtures()

      setMatches(
        (data || []).filter((m: any) =>
          m &&
          m.date &&
          m.opponent &&
          m.team &&
          m.venue
        )
      )
    } catch (error) {
      console.error('Failed to load fixtures:', error)
      setMatches([])
    }
  }

  loadFixtures()
}, [])

  function formatDate(date: string) {
    if (!date) return 'Date TBC'

    const d = new Date(date)

    if (isNaN(d.getTime())) return 'Date TBC'

    return d.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
  }

  function scoreLine(m: Fixture) {
    const isHome = m.venue === 'Home'

    if (!m.played) {
      return isHome
        ? `BTFC vs ${m.opponent || 'Fixture TBC'}`
        : `${m.opponent || 'Fixture TBC'} vs BTFC`
    }

    const btfc = m.btfcScore ?? '-'
    const opp = m.opponentScore ?? '-'
    const opponent = m.opponent || 'Opponent TBC'

    return isHome
      ? `BTFC ${btfc}-${opp} ${opponent}`
      : `${opponent} ${opp}-${btfc} BTFC`
  }

  const filtered = matches
    .filter((m) => {
      const teamMatch =
        team === 'all' ||
        (team === 'first' && m.team === 'First XI') ||
        (team === 'reserves' && m.team === 'Reserves') ||
        (team === 'u17s' && m.team === 'Under 17s')

      const viewMatch =
        view === 'all' ||
        (view === 'upcoming' && !m.played) ||
        (view === 'results' && m.played)

      return teamMatch && viewMatch
    })
    .sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })

  const teamTabs = [
    { id: 'all', label: 'All Teams' },
    { id: 'first', label: 'First XI' },
    { id: 'reserves', label: 'Reserves' },
    { id: 'u17s', label: 'Under 17s' },
  ] as const

  const viewTabs = [
    { id: 'all', label: 'All Matches' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'results', label: 'Results' },
  ] as const

  return (
    <main
      style={{
        background: '#F2F2F2',
        minHeight: '100vh',
        padding: '52px 24px 90px',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Team filter */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            justifyContent: 'center',
            marginBottom: 18,
            flexWrap: 'wrap',
          }}
        >
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

        {/* View filter */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            justifyContent: 'center',
            marginBottom: 36,
            flexWrap: 'wrap',
          }}
        >
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

        {/* Match count banner */}
        <div
          style={{
            background: '#041B5F',
            borderRadius: 8,
            padding: '20px 28px',
            marginBottom: 28,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <img
            src="/branding/crest.png"
            alt="BTFC"
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              border: '2px solid #fff',
            }}
          />

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "'Barlow Condensed',sans-serif",
                fontWeight: 800,
                fontSize: 28,
                color: '#fff',
                letterSpacing: '0.04em',
              }}
            >
              Match Centre
            </div>

            <div
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontSize: 12,
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              Showing {filtered.length} match
              {filtered.length === 1 ? '' : 'es'}
            </div>
          </div>
        </div>

        {/* Match list */}
        <div style={{ display: 'grid', gap: 16 }}>
          {filtered.map((m) => (
            <div
              key={m._id}
              style={{
                background: '#fff',
                border: '1px solid #E5E7EB',
                borderLeft: `5px solid ${
                  m.played ? '#22C55E' : '#1149D8'
                }`,
                borderRadius: 8,
                padding: '18px 22px',
                display: 'flex',
justifyContent: 'space-between',
alignItems: 'flex-start',
flexWrap: 'nowrap',
gap: 16,
minHeight: 120,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Montserrat',sans-serif",
                    fontSize: 11,
                    fontWeight: 800,
                    color: m.played ? '#22C55E' : '#1149D8',
                    textTransform: 'uppercase',
                    marginBottom: 6,
                  }}
                >
                  {m.team} · {m.played ? 'Result' : 'Upcoming Fixture'}
                </div>

                <div
  style={{
    fontFamily: "'Barlow Condensed',sans-serif",
    fontWeight: 800,
    fontSize: 26,
    color: '#041B5F',
    lineHeight: 1.1,
    minHeight: 60,
  }}
>
  {scoreLine(m)}
</div>

                <div
                  style={{
                    marginTop: 6,
                    fontFamily: "'Montserrat',sans-serif",
                    fontSize: 12,
                    color: '#6B7280',
                    display: 'flex',
                    gap: 12,
                    flexWrap: 'wrap',
                  }}
                >
                  <span>{m.competition}</span>

                  <span>
                    {m.venue === 'Home'
                      ? '🏟 Home'
                      : '✈️ Away'}
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontFamily: "'Barlow Condensed',sans-serif",
                    fontWeight: 800,
                    fontSize: 24,
                    color: '#1149D8',
                  }}
                >
                  {formatDate(m.date)}
                </div>

                <div
                  style={{
  textAlign: 'right',
  width: 120,
  flexShrink: 0
}}
                >
                  Kick Off: {m.kickoff}
                </div>
              </div>
            </div>
          ))}
        </div>

        {(team === 'all' || team === 'first') && <FirstTeamLeagueTable />}

      </div>
    </main>
  )
}
