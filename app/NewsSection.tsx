'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getNewsArticles } from './lib/sanity.client'

const FALLBACK_NEWS: any[] = []

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function articleHref(article: any) {
  return article?.slug ? `/news/${article.slug}` : '/news'
}

export default function NewsSection() {
  const [news, setNews] = useState<any[]>(FALLBACK_NEWS)

  useEffect(() => {
    getNewsArticles()
      .then(data => setNews(data || []))
      .catch(error => console.error('Failed to load latest news:', error))
  }, [])

  const now = Date.now()
  const announcement = news.find((item: any) => {
    if (item.category !== 'Announcements') return false
    if (!item.showUntil) return true
    const expiry = new Date(item.showUntil).getTime()
    return Number.isFinite(expiry) && expiry > now
  })
  const clubNews = news.filter((item: any) => item.category === 'Club News').slice(0, 2)

  return (
    <section style={{ padding: '72px 24px', background: '#fff' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {announcement && (
          <Link href={articleHref(announcement)} style={{ textDecoration: 'none', display: 'block', marginBottom: 42 }}>
            <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderLeft: '5px solid #D97706', borderRadius: 8, padding: '20px 24px' }}>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 10, color: '#B45309', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 7 }}>📢 Latest Announcement</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, alignItems: 'baseline', flexWrap: 'wrap' }}>
                <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 'clamp(24px,3.5vw,36px)', color: '#2D2D2D', margin: 0, lineHeight: 1.05 }}>{announcement.title}</h2>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: '#9A6A35' }}>{formatDate(announcement.date)}</span>
              </div>
              {announcement.summary && <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: '#6B7280', margin: '10px 0 0', lineHeight: 1.55 }}>{announcement.summary}</p>}
            </div>
          </Link>
        )}

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 'clamp(30px,4.5vw,50px)', color: '#2D2D2D', margin: '0 0 8px', letterSpacing: '.04em' }}>Latest News</h2>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: '#6B7280' }}>The latest from Brimscombe & Thrupp FC</p>
          <div style={{ width: 52, height: 4, background: '#1149D8', margin: '12px auto 0', borderRadius: 2 }} />
        </div>

        <div className="mobile-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24, alignItems: 'stretch', maxWidth: 760, margin: '0 auto' }}>
          {clubNews.map((n: any) => (
            <Link className="mobile-full-card" key={n._id} href={articleHref(n)} style={{ textDecoration: 'none', width: '100%' }}>
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden', height: '100%' }}>
                <div style={{ height: 6, background: '#059669' }} />
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ background: '#05966918', color: '#059669', padding: '3px 10px', borderRadius: 4, fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>🤝 Club News</span>
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: '#9CA3AF' }}>{formatDate(n.date)}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, color: '#2D2D2D', margin: '0 0 8px', lineHeight: 1.15 }}>{n.title}</h3>
                  {n.summary && <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: '#6B7280', margin: '0 0 16px', lineHeight: 1.55 }}>{n.summary}</p>}
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 15, color: '#1149D8' }}>Read More →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 34 }}>
          <Link href="/news" style={{ display: 'inline-block', color: '#1149D8', border: '2px solid #1149D8', padding: '12px 28px', borderRadius: 6, fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', textDecoration: 'none' }}>
            All News →
          </Link>
        </div>
      </div>
    </section>
  )
}
