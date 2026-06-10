'use client'

import { useEffect, useState } from 'react'
import { getFixtures } from '../lib/sanity.client'

type TeamId = 'all' | 'first' | 'reserves' | 'u17s'
type ViewId = 'all' | 'upcoming' | 'results'

type Fixture = {
  _id: string
  date: string
  opponent: string
  team: TeamId
  venue: 'Home' | 'Away'
  competition: string
  kickoff: string
  btfcScore?: number
  opponentScore?: number
  played: boolean
}

export default function FixturesPage() {
  const [team, setTeam] = useState<TeamId>('all')
  const [view, setView] = useState<ViewId>('all')
  const [matches, setMatches] = useState<Fixture[]>([])

  useEffect(() => {
    getFixtures().then(setMatches).catch(console.error)
  }, [])

  const filtered = matches.filter((m) => {
    const type = m.played ? 'results' : 'upcoming'
    const sanityTeam = String(m.team).toLowerCase()

const teamMatch =
  team === 'all' ||
  (team === 'first' && (sanityTeam === 'first' || sanityTeam === 'first xi')) ||
  (team === 'reserves' && (sanityTeam === 'reserves' || sanityTeam === 'reserve team')) ||
  (team === 'u17s' && (sanityTeam === 'u17s' || sanityTeam === 'under 17s' || sanityTeam === "u17's"))
    const viewMatch = view === 'all' || view === type
    return teamMatch && viewMatch
  })

  const teamTabs = [
    { id:'all', label:'All Teams' },
    { id:'first', label:'First XI' },
    { id:'reserves', label:'Reserves' },
    { id:'u17s', label:'Under 17s' },
  ] as const

  const viewTabs = [
    { id:'all', label:'All Matches' },
    { id:'upcoming', label:'Upcoming' },
    { id:'results', label:'Results' },
  ] as const

  function teamName(t: string) {
  const value = String(t).toLowerCase()

  if (value === 'first' || value === 'first xi') return 'First XI'
  if (value === 'reserves' || value === 'reserve team') return 'Reserves'
  if (value === 'u17s' || value === 'under 17s' || value === "u17's") return 'Under 17s'

  return 'First XI'
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

      m.venue === 'Home'
      ? `BTFC ${m.btfcScore ?? '-'}-${m.opponentScore ?? '-'} ${m.opponent}`
      : `${m.opponent} ${m.opponentScore ?? '-'}-${m.btfcScore ?? '-'} BTFC`
  }

  return (
    <main style={{ background:'#F2F2F2', minHeight:'100vh', padding:'52px 24px 90px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>

        <div style={{ display:'flex', gap:10, justifyContent:'center', marginBottom:18, flexWrap:'wrap' }}>
          {teamTabs.map(({ id, label }) => (
            <button key={id} onClick={() => setTeam(id)} style={{
              padding:'10px 24px',
              borderRadius:6,
              cursor:'pointer',
              fontFamily:"'Barlow Condensed',sans-serif",
              fontWeight:800,
              fontSize:15,
              letterSpacing:'0.08em',
              textTransform:'uppercase',
              background: team===id ? '#1149D8' : '#fff',
              color: team===id ? '#fff' : '#041B5F',
              border:'2px solid #1149D8',
            }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ display:'flex', gap:10, justifyContent:'center', marginBottom:36, flexWrap:'wrap' }}>
          {viewTabs.map(({ id, label }) => (
            <button key={id} onClick={() => setView(id)} style={{
              padding:'8px 20px',
              borderRadius:6,
              cursor:'pointer',
              fontFamily:"'Montserrat',sans-serif",
              fontWeight:800,
              fontSize:12,
              letterSpacing:'0.08em',
              textTransform:'uppercase',
              background: view===id ? '#041B5F' : '#fff',
              color: view===id ? '#fff' : '#041B5F',
              border:'1px solid #041B5F',
            }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ background:'#041B5F', borderRadius:8, padding:'20px 28px', marginBottom:28, display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
          <img src="/branding/crest.png" alt="BTFC" style={{ width:56, height:56, borderRadius:'50%', border:'2px solid #fff' }} />
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:28, color:'#fff', letterSpacing:'0.04em' }}>
              Match Centre
            </div>
            <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:12, color:'rgba(255,255,255,0.55)' }}>
              Showing {filtered.length} match{filtered.length === 1 ? '' : 'es'}
            </div>
          </div>
        </div>

        <div style={{ display:'grid', gap:16 }}>
          {filtered.length === 0 && (
            <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:8, padding:'40px 24px', textAlign:'center' }}>
              <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:13, color:'#9CA3AF' }}>
                No matches found for this filter.
              </p>
            </div>
          )}

          {filtered.map((m) => (
            <div key={m._id} style={{
              background:'#fff',
              border:'1px solid #E5E7EB',
              borderLeft:`5px solid ${m.played ? '#22C55E' : '#1149D8'}`,
              borderRadius:8,
              padding:'18px 22px',
              display:'flex',
              justifyContent:'space-between',
              alignItems:'center',
              flexWrap:'wrap',
              gap:16,
            }}>
              <div>
                <div style={{
                  fontFamily:"'Montserrat',sans-serif",
                  fontSize:11,
                  fontWeight:800,
                  color: m.played ? '#22C55E' : '#1149D8',
                  textTransform:'uppercase',
                  marginBottom:6
                }}>
                  {teamName(m.team)} · {m.played ? 'Result' : 'Upcoming Fixture'}
                </div>

                <div
  style={{
    fontFamily:"'Barlow Condensed',sans-serif",
    fontWeight:800,
    fontSize:26,
    lineHeight:1,
    display:'flex',
    alignItems:'center',
    gap:10,
    flexWrap:'wrap',
  }}
>
  <span style={{ color:'#1149D8' }}>BTFC</span>

  <span style={{ color:'#041B5F' }}>
    {m.played
      ? scoreLine(m).replace(/^BTFC\s*/, '').replace(/\s*BTFC$/, '')
      : `vs ${m.opponent}`}
  </span>
</div>

                <div style={{
                  marginTop:6,
                  fontFamily:"'Montserrat',sans-serif",
                  fontSize:12,
                  color:'#6B7280',
                  display:'flex',
                  gap:12,
                  flexWrap:'wrap'
                }}>
                  <span>{m.competition}</span>
                  <span>{m.venue === 'Home' ? '🏟 Home' : '✈️ Away'}</span>
                </div>
              </div>

              <div style={{ textAlign:'right' }}>
                <div style={{
                  fontFamily:"'Barlow Condensed',sans-serif",
                  fontWeight:800,
                  fontSize:24,
                  color:'#1149D8'
                }}>
                  {formatDate(m.date)}
                </div>

                <div style={{
                  fontFamily:"'Montserrat',sans-serif",
                  fontSize:13,
                  color:'#6B7280'
                }}>
                  Kick Off: {m.kickoff}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
        </main>
  )
}
