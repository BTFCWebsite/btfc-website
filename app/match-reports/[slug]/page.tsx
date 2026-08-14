import { notFound } from 'next/navigation'
import Link from 'next/link'
import { client } from '../../lib/sanity.client'

export const revalidate = 60

type MatchData = {
  date?: string
  opponent?: string
  competition?: string
  venue?: string
  btfcScore?: number
  opponentScore?: number
  sourceUrl?: string
}

type PortableSpan = {
  _key?: string
  _type?: string
  text?: string
  marks?: string[]
}

type PortableBlock = {
  _key?: string
  _type?: string
  style?: string
  listItem?: string
  children?: PortableSpan[]
}

type MatchReport = {
  headline: string
  report: string | PortableBlock[]
  matchData: string
}

function formatDate(value?: string) {
  if (!value) return ''
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function inlineBold(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={index}>{part.slice(2, -2)}</strong>
      : part
  )
}

function renderSpan(span: PortableSpan, index: number) {
  let content: React.ReactNode = span.text || ''
  const marks = span.marks || []
  if (marks.includes('strong')) content = <strong>{content}</strong>
  if (marks.includes('em')) content = <em>{content}</em>
  if (marks.includes('underline')) content = <u>{content}</u>
  return <span key={span._key || index}>{content}</span>
}

function renderRichReport(blocks: PortableBlock[]) {
  return blocks.map((block, index) => {
    if (!block || block._type !== 'block') return null
    const content = (block.children || []).map(renderSpan)
    const key = block._key || index

    if (block.listItem === 'bullet') {
      return <ul key={key} style={{ margin: '0 0 22px', paddingLeft: 24 }}><li>{content}</li></ul>
    }
    if (block.listItem === 'number') {
      return <ol key={key} style={{ margin: '0 0 22px', paddingLeft: 24 }}><li>{content}</li></ol>
    }
    if (block.style === 'h3') {
      return <h3 key={key} style={{ margin: '30px 0 12px', color: '#041B5F', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 26, lineHeight: 1.1 }}>{content}</h3>
    }
    if (block.style === 'blockquote') {
      return <blockquote key={key} style={{ margin: '0 0 22px', padding: '4px 0 4px 18px', borderLeft: '4px solid #1149D8', color: '#4B5563', fontStyle: 'italic' }}>{content}</blockquote>
    }
    return <p key={key} style={{ margin: '0 0 22px' }}>{content}</p>
  })
}

function renderReportBody(report: string | PortableBlock[]) {
  if (Array.isArray(report)) return renderRichReport(report)

  const paragraphs = String(report || '')
    .split(/\n\s*\n/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean)

  return paragraphs.map((paragraph, index) => (
    <p key={index} style={{ margin: '0 0 22px' }}>
      {inlineBold(paragraph)}
    </p>
  ))
}

export default async function MatchReportPage({ params }: { params: { slug: string } }) {
  const report = await client.fetch<MatchReport | null>(
    `*[_type == "matchReport" && published == true && slug.current == $slug][0] {
      headline, report, matchData
    }`,
    { slug: params.slug },
    { next: { revalidate: 60 } }
  )

  if (!report) notFound()

  let match: MatchData = {}
  try {
    match = JSON.parse(report.matchData || '{}')
  } catch {
    match = {}
  }

  const isHome = match.venue === 'Home'
  const btfcScore = match.btfcScore
  const opponentScore = match.opponentScore
  const scoreLine = btfcScore != null && opponentScore != null && match.opponent
    ? isHome
      ? `Brimscombe & Thrupp ${btfcScore}–${opponentScore} ${match.opponent}`
      : `${match.opponent} ${opponentScore}–${btfcScore} Brimscombe & Thrupp`
    : match.opponent || 'Brimscombe & Thrupp FC'

  return (
    <main style={{ background: '#F2F2F2', minHeight: '100vh', padding: '54px 24px 100px' }}>
      <article style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 10px 30px rgba(4,27,95,.10)' }}>
        <header style={{ background: '#041B5F', borderBottom: '5px solid #1149D8', padding: '42px 42px 34px' }}>
          <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,.62)', letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 12 }}>
            Match Report
          </div>
          <h1 style={{ margin: 0, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 'clamp(38px,6vw,64px)', lineHeight: .98, fontWeight: 800, letterSpacing: '.02em' }}>
            {report.headline}
          </h1>
          <div style={{ marginTop: 22, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 27, fontWeight: 800, letterSpacing: '.03em' }}>
            {scoreLine}
          </div>
          <div style={{ marginTop: 8, color: 'rgba(255,255,255,.62)', fontFamily: "'Montserrat',sans-serif", fontSize: 12, fontWeight: 600 }}>
            {[match.competition, formatDate(match.date)].filter(Boolean).join(' · ')}
          </div>
        </header>

        <div style={{ padding: '42px clamp(24px,6vw,58px) 46px' }}>
          <div style={{ fontFamily: "'Montserrat',sans-serif", color: '#28344D', fontSize: 15, lineHeight: 1.85 }}>
            {renderReportBody(report.report)}
          </div>

          <div style={{ marginTop: 36, paddingTop: 24, borderTop: '1px solid #E5E7EB' }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 22, color: '#041B5F', letterSpacing: '.04em' }}>
              Lily White
            </div>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 11, color: '#6B7280', letterSpacing: '.1em', textTransform: 'uppercase' }}>
              Matchday Reporter
            </div>
          </div>

          <div style={{ marginTop: 34, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/fixtures" style={{ background: '#1149D8', color: '#fff', borderRadius: 6, padding: '12px 20px', textDecoration: 'none', fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase' }}>
              ← Fixtures & Results
            </Link>
            {match.sourceUrl && (
              <a href={match.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ border: '1px solid #CBD5E1', color: '#041B5F', borderRadius: 6, padding: '12px 20px', textDecoration: 'none', fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase' }}>
                Full-Time details ↗
              </a>
            )}
          </div>
        </div>
      </article>
    </main>
  )
}
