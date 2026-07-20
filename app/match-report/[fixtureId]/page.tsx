import { client } from '../../lib/sanity.client'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function MatchReportPendingPage({
  params,
}: {
  params: { fixtureId: string }
}) {
  const fixture = await client.fetch(
    `*[_type == "fixture" && _id == $fixtureId][0] {
      _id, opponent, date, competition, venue, btfcScore, opponentScore
    }`,
    { fixtureId: params.fixtureId },
    { cache: 'no-store' }
  )

  if (!fixture) notFound()

  const report = await client.fetch(
    `*[_type == "newsArticle" && category == "Match Report" && (fixture._ref == $fixtureId || (!defined(fixture) && date == $date))] | order(_updatedAt desc)[0] {
      "slug": slug.current
    }`,
    { fixtureId: fixture._id, date: fixture.date },
    { cache: 'no-store' }
  )

  if (report?.slug) redirect(`/news/${report.slug}`)

  const score = `${fixture.btfcScore ?? 0}–${fixture.opponentScore ?? 0}`

  return (
    <main style={{ background: '#F2F2F2', minHeight: '70vh', padding: '64px 24px 100px' }}>
      <section style={{ maxWidth: 720, margin: '0 auto' }}>
        <Link href="/news" style={{
          display: 'inline-flex',
          color: '#1149D8',
          textDecoration: 'none',
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 700,
          fontSize: 12,
          marginBottom: 28,
        }}>
          ← Back to Club News
        </Link>

        <div style={{
          background: '#fff',
          border: '1px solid #E5E7EB',
          borderRadius: 8,
          overflow: 'hidden',
          textAlign: 'center',
        }}>
          <div style={{ height: 6, background: '#1149D8' }} />
          <div style={{ padding: '52px 36px' }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(17,73,216,.08)',
              color: '#1149D8',
              borderRadius: 4,
              padding: '5px 12px',
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              marginBottom: 20,
            }}>
              ⚽ Match Report
            </div>

            <h1 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(30px, 5vw, 48px)',
              color: '#2D2D2D',
              lineHeight: 1.05,
              margin: '0 0 12px',
            }}>
              BTFC <span style={{ color: '#1149D8' }}>{score}</span> {fixture.opponent}
            </h1>

            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 12,
              color: '#9CA3AF',
              margin: '0 0 32px',
            }}>
              {formatDate(fixture.date)}{fixture.competition ? ` · ${fixture.competition}` : ''}
            </p>

            <div style={{ height: 1, background: '#E5E7EB', marginBottom: 32 }} />

            <h2 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: 30,
              color: '#041B5F',
              margin: '0 0 10px',
            }}>
              Match report to follow…
            </h2>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 13,
              color: '#6B7280',
              lineHeight: 1.7,
              margin: 0,
            }}>
              Please check back soon for the full report from this match.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
