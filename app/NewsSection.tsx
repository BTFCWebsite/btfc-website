'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getNewsArticles } from './lib/sanity.client'

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

const FALLBACK_NEWS: any[] = []

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function NewsSection() {
  const [news, setNews] = useState<any[]>(FALLBACK_NEWS)

  useEffect(() => {
    getNewsArticles()
      .then(data => setNews((data || []).slice(0, 3)))
      .catch(error => console.error('Failed to load latest news:', error))
  }, [])

  return (
    <section style={{ padding: '72px 24px', background: '#fff' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 'clamp(30px,4.5vw,50px)', color: '#2D2D2D', margin: '0 0 8px', letterSpacing: '.04em' }}>Latest News</h2>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: '#6B7280' }}>The latest from Brimscombe & Thrupp FC</p>
          <div style={{ width: 52, height: 4, background: '#1149D8', margin: '12px auto 0', borderRadius: 2 }} />
        </div>
        <div className="mobile-card-grid" style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: 24,
  alignItems: 'stretch'
}}>
          {news.map((n: any) => {
            const color = CATEGORY_COLORS[n.category] || '#1149D8'
            const icon = CATEGORY_ICONS[n.category] || '📰'
            return (
              <Link className="mobile-full-card"
  key={n._id}
  href="/news"
  style={{
    textDecoration: 'none',
    width: '100%',
    maxWidth: 360,
    margin: '0 auto'
  }}
>
                <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden', height: '100%' }}>
                  <div style={{ height: 6, background: color }} />
                  <div style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ background: `${color}18`, color, padding: '3px 10px', borderRadius: 4, fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>
                        {icon} {n.category}
                      </span>
                      <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: '#9CA3AF' }}>{formatDate(n.date)}</span>
                    </div>
                    <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, color: '#2D2D2D', margin: '0 0 8px', lineHeight: 1.15 }}>{n.title}</h3>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: '#6B7280', margin: '0 0 16px', lineHeight: 1.55 }}>{n.summary}</p>
                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 15, color: '#1149D8' }}>Read More →</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
        <div style={{ textAlign: 'center' }}>
          <Link href="/news" style={{ display: 'inline-block', color: '#1149D8', border: '2px solid #1149D8', padding: '12px 28px', borderRadius: 6, fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', textDecoration: 'none' }}>
            All News →
          </Link>
        </div>
      </div>
    </section>
  )
}
