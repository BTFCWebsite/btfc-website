'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getNewsArticles } from '../lib/sanity.client'

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function articleHref(article: any) {
  return article?.slug ? `/news/${article.slug}` : '/news'
}

const body = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 12,
  color: '#6B7280',
  lineHeight: 1.6,
  margin: 0,
} as const

const cardShell = {
  background: '#fff',
  border: '1px solid #E5E7EB',
  borderRadius: 8,
  overflow: 'hidden',
  minHeight: 250,
  height: '100%',
  boxSizing: 'border-box',
} as const

export default function NewsPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNewsArticles()
      .then(data => setArticles(data || []))
      .catch(error => console.error('Failed to load news:', error))
      .finally(() => setLoading(false))
  }, [])

  const announcements = articles.filter((article: any) =>
    article.category === 'Announcements' || article.category === 'Announcement'
  )
  const clubNews = articles.filter((article: any) => article.category === 'Club News')

  return (
    <main style={{ background: '#F2F2F2', minHeight: '100vh', padding: '0 0 90px' }}>
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '52px 24px 0' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '70px 24px' }}>
            <p style={{ ...body, color: '#9CA3AF' }}>Loading news...</p>
          </div>
        ) : (
          <>
            <div className="news-page-columns" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: 24, alignItems: 'start' }}>
              <section style={{ minWidth: 0 }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 'clamp(30px,4vw,44px)', color: '#2D2D2D', margin: '0 0 8px', letterSpacing: '.04em' }}>Announcements</h1>
                  <div style={{ width: 42, height: 4, background: '#D97706', margin: '10px auto 0', borderRadius: 2 }} />
                </div>

                <div style={{ display: 'grid', gap: 20 }}>
                  {announcements.length > 0 ? announcements.map((article: any) => (
                    <Link key={article._id} href={articleHref(article)} style={{ textDecoration: 'none', display: 'block' }}>
                      <article style={{ ...cardShell, borderTop: '6px solid #D97706' }}>
                        <div style={{ padding: 20 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                            <span style={{ background: '#D9770618', color: '#B45309', padding: '3px 10px', borderRadius: 4, fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>📢 Announcement</span>
                            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: '#9CA3AF' }}>{formatDate(article.date)}</span>
                          </div>
                          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 22, color: '#2D2D2D', margin: '0 0 9px', lineHeight: 1.15 }}>{article.title}</h2>
                          <p style={{ ...body, marginBottom: 18 }}>{article.summary || 'Read the latest announcement from Brimscombe & Thrupp FC.'}</p>
                          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 16, color: '#D97706' }}>Read More →</span>
                        </div>
                      </article>
                    </Link>
                  )) : (
                    <div style={{ ...cardShell, borderTop: '6px solid #D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 24, marginBottom: 10 }}>📢</div>
                        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, color: '#4B5563', marginBottom: 5 }}>No Announcements Yet</div>
                        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: '#9CA3AF' }}>Club announcements will appear here.</div>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <section style={{ minWidth: 0 }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 'clamp(30px,4vw,44px)', color: '#2D2D2D', margin: '0 0 8px', letterSpacing: '.04em' }}>Latest News</h1>
                  <div style={{ width: 42, height: 4, background: '#1149D8', margin: '10px auto 0', borderRadius: 2 }} />
                </div>

                {clubNews.length > 0 ? (
                  <div className="news-page-news-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20, alignItems: 'stretch' }}>
                    {clubNews.map((article: any) => (
                      <Link key={article._id} href={articleHref(article)} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                        <article style={{ ...cardShell, borderTop: '6px solid #059669' }}>
                          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', minHeight: 238, boxSizing: 'border-box' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                              <span style={{ background: '#05966918', color: '#059669', padding: '3px 10px', borderRadius: 4, fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>🤝 Club News</span>
                              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: '#9CA3AF' }}>{formatDate(article.date)}</span>
                            </div>
                            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 22, color: '#2D2D2D', margin: '0 0 9px', lineHeight: 1.15 }}>{article.title}</h2>
                            <p style={{ ...body, marginBottom: 18, flex: 1 }}>{article.summary || 'Read the latest update from Brimscombe & Thrupp FC.'}</p>
                            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 16, color: '#1149D8' }}>Read More →</span>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div style={{ ...cardShell, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 24, marginBottom: 10 }}>📰</div>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, color: '#4B5563', marginBottom: 5 }}>No Club News Yet</div>
                      <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: '#9CA3AF' }}>Club news stories will appear here.</div>
                    </div>
                  </div>
                )}
              </section>
            </div>

            <style>{`
              @media(max-width:768px) {
                .news-page-columns { grid-template-columns: 1fr !important; gap: 44px !important; }
                .news-page-news-grid { grid-template-columns: 1fr !important; }
              }
            `}</style>
          </>
        )}
      </section>
    </main>
  )
}
