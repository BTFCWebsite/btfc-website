'use client'
import { useState } from 'react'

const POS_COLORS: Record<string,string> = {
  GK:'#1e3a5f', CB:'#1149D8', LB:'#1149D8', RB:'#1149D8',
  CM:'#041B5F', CAM:'#2563FF', MID:'#1149D8', LW:'#2563FF',
  RW:'#2563FF', ST:'#7f1d1d', FWD:'#7f1d1d', DEF:'#1149D8'
}

const firstTeam = [
  { num:1,  name:'Oliver Bradbury',        pos:'GK'  },
  { num:2,  name:'Callum Blackford',       pos:'CB'  },
  { num:3,  name:'Jacob Chamberlain',      pos:'CB'  },
  { num:4,  name:'Xavi Diaz-Butcher',      pos:'CB'  },
  { num:5,  name:'Aaron Dainton',          pos:'LB'  },
  { num:6,  name:'Ben Hall',               pos:'RB'  },
  { num:7,  name:'Nathan Marks',           pos:'CM'  },
  { num:8,  name:'Oliver Martin Gargett',  pos:'CM'  },
  { num:9,  name:'Jay Griffiths',          pos:'CM'  },
  { num:10, name:'Matthew Jones',          pos:'CAM' },
  { num:11, name:'Thomas Kenneth Moore',   pos:'CAM' },
  { num:14, name:'Ryan Outram',            pos:'LW'  },
  { num:15, name:'Jonathan Peachey-Score', pos:'LW'  },
  { num:16, name:'James Piatek',           pos:'RW'  },
  { num:17, name:'Ben Saunders',           pos:'ST'  },
  { num:9,  name:'Lewis Toop',             pos:'ST'  },
  { num:18, name:'Jacob Newdick',          pos:'MID' },
  { num:19, name:'Macauley Messenger',     pos:'ST'  },
]

const reserves = [
  { num:1,  name:'Finley Blythe',       pos:'GK'  },
  { num:2,  name:'Fabio Caldarone',     pos:'DEF' },
  { num:3,  name:'Luke Mitchell',       pos:'DEF' },
  { num:4,  name:'Kai Morris',          pos:'MID' },
  { num:5,  name:'Thomas Wickens',      pos:'DEF' },
  { num:6,  name:'Harry Bunn',          pos:'FWD' },
  { num:7,  name:'Liam Dailey',         pos:'MID' },
  { num:8,  name:'Charlie Diston',      pos:'DEF' },
  { num:9,  name:'Tyler Jesson',        pos:'MID' },
  { num:10, name:'Jake Meredith',       pos:'FWD' },
  { num:11, name:'Matt Prosser',        pos:'MID' },
  { num:12, name:'Ned Ridler-Dutton',   pos:'DEF' },
  { num:13, name:'Tyler Stanton',       pos:'FWD' },
  { num:14, name:'Jamie Shaw',          pos:'MID' },
  { num:15, name:'Lennon Skinner',      pos:'MID' },
  { num:16, name:'Luke Bishop',         pos:'GK'  },
]

const u17s = [
  { num:1,  name:'Archie Thompson',  pos:'GK'  },
  { num:2,  name:'Freddie Clarke',   pos:'CB'  },
  { num:3,  name:'George Harrison',  pos:'CB'  },
  { num:4,  name:'Harry Willis',     pos:'LB'  },
  { num:5,  name:'Theo Barnes',      pos:'RB'  },
  { num:6,  name:'Jack Morrison',    pos:'CM'  },
  { num:7,  name:'Charlie Evans',    pos:'CM'  },
  { num:8,  name:'Luca Rossi',       pos:'CM'  },
  { num:9,  name:'Mason Webb',       pos:'CAM' },
  { num:10, name:'Tyler Hughes',     pos:'LW'  },
  { num:11, name:'Ethan Price',      pos:'RW'  },
  { num:14, name:'Kai Fletcher',     pos:'ST'  },
  { num:15, name:'Jamie Newton',     pos:'ST'  },
  { num:16, name:'Oliver Cross',     pos:'MID' },
  { num:17, name:'Ben Mitchell',     pos:'ST'  },
  { num:18, name:'Sam Cooper',       pos:'MID' },
]

type Player = { num: number, name: string, pos: string }

