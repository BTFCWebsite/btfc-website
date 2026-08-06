'use client'

import { useEffect, useMemo, useState } from 'react'
import { getFixtures, getSiteSettings } from '../lib/sanity.client'

const FALLBACK_MAP_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d737.3188611688546!2d-2.196166640744735!3d51.72201894723951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48710c418313cc5f%3A0x6e0c3c089afa1c4d!2sBrimscombe%20and%20Thrupp%20Football%20Club!5e1!3m2!1sen!2suk!4v1780823602873!5m2!1sen!2suk'
const FALLBACK_MAP_URL = 'https://maps.google.com/?q=Brimscombe+and+Thrupp+FC,+London+Road,+Brimscombe,+GL5+2SH'

const h2 = { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 36, fontWeight: 800, color: '#2D2D2D', margin: '0 0 6px', letterSpacing: '0.03em' } as const
const h3 = { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, color: '#2D2D2D', margin: '0 0 10px', lineHeight: 1.1 } as const
const body = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: '#4B5563', lineHeight: 1.65, margin: 0 } as const
const card = { background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: 24 } as const

export default function MatchdayPage() {
  const [settings, setSettings] = useState<any>({})
  const [nextHomeGame, setNextHomeGame] = useState<any>(null)

  useEffect(() => {
    Promise.all([getSiteSettings(), getFixtures()])
      .then(([siteSettings, fixtures]) => {
        setSettings(siteSettings || {})
        const today = new Date().toISOString().slice(0, 10)
        const next = (fixtures || []).find((fixture: any) =>
          fixture.team === 'First XI' && fixture.venue === 'Home' && fixture.date >= today && !fixture.played
        )
        setNextHomeGame(next || null)
      })
      .catch(console.error)
  }, [])

  const groundName = settings.groundName || 'Brackenfern Meadow'
  const postcode = settings.postcode || 'GL5 2SH'
  const address = [groundName, settings.addressLine1 || 'London Road, Brimscombe', settings.addressLine2, postcode].filter(Boolean).join(' · ')

  const facilities = useMemo(() => [
    { icon: '🍺', title: 'Clubhouse Bar', text: settings.refreshmentsInformation || 'The clubhouse bar and pitch-side refreshments are available before, during and after First XI home matches. Cash and card accepted.' },
    { icon: '🍔', title: 'Food & Drink', text: settings.refreshmentsInformation || 'Hot food, snacks and drinks are available on First XI matchdays.' },
    { icon: '♿', title: 'Accessibility', text: settings.accessibilityInformation || 'Wheelchair spaces and level access are available. Contact the club in advance if assistance is required.' },
    { icon: '📋', title: 'Programme', text: settings.programmeInformation || 'The official digital matchday programme is available free on the website for First XI home matches.' },
    { icon: '🅿', title: 'Parking', text: settings.parkingInformation || 'Free parking is available at the ground. Please follow matchday signage and steward instructions.' },
    { icon: '🎫', title: 'Entrance Fees', text: `League & Cup: Adult ${settings.admissionAdult || '£7'} · Concession ${settings.admissionConcession || '£5'} · Under 16 ${settings.admissionJunior || 'Free'}. Friendlies: ${settings.friendlyAdmission || '£3'}.` },
  ], [settings])

  const gettingHere = useMemo(() => [
    { icon: '🚗', title: 'By Car', text: settings.byCarInformation || `${groundName} is on London Road, Brimscombe, ${postcode}. Parking is available at the ground.`, link: null },
    { icon: '🚌', title: 'By Bus', text: settings.byBusInformation || 'The number 67 bus runs from Stroud town centre to Brimscombe. Alight near the War Memorial on London Road.', link: settings.busTimetableUrl ? { label: 'View Bus Timetable', url: settings.busTimetableUrl } : null },
    { icon: '🚆', title: 'By Train', text: settings.byTrainInformation || 'The nearest railway station is Stroud. From there, continue by bus or taxi to the ground.', link: null },
  ], [settings, groundName, postcode])

  const fixtureDate = nextHomeGame?.date
    ? new Date(`${nextHomeGame.date}T12:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
    : 'Fixture TBC'

  return (
    <main style={{ background: '#F2F2F2', minHeight: '100vh', padding: '0 0 90px' }}>
      <section style={{ maxWidth: 980, margin: '0 auto', padding: '52px 24px' }}>
        <div className="mobile-feature-card" style={{ background: '#041B5F', borderRadius: 8, padding: '22px 28px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 44 }}>
          <div>
            <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: '.12em', opacity: .6, textTransform: 'uppercase', marginBottom: 6 }}>Next Home Game</div>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 800, margin: '0 0 6px', letterSpacing: '0.03em' }}>{nextHomeGame?.opponent || 'Fixture TBC'}</h2>
            <p style={{ fontFamily: "'Montserrat', sans-serif", margin: 0, color: 'rgba(255,255,255,.7)', fontSize: 13, lineHeight: 1.6 }}>
              📅 {fixtureDate} · ⏰ {nextHomeGame?.kickoff || 'TBC'} · 📍 {groundName} · {nextHomeGame?.competition || settings.seasonYear || ''}
            </p>
          </div>
          <a href="/tickets" style={{ background: '#1149D8', padding: '12px 22px', borderRadius: 6, textAlign: 'center', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 18, color: '#fff', textDecoration: 'none', whiteSpace: 'nowrap' }}>🎫 Tickets</a>
        </div>

        <div className="mobile-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 52 }}>
          {facilities.map(f => (
            <div key={f.title} style={{ ...card, width: '100%', maxWidth: 360, margin: '0 auto' }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
              <h3 style={h3}>{f.title}</h3>
              <p style={body}>{f.text}</p>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 44 }}>
          <h2 style={h2}>Getting Here</h2>
          <p style={{ ...body, color: '#6B7280', marginBottom: 12 }}>{address}</p>

          {(settings.what3words || settings.what3wordsUrl) && (
            <a href={settings.what3wordsUrl || `https://what3words.com/${settings.what3words}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24, padding: '9px 14px', borderRadius: 6, background: '#fff', border: '1px solid #D1D5DB', color: '#041B5F', fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 800, textDecoration: 'none' }}>
              <span style={{ color: '#E11D48', fontSize: 16 }}>///</span>{settings.what3words || 'Open what3words'}
            </a>
          )}

          <div style={{ borderRadius: 8, overflow: 'hidden', marginBottom: 20, border: '1px solid #E5E7EB' }}>
            <iframe src={settings.googleMapsEmbedUrl || FALLBACK_MAP_EMBED} width="100%" height="280" style={{ border: 0, display: 'block' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`${groundName} location`} />
          </div>

          <div className="mobile-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {gettingHere.map(g => (
              <div key={g.title} style={{ ...card, width: '100%', maxWidth: 360, margin: '0 auto' }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{g.icon}</div>
                <h3 style={h3}>{g.title}</h3>
                <p style={{ ...body, marginBottom: g.link ? 10 : 0 }}>{g.text}</p>
                {g.link && <a href={g.link.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 700, color: '#1149D8', textDecoration: 'none' }}>{g.link.label} →</a>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...card, background: '#041B5F', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <h3 style={{ ...h3, color: '#fff', fontSize: 20, margin: '0 0 8px' }}>🏟 {groundName}</h3>
            <p style={{ ...body, color: 'rgba(255,255,255,.7)', fontSize: 13 }}>{address}</p>
          </div>
          <a href={settings.googleMapsUrl || FALLBACK_MAP_URL} target="_blank" rel="noopener noreferrer" style={{ background: '#1149D8', padding: '10px 20px', borderRadius: 6, color: '#fff', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 16, textDecoration: 'none', whiteSpace: 'nowrap' }}>Open in Maps →</a>
        </div>
      </section>
    </main>
  )
}
