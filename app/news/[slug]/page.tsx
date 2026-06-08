import { client } from '../../lib/sanity.client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'

export const dynamic = 'force-dynamic'

const CATEGORY_COLORS: Record<string, string> = {
  'Match Report': '#1149D8',
  'Club News': '#059669',
  'Tickets': '#7C3AED',
  'Announcement': '#D97706',
  'Youth': '#DB2777',
  'Matchday': '#0891B2',
}

const CATEGORY_ICONS: Record<string, string> = {
  'Match Report': '⚽',
  'Club News': '🤝',
  'Tickets': '🎟',
  'Announcement': '📢',
  'Youth': '⭐',
  'Matchday': '🏟',
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await client.fetch(
    `*[_type == "newsArticle" && slug.current == $slug][0] {
      _id, title, category, date, summary, body,
      "imageUrl": image.asset->url,
      "slug": slug.current
    }`,
    { slug: params.slug },
    { cache: 'no-store' }
  )

  if (!article) notFound()

  const color = CATEGORY_COLORS[article.category] ?? '#1149D8'
  const icon = CATEGORY_ICONS[article.category] ?? '📰'

  return (
    <main style={{ background: '#F2F2F2', minHeight: '100vh', padding: '0 0 90px' }}>
      <section style={{ maxWidth: 780, margin: '0 auto', padding: '52px 24px' }}>

        {/* Back link */}
        <Link href="/news" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 700,
          color: '#1149D8', textDecoration: 'none', marginBottom: 32,
          letterSpacing: '.04em',
        }}>
          ← Back to News
        </Link>

        {/* Article card */}
        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          <div style={{ height: 6, background: color }} />

          {/* Hero image */}
          {article.imageUrl && (
            <div style={{ width: '100%', maxHeight: 420, overflow: 'hidden' }}>
              <img
                src={article.imageUrl}
                alt={article.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          )}

          <div style={{ padding: '36px 40px' }}>
            {/* Category + date */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: `${color}15`, color,
                padding: '4px 12px', borderRadius: 4,
                fontFamily: "'Montserrat', sans-serif", fontSize: 10,
                fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' as const,
              }}>
                {icon} {article.category}
              </span>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: '#9CA3AF' }}>
                {formatDate(article.date)}
              </span>
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
              fontSize: 'clamp(28px, 4vw, 42px)', color: '#2D2D2D',
              margin: '0 0 16px', lineHeight: 1.1, letterSpacing: '.02em',
            }}>
              {article.title}
            </h1>

            {/* Summary */}
            {article.summary && (
              <p style={{
                fontFamily: "'Montserrat', sans-serif", fontSize: 14,
                color: '#4B5563', lineHeight: 1.7, margin: '0 0 28px',
                fontWeight: 600, borderLeft: `3px solid ${color}`,
                paddingLeft: 16,
              }}>
                {article.summary}
              </p>
            )}

            {/* Divider */}
            <div style={{ height: 1, background: '#E5E7EB', margin: '0 0 28px' }} />

            {/* Body */}
            {article.body && (
              <div style={{
                fontFamily: "'Montserrat', sans-serif", fontSize: 13,
                color: '#374151', lineHeight: 1.8,
              }}>
                <PortableText value={article.body} />
              </div>
            )}
          </div>
        </div>

        {/* Back link bottom */}
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <Link href="/news" style={{
            display: 'inline-block', color: '#1149D8', border: '2px solid #1149D8',
            padding: '12px 28px', borderRadius: 6,
            fontFamily: "'Montserrat', sans-serif", fontWeight: 700,
            fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase' as const,
            textDecoration: 'none',
          }}>
            ← All News
          </Link>
        </div>

      </section>
    </main>
  )
}
