'use client'
import { useState } from 'react'

type TeamId = 'all' | 'first' | 'reserves' | 'u17s'
type ViewId = 'all' | 'upcoming' | 'results'

export default function FixturesPage() {
  const [team, setTeam] = useState<TeamId>('all')
  const [view, setView] = useState<ViewId>('all')

  const matches = [
    { team:'first', type:'result', date:'Sat 18 Apr', opp:'FC Stratford', comp:'League', venue:'H', time:'15:00', score:'BTFC 1-2 FC Stratford' },
    { team:'first', type:'result', date:'Tue 14 Apr', opp:'Thame Utd Res', comp:'League', venue:'A', time:'19:45', score:'Thame Utd Res 0-2 BTFC' },
    { team:'first', type:'upcoming', date:'Sat 9 Aug', opp:'Clanfield FC', comp:'League', venue:'H', time:'15:00', score:'' },

    { team:'reserves', type:'result', date:'Sat 20 Apr', opp:'Hardwicke Res', comp:'League', venue:'H', time:'14:00', score:'BTFC Res 3-1 Hardwicke Res' },
    { team:'reserves', type:'result', date:'Sat 13 Apr', opp:'Minchinhampton Res', comp:'League', venue:'A', time:'14:00', score:'Minchinhampton Res 2-1 BTFC Res' },
    { team:'reserves', type:'upcoming', date:'Sat 10 Aug', opp:'Bishops Cleeve Dev', comp:'League', venue:'A', time:'14:00', score:'' },

    { team:'u17s', type:'result', date:'Sun 21 Apr', opp:'Stonehouse U17', comp:'League', venue:'H', time:'10:30', score:'BTFC U17 2-2 Stonehouse U17' },
    { team:'u17s', type:'result', date:'Sun 14 Apr', opp:'Longlevens U17', comp:'League', venue:'A', time:'10:30', score:'Longlevens U17 1-3 BTFC U17' },
    { team:'u17s', type:'upcoming', date:'Sun 11 Aug', opp:'Tuffley Rovers U17', comp:'League', venue:'H', time:'10:30', score:'' },
  ] as const

  const filtered = matches.filter((m) => {
    const teamMatch = team === 'all' || m.team === team
    const viewMatch = view === 'all' || m.type === view
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

  return (
    <main style={{ background:'#F2F2F2', minHeight:'100vh', padding:'80px 24px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:42 }}>
          <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:56, letterSpacing:'0.04em', color:'#041B5F', marginBottom:8, textTransform:'uppercase' }}>
            Matches
          </h1>
          <div style={{ width:70, height:4, background:'#1149D8', margin:'0 auto 16px', borderRadius:2 }} />
          <p style={{ color:'#6B7280', fontSize:14, maxWidth:680, margin:'0 auto', lineHeight:1.7 }}>
            Fixtures and results across all Brimscombe & Thrupp FC teams.
          </p>
        </div>

        <div style={{ display:'flex', gap:10, justifyContent:'center', marginBottom:18, flexWrap:'wrap' }}>
          {teamTabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTeam(id)}
              style={{
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
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ display:'flex', gap:10, justifyContent:'center', marginBottom:36, flexWrap:'wrap' }}>
          {viewTabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              style={{
                padding:'8px 20px',
                borderRadius:6,
                cursor:'pointer',
                fontWeight:800,
                fontSize:12,
                letterSpacing:'0.08em',
                textTransform:'uppercase',
                background: view===id ? '#041B5F' : '#fff',
                color: view===id ? '#fff' : '#041B5F',
                border:'1px solid #041B5F',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ background:'#041B5F', borderRadius:8, padding:'20px 28px', marginBottom:28, display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
          <img src="/crest.png" alt="BTFC" style={{ width:56, height:56, borderRadius:'50%', border:'2px solid #fff' }} />
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:28, color:'#fff', letterSpacing:'0.04em' }}>
              Match Centre
            </div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.55)' }}>
              Showing {filtered.length} match{filtered.length === 1 ? '' : 'es'}
            </div>
          </div>
        </div>

        <div style={{ display:'grid', gap:16 }}>
          {filtered.map((m, i) => (
            <div
              key={i}
              style={{
                background:'#fff',
                border:'1px solid #E5E7EB',
                borderLeft:`5px solid ${m.type === 'upcoming' ? '#1149D8' : '#22C55E'}`,
                borderRadius:8,
                padding:'18px 22px',
                display:'flex',
                justifyContent:'space-between',
                alignItems:'center',
                flexWrap:'wrap',
                gap:16
              }}
            >
              <div>
                <div style={{ fontSize:11, fontWeight:800, color:'#1149D8', textTransform:'uppercase', marginBottom:6 }}>
                  {m.team === 'first' ? 'First XI' : m.team === 'reserves' ? 'Reserves' : 'Under 17s'} · {m.type === 'upcoming' ? 'Upcoming Fixture' : 'Result'}
                </div>

                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:26, color:'#041B5F', lineHeight:1 }}>
                  {m.type === 'result' ? m.score : `BTFC vs ${m.opp}`}
                </div>

                <div style={{ marginTop:6, fontSize:12, color:'#6B7280', display:'flex', gap:12, flexWrap:'wrap' }}>
                  <span>{m.comp}</span>
                  <span>{m.venue === 'H' ? 'Home' : 'Away'}</span>
                </div>
              </div>

              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:24, color:'#1149D8' }}>
                  {m.date}
                </div>
                <div style={{ fontSize:13, color:'#6B7280' }}>
                  Kick Off: {m.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
