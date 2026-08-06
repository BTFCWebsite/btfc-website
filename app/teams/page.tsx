'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { getTeamsContent } from '../lib/sanity.client'

type TeamKey = 'first' | 'reserves' | 'u17s'

type Player = {
  _id: string
  name: string
  num?: number
  pos: string
  team: string
  imageUrl?: string
  sponsorName?: string
}

type TeamStaff = {
  _id: string
  name: string
  role: string
  team: string
  imageUrl?: string
}

const teamConfig: Record<TeamKey, { sanityName: string; settingsName: string; settingsLeague: string; fallbackName: string; fallbackLeague: string }> = {
  first: { sanityName: 'First XI', settingsName: 'firstTeamName', settingsLeague: 'firstTeamLeague', fallbackName: 'BTFC First XI', fallbackLeague: 'Uhlsport Hellenic League Division One' },
  reserves: { sanityName: 'Reserves', settingsName: 'reservesName', settingsLeague: 'reservesLeague', fallbackName: 'BTFC Reserves', fallbackLeague: 'Stroud & District League Division 2' },
  u17s: { sanityName: 'Under 17s', settingsName: 'u17Name', settingsLeague: 'u17League', fallbackName: 'BTFC Under 17s', fallbackLeague: 'Cheltenham Youth Football League' },
}

const positionGroups = [
  { key: 'goalkeepers', label: 'Goalkeepers' },
  { key: 'defenders', label: 'Defenders' },
  { key: 'midfielders', label: 'Midfielders' },
  { key: 'strikers', label: 'Strikers' },
]

function normaliseTeam(value: string): TeamKey {
  const team = String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '')
  if (team.includes('reserve')) return 'reserves'
  if (team.includes('u17') || team.includes('under17')) return 'u17s'
  return 'first'
}