function PlayerCard({ p }: { p: Player }) {
  const col = POS_COLORS[p.pos] || '#1149D8'
  const num = String(p.num).padStart(2, '0')

  return (
    <div style={{ background:'#fff', border:'2px solid #E5E7EB', borderLeft:`4px solid ${col}`, borderRadius:8, overflow:'hidden', position:'relative' as const }}>
      <div style={{ height:6, background:col }}></div>
      <div style={{ padding:'18px 14px 16px', textAlign:'center' as const, position:'relative' as const }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:52, lineHeight:1, marginBottom:-8, color:'rgba(17,73,216,0.07)', letterSpacing:'0.02em' }}>{num}</div>
        <span style={{ display:'inline-block', padding:'3px 10px', borderRadius:4, fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase' as const, color:'#fff', background:col, margin:'8px 0 8px', position:'relative' as const, zIndex:1 }}>{p.pos}</span>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:16, letterSpacing:'0.03em', lineHeight:1.1, color:'#2D2D2D', position:'relative' as const, zIndex:1 }}>{p.name}</div>
      </div>
    </div>
  )
}

function TeamBanner({ title, subtitle, stats }: { title: string, subtitle: string, stats: { v: string, l: string }[] }) {
  return (
    <div style={{ background:'#041B5F', borderRadius:8, padding:'20px 28px', marginBottom:32, display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' as const }}>
      <img src="/crest.png" alt="BTFC" style={{ width:56, height:56, borderRadius:'50%', border:'2px solid #fff' }} />
      <div style={{ flex:1 }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:26, color:'#fff', letterSpacing:'0.04em' }}>{title}</div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.55)' }}>{subtitle}</div>
      </div>
      <div style={{ display:'flex', gap:12, flexWrap:'wrap' as const }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background:'rgba(255,255,255,0.08)', borderRadius:6, padding:'10px 18px', textAlign:'center' as const }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:22, color: i===2 ? '#22C55E' : '#fff' }}>{s.v}</div>
            <div style={{ fontSize:9, color:'rgba(255,255,255,0.5)', letterSpacing:'0.1em', textTransform:'uppercase' as const }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SquadGrid({ players }: { players: Player[] }) {
  const [filter, setFilter] = useState('All')
  const positions = ['All', ...Array.from(new Set(players.map(p => p.pos)))]
  const filtered = filter === 'All' ? players : players.filter(p => p.pos === filter)

  return (
    <>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' as const, justifyContent:'center', marginBottom:24 }}>
        {positions.map(pos => (
          <button key={pos} onClick={() => setFilter(pos)} style={{
            padding:'6px 16px', borderRadius:6, cursor:'pointer',
            fontFamily:"'Montserrat',sans-serif", fontWeight:700, fontSize:11,
            letterSpacing:'0.08em', textTransform:'uppercase' as const,
            background: filter===pos ? '#1149D8' : '#fff',
            color: filter===pos ? '#fff' : '#6B7280',
            border: `1px solid ${filter===pos ? '#1149D8' : '#E5E7EB'}`
          }}>{pos}</button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(155px,1fr))', gap:14, marginBottom:48 }}>
        {filtered.map((p, i) => <PlayerCard key={i} p={p} />)}
      </div>
    </>
  )
}

function StatGrid({ stats }: { stats: [string, string, string][] }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:12, marginBottom:32 }}>
      {stats.map(([v, l, c]) => (
        <div key={l} style={{ background:'#041B5F', borderRadius:8, padding:16, textAlign:'center' as const }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:38, color:c, lineHeight:1 }}>{v}</div>
          <div style={{ fontSize:9, color:'rgba(255,255,255,0.5)', letterSpacing:'0.1em', textTransform:'uppercase' as const, marginTop:4 }}>{l}</div>
        </div>
      ))}
    </div>
  )
}

