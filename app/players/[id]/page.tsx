'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getPlayer } from '../../lib/sanity.client'

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

function clean(value?: string) {
  const text = String(value || '').trim()
  return text || undefined
}

export default function PlayerPage() {
  const params = useParams<{ id: string }>()
  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = decodeURIComponent(String(params.id || ''))
    setLoading(true)
    getPlayer(id)
      .then((data) => setPlayer(data || null))
      .catch(error => {
        console.error('Failed to load player profile:', error)
        setPlayer(null)
      })
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
  const bio = clean(player.bio)
  const sponsorName = clean(player.sponsorName)
  const sponsorLogoUrl = clean(player.sponsorLogoUrl)
  const sponsorUrl = clean(player.sponsorUrl)
  const sponsorMessage = clean(player.sponsorMessage)

  return (
    <main style={{ background: '#f2f2f2', minHeight: '100vh', padding: '80px 24px' }}>
      <div className="player-detail-shell">
        <Link className="player-detail-back" href="/teams">← Back to teams</Link>

        <article className="player-detail-card">
          <div className={`player-profile-photo player-detail-photo${player.imageUrl ? '' : ' is-placeholder'}`}>
            {player.imageUrl ? (
              <img
                src={player.imageUrl}
                alt={`${player.name}, ${player.position || 'BTFC player'}`}
                width={720}
                height={900}
                loading="eager"
                decoding="async"
              />
            ) : (
              <div className="player-photo-placeholder" aria-label="Player photograph to follow">
                <img src="/branding/crest.png" alt="" width={160} height={160} />
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

            {bio && <p className="player-detail-bio">{bio}</p>}

            {sponsorName ? (
              <section className="player-detail-sponsor">
                <p className="player-detail-sponsor-label">Player sponsor</p>
                {sponsorLogoUrl && (
                  <img src={sponsorLogoUrl} alt={`${sponsorName} logo`} width={320} height={160} decoding="async" />
                )}
                <h2>{sponsorName}</h2>
                {sponsorMessage && (
                  <p className="player-detail-sponsor-message">{sponsorMessage}</p>
                )}
                {sponsorUrl && (
                  <a
                    className="player-detail-sponsor-link"
                    href={sponsorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit sponsor website
                  </a>
                )}
              </section>
            ) : (
              <section className="player-detail-sponsor">
                <p className="player-detail-sponsor-label">Player sponsorship</p>
                <h2>Sponsor {player.name}</h2>
                <p className="player-detail-sponsor-message">
                  Support the club and promote your business by sponsoring this player for the season.
                </p>
                <Link className="player-detail-sponsor-link" href="/contact">
                  Enquire about sponsorship
                </Link>
              </section>
            )}
          </div>
        </article>
      </div>
    </main>
  )
}
