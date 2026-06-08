'use client'
import { useState, useEffect } from 'react'

const CATEGORIES = ['All', 'Match Report', 'Club News', 'Tickets', 'Announcement', 'Youth', 'Matchday']

const categoryColor: Record<string, string> = {
  'Match Report': '#1149D8',
  'Club News':    '#059669',
  'Tickets':      '#7C3AED',
  'Announcement': '#D97706',
  'Youth':        '#DB2777',
  'Matchday':     '#0891B2',
}

const categoryIcon: Record<string, string> = {
  'Match Report': '⚽',
  'Club News':    '🤝',
  'Tickets':      '🎟',
  'Announcement': '📢',
  'Youth':        '⭐',
  'Matchday':     '🏟',
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const body = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 12,
  color: '#4B5563',
  lineHeight: 1.65,
  margin: 0,
} as const

export default function NewsPage() {
  const [active, setActive] = useState('All')
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const query = encodeURIComponent(`*[_type == "newsArticle"] | order(date desc) { _id, title, category, date, summary }`)
    fetch(`https://vm0n9zl5.api.sanity.io/v2024-01-01/data/query/production?query=${query}`)
      .then(r => r.json())
      .then(data => {
        if (data.result) setArticles(data.result)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = active === 'All' ? articles : articles.filter(n => n.category === active)

  return (
    <main style={{ background: '#F2F2F2', minHeight: '100vh', padding: '0 0 90px' }}>
      <section style={{ maxWidth: 980, margin: '0 auto', padding: '52px 24px 0' }}>

        {/* Category filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32, justifyContent: 'center' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                padding: '7px 16px',
                borderRadius: 6,
                border: active === cat ? 'none' : '1px solid #E5E7EB',
                background: active === cat ? '#1149D8' : '#fff',
                color: active === cat ? '#fff' : '#4B5563',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 12,
                fontWeight: active === cat ? 700 : 400,
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <p style={{ ...body, color: '#9CA3AF' }}>Loading articles...</p>
          </div>
        )}

        {/* Article count */}
        {!loading && (
          <p style={{ ...body, fontSize: 11, color: '#9CA3AF', marginBottom: 20 }}>
            {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
            {active !== 'All' ? ` in ${active}` : ''}
          </p>
        )}

        {/* News grid */}
        {!loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20 }}>
            {filtered.map(article => (
              <div key={article._id} style={{
                background: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: 8,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
              }}>
                <div style={{ height: 4, background: categoryColor[article.category] ?? '#1149D8', marginBottom: 16, borderRadius: 2 }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    background: `${categoryColor[article.category] ?? '#1149D8'}15`,
                    color: categoryColor[article.category] ?? '#1149D8',
                    padding: '3px 10px', borderRadius: 4,
                    fontFamily: "'Montserrat', sans-serif", fontSize: 10,
                    fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' as const,
                  }}>
                    {categoryIcon[article.category] ?? '📰'} {article.category}
                  </span>
                  <span style={{ ...body, fontSize: 10, color: '#9CA3AF' }}>{formatDate(article.date)}</span>
                </div>
                <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, color: '#2D2D2D', margin: '0 0 10px', lineHeight: 1.15 }}>
                  {article.title}
                </h3>
                <p style={{ ...body, marginBottom: 20, flex: 1 }}>{article.summary}</p>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 800, color: '#1149D8', letterSpacing: '.03em' }}>
                  Read More →
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 24px', background: '#fff', borderRadius: 8, border: '1px solid #E5E7EB' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
            <p style={{ ...body, color: '#9CA3AF' }}>No articles in this category yet.</p>
          </div>
        )}

      </section>
    </main>
  )
}