function positionGroup(position: string) {
  const value = String(position || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  const roles = new Set(value.split(/\s+/).filter(Boolean))
  if (roles.has('gk') || value.includes('goalkeeper')) return 'goalkeepers'
  if (roles.has('st') || roles.has('cf') || roles.has('lw') || roles.has('rw') || value.includes('striker') || value.includes('forward') || value.includes('winger')) return 'strikers'
  if (roles.has('rb') || roles.has('lb') || roles.has('cb') || roles.has('rwb') || roles.has('lwb') || value.includes('defender') || value.includes('back')) return 'defenders'
  return 'midfielders'
}

function PlayerCard({ player, eager }: { player: Player; eager: boolean }) {
  const sponsorName = String(player.sponsorName || '').trim()
  return (
    <Link className="player-profile-card player-profile-link" href={`/players/${encodeURIComponent(player._id)}`} aria-label={`View ${player.name}'s player profile`}>
      <div className={`player-profile-photo${player.imageUrl ? '' : ' is-placeholder'}`}>
        {player.imageUrl ? (
          <img
            src={player.imageUrl}
            alt={`${player.name}, ${player.pos}`}
            width={480}
            height={600}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
          />
        ) : (
          <div className="player-photo-placeholder" aria-label="Player photograph to follow">
            <img src="/branding/crest.png" alt="" width={120} height={120} />
            <span>Photo to follow</span>
          </div>
        )}
        {Number(player.num) > 0 && <span className="player-squad-number">{player.num}</span>}
        <div className="player-profile-identity"><h4>{player.name}</h4><p>{player.pos}</p></div>
      </div>
      <div className={`player-sponsor-panel${sponsorName ? ' has-sponsor' : ''}`}>
        {sponsorName ? <><span>Sponsored by</span><strong>{sponsorName}</strong></> : <><span>Player sponsorship</span><strong>Sponsor this player</strong></>}
      </div>
    </Link>
  )
}

function SquadGrid({ players }: { players: Player[] }) {
  if (!players.length) return <div className="squad-pitch"><div className="squad-empty">No active players have been published in Sanity for this squad yet.</div></div>
  let visibleIndex = 0
  return (
    <div className="squad-pitch">
      {positionGroups.map(group => {
        const groupedPlayers = players.filter(player => positionGroup(player.pos) === group.key)
        if (!groupedPlayers.length) return null
        return (
          <section className="squad-position-line" key={group.key}>
            <h3>{group.label}</h3>
            <div className="squad-player-grid">
              {groupedPlayers.map(player => {
                const eager = visibleIndex < 4
                visibleIndex += 1
                return <PlayerCard key={player._id} player={player} eager={eager} />
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function ManagementTeam({ staff }: { staff: TeamStaff[] }) {
  if (!staff.length) return null
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 26, color: '#041B5F', letterSpacing: '0.04em', textTransform: 'uppercase', margin: '0 0 16px' }}>Management Team</h2>
      <div className="management-profile-grid">
        {staff.map(member => (
          <article className="player-profile-card management-profile-card" key={member._id}>
            <div className={`player-profile-photo${member.imageUrl ? '' : ' is-placeholder'}`}>
              {member.imageUrl ? (
                <img src={member.imageUrl} alt={`${member.name}, ${member.role}`} width={480} height={600} loading="lazy" decoding="async" />
              ) : (
                <div className="player-photo-placeholder"><img src="/branding/crest.png" alt="" width={120} height={120} /><span>Photo to follow</span></div>
              )}
              <div className="player-profile-identity"><h4>{member.name}</h4><p>{member.role}</p></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function TeamBanner({ title, subtitle, stats }: { title: string; subtitle: string; stats: { value: string; label: string }[] }) {
  return (
    <div style={{ background: '#041B5F', borderRadius: 8, padding: '20px 28px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <img src="/branding/crest.png" alt="BTFC" width={56} height={56} style={{ borderRadius: '50%', border: '2px solid #fff' }} />
      <div style={{ flex: 1 }}><div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 26, color: '#fff', letterSpacing: '0.04em' }}>{title}</div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{subtitle}</div></div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>{stats.map(stat => <div key={stat.label} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 6, padding: '10px 18px', textAlign: 'center' }}><div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 22, color: '#fff' }}>{stat.value}</div><div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{stat.label}</div></div>)}</div>
    </div>
  )
}

function ResultsSummary({ fixtures }: { fixtures: any[] }) {
  let wins = 0, draws = 0, losses = 0, goalsFor = 0, goalsAgainst = 0
  fixtures.forEach(fixture => {
    const btfc = Number(fixture.btfcScore)
    const opponent = Number(fixture.opponentScore)
    if (Number.isNaN(btfc) || Number.isNaN(opponent)) return
    goalsFor += btfc
    goalsAgainst += opponent
    if (btfc > opponent) wins += 1
    else if (btfc === opponent) draws += 1
    else losses += 1
  })
  const goalDifference = goalsFor - goalsAgainst
  const form = fixtures.slice(0, 8).map(fixture => Number(fixture.btfcScore) > Number(fixture.opponentScore) ? 'W' : Number(fixture.btfcScore) === Number(fixture.opponentScore) ? 'D' : 'L')
  const stats = [['-', 'Position'], [String(wins * 3 + draws), 'Points'], [String(wins), 'Wins'], [String(draws), 'Draws'], [String(losses), 'Losses'], [goalDifference > 0 ? `+${goalDifference}` : String(goalDifference), 'Goal Diff']]
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 12, marginBottom: 32 }}>{stats.map(([value, label]) => <div key={label} style={{ background: '#041B5F', borderRadius: 8, padding: 16, textAlign: 'center' }}><div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 38, color: '#fff', lineHeight: 1 }}>{value}</div><div style={{ fontSize: 9, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>{label}</div></div>)}</div>
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '20px 24px' }}><div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 20, color: '#2D2D2D', marginBottom: 14 }}>Last 8 Results</div><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>{form.length ? form.map((result, index) => <div key={`${result}-${index}`} style={{ width: 38, height: 38, borderRadius: 6, background: result === 'W' ? '#22C55E' : result === 'D' ? '#F59E0B' : '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 17, color: '#fff' }}>{result}</div>) : <span style={{ fontSize: 12, color: '#9CA3AF' }}>No results published yet.</span>}</div></div>
    </>
  )
}

export default function TeamsPage() {
  const [team, setTeam] = useState<TeamKey>('first')
  const [players, setPlayers] = useState<Player[]>([])
  const [staff, setStaff] = useState<TeamStaff[]>([])
  const [fixtures, setFixtures] = useState<any[]>([])
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    getTeamsContent()
      .then(data => {
        setPlayers((data.players || []).map((player: any) => ({ _id: player._id, name: player.name, num: player.squadNumber, pos: player.position, team: player.team, imageUrl: player.imageUrl, sponsorName: player.sponsorName })))
        setStaff(data.staff || [])
        setFixtures(data.fixtures || [])
        setSettings(data.settings || {})
      })
      .catch(error => {
        console.error('Failed to load teams content:', error)
        setLoadError(true)
      })
      .finally(() => setLoading(false))
  }, [])

  const selected = teamConfig[team]
  const selectedPlayers = useMemo(() => players.filter(player => normaliseTeam(player.team) === team), [players, team])
  const selectedStaff = useMemo(() => staff.filter(member => normaliseTeam(member.team) === team), [staff, team])
  const selectedFixtures = useMemo(() => fixtures.filter(fixture => fixture.team === selected.sanityName && fixture.played).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [fixtures, selected.sanityName])
  const summary = selectedFixtures.reduce((acc, fixture) => { const btfc = Number(fixture.btfcScore), opponent = Number(fixture.opponentScore); if (!Number.isNaN(btfc) && !Number.isNaN(opponent)) { if (btfc > opponent) acc.wins += 1; else if (btfc === opponent) acc.draws += 1; acc.points = acc.wins * 3 + acc.draws } return acc }, { wins: 0, draws: 0, points: 0 })

  const tabs: { id: TeamKey; label: string }[] = [{ id: 'first', label: '⚽ First XI' }, { id: 'reserves', label: '⚽ Reserves' }, { id: 'u17s', label: '⚽ Under 17s' }]
  const title = settings[selected.settingsName] || selected.fallbackName
  const league = settings[selected.settingsLeague] || selected.fallbackLeague

  if (loading) {
    return <main className="player-detail-status">Loading teams…</main>
  }

  if (loadError) {
    return <main className="player-detail-status">The teams section is temporarily unavailable. Please refresh and try again.</main>
  }

  return (
    <main style={{ background: '#F2F2F2', minHeight: '100vh', padding: '80px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 36, flexWrap: 'wrap' }}>{tabs.map(tab => <button key={tab.id} onClick={() => setTeam(tab.id)} style={{ padding: '10px 24px', borderRadius: 6, cursor: 'pointer', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: '0.08em', textTransform: 'uppercase', background: team === tab.id ? '#1149D8' : '#fff', color: team === tab.id ? '#fff' : '#041B5F', border: '2px solid #1149D8' }}>{tab.label}</button>)}</div>
        <TeamBanner title={title} subtitle={league} stats={[{ value: '-', label: 'Position' }, { value: String(summary.points), label: 'Points' }, { value: `${summary.wins}W`, label: 'Wins' }]} />
        <SquadGrid players={selectedPlayers} />
        <ManagementTeam staff={selectedStaff} />
        <ResultsSummary fixtures={selectedFixtures} />
      </div>
    </main>
  )
}
