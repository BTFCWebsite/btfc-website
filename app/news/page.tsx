'use client'
import { PageHeader } from '../layout'
import { useState } from 'react'

type Article = {
  id: number
  category: string
  icon: string
  date: string
  title: string
  summary: string
}

// ─── ADD / EDIT NEWS ARTICLES HERE ───────────────────────────────────────────
const NEWS: Article[] = [
  {
    id: 1,
    category: 'Match Report',
    icon: '⚽',
    date: '24 May 2026',
    title: 'Tyler Cross Hits 18 Goals for the Season',
    summary: 'A brace against Vale Athletic takes our top scorer to an incredible 18 league goals this season. A commanding performance from the Lilywhites rounded off a strong end to the campaign.',
  },
  {
    id: 2,
    category: 'Tickets',
    icon: '🎟',
    date: '21 May 2026',
    title: '2026/27 Season Tickets Now on Sale',
    summary: 'Season tickets for the 2026/27 campaign are now available to purchase online. Adult £100 · Concession £80. Early bird prices available until 1st July.',
  },
  {
    id: 3,
    category: 'Club News',
    icon: '🤝',
    date: '20 May 2026',
    title: 'Brackenfern Advisory Limited — Kit Sponsorship Confirmed',
    summary: 'We are delighted to confirm that Brackenfern Advisory Limited have signed as our First Team kit sponsor for the 2026/27 season. A fantastic new partnership for the club.',
  },
  {
    id: 4,
    category: 'Announcement',
    icon: '📅',
    date: '15 May 2026',
    title: 'Pre-Season Training Dates Announced',
    summary: 'The First Team will return for pre-season training on Monday 7th July. All players should report to The Jessons Meadow at 7pm. Contact the manager for more details.',
  },
  {
    id: 5,
    category: 'Youth',
    icon: '🏆',
    date: '10 May 2026',
    title: 'U18s Win County Cup Final',
    summary: 'Our Under 18s capped off a brilliant season by winning the Gloucestershire County Cup Final. A proud moment for the young Lilywhites and everyone at the club.',
  },
  {
    id: 6,
    category: 'Matchday',
    icon: '🅿',
    date: '8 May 2026',
    title: 'Matchday Parking Changes for 2026/27',
    summary: 'Please be aware of updated parking arrangements at The Jessons Meadow for the forthcoming season. The main car park entrance will move to the northern gate off Station Road.',
  },
  {
    id: 7,
    category: 'Match Report',
    icon: '⚽',
    date: '3 May 2026',
    title: 'BTFC 2–1 Wantage Town — Late Winner Seals Vital Points',
    summary: 'A late header from Danny Morris secured all three points in a tense finish at The Jessons Meadow. The win keeps BTFC firmly in mid-table with two games remaining.',
  },
  {
    id: 8,
    category: 'Club News',
    icon: '🤝',
    date: '28 Apr 2026',
    title: 'Jessons Real Estate Extend Ground Sponsorship',
    summary: 'We are thrilled to confirm that Jessons Real Estate have extended their ground sponsorship deal, keeping the naming rights to The Jessons Meadow for a further two seasons.',
  },
  {
    id: 9,
    category: 'Announcement',
    icon: '📣',
    date: '20 Apr 2026',
    title: 'AGM Date Confirmed — All Members Welcome',
    summary: 'The club\'s Annual General Meeting will take place on Thursday 12th June at The Jessons Meadow clubhouse, starting at 7:30pm. All members and supporters are welcome to attend.',
  },
]
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES = ['All', 'Match Report', 'Club News', 'Tickets', 'Announcement', 'Youth', 'Matchday']

const categoryColor: Record<string, string> = {
  'Match Report': '#1149D8',
  'Club News':    '#059669',
  'Tickets':      '#7C3AED',
  'Announcement': '#D97706',
  'Youth':        '#DB2777',
  'Matchday':     '#0891B2',
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

  const filtered = active === 'All' ? NEWS : NEWS.filter(n => n.category === active)

  return (
    <main style={{ background: '#F2F2F2', minHeight: '100vh', padding: '0 0 90px' }}>
      <section style={{ maxWidth: 980, margin: '0 auto' }}>

        <PageHeader title="Club News" subtitle="The latest from Brimscombe & Thrupp FC" />

        {/* Category filter */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 32,
          justifyContent: 'center',
        }}>
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
                transition: 'all .15s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Article count */}
        <p style={{ ...body, fontSize: 11, color: '#9CA3AF', marginBottom: 20 }}>
          {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
          {active !== 'All' ? ` in ${active}` : ''}
        </p>

        {/* News grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 20,
        }}>
          {filtered.map(article => (
            <div key={article.id} style={{
              background: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: 8,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{ height: 4, background: categoryColor[article.category] ?? '#1149D8', marginBottom: 16, borderRadius: 2 }} />

              {/* Category + date */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  background: `${categoryColor[article.category] ?? '#1149D8'}15`,
                  color: categoryColor[article.category] ?? '#1149D8',
                  padding: '3px 10px',
                  borderRadius: 4,
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '.06em',
                  textTransform: 'uppercase' as const,
                }}>
                  {article.icon} {article.category}
                </span>
                <span style={{ ...body, fontSize: 10, color: '#9CA3AF' }}>{article.date}</span>
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 22,
                fontWeight: 800,
                color: '#2D2D2D',
                margin: '0 0 10px',
                lineHeight: 1.15,
              }}>
                {article.title}
              </h3>

              {/* Summary */}
              <p style={{ ...body, marginBottom: 20, flex: 1 }}>
                {article.summary}
              </p>

              {/* Read more */}
              <span style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 16,
                fontWeight: 800,
                color: '#1149D8',
                letterSpacing: '.03em',
                cursor: 'default',
              }}>
                Read More →
              </span>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 24px',
            background: '#fff',
            borderRadius: 8,
            border: '1px solid #E5E7EB',
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
            <p style={{ ...body, color: '#9CA3AF' }}>No articles in this category yet.</p>
          </div>
        )}

      </section>
    </main>
  )
}