function LastEightResults({ results }: { results: string[] }) {
  return (
    <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:8, padding:'20px 24px' }}>
      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:20, color:'#2D2D2D', marginBottom:14 }}>
        Last 8 Results
      </div>

      <div style={{ display:'flex', gap:8, flexWrap:'wrap' as const, alignItems:'center' }}>
        {results.map((r, i) => (
          <div
            key={i}
            style={{
              width:38,
              height:38,
              borderRadius:6,
              background: r==='W' ? '#22C55E' : r==='D' ? '#F59E0B' : '#EF4444',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              fontFamily:"'Barlow Condensed',sans-serif",
              fontWeight:800,
              fontSize:17,
              color:'#fff'
            }}
          >
            {r}
          </div>
        ))}

        <span style={{ marginLeft:8, fontSize:11, color:'#9CA3AF' }}>
          ← Most recent
        </span>
      </div>

      <div style={{ marginTop:10, display:'flex', gap:14 }}>
        {([['#22C55E','Win'],['#F59E0B','Draw'],['#EF4444','Loss']] as [string,string][]).map(([c, l]) => (
          <span key={l} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'#6B7280' }}>
            <span style={{ width:12, height:12, borderRadius:3, background:c, display:'inline-block' }}></span>{l}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function TeamsPage() {
  const [team, setTeam] = useState<'first' | 'reserves' | 'u17s'>('first')

  const tabs: { id: 'first' | 'reserves' | 'u17s', label: string }[] = [
    { id:'first',    label:'⚽ First XI'    },
    { id:'reserves', label:'⚽ Reserves'    },
    { id:'u17s',     label:'⚽ Under 17s'   },
  ]

  return (
    <main style={{ background:'#F2F2F2', minHeight:'100vh', padding:'80px 24px 80px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>

        <div style={{ display:'flex', gap:10, justifyContent:'center', marginBottom:36, flexWrap:'wrap' as const }}>
          {tabs.map(({ id, label }) => (
            <button key={id} onClick={() => setTeam(id)} style={{
              padding:'10px 24px', borderRadius:6, cursor:'pointer',
              fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:15,
              letterSpacing:'0.08em', textTransform:'uppercase' as const,
              background: team===id ? '#1149D8' : '#fff',
              color: team===id ? '#fff' : '#041B5F',
              border: `2px solid ${team===id ? '#1149D8' : '#1149D8'}`,
              boxShadow: team===id ? '0 4px 16px rgba(17,73,216,0.3)' : 'none'
            }}>{label}</button>
          ))}
        </div>

        {team === 'first' && (
          <>
            <div style={{ background:'#041B5F', borderRadius:8, overflow:'hidden', marginBottom:24, height:280, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' as const }}>
              <img src="/first-team-photo.jpg" alt="BTFC First XI" style={{ width:'100%', height:'100%', objectFit:'cover' as const }} onError={(e) => { (e.target as HTMLImageElement).style.display='none' }} />
              <div style={{ position:'absolute' as const, inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' as const, gap:8 }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:22, color:'rgba(255,255,255,0.3)', letterSpacing:'0.06em', textTransform:'uppercase' as const }}>First XI Team Photo</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.2)' }}>Upload first-team-photo.jpg to /public to display</div>
              </div>
            </div>

            <TeamBanner
              title="BTFC First XI"
              subtitle="Uhlsport Hellenic League Division One — Manager: Tim Bond"
              stats={[{ v:'7th', l:'Position' }, { v:'51', l:'Points' }, { v:'15W', l:'Wins' }]}
            />

            <SquadGrid players={firstTeam} />

            <StatGrid stats={[
              ['7th','Final Position','#fff'],
              ['51','Points','#1149D8'],
              ['15','Wins','#22C55E'],
              ['6','Draws','#F59E0B'],
              ['13','Losses','#EF4444'],
              ['+9','Goal Diff','#fff'],
            ]} />

            <LastEightResults results={['L','W','D','L','W','W','W','W']} />
          </>
        )}

        {team === 'reserves' && (
          <>
            <div style={{ background:'#041B5F', borderRadius:8, overflow:'hidden', marginBottom:24, height:280, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' as const }}>
              <img src="/reserves-photo.jpg" alt="BTFC Reserves" style={{ width:'100%', height:'100%', objectFit:'cover' as const }} onError={(e) => { (e.target as HTMLImageElement).style.display='none' }} />
              <div style={{ position:'absolute' as const, inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' as const, gap:8 }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:22, color:'rgba(255,255,255,0.3)', letterSpacing:'0.06em', textTransform:'uppercase' as const }}>Reserves Team Photo</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.2)' }}>Upload reserves-photo.jpg to /public to display</div>
              </div>
            </div>

            <TeamBanner
              title="BTFC Reserves"
              subtitle="Stroud & District League Division 2 — Final Position: 7th"
              stats={[{ v:'7th', l:'Position' }, { v:'31', l:'Points' }, { v:'10W', l:'Wins' }]}
            />

            <SquadGrid players={reserves} />

            <StatGrid stats={[
              ['7th','Final Position','#fff'],
              ['31','Points','#1149D8'],
              ['10','Wins','#22C55E'],
              ['1','Draws','#F59E0B'],
              ['15','Losses','#EF4444'],
              ['26','Played','#fff'],
            ]} />

            <LastEightResults results={['W','L','W','D','W','L','W','W']} />
          </>
        )}

        {team === 'u17s' && (
          <>
            <div style={{ background:'#041B5F', borderRadius:8, overflow:'hidden', marginBottom:24, height:280, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' as const }}>
              <img src="/u17s-photo.jpg" alt="BTFC Under 17s" style={{ width:'100%', height:'100%', objectFit:'cover' as const }} onError={(e) => { (e.target as HTMLImageElement).style.display='none' }} />
              <div style={{ position:'absolute' as const, inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' as const, gap:8 }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:22, color:'rgba(255,255,255,0.3)', letterSpacing:'0.06em', textTransform:'uppercase' as const }}>Under 17s Team Photo</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.2)' }}>Upload u17s-photo.jpg to /public to display</div>
              </div>
            </div>

            <TeamBanner
              title="BTFC Under 17s"
              subtitle="Under 17s Squad — 2025/26 Season"
              stats={[{ v:'TBC', l:'Position' }, { v:'TBC', l:'Points' }, { v:'TBC', l:'Wins' }]}
            />

            <SquadGrid players={u17s} />

            <div style={{ background:'#041B5F', borderRadius:8, padding:'28px 32px', textAlign:'center' as const, marginBottom:24 }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:24, color:'#fff', marginBottom:8 }}>
                Season Stats
              </div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)' }}>
                Stats will be updated as the season progresses
              </div>
            </div>

            <LastEightResults results={['W','W','D','W','L','W','W','D']} />
          </>
        )}

      </div>
    </main>
  )
}
