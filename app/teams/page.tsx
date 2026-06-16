'use client'
import { useEffect, useState } from 'react'
import { getPlayers } from '../lib/sanity.client'
import { getFixtures } from '../lib/sanity.client'

const POS_COLORS: Record<string,string> = {
  GK:'#1e3a5f', CB:'#1149D8', LB:'#1149D8', RB:'#1149D8',
  CM:'#041B5F', CAM:'#2563FF', MID:'#1149D8', LW:'#2563FF',
  RW:'#2563FF', ST:'#7f1d1d', FWD:'#7f1d1d', DEF:'#1149D8'
}

type TeamKey = 'first' | 'reserves' | 'u17s'

type Player = {
  _id?: string
  num: number
  name: string
  pos: string
  team: string
}

function normaliseTeam(team: string): TeamKey {
  const t = String(team).toLowerCase()
  if (t === 'reserves') return 'reserves'
  if (t === 'under 17s' || t === 'u17s' || t === "u17's") return 'u17s'
  return 'first'
}

function PlayerCard({ p }: { p: Player }) {
  const col = POS_COLORS[p.pos] || '#1149D8'
  const num = String(p.num || 0).padStart(2, '0')

  return (
    <div style={{ background:'#fff', border:'2px solid #E5E7EB', borderLeft:`4px solid ${col}`, borderRadius:8, overflow:'hidden', position:'relative' }}>
      <div style={{ height:6, background:col }} />
      <div style={{ padding:'18px 14px 16px', textAlign:'center', position:'relative' }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:52, lineHeight:1, marginBottom:-8, color:'rgba(17,73,216,0.07)', letterSpacing:'0.02em' }}>{num}</div>
        <span style={{ display:'inline-block', padding:'3px 10px', borderRadius:4, fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#fff', background:col, margin:'8px 0 8px', position:'relative', zIndex:1 }}>{p.pos}</span>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:16, letterSpacing:'0.03em', lineHeight:1.1, color:'#2D2D2D', position:'relative', zIndex:1 }}>{p.name}</div>
      </div>
    </div>
  )
}

function TeamBanner({ title, subtitle, stats }: { title: string, subtitle: string, stats: { v: string, l: string }[] }) {
  return (
    <div style={{ background:'#041B5F', borderRadius:8, padding:'20px 28px', marginBottom:32, display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
      <img src="/crest.png" alt="BTFC" style={{ width:56, height:56, borderRadius:'50%', border:'2px solid #fff' }} />
      <div style={{ flex:1 }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:26, color:'#fff', letterSpacing:'0.04em' }}>{title}</div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.55)' }}>{subtitle}</div>
      </div>
      <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background:'rgba(255,255,255,0.08)', borderRadius:6, padding:'10px 18px', textAlign:'center' }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:22, color: i===2 ? '#22C55E' : '#fff' }}>{s.v}</div>
            <div style={{ fontSize:9, color:'rgba(255,255,255,0.5)', letterSpacing:'0.1em', textTransform:'uppercase' }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SquadGrid({ players }: { players: Player[] }) {
  const [filter, setFilter] = useState('All')
  const positions = ['All', ...Array.from(new Set(players.map(p => p.pos).filter(Boolean)))]
  const filtered = filter === 'All' ? players : players.filter(p => p.pos === filter)

  return (
    <>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center', marginBottom:24 }}>
        {positions.map(pos => (
          <button key={pos} onClick={() => setFilter(pos)} style={{
            padding:'6px 16px', borderRadius:6, cursor:'pointer',
            fontFamily:"'Montserrat',sans-serif", fontWeight:700, fontSize:11,
            letterSpacing:'0.08em', textTransform:'uppercase',
            background: filter===pos ? '#1149D8' : '#fff',
            color: filter===pos ? '#fff' : '#6B7280',
            border: `1px solid ${filter===pos ? '#1149D8' : '#E5E7EB'}`
          }}>{pos}</button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(155px,1fr))', gap:14, marginBottom:48 }}>
        {filtered.length === 0 ? (
          <div style={{ gridColumn:'1 / -1', background:'#fff', border:'1px solid #E5E7EB', borderRadius:8, padding:28, textAlign:'center', color:'#9CA3AF', fontFamily:"'Montserrat',sans-serif", fontSize:13 }}>
            No active players added in Sanity for this squad yet.
          </div>
        ) : (
          filtered.map((p) => <PlayerCard key={p._id || `${p.name}-${p.num}`} p={p} />)
        )}
      </div>
    </>
  )
}

function StatGrid({ stats }: { stats: [string, string, string][] }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:12, marginBottom:32 }}>
      {stats.map(([v, l, c]) => (
        <div key={l} style={{ background:'#041B5F', borderRadius:8, padding:16, textAlign:'center' }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:38, color:c, lineHeight:1 }}>{v}</div>
          <div style={{ fontSize:9, color:'rgba(255,255,255,0.5)', letterSpacing:'0.1em', textTransform:'uppercase', marginTop:4 }}>{l}</div>
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

      <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
        {results.map((r, i) => (
          <div key={i} style={{
            width:38, height:38, borderRadius:6,
            background: r==='W' ? '#22C55E' : r==='D' ? '#F59E0B' : '#EF4444',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:17, color:'#fff'
          }}>
            {r}
          </div>
        ))}
        <span style={{ marginLeft:8, fontSize:11, color:'#9CA3AF' }}>← Most recent</span>
      </div>
    </div>
  )
}

export default function TeamsPage() {

  const [fixtures, setFixtures] = useState<any[]>([])
  const [team, setTeam] = useState<TeamKey>('first')
  const [players, setPlayers] = useState<Player[]>([])

  useEffect(() => {
    async function loadFixtures() {
      try {
        const data = await getFixtures()
        setFixtures(data || [])
      } catch (error) {
        console.error('Failed to load fixtures', error)
      }
    }

    loadFixtures()
  }, [])

  const firstXiResults = (fixtures || [])
  .filter(
    (f: any) =>
      f.team === 'First XI' &&
      f.played === true
  )
  .sort(
    (a: any, b: any) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
  )
  .slice(0, 8)
  

  useEffect(() => {
    getPlayers()
      .then((data) => {
        const mapped = data.map((p: any) => ({
          _id: p._id,
          name: p.name,
          num: p.squadNumber,
          pos: p.position,
          team: p.team,
        }))
        setPlayers(mapped)
      })
      .catch(console.error)
  }, [])

  const firstTeam = players.filter(p => normaliseTeam(p.team) === 'first')
  const reserves = players.filter(p => normaliseTeam(p.team) === 'reserves')
  const u17s = players.filter(p => normaliseTeam(p.team) === 'u17s')

  const tabs: { id: TeamKey, label: string }[] = [
    { id:'first', label:'⚽ First XI' },
    { id:'reserves', label:'⚽ Reserves' },
    { id:'u17s', label:'⚽ Under 17s' },
  ]

  return (
    <main style={{ background:'#F2F2F2', minHeight:'100vh', padding:'80px 24px 80px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>

        <div style={{ display:'flex', gap:10, justifyContent:'center', marginBottom:36, flexWrap:'wrap' }}>
          {tabs.map(({ id, label }) => (
            <button key={id} onClick={() => setTeam(id)} style={{
              padding:'10px 24px', borderRadius:6, cursor:'pointer',
              fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:15,
              letterSpacing:'0.08em', textTransform:'uppercase',
              background: team===id ? '#1149D8' : '#fff',
              color: team===id ? '#fff' : '#041B5F',
              border:'2px solid #1149D8',
              boxShadow: team===id ? '0 4px 16px rgba(17,73,216,0.3)' : 'none'
            }}>{label}</button>
          ))}
        </div>

        {team === 'first' && (
          <>
            <TeamBanner title="BTFC First XI" subtitle="Uhlsport Hellenic League Division One — Manager: Tim Bond" stats={[{ v:'7th', l:'Position' }, { v:'51', l:'Points' }, { v:'15W', l:'Wins' }]} />
            <SquadGrid players={firstTeam} />
            <StatGrid stats={[
  ['-','Position','#fff'],
  ['-','Points','#1149D8'],
  ['-','Wins','#22C55E'],
  ['-','Draws','#F59E0B'],
  ['-','Losses','#EF4444'],
  ['-','Goal Diff','#fff'],
]} />

<LastEightResults results={[]} />
          </>
        )}

        {team === 'reserves' && (
          <>
            <TeamBanner title="BTFC Reserves" subtitle="Stroud & District League Division 2 — Final Position: 7th" stats={[{ v:'7th', l:'Position' }, { v:'31', l:'Points' }, { v:'10W', l:'Wins' }]} />
            <SquadGrid players={reserves} />
           <StatGrid stats={[
  ['-','Position','#fff'],
  ['-','Points','#1149D8'],
  ['-','Wins','#22C55E'],
  ['-','Draws','#F59E0B'],
  ['-','Losses','#EF4444'],
  ['-','Played','#fff'],
]} />

<LastEightResults results={[]} />
          </>
        )}

        {team === 'u17s' && (
          <>
            <TeamBanner title="BTFC Under 17s" subtitle="Under 17s Squad — 2025/26 Season" stats={[{ v:'TBC', l:'Position' }, { v:'TBC', l:'Points' }, { v:'TBC', l:'Wins' }]} />
            <SquadGrid players={u17s} />
            <div style={{ background:'#041B5F', borderRadius:8, padding:'28px 32px', textAlign:'center', marginBottom:24 }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:24, color:'#fff', marginBottom:8 }}>
                Season Stats
              </div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)' }}>
                Stats will be updated as the season progresses
              </div>
            </div>
            <LastEightResults results={[]} />
          </>
        )}

      </div>
    </main>
  )
}
