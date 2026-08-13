'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getNewsArticles } from '../lib/sanity.client'

const CATEGORIES = ['Club News', 'Announcements']

const categoryColor: Record<string, string> = {
  'Announcements': '#1149D8',
  'Club News': '#059669',
}

const categoryIcon: Record<string, string> = {
  'Announcements': '📣',
  'Club News': '🤝',
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
  const [active, setActive] = useState('Club News')
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNewsArticles()
      .then(data => {
        const normalised = (data || []).map((article: any) => ({
          ...article,
          displayCategory: article.category === 'Announcement' || article.category === 'Announcements'
            ? 'Announcements'
            : 'Club News',
        }))
        setArticles(normalised)
      })
      .catch(error => console.error('Failed to load news:', error))
      .finally(() => setLoading(false))
  }, [])

  const filtered = articles.filter(article => article.displayCategory === active)

  return (
    <main style={{ background: '#F2F2F2', minHeight: '100vh', padding: '0 0 90px' }}>
      <section style={{ maxWidth: 980, margin: '0 auto', padding: '52px 24px 0' }}>
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

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <p style={{ ...body, color: '#9CA3AF' }}>Loading articles...</p>
          </div>
        )}

        {!loading && (
          <p style={{ ...body, fontSize: 11, color: '#9CA3AF', marginBottom: 20 }}>
            {filtered.length} {filtered.length === 1 ? 'article' : 'articles'} in {active}
          </p>
        )}

        {!loading && filtered.length > 0 && (
          <div className="mobile-card-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20,
            alignItems: 'stretch',
          }}>
            {filtered.map(article => {
              const category = article.displayCategory
              return (
                <Link
                  className="mobile-full-card"
                  key={article._id}
                  href={article.slug ? `/news/${article.slug}` : '/news'}
                  style={{ textDecoration: 'none', width: '100%', maxWidth: 360, margin: '0 auto' }}
                >
                  <div style={{
                    background: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: 8,
                    padding: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    cursor: 'pointer',
                  }}>
                    <div style={{ height: 4, background: categoryColor[category], marginBottom: 16, borderRadius: 2 }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        background: `${categoryColor[category]}15`,
                        color: categoryColor[category],
                        padding: '3px 10px', borderRadius: 4,
                        fontFamily: "'Montserrat', sans-serif", fontSize: 10,
                        fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' as const,
                      }}>
                        {categoryIcon[category]} {category}
                      </span>
                      <span style={{ ...body, fontSize: 10, color: '#9CA3AF' }}>{formatDate(article.date)}</span>
                    </div>
                    <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, color: '#2D2D2D', margin: '0 0 10px', lineHeight: 1.15 }}>
                      {article.title}
                    </h3>
                    <p style={{ ...body, marginBottom: 20, flex: 1 }}>{article.summary || 'Read the latest update from Brimscombe & Thrupp FC.'}</p>
                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 800, color: '#1149D8', letterSpacing: '.03em' }}>
                      Read More →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

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
