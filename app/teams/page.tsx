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
  { num:1,  name:'Finley Blythe',        pos:'GK'  },
  { num:2,  name:'Fabio Caldarone',      pos:'DEF' },
  { num:3,  name:'Luke Mitchell',        pos:'DEF' },
  { num:4,  name:'Kai Morris',           pos:'MID' },
  { num:5,  name:'Thomas Wickens',       pos:'DEF' },
  { num:6,  name:'Harry Bunn',           pos:'FWD' },
  { num:7,  name:'Liam Dailey',          pos:'MID' },
  { num:8,  name:'Charlie Diston',       pos:'DEF' },
  { num:9,  name:'Tyler Jesson',         pos:'MID' },
  { num:10, name:'Jake Meredith',        pos:'FWD' },
  { num:11, name:'Matt Prosser',         pos:'MID' },
  { num:12, name:'Ned Ridler-Dutton',    pos:'DEF' },
  { num:13, name:'Tyler Stanton',        pos:'FWD' },
  { num:14, name:'Jamie Shaw',           pos:'MID' },
  { num:15, name:'Lennon Skinner',       pos:'MID' },
  { num:16, name:'Luke Bishop',          pos:'GK'  },
]

const u17s = [
  { num:1,  name:'Archie Thompson',    pos:'GK'  },
  { num:2,  name:'Freddie Clarke',     pos:'CB'  },
  { num:3,  name:'George Harrison',    pos:'CB'  },
  { num:4,  name:'Harry Willis',       pos:'LB'  },
  { num:5,  name:'Theo Barnes',        pos:'RB'  },
  { num:6,  name:'Jack Morrison',      pos:'CM'  },
  { num:7,  name:'Charlie Evans',      pos:'CM'  },
  { num:8,  name:'Luca Rossi',         pos:'CM'  },
  { num:9,  name:'Mason Webb',         pos:'CAM' },
  { num:10, name:'Tyler Hughes',       pos:'LW'  },
  { num:11, name:'Ethan Price',        pos:'RW'  },
  { num:14, name:'Kai Fletcher',       pos:'ST'  },
  { num:15, name:'Jamie Newton',       pos:'ST'  },
  { num:16, name:'Oliver Cross',       pos:'MID' },
  { num:17, name:'Ben Mitchell',       pos:'ST'  },
  { num:18, name:'Sam Cooper',         pos:'MID' },
]

