'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { getMatchFeeds, getTeamsContent } from '../lib/sanity.client'
import {
  loadFullTimeWidgetMatches,
  loadFullTimeWidgetTable,
  type FullTimeLeagueRow,
} from '../lib/fulltime.browser'

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

type FeedConfig = {
  team: string
  widgets: string[]
  division: string
  tableWidget?: string
}

const teamConfig: Record<TeamKey, { sanityName: string; settingsName: string; settingsLeague: string; fallbackName: string; fallbackLeague: string }> = {
  first: { sanityName: 'First XI', settingsName: 'firstTeamName', settingsLeague: 'firstTeamLeague', fallbackName: 'BTFC First XI', fallbackLeague: 'Uhlsport Hellenic League Division One' },
  reserves: { sanityName: 'Reserves', settingsName: 'reservesName', settingsLeague: 'reservesLeague', fallbackName: 'BTFC Reserves', fallbackLeague: 'Stroud & District League Division 2' },
  u17s: { sanityName: 'Under 17s', settingsName: 'u17Name', settingsLeague: 'u17League', fallbackName: 'BTFC Under 17s', fallbackLeague: 'Cheltenham Youth Football League' },
}

const DEFAULT_FEEDS: Record<TeamKey, FeedConfig> = {
  first: { team: 'First XI', widgets: ['969980533'], division: '320568525', tableWidget: '251176067' },
  reserves: { team: 'Reserves', widgets: ['681011209'], division: '222455275', tableWidget: '625925242' },
  u17s: { team: 'Under 17s', widgets: [], division: '761524402' },
}

const positionGroups = [
  { key: 'goalkeepers', label: 'Goalkeepers' },
  { key: 'defenders', label: 'Defenders' },
  { key: 'midfielders', label: 'Midfielders' },
  { key: 'strikers', label: 'Strikers' },
]

function normalise(value = '') {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, '')
}

function normaliseTeam(value: string): TeamKey {
  const team = normalise(value)
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

function isLeagueFixture(fixture: any, team: TeamKey) {
  const competition = normalise(fixture?.competition || '')
  if (!competition) return false
  if (competition.includes('friendly') || competition.includes('cup') || competition.includes('vase')) return false

  if (team === 'first') {
    return competition === 'hl1' || competition.includes('uhl1') || competition.includes('divisionone') || competition.includes('division1') || competition.includes('hellenicleague')
  }

  if (team === 'reserves') {
    return competition.includes('sdfl2') || competition.includes('sdl2') || (competition.includes('stroud') && competition.includes('division2')) || competition.includes('division2')
  }

  return competition.includes('cheltenham') || competition.includes('cyfl') || competition.includes('league') || competition.includes('u17') || competition.includes('under17')
}

function resultLetter(fixture: any) {
  const btfc = Number(fixture?.btfcScore)
  const opponent = Number(fixture?.opponentScore)
  if (!Number.isFinite(btfc) || !Number.isFinite(opponent)) return null
  if (btfc > opponent) return 'W'
  if (btfc < opponent) return 'L'
  return 'D'
}

function btfcLeagueRow(rows: FullTimeLeagueRow[], team: TeamKey) {
  const candidates = rows.filter((row) => {
    const name = normalise(row.team)
    return name.includes('brimscombe') && name.includes('thrupp')
  })

  if (team === 'reserves') {
    return candidates.find((row) => normalise(row.team).includes('reserve')) || candidates[0] || null
  }

  if (team === 'u17s') {
    return candidates.find((row) => {
      const name = normalise(row.team)
      return name.includes('u17') || name.includes('under17')
    }) || candidates[0] || null
  }

  return candidates.find((row) => {
    const name = normalise(row.team)
    return !name.includes('reserve') && !name.includes('u17') && !name.includes('under17')
  }) || candidates[0] || null
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

function TeamBanner({ title, subtitle, row }: { title: string; subtitle: string; row: FullTimeLeagueRow | null }) {
  const stats = [
    { value: row ? String(row.position) : '—', label: 'Position' },
    { value: row ? String(row.points) : '—', label: 'Points' },
    { value: row ? `${row.won}W` : '—', label: 'Wins' },
  ]

  return (
    <div style={{ background: '#041B5F', borderRadius: 8, padding: '20px 28px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <img src="/branding/crest.png" alt="BTFC" width={56} height={56} style={{ borderRadius: '50%', border: '2px solid #fff' }} />
      <div style={{ flex: 1 }}><div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 26, color: '#fff', letterSpacing: '0.04em' }}>{title}</div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{subtitle}</div></div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>{stats.map(stat => <div key={stat.label} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 6, padding: '10px 18px', textAlign: 'center' }}><div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 22, color: '#fff' }}>{stat.value}</div><div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{stat.label}</div></div>)}</div>
    </div>
  )
}

