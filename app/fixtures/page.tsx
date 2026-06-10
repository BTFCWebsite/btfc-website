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
  venue: 'H' | 'A'
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
    const teamMatch = team === 'all' || m.team === team
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
    if (t === 'first') return 'First XI'
    if (t === 'reserves') return 'Reserves'
    return 'Under 17s'
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-GB', {
      weekday:'short',
      day:'numeric',
      month:'short',
    })
  }

  function scoreLine(m: Fixture) {
    if (!m.played) {
      return m.venue === 'H'
        ? `BTFC vs ${m.opponent}`
        : `${m.opponent} vs BTFC`
    }

    return m.venue === 'H'
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

                <div style={{
                  fontFamily:"'Barlow Condensed',sans-serif",
                  fontWeight:800,
                  fontSize:26,
                  color:'#041B5F',
                  lineHeight:1
                }}>
                  {scoreLine(m)}
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
                  <span>{m.venue === 'H' ? '🏟 Home' : '✈️ Away'}</span>
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