function PlayerCard({ p }: { p: { num: number, name: string, pos: string } }) {
  const col = POS_COLORS[p.pos] || '#1149D8'
  const num = String(p.num).padStart(2,'0')
  return (
    <div style={{background:'#fff',border:'2px solid #E5E7EB',borderRadius:8,overflow:'hidden',transition:'all 0.2s',cursor:'default'}}>
      <div style={{height:6,background:col}}></div>
      <div style={{padding:'18px 14px 16px',textAlign:'center',background:'#fff'}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:46,lineHeight:1,marginBottom:-4,color:'rgba(17,73,216,0.08)',letterSpacing:'0.02em'}}>{num}</div>
        <span style={{display:'inline-block',padding:'3px 10px',borderRadius:4,fontSize:10,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#fff',background:col,margin:'6px 0 8px'}}>{p.pos}</span>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,letterSpacing:'0.03em',lineHeight:1.1,color:'#2D2D2D'}}>{p.name}</div>
      </div>
    </div>
  )
}

function TeamBanner({ title, subtitle, stats }: { title: string, subtitle: string, stats: {v:string,l:string}[] }) {
  return (
    <div style={{background:'#041B5F',borderRadius:8,padding:'20px 28px',marginBottom:32,display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
      <img src="/crest.png" alt="BTFC" style={{width:56,height:56,borderRadius:'50%',background:'#fff',border:'2px solid #fff'}}/>
      <div style={{flex:1}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:26,color:'#fff',letterSpacing:'0.04em'}}>{title}</div>
        <div style={{fontSize:12,color:'rgba(255,255,255,0.55)'}}>{subtitle}</div>
      </div>
      <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
        {stats.map((s,i) => (
          <div key={i} style={{background:'rgba(255,255,255,0.08)',borderRadius:6,padding:'10px 18px',textAlign:'center'}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:22,color:i===2?'#22C55E':'#fff'}}>{s.v}</div>
            <div style={{fontSize:9,color:'rgba(255,255,255,0.5)',letterSpacing:'0.1em',textTransform:'uppercase'}}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SquadGrid({ players }: { players: typeof firstTeam }) {
  const [filter, setFilter] = useState('All')
  const positions = ['All', ...Array.from(new Set(players.map(p => p.pos)))]
  const filtered = filter === 'All' ? players : players.filter(p => p.pos === filter)
  return (
    <>
      <div style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center',marginBottom:24}}>
        {positions.map(pos => (
          <button key={pos} onClick={() => setFilter(pos)} style={{
            padding:'6px 16px',borderRadius:6,border:'none',cursor:'pointer',
            fontFamily:"'Montserrat',sans-serif",fontWeight:700,fontSize:11,
            letterSpacing:'0.08em',textTransform:'uppercase',
            background: filter===pos ? '#1149D8' : '#fff',
            color: filter===pos ? '#fff' : '#6B7280',
            border: filter===pos ? 'none' : '1px solid #E5E7EB'
          }}>{pos}</button>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(155px,1fr))',gap:14,marginBottom:48}}>
        {filtered.map((p,i) => <PlayerCard key={i} p={p} />)}
      </div>
    </>
  )
}

export default function TeamsPage() {
  const [team, setTeam] = useState<'first'|'reserves'|'u17s'>('first')

  return (
    <main style={{background:'#F2F2F2',minHeight:'100vh',padding:'80px 24px 80px'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>

        {/* Team tabs */}
        <div style={{display:'flex',gap:10,justifyContent:'center',marginBottom:36,flexWrap:'wrap'}}>
          {([['first','⚽ First XI'],['reserves','⚽ Reserves'],['u17s','⚽ Under 17s']] as const).map(([id,label]) => (
            <button key={id} onClick={() => setTeam(id)} style={{
              padding:'10px 24px',borderRadius:6,border:'none',cursor:'pointer',
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,
              letterSpacing:'0.08em',textTransform:'uppercase',
              background: team===id ? '#1149D8' : '#fff',
              color: team===id ? '#fff' : '#041B5F',
              border: team===id ? 'none' : '2px solid #1149D8',
              boxShadow: team===id ? '0 4px 16px rgba(17,73,216,0.3)' : 'none'
            }}>{label}</button>
          ))}
        </div>

        {/* FIRST XI */}
        {team === 'first' && (
          <>
            <TeamBanner
              title="BTFC First XI"
              subtitle="Uhlsport Hellenic League Division One — Manager: Tim Bond"
              stats={[{v:'7th',l:'Position'},{v:'51',l:'Points'},{v:'15W',l:'Wins'}]}
            />
            <SquadGrid players={firstTeam} />
            {/* Season stats */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:12,marginBottom:32}}>
              {[['7th','Final Position','#fff'],['51','Points','#1149D8'],['15','Wins','#22C55E'],['6','Draws','#F59E0B'],['13','Losses','#EF4444'],['+9','Goal Diff','#fff']].map(([v,l,c])=>(
                <div key={l as string} style={{background:'#041B5F',borderRadius:8,padding:'16px',textAlign:'center'}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:38,color:c as string,lineHeight:1}}>{v}</div>
                  <div style={{fontSize:9,color:'rgba(255,255,255,0.5)',letterSpacing:'0.1em',textTransform:'uppercase',marginTop:4}}>{l}</div>
                </div>
              ))}
            </div>
            {/* Form */}
            <div style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:8,padding:'20px 24px'}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:20,color:'#2D2D2D',marginBottom:14}}>Last 8 Results</div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
                {[['L','#EF4444'],['W','#22C55E'],['D','#F59E0B'],['L','#EF4444'],['W','#22C55E'],['W','#22C55E'],['W','#22C55E'],['W','#22C55E']].map(([r,c],i)=>(
                  <div key={i} style={{width:38,height:38,borderRadius:6,background:c as string,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:17,color:'#fff'}}>{r}</div>
                ))}
                <span style={{marginLeft:8,fontSize:11,color:'#9CA3AF'}}>← Most recent</span>
              </div>
              <div style={{marginTop:10,display:'flex',gap:14}}>
                {[['#22C55E','Win'],['#F59E0B','Draw'],['#EF4444','Loss']].map(([c,l])=>(
                  <span key={l as string} style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:'#6B7280'}}>
                    <span style={{width:12,height:12,borderRadius:3,background:c as string,display:'inline-block'}}></span>{l}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* RESERVES */}
        {team === 'reserves' && (
          <>
            <TeamBanner
              title="BTFC Reserves"
              subtitle="Stroud & District League Division 2 — Final Position: 7th"
              stats={[{v:'7th',l:'Position'},{v:'31',l:'Points'},{v:'10W',l:'Wins'}]}
            />
            <SquadGrid players={reserves} />
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:12,marginBottom:32}}>
              {[['7th','Final Position','#fff'],['31','Points','#1149D8'],['10','Wins','#22C55E'],['1','Draws','#F59E0B'],['15','Losses','#EF4444'],['26','Played','#fff']].map(([v,l,c])=>(
                <div key={l as string} style={{background:'#041B5F',borderRadius:8,padding:'16px',textAlign:'center'}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:38,color:c as string,lineHeight:1}}>{v}</div>
                  <div style={{fontSize:9,color:'rgba(255,255,255,0.5)',letterSpacing:'0.1em',textTransform:'uppercase',marginTop:4}}>{l}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* UNDER 17s */}
        {team === 'u17s' && (
          <>
            <TeamBanner
              title="BTFC Under 17s"
              subtitle="Under 17s Squad — 2025/26 Season"
              stats={[{v:'TBC',l:'Position'},{v:'TBC',l:'Points'},{v:'TBC',l:'Wins'}]}
            />
            <SquadGrid players={u17s} />
            <div style={{background:'#041B5F',borderRadius:8,padding:'28px 32px',textAlign:'center'}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:24,color:'#fff',marginBottom:8}}>Season Stats</div>
              <div style={{fontSize:13,color:'rgba(255,255,255,0.5)'}}>Stats will be updated as the season progresses</div>
            </div>
          </>
        )}

      </div>
    </main>
  )
}