function ResultsSummary({ fixtures, row, loading }: { fixtures: any[]; row: FullTimeLeagueRow | null; loading: boolean }) {
  const stats = [
    [row ? String(row.position) : '—', 'Position'],
    [row ? String(row.points) : '—', 'Points'],
    [row ? String(row.won) : '—', 'Wins'],
    [row ? String(row.drawn) : '—', 'Draws'],
    [row ? String(row.lost) : '—', 'Losses'],
    [row ? (row.goalDifference > 0 ? `+${row.goalDifference}` : String(row.goalDifference)) : '—', 'Goal Diff'],
  ]
  const form = fixtures.slice(0, 10).map(resultLetter).filter(Boolean) as string[]

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 12, marginBottom: 32 }}>
        {stats.map(([value, label]) => <div key={label} style={{ background: '#041B5F', borderRadius: 8, padding: 16, textAlign: 'center' }}><div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 38, color: '#fff', lineHeight: 1 }}>{value}</div><div style={{ fontSize: 9, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>{label}</div></div>)}
      </div>
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '20px 24px' }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 20, color: '#2D2D2D', marginBottom: 14 }}>Last 10 League Results</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {form.length ? form.map((result, index) => <div key={`${result}-${index}`} style={{ width: 38, height: 38, borderRadius: 6, background: result === 'W' ? '#22C55E' : result === 'D' ? '#F59E0B' : '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 17, color: '#fff' }}>{result}</div>) : <span style={{ fontSize: 12, color: '#9CA3AF' }}>{loading ? 'Loading league results…' : 'No league results published yet.'}</span>}
        </div>
      </div>
    </>
  )
}

export default function TeamsPage() {
  const [team, setTeam] = useState<TeamKey>('first')
  const [players, setPlayers] = useState<Player[]>([])
  const [staff, setStaff] = useState<TeamStaff[]>([])
  const [fixtures, setFixtures] = useState<any[]>([])
  const [settings, setSettings] = useState<any>({})
  const [feeds, setFeeds] = useState<Record<TeamKey, FeedConfig>>(DEFAULT_FEEDS)
  const [leagueFixtures, setLeagueFixtures] = useState<any[]>([])
  const [leagueRow, setLeagueRow] = useState<FullTimeLeagueRow | null>(null)
  const [leagueLoading, setLeagueLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadPage() {
      const [contentResult, feedsResult] = await Promise.allSettled([getTeamsContent(), getMatchFeeds()])
      if (cancelled) return

      if (contentResult.status === 'rejected') {
        console.error('Failed to load teams content:', contentResult.reason)
        setLoadError(true)
        setLoading(false)
        return
      }

      const data = contentResult.value
      setPlayers((data.players || []).map((player: any) => ({ _id: player._id, name: player.name, num: player.squadNumber, pos: player.position, team: player.team, imageUrl: player.imageUrl, sponsorName: player.sponsorName })))
      setStaff(data.staff || [])
      setFixtures(data.fixtures || [])
      setSettings(data.settings || {})

      const nextFeeds: Record<TeamKey, FeedConfig> = {
        first: { ...DEFAULT_FEEDS.first, widgets: [...DEFAULT_FEEDS.first.widgets] },
        reserves: { ...DEFAULT_FEEDS.reserves, widgets: [...DEFAULT_FEEDS.reserves.widgets] },
        u17s: { ...DEFAULT_FEEDS.u17s, widgets: [...DEFAULT_FEEDS.u17s.widgets] },
      }

      if (feedsResult.status === 'fulfilled') {
        for (const feed of feedsResult.value || []) {
          const id = normaliseTeam(String(feed?.team || ''))
          const snippet = String(feed?.snippet || '')
          const widget = snippet.match(/\blrcode\s*=\s*['\"](\d+)['\"]/i)?.[1] || ''
          const division = snippet.match(/[?&]divisionseason=(\d+)/i)?.[1] || ''

          if (id === 'reserves') continue
          nextFeeds[id] = {
            ...nextFeeds[id],
            widgets: widget ? [widget] : nextFeeds[id].widgets,
            division: division || nextFeeds[id].division,
          }
        }
      }

      setFeeds(nextFeeds)
      setLoading(false)
    }

    loadPage()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (loading) return
    let cancelled = false

    setLeagueFixtures([])
    setLeagueRow(null)
    setLeagueLoading(true)

    async function loadLeagueData() {
      const config = feeds[team]
      const selected = teamConfig[team]
      const manual = (fixtures || []).filter((fixture: any) => fixture?.team === selected.sanityName && fixture?.played)

      const fixtureResults = config.widgets.length
        ? await Promise.allSettled(config.widgets.map((widget) => loadFullTimeWidgetMatches(widget, config.team, 18000)))
        : []

      if (cancelled) return

      const live = fixtureResults.flatMap((result) => result.status === 'fulfilled' ? result.value : [])
      const combined = [...live, ...manual]
        .filter((fixture: any) => fixture?.played && fixture?.date && fixture?.opponent && fixture?.btfcScore != null && fixture?.opponentScore != null)
        .filter((fixture: any, index: number, all: any[]) => all.findIndex((candidate) =>
          candidate._id === fixture._id ||
          (candidate.date === fixture.date && normalise(candidate.opponent) === normalise(fixture.opponent))
        ) === index)

      const latestLeague = combined
        .filter((fixture: any) => isLeagueFixture(fixture, team))
        .sort((a: any, b: any) => String(b.date).localeCompare(String(a.date)))
        .slice(0, 10)

      setLeagueFixtures(latestLeague)

      try {
        let rows: FullTimeLeagueRow[] = []
        if (config.tableWidget) {
          rows = await loadFullTimeWidgetTable(config.tableWidget, 18000)
        } else if (config.division) {
          const params = new URLSearchParams({kind: 'table', division: config.division, team: config.team})
          const response = await fetch(`/api/full-time?${params.toString()}`, {cache: 'no-store'})
          if (response.ok) {
            const payload = await response.json()
            rows = Array.isArray(payload?.table) ? payload.table : []
          }
        }

        if (!cancelled) setLeagueRow(btfcLeagueRow(rows, team))
      } catch (error) {
        console.error(`Unable to load ${config.team} league table`, error)
        if (!cancelled) setLeagueRow(null)
      } finally {
        if (!cancelled) setLeagueLoading(false)
      }
    }

    loadLeagueData()
    return () => { cancelled = true }
  }, [team, feeds, fixtures, loading])

  const selected = teamConfig[team]
  const selectedPlayers = useMemo(() => players.filter(player => normaliseTeam(player.team) === team), [players, team])
  const selectedStaff = useMemo(() => staff.filter(member => normaliseTeam(member.team) === team), [staff, team])

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
        <TeamBanner title={title} subtitle={league} row={leagueRow} />
        <SquadGrid players={selectedPlayers} />
        <ManagementTeam staff={selectedStaff} />
        <ResultsSummary fixtures={leagueFixtures} row={leagueRow} loading={leagueLoading} />
      </div>
    </main>
  )
}
