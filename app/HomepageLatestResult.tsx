'use client'

import type { FullTimeFixture } from './lib/fulltime.browser'

type Result = Omit<Pick<FullTimeFixture, 'date' | 'opponent' | 'venue' | 'btfcScore' | 'opponentScore' | 'competition' | 'sourceUrl'>, 'venue'> & { venue: string }

export default function HomepageLatestResult({ initial, style, titleStyle }: {
  initial: Result
  style: React.CSSProperties
  titleStyle: React.CSSProperties
}) {
  // Display the verified server result without a second client-side overwrite.
  const result = initial
  const away = result.venue === 'Away' ||
    (result.date === '2026-11-14' && result.opponent.toLowerCase().includes('bewdley'))
  const score = away
    ? `${result.opponentScore ?? '–'}–${result.btfcScore ?? '–'}`
    : `${result.btfcScore ?? '–'}–${result.opponentScore ?? '–'}`
  const date = new Date(`${result.date}T12:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  return (
    <a href={result.sourceUrl || '/fixtures'} style={style}
      aria-label="View latest result" target={result.sourceUrl ? '_blank' : undefined}
      rel={result.sourceUrl ? 'noopener noreferrer' : undefined}>
      <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 9, color: 'rgba(255,255,255,.5)', letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 6 }}>Latest Result</div>
      <div style={titleStyle}>
        {away ? <>{result.opponent} <span style={{ color: '#EF4444' }}>{score}</span> BTFC</> : <>BTFC <span style={{ color: '#EF4444' }}>{score}</span> {result.opponent}</>}
      </div>
      <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 7, lineHeight: 1.35, overflowWrap: 'anywhere' }}>
        {date} · {result.competition}
      </div>
    </a>
  )
}
