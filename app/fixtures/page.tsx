'use client'
import { useState } from 'react'

export default function FixturesPage() {
  const [team, setTeam] = useState<'first' | 'reserves' | 'u17s'>('first')

  const tabs = [
    { id:'first', label:'⚽ First XI Fixtures' },
    { id:'reserves', label:'⚽ Reserves Fixtures' },
    { id:'u17s', label:'⚽ Under 17s Fixtures' },
  ] as const

  const firstFixtures = [
    { date:'Sat 9 Aug', opp:'Clanfield FC', comp:'League', venue:'H', time:'15:00' },
    { date:'Tue 12 Aug', opp:'Shortwood United', comp:'League', venue:'A', time:'19:45' },
    { date:'Sat 16 Aug', opp:'Newent Town', comp:'League', venue:'H', time:'15:00' },
  ]

  const reserveFixtures = [
    { date:'Sat 9 Aug', opp:'Minchinhampton Res', comp:'League', venue:'A', time:'14:00' },
    { date:'Sat 16 Aug', opp:'Hardwicke Res', comp:'League', venue:'H', time:'14:00' },
    { date:'Sat 23 Aug', opp:'Bishops Cleeve Dev', comp:'Cup', venue:'A', time:'14:00' },
  ]

  const u17Fixtures = [
    { date:'Sun 10 Aug', opp:'Tuffley Rovers U17', comp:'League', venue:'H', time:'10:30' },
    { date:'Sun 17 Aug', opp:'Longlevens U17', comp:'League', venue:'A', time:'10:30' },
    { date:'Sun 24 Aug', opp:'Stonehouse U17', comp:'Cup', venue:'H', time:'10:30' },
  ]

  const activeFixtures =
    team === 'first'
      ? firstFixtures
      : team === 'reserves'
      ? reserveFixtures
      : u17Fixtures

  const activeTitle =
    team === 'first'
      ? 'First XI Fixtures'
      : team === 'reserves'
      ? 'Reserves Fixtures'
      : 'Under 17s Fixtures'

  const activeSubtitle =
    team === 'first'
      ? 'Uhlsport Hellenic League Division One'
      : team === 'reserves'
      ? 'Stroud & District Football League'
      : 'Gloucestershire Youth Football'

  return (
    <main style={{ background:'#F2F2F2', minHeight:'100vh', padding:'80px 24px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:42 }}>
          <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:56, letterSpacing:'0.04em', color:'#041B5F', marginBottom:8, textTransform:'uppercase' }}>
            Fixtures
          </h1>
          <div style={{ width:70, height:4, background:'#1149D8', margin:'0 auto 16px', borderRadius:2 }} />
          <p style={{ color:'#6B7280', fontSize:14, maxWidth:680, margin:'0 auto', lineHeight:1.7 }}>
            Upcoming fixtures across all Brimscombe & Thrupp FC teams.
          </p>
        </div>

        <div style={{ display:'flex', gap:10, justifyContent:'center', marginBottom:36, flexWrap:'wrap' }}>
          {tabs.map(({ id, label }) => (
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
                boxShadow: team===id ? '0 4px 16px rgba(17,73,216,0.3)' : 'none'
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
              {activeTitle}
            </div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.55)' }}>
              {activeSubtitle}
            </div>
          </div>
        </div>

        <div style={{ display:'grid', gap:16 }}>
          {activeFixtures.map((f, i) => (
            <div
              key={i}
              style={{
                background:'#fff',
                border:'1px solid #E5E7EB',
                borderLeft:'5px solid #1149D8',
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
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:26, color:'#041B5F', lineHeight:1 }}>
                  {f.opp}
                </div>
                <div style={{ marginTop:6, fontSize:12, color:'#6B7280', display:'flex', gap:12, flexWrap:'wrap' }}>
                  <span>{f.comp}</span>
                  <span>{f.venue === 'H' ? 'Home' : 'Away'}</span>
                </div>
              </div>

              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:24, color:'#1149D8' }}>
                  {f.date}
                </div>
                <div style={{ fontSize:13, color:'#6B7280' }}>
                  Kick Off: {f.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
