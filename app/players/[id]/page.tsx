'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getPlayers } from '../../lib/sanity.client'

type Player = {
  _id: string
  name: string
  squadNumber?: number
  position?: string
  team?: string
  imageUrl?: string
  bio?: string
  sponsorName?: string
  sponsorLogoUrl?: string
  sponsorUrl?: string
  sponsorMessage?: string
}

export default function PlayerPage() {
  const params = useParams<{ id: string }>()
  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPlayers()
      .then((players) => {
        const id = decodeURIComponent(String(params.id || ''))
        setPlayer((players || []).find((item: Player) => item._id === id || item.name === id) || null)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) {
    return <main className="player-detail-status">Loading player profile…</main>
  }

  if (!player) {
    return (
      <main className="player-detail-status">
        <p>Player profile not found</p>
        <Link className="player-detail-back" href="/teams">← Back to teams</Link>
      </main>
    )
  }

  const number = Number(player.squadNumber) > 0 ? player.squadNumber : null

  return (
    <main style={{ background: '#f2f2f2', minHeight: '100vh', padding: '80px 24px' }}>
      <div className="player-detail-shell">
        <Link className="player-detail-back" href="/teams">← Back to teams</Link>

        <article className="player-detail-card">
          <div className={`player-profile-photo player-detail-photo${player.imageUrl ? '' : ' is-placeholder'}`}>
            {player.imageUrl ? (
              <img src={player.imageUrl} alt={`${player.name}, ${player.position || 'BTFC player'}`} />
            ) : (
              <div className="player-photo-placeholder" aria-label="Player photograph to follow">
                <img src="/branding/crest.png" alt="" />
                <span>Photo to follow</span>
              </div>
            )}
            {number && <span className="player-squad-number">{number}</span>}
          </div>

          <div className="player-detail-copy">
            <h1>{player.name}</h1>
            <p className="player-detail-position">
              {[player.position, player.team].filter(Boolean).join(' · ')}
            </p>

            {player.bio && <p className="player-detail-bio">{player.bio}</p>}

            {player.sponsorName && (
              <section className="player-detail-sponsor">
                <p className="player-detail-sponsor-label">Player sponsor</p>
                {player.sponsorLogoUrl && (
                  <img src={player.sponsorLogoUrl} alt={`${player.sponsorName} logo`} />
                )}
                <h2>{player.sponsorName}</h2>
                {player.sponsorMessage && (
                  <p className="player-detail-sponsor-message">{player.sponsorMessage}</p>
                )}
                {player.sponsorUrl && (
                  <a
                    className="player-detail-sponsor-link"
                    href={player.sponsorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit sponsor website
                  </a>
                )}
              </section>
            )}
          </div>
        </article>
      </div>
    </main>
  )
}
