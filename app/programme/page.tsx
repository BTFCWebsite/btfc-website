'use client'

import {useEffect, useMemo, useState} from 'react'

function parseFixture(value: unknown) {
  if (!value || typeof value !== 'string') return null
  try { return JSON.parse(value) } catch { return null }
}

function normalise(value: string) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

export default function ProgrammePage() {
  const [loading, setLoading] = useState(true)
  const [programme, setProgramme] = useState<any>(null)
  const [fixture, setFixture] = useState<any>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/content?type=programmes', {cache: 'no-store'}).then(r => r.ok ? r.json() : []),
      fetch('/api/full-time?kind=matches&team=First%20XI', {cache: 'no-store'}).then(r => r.ok ? r.json() : {matches: []}),
    ])
      .then(([programmes, fullTime]) => {
        const today = new Date().toISOString().slice(0, 10)
        const nextHome = (fullTime?.matches || [])
          .filter((match: any) => match.venue === 'Home' && !match.played && match.date >= today)
          .sort((a: any, b: any) => String(a.date).localeCompare(String(b.date)))[0] || null

        setFixture(nextHome)

        const matched = nextHome ? (programmes || []).find((item: any) => {
          const selected = parseFixture(item.selectedFixture) || parseFixture(item.fixture)
          if (!selected) return false
          return selected.id === nextHome._id ||
            selected.id === String(nextHome._id).replace(/^full-time-/, '') ||
            (selected.date === nextHome.date && normalise(selected.opponent) === normalise(nextHome.opponent))
        }) : null

        setProgramme(matched || null)
      })
      .finally(() => setLoading(false))
  }, [])

  const fixtureDate = useMemo(() => fixture?.date
    ? new Date(`${fixture.date}T12:00:00`).toLocaleDateString('en-GB', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})
    : '', [fixture])

  return (
    <main style={{minHeight: '100vh', background: '#F4F6FA', padding: '56px 24px'}}>
      <section style={{maxWidth: 880, margin: '0 auto'}}>
        <div style={{background: '#041B5F', color: '#fff', borderRadius: 12, padding: '34px 30px', boxShadow: '0 14px 34px rgba(4,27,95,.18)'}}>
          <div style={{fontFamily: "'Montserrat', sans-serif", fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', opacity: .7, marginBottom: 10}}>Brimscombe & Thrupp FC</div>
          <h1 style={{fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(42px,8vw,66px)', margin: 0, lineHeight: .95, fontWeight: 800}}>Matchday Programme</h1>
          {fixture && <p style={{fontFamily: "'Montserrat', sans-serif", fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,.8)', margin: '20px 0 0'}}>{`BTFC v ${fixture.opponent}`}<br />{fixtureDate} · {fixture.kickoff || 'TBC'}</p>}
        </div>

        <div style={{background: '#fff', borderRadius: 12, padding: '34px 30px', marginTop: 18, border: '1px solid #E1E6EF', textAlign: 'center'}}>
          {loading ? (
            <p style={{fontFamily: "'Montserrat', sans-serif", color: '#51617F'}}>Checking for the latest programme…</p>
          ) : programme?.programmeUrl ? (
            <>
              <h2 style={{fontFamily: "'Barlow Condensed', sans-serif", color: '#071E63', fontSize: 34, margin: '0 0 10px'}}>Today's programme is ready</h2>
              <p style={{fontFamily: "'Montserrat', sans-serif", color: '#51617F', fontSize: 14, margin: '0 0 24px'}}>Tap below to open the official digital matchday programme.</p>
              <a href={programme.programmeUrl} target="_blank" rel="noopener noreferrer" style={{display: 'inline-block', background: '#1E55E5', color: '#fff', textDecoration: 'none', borderRadius: 7, padding: '14px 24px', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 22}}>📖 Open Match Programme</a>
            </>
          ) : (
            <>
              <h2 style={{fontFamily: "'Barlow Condensed', sans-serif", color: '#071E63', fontSize: 34, margin: '0 0 10px'}}>Programme coming soon</h2>
              <p style={{fontFamily: "'Montserrat', sans-serif", color: '#51617F', fontSize: 14, margin: 0}}>The programme for the next home match has not been published yet. Please check back closer to kick-off.</p>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
