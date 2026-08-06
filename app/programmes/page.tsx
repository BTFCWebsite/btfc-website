'use client'

import {useEffect, useMemo, useState} from 'react'
import {getMatchdayProgrammes} from '../lib/sanity.client'

type Programme = {
  _id: string
  selectedFixture?: string
  title?: string
  opponent?: string
  matchDate?: string
  programmeUrl?: string
}

type ParsedProgramme = Programme & {
  displayTitle: string
  displayDate: string
  sortDate: string
}

function parseProgramme(programme: Programme): ParsedProgramme {
  let opponent = programme.opponent || ''
  let date = programme.matchDate || ''

  if (programme.selectedFixture) {
    try {
      const selected = JSON.parse(programme.selectedFixture)
      opponent = selected?.opponent || opponent
      date = selected?.date || date
    } catch {
      // Older programme records continue to use the legacy fields.
    }
  }

  const displayTitle = programme.title || (opponent ? `BTFC v ${opponent}` : 'BTFC Matchday Programme')
  const displayDate = date
    ? new Date(`${date}T12:00:00`).toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Date to be confirmed'

  return {...programme, displayTitle, displayDate, sortDate: date || ''}
}

export default function ProgrammesPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMatchdayProgrammes()
      .then((items) => setProgrammes(items || []))
      .catch((error) => console.error('Failed to load programmes:', error))
      .finally(() => setLoading(false))
  }, [])

  const published = useMemo(
    () => programmes
      .map(parseProgramme)
      .filter((programme) => programme.programmeUrl)
      .sort((a, b) => b.sortDate.localeCompare(a.sortDate)),
    [programmes]
  )

  const latest = published[0]
  const archive = published.slice(1)

  return (
    <main style={{background: '#F2F2F2', minHeight: '100vh', padding: '52px 24px 90px'}}>
      <div style={{maxWidth: 980, margin: '0 auto'}}>
        <header style={{marginBottom: 30}}>
          <div style={{fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: '#1149D8', marginBottom: 8}}>BTFC Digital</div>
          <h1 style={{fontFamily: "'Barlow Condensed',sans-serif", fontSize: 'clamp(38px, 7vw, 58px)', lineHeight: 1, fontWeight: 800, color: '#041B5F', margin: 0}}>Matchday Programmes</h1>
          <p style={{fontFamily: "'Montserrat',sans-serif", fontSize: 13, lineHeight: 1.7, color: '#4B5563', maxWidth: 680, margin: '14px 0 0'}}>The latest First XI programme is always shown first. Previous programmes remain available below.</p>
        </header>

        {loading && (
          <div style={{background: '#fff', border: '1px solid #DCE3F1', borderRadius: 10, padding: 30, fontFamily: "'Montserrat',sans-serif", color: '#6B7280'}}>Loading programmes…</div>
        )}

        {!loading && latest && (
          <section style={{background: '#041B5F', borderRadius: 12, padding: '28px 30px', color: '#fff', marginBottom: 34, boxShadow: '0 12px 32px rgba(4,27,95,.18)'}}>
            <div style={{fontFamily: "'Montserrat',sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: '#93C5FD', marginBottom: 8}}>Latest Programme</div>
            <h2 style={{fontFamily: "'Barlow Condensed',sans-serif", fontSize: 'clamp(30px, 5vw, 44px)', lineHeight: 1, fontWeight: 800, margin: '0 0 10px'}}>{latest.displayTitle}</h2>
            <p style={{fontFamily: "'Montserrat',sans-serif", color: 'rgba(255,255,255,.72)', margin: '0 0 20px', fontSize: 13}}>{latest.displayDate}</p>
            <a href={latest.programmeUrl} target="_blank" rel="noopener noreferrer" style={{display: 'inline-block', background: '#1149D8', color: '#fff', padding: '13px 22px', borderRadius: 6, textDecoration: 'none', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 19, fontWeight: 800}}>📖 View Latest Programme</a>
          </section>
        )}

        {!loading && archive.length > 0 && (
          <section>
            <h2 style={{fontFamily: "'Barlow Condensed',sans-serif", fontSize: 30, fontWeight: 800, color: '#041B5F', margin: '0 0 16px'}}>Previous Programmes</h2>
            <div style={{display: 'grid', gap: 12}}>
              {archive.map((programme) => (
                <article key={programme._id} style={{background: '#fff', border: '1px solid #DCE3F1', borderLeft: '5px solid #1149D8', borderRadius: 8, padding: '18px 20px', display: 'flex', justifyContent: 'space-between', gap: 18, alignItems: 'center', flexWrap: 'wrap'}}>
                  <div>
                    <h3 style={{fontFamily: "'Barlow Condensed',sans-serif", fontSize: 24, color: '#041B5F', margin: '0 0 5px'}}>{programme.displayTitle}</h3>
                    <p style={{fontFamily: "'Montserrat',sans-serif", fontSize: 12, color: '#6B7280', margin: 0}}>{programme.displayDate}</p>
                  </div>
                  <a href={programme.programmeUrl} target="_blank" rel="noopener noreferrer" style={{color: '#1149D8', fontFamily: "'Montserrat',sans-serif", fontSize: 12, fontWeight: 800, textDecoration: 'none'}}>View Programme →</a>
                </article>
              ))}
            </div>
          </section>
        )}

        {!loading && published.length === 0 && (
          <div style={{background: '#fff', border: '1px solid #DCE3F1', borderRadius: 10, padding: 32, textAlign: 'center'}}>
            <h2 style={{fontFamily: "'Barlow Condensed',sans-serif", color: '#041B5F', fontSize: 28, margin: '0 0 8px'}}>Programme coming soon</h2>
            <p style={{fontFamily: "'Montserrat',sans-serif", fontSize: 13, color: '#6B7280', margin: 0}}>The latest digital matchday programme will appear here once published.</p>
          </div>
        )}
      </div>
    </main>
  )
}
