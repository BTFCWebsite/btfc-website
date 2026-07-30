'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getSponsors } from '../../lib/sanity.client'

function sponsorSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function tierLabel(tier?: string) {
  if (tier === 'principal') return 'Principal Partner'
  if (tier === 'official') return 'Gold Partner'
  if (tier === 'club') return 'Club Partner'
  return 'Club Sponsor'
}

export default function SponsorProfilePage() {
  const params = useParams<{ slug: string }>()
  const [sponsor, setSponsor] = useState<any | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getSponsors()
      .then((items) => {
        const match = (items || []).find((item: any) => sponsorSlug(String(item?.name || '')) === params.slug)
        setSponsor(match || null)
      })
      .catch(console.error)
      .finally(() => setLoaded(true))
  }, [params.slug])

  if (!loaded) {
    return <main style={{ minHeight: '70vh', background: '#F2F2F2' }} />
  }

  if (!sponsor) {
    return (
      <main style={{ minHeight: '70vh', background: '#F2F2F2', padding: '64px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 42, marginBottom: 16 }}>Sponsor not found</h1>
          <Link href="/sponsors" style={{ color: '#1149D8', fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>Back to Sponsors</Link>
        </div>
      </main>
    )
  }

  const website = sponsor.website
    ? String(sponsor.website).startsWith('http') ? sponsor.website : `https://${sponsor.website}`
    : ''

  return (
    <main style={{ minHeight: '100vh', background: '#F2F2F2', padding: '48px 24px 88px' }}>
      <article style={{ maxWidth: 820, margin: '0 auto' }}>
        <Link href="/sponsors" style={{ display: 'inline-block', marginBottom: 22, color: '#1149D8', textDecoration: 'none', fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700 }}>
          ← Back to Sponsors
        </Link>

        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, overflow: 'hidden', boxShadow: '0 12px 30px rgba(4, 27, 95, 0.08)' }}>
          <div style={{ height: 6, background: '#1149D8' }} />

          <div style={{ padding: '38px clamp(24px, 6vw, 58px) 46px' }}>
            {sponsor.logoUrl && (
              <div style={{ minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFF', border: '1px solid #E5E7EB', borderRadius: 8, padding: 28, marginBottom: 28 }}>
                <img src={sponsor.logoUrl} alt={sponsor.name} style={{ maxWidth: '78%', maxHeight: 130, objectFit: 'contain' }} />
              </div>
            )}

            <div style={{ textAlign: 'center', marginBottom: 34 }}>
              <div style={{ display: 'inline-block', background: '#E8EEFF', color: '#1149D8', padding: '5px 12px', borderRadius: 99, fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                {sponsor.role || tierLabel(sponsor.tier)}
              </div>
              <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(36px, 7vw, 54px)', lineHeight: 1, color: '#2D2D2D', margin: 0 }}>
                {sponsor.name}
              </h1>
            </div>

            {sponsor.about && (
              <section style={{ marginBottom: 34 }}>
                <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, color: '#2D2D2D', margin: '0 0 12px' }}>About the Company</h2>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: '#4B5563', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-line' }}>
                  {sponsor.about}
                </p>
              </section>
            )}

            {(sponsor.contactName || sponsor.phone || sponsor.email || website) && (
              <section style={{ borderTop: '1px solid #E5E7EB', paddingTop: 28 }}>
                <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, color: '#2D2D2D', margin: '0 0 16px' }}>Contact Details</h2>
                <div style={{ display: 'grid', gap: 10, fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: '#374151' }}>
                  {sponsor.contactName && <div><strong>Contact:</strong> {sponsor.contactName}</div>}
                  {sponsor.phone && <div><strong>Telephone:</strong> <a href={`tel:${sponsor.phone}`} style={{ color: '#1149D8' }}>{sponsor.phone}</a></div>}
                  {sponsor.email && <div><strong>Email:</strong> <a href={`mailto:${sponsor.email}`} style={{ color: '#1149D8' }}>{sponsor.email}</a></div>}
                  {website && <div><strong>Website:</strong> <a href={website} target="_blank" rel="noreferrer" style={{ color: '#1149D8', overflowWrap: 'anywhere' }}>{String(sponsor.website).replace(/^https?:\/\//, '').replace(/\/$/, '')}</a></div>}
                </div>
              </section>
            )}
          </div>
        </div>
      </article>
    </main>
  )
}
