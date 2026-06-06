'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const NEXT_FIXTURE = {
  opponent: 'Fixture TBC',
  date: 'Fixtures released July 2026',
  time: '15:00',
  competition: '2026/27 Season',
}

const LAST_RESULT = {
  opponent: 'FC Stratford',
  score: '1–2',
  date: 'Sat 18 Apr 2026',
  home: true,
  competition: 'Hellenic Div One',
  win: false,
}

const STATS = [
  { value: '7th',      label: 'League Position' },
  { value: '59',       label: 'Goals Scored' },
  { value: '44%',      label: 'Win Rate' },
  { value: 'Hellenic', label: 'Division One' },
]

const NEWS = [
  { category: 'Match Report', color: '#1149D8', icon: '⚽', date: '24 May 2026', title: 'Tyler Cross Hits 18 Goals for the Season', summary: 'A brace against Vale Athletic takes our top scorer to an incredible 18 league goals this season.' },
  { category: 'Tickets',      color: '#7C3AED', icon: '🎟', date: '21 May 2026', title: '2026/27 Season Tickets Now on Sale', summary: 'Season tickets for the 2026/27 campaign are now available online. Adult £100 · Concession £80.' },
  { category: 'Club News',    color: '#059669', icon: '🤝', date: '20 May 2026', title: 'Brackenfern Advisory — Kit Sponsorship Confirmed', summary: 'We are delighted to confirm Brackenfern Advisory Limited as our First Team kit sponsor for 2026/27.' },
]

const SPONSORS = [
  { name: 'Jessons Real Estate',          role: 'Ground Sponsor',     logo: '/jessons-logo.png' },
  { name: 'Brackenfern Advisory Limited', role: 'First Team Sponsor', logo: '/brackenfern-logo.png' },
]

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? 'rgba(4,27,95,.98)' : '#041B5F',
        borderBottom: '3px solid #1149D8',
        padding: '0 20px',
        transition: 'background .3s',
      }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/crest.png" alt="BTFC" style={{ width: 42, height: 42, borderRadius: '50%', border: '2px solid #fff' }} />
            <div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '.06em', lineHeight: 1 }}>BRIMSCOMBE & THRUPP FC</div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 9, color: 'rgba(255,255,255,.4)', letterSpacing: '.15em', textTransform: 'uppercase' }}>Official Website</div>
            </div>
          </Link>
          <div style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
            {[
              ['News', '/news'], ['Teams', '/teams'], ['Matches', '/fixtures'],
              ['Tickets', '/tickets'], ['Matchday', '/matchday'],
              ['Sponsors', '/sponsors'], ['Club', '/club'], ['Shop', '/shop'], ['Contact', '/contact'],
            ].map(([label, href]) => (
              <Link key={href} href={href} style={{
                color: 'rgba(255,255,255,.65)',
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: '.07em',
                textTransform: 'uppercase',
                padding: '8px 11px',
                borderBottom: '3px solid transparent',
                textDecoration: 'none',
                transition: 'all .15s',
              }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = '#fff'; (e.target as HTMLElement).style.borderBottomColor = '#1149D8' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = 'rgba(255,255,255,.65)'; (e.target as HTMLElement).style.borderBottomColor = 'transparent' }}
              >
                {label}
              </Link>
            ))}
            <Link href="/tickets" style={{
              background: '#1149D8', color: '#fff', padding: '10px 18px', borderRadius: 6,
              fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 11,
              letterSpacing: '.08em', textTransform: 'uppercase', textDecoration: 'none',
              marginLeft: 12, whiteSpace: 'nowrap',
            }}>
              🎟 Buy Tickets
            </Link>
          </div>
        </div>
      </nav>

      {/* ── TICKER ──────────────────────────────────────────────────────── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: '#041B5F', borderTop: '2px solid #1149D8',
        padding: '7px 0', overflow: 'hidden',
      }}>
        <style>{`@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
        <div style={{ display: 'flex', gap: 52, whiteSpace: 'nowrap', animation: 'ticker 30s linear infinite' }}>
          {[
            ['Jessons Real Estate', 'Official Ground Sponsor — The Jessons Meadow'],
            ['Brackenfern Advisory Limited', 'First Team Sponsor'],
            ['Reserves Sponsor TBC', 'Reserves Sponsor'],
            ['U17s Sponsor TBC', 'Under 17s Sponsor'],
            ['Your Business Here', 'Gold Partner — enquire now'],
            ['Jessons Real Estate', 'Official Ground Sponsor — The Jessons Meadow'],
            ['Brackenfern Advisory Limited', 'First Team Sponsor'],
            ['Reserves Sponsor TBC', 'Reserves Sponsor'],
            ['U17s Sponsor TBC', 'Under 17s Sponsor'],
            ['Your Business Here', 'Gold Partner — enquire now'],
          ].map(([name, role], i) => (
            <span key={i} style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: 10, color: 'rgba(255,255,255,.38)', letterSpacing: '.06em', flexShrink: 0, textTransform: 'uppercase' }}>
              <strong style={{ color: 'rgba(255,255,255,.7)' }}>{name}</strong>
              <span style={{ color: '#1149D8', margin: '0 6px' }}>·</span>
              {role}
            </span>
          ))}
        </div>
      </div>

      <main style={{ paddingTop: 64, paddingBottom: 48 }}>

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '100px 24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <img src="/Ground_Pic.jpeg" alt="The Jessons Meadow" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 55%', filter: 'contrast(1.05) saturate(1.05)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(4,27,95,.45)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(0deg,rgba(4,27,95,.8) 0%,transparent 100%)' }} />
          </div>

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* First Team Sponsor */}
            <div style={{ background: 'rgba(17,73,216,.35)', border: '1px solid rgba(17,73,216,.6)', borderRadius: 4, padding: '7px 22px', marginBottom: 36, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 10, color: 'rgba(255,255,255,.6)', letterSpacing: '.14em', textTransform: 'uppercase' }}>First Team Sponsor</span>
              <div style={{ background: '#fff', borderRadius: 4, padding: '3px 10px', display: 'flex', alignItems: 'center' }}>
                <img src="/brackenfern-logo.png" alt="Brackenfern Advisory Limited" style={{ height: 24, objectFit: 'contain' }} />
              </div>
            </div>

            {/* Crest */}
            <div style={{ width: 120, height: 120, borderRadius: '50%', border: '3px solid #fff', boxShadow: '0 0 0 3px #041B5F, 0 0 0 5px #1149D8', overflow: 'hidden', background: '#fff' }}>
              <img src="/crest.png" alt="BTFC" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* Title */}
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 'clamp(48px,10vw,110px)', color: '#fff', margin: '18px 0 0', letterSpacing: '.04em', lineHeight: .88, textShadow: '0 2px 20px rgba(4,27,95,.9)' }}>
              BRIMSCOMBE<br />&amp; THRUPP FC
            </h1>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: 12, color: 'rgba(255,255,255,.7)', letterSpacing: '.22em', textTransform: 'uppercase', margin: '14px 0 44px', textShadow: '0 1px 10px rgba(4,27,95,.9)' }}>
              Est. 1886 · The Lilywhites
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 56 }}>
              <Link href="/tickets" style={{ background: '#1149D8', color: '#fff', border: 'none', padding: '16px 36px', borderRadius: 6, fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', textDecoration: 'none', boxShadow: '0 8px 28px rgba(17,73,216,.45)' }}>
                🎟 Season Tickets
              </Link>
              <Link href="/fixtures" style={{ background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,.28)', padding: '14px 36px', borderRadius: 6, fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
                View Fixtures
              </Link>
            </div>

            {/* Result + Fixture cards */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderLeft: `4px solid ${LAST_RESULT.win ? '#22C55E' : '#EF4444'}`, borderRadius: 8, padding: '16px 22px', textAlign: 'left', minWidth: 230 }}>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 9, color: 'rgba(255,255,255,.38)', letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 6 }}>Latest Result</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '.04em' }}>
                  BTFC <span style={{ color: LAST_RESULT.win ? '#22C55E' : '#EF4444' }}>{LAST_RESULT.score}</span> {LAST_RESULT.opponent}
                </div>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 5 }}>{LAST_RESULT.date} · {LAST_RESULT.competition}</div>
              </div>
              <div style={{ background: 'rgba(17,73,216,.2)', border: '1px solid rgba(255,255,255,.1)', borderLeft: '4px solid #1149D8', borderRadius: 8, padding: '16px 22px', textAlign: 'left', minWidth: 230 }}>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 9, color: 'rgba(255,255,255,.38)', letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 6 }}>Next Fixture</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '.04em' }}>BTFC vs {NEXT_FIXTURE.opponent}</div>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 5 }}>{NEXT_FIXTURE.date} · {NEXT_FIXTURE.time}</div>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(4,27,95,.96)', borderTop: '3px solid #1149D8', display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            {STATS.map(s => (
              <div key={s.label} style={{ padding: '14px 36px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,.07)' }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 26, color: '#1149D8', letterSpacing: '.04em' }}>{s.value}</div>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: 9, color: 'rgba(255,255,255,.38)', letterSpacing: '.12em', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── GROUND SPONSOR STRIP ─────────────────────────────────────── */}
        <div style={{ background: '#F2F2F2', borderBottom: '1px solid #E5E7EB', padding: '10px 24px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, color: '#6B7280', letterSpacing: '.08em', textTransform: 'uppercase' }}>Home of BTFC</span>
            <div style={{ width: 1, height: 20, background: '#D1D5DB' }} />
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 15, color: '#041B5F', letterSpacing: '.04em' }}>THE JESSONS MEADOW</span>
            <div style={{ width: 1, height: 20, background: '#D1D5DB' }} />
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, color: '#9CA3AF', letterSpacing: '.06em', textTransform: 'uppercase' }}>Ground Sponsor</span>
            <img src="/jessons-logo.png" alt="Jessons Real Estate" style={{ height: 32, objectFit: 'contain' }} />
          </div>
        </div>

        {/* ── LATEST NEWS ──────────────────────────────────────────────── */}
        <section style={{ padding: '72px 24px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 'clamp(30px,4.5vw,50px)', color: '#2D2D2D', margin: '0 0 8px', letterSpacing: '.04em' }}>Latest News</h2>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: '#6B7280' }}>The latest from Brimscombe & Thrupp FC</p>
              <div style={{ width: 52, height: 4, background: '#1149D8', margin: '12px auto 0', borderRadius: 2 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20, marginBottom: 36 }}>
              {NEWS.map(n => (
                <Link key={n.title} href="/news" style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden', transition: 'all .2s', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
                  >
                    <div style={{ height: 6, background: n.color }} />
                    <div style={{ padding: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ background: `${n.color}15`, color: n.color, padding: '3px 10px', borderRadius: 4, fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>
                          {n.icon} {n.category}
                        </span>
                        <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: '#9CA3AF' }}>{n.date}</span>
                      </div>
                      <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, color: '#2D2D2D', margin: '0 0 8px', letterSpacing: '.03em', lineHeight: 1.15 }}>{n.title}</h3>
                      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: '#6B7280', margin: '0 0 16px', lineHeight: 1.55 }}>{n.summary}</p>
                      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 15, color: '#1149D8', letterSpacing: '.03em' }}>Read More →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ textAlign: 'center' }}>
              <Link href="/news" style={{ display: 'inline-block', color: '#1149D8', border: '2px solid #1149D8', padding: '12px 28px', borderRadius: 6, fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', textDecoration: 'none' }}>
                All News →
              </Link>
            </div>
          </div>
        </section>

        {/* ── NEXT FIXTURE ─────────────────────────────────────────────── */}
        <section style={{ padding: '72px 24px', background: '#F2F2F2' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 'clamp(30px,4.5vw,50px)', color: '#2D2D2D', margin: '0 0 8px', letterSpacing: '.04em' }}>Fixtures & Results</h2>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: '#6B7280' }}>Upcoming games and recent results</p>
              <div style={{ width: 52, height: 4, background: '#1149D8', margin: '12px auto 0', borderRadius: 2 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
              {/* Last result */}
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderLeft: `4px solid #EF4444`, borderRadius: 8, padding: 24 }}>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 10, color: '#9CA3AF', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 12 }}>Latest Result</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, color: '#041B5F' }}>BTFC</span>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 32, color: '#EF4444', padding: '4px 12px', background: '#FEF2F2', borderRadius: 6 }}>{LAST_RESULT.score}</span>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, color: '#6B7280' }}>{LAST_RESULT.opponent}</span>
                </div>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: '#9CA3AF', margin: 0 }}>{LAST_RESULT.date} · {LAST_RESULT.competition} · Home</p>
              </div>
              {/* Next fixture */}
              <div style={{ background: '#041B5F', borderRadius: 8, padding: 24 }}>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 10, color: 'rgba(255,255,255,.5)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 12 }}>Next Home Game</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 24, color: '#fff', marginBottom: 8, letterSpacing: '.03em' }}>BTFC vs {NEXT_FIXTURE.opponent}</div>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: 'rgba(255,255,255,.5)', margin: '0 0 16px' }}>{NEXT_FIXTURE.date} · {NEXT_FIXTURE.time}</p>
                <Link href="/tickets" style={{ display: 'inline-block', background: '#1149D8', color: '#fff', padding: '10px 20px', borderRadius: 6, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 16, textDecoration: 'none', letterSpacing: '.04em' }}>
                  Get Tickets →
                </Link>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Link href="/fixtures" style={{ display: 'inline-block', color: '#1149D8', border: '2px solid #1149D8', padding: '12px 28px', borderRadius: 6, fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', textDecoration: 'none' }}>
                All Fixtures →
              </Link>
            </div>
          </div>
        </section>

        {/* ── GROUND ───────────────────────────────────────────────────── */}
        <section style={{ background: '#041B5F' }}>
          <div style={{ position: 'relative', height: 'clamp(320px,50vw,520px)', overflow: 'hidden' }}>
            <img src="/Ground_Pic.jpeg" alt="The Jessons Meadow" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 55%', filter: 'contrast(1.05) saturate(1.05)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(0deg,rgba(4,27,95,.92) 0%,transparent 100%)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 40px 32px' }}>
              <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 10, color: 'rgba(255,255,255,.5)', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 6 }}>Our Home Ground</div>
                  <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 'clamp(26px,4vw,48px)', color: '#fff', margin: 0, letterSpacing: '.04em' }}>The Jessons Meadow</h2>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: 'rgba(255,255,255,.6)', margin: '6px 0 0' }}>Brimscombe · Est. 1886</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <Link href="/matchday" style={{ background: '#1149D8', color: '#fff', padding: '12px 24px', borderRadius: 6, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 16, textDecoration: 'none', letterSpacing: '.04em' }}>Matchday Info</Link>
                  <Link href="/tickets" style={{ background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,.4)', padding: '10px 24px', borderRadius: 6, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 16, textDecoration: 'none', letterSpacing: '.04em' }}>Get Tickets</Link>
                </div>
              </div>
            </div>
          </div>
          <div style={{ background: '#1149D8', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[['🏟 The Jessons Meadow', 'Sponsored by Jessons Real Estate'], ['📍 Brimscombe, Stroud', 'Gloucestershire'], ['🎟 1,000', 'Capacity'], ['📅 Est. 1886', 'Founded']].map(([val, label]) => (
              <div key={label} style={{ padding: '14px 32px', textAlign: 'center', flex: '1 1 140px', borderRight: '1px solid rgba(255,255,255,.18)' }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 18, color: '#fff', lineHeight: 1 }}>{val}</div>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: 9, color: 'rgba(255,255,255,.6)', letterSpacing: '.14em', textTransform: 'uppercase', marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SEASON TICKET PROMO ──────────────────────────────────────── */}
        <section style={{ padding: '72px 24px', background: '#F2F2F2' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ background: '#041B5F', borderRadius: 8, padding: '44px 40px', display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}>
              <div style={{ flex: 1 }}>
                <span style={{ display: 'inline-block', background: '#1149D8', color: '#fff', padding: '3px 10px', borderRadius: 4, fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>Now On Sale</span>
                <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 'clamp(26px,3.5vw,42px)', color: '#fff', margin: '0 0 8px', letterSpacing: '.04em' }}>2026/27 Season Tickets</h3>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: 'rgba(255,255,255,.55)', margin: 0 }}>Adult £100 · Concession £80 · All home league & cup games · Digital QR ticket by email</p>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                {[['Adult', '£100'], ['Concession', '£80']].map(([label, price]) => (
                  <div key={label} style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 6, padding: '12px 18px', textAlign: 'center', minWidth: 90 }}>
                    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: 10, color: 'rgba(255,255,255,.5)', letterSpacing: '.1em', textTransform: 'uppercase' }}>{label}</div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 28, color: '#fff' }}>{price}</div>
                  </div>
                ))}
                <Link href="/tickets" style={{ background: '#1149D8', color: '#fff', padding: '16px 28px', borderRadius: 6, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, textDecoration: 'none', letterSpacing: '.04em', boxShadow: '0 8px 28px rgba(17,73,216,.45)' }}>
                  🎟 Buy Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── SPONSORS ─────────────────────────────────────────────────── */}
        <section style={{ padding: '72px 24px', background: '#041B5F' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 'clamp(30px,4.5vw,50px)', color: '#fff', margin: '0 0 8px', letterSpacing: '.04em' }}>Club Sponsors</h2>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: 'rgba(255,255,255,.5)' }}>Our valued club partners</p>
              <div style={{ width: 52, height: 4, background: '#1149D8', margin: '12px auto 0', borderRadius: 2 }} />
            </div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 36 }}>
              {SPONSORS.map(s => (
                <Link key={s.name} href="/sponsors" style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#fff', border: '2px solid #E5E7EB', borderRadius: 8, padding: '26px 20px', textAlign: 'center', width: 220, cursor: 'pointer', transition: 'all .22s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
                  >
                    <div style={{ height: 3, background: '#1149D8', position: 'relative', top: -26, left: -20, width: 'calc(100% + 40px)', marginBottom: -3 }} />
                    <div style={{ height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                      <img src={s.logo} alt={s.name} style={{ maxHeight: 60, maxWidth: 180, objectFit: 'contain' }} />
                    </div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 16, color: '#2D2D2D', marginBottom: 4 }}>{s.name}</div>
                    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 9, color: '#1149D8', letterSpacing: '.1em', textTransform: 'uppercase' }}>{s.role}</div>
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ textAlign: 'center' }}>
              <Link href="/sponsors" style={{ display: 'inline-block', color: 'rgba(255,255,255,.6)', border: '2px solid rgba(255,255,255,.2)', padding: '12px 28px', borderRadius: 6, fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', textDecoration: 'none' }}>
                All Sponsors →
              </Link>
            </div>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────────── */}
        <footer style={{ background: '#020B30', borderTop: '3px solid #1149D8', padding: '52px 24px 24px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 44, marginBottom: 44 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <img src="/crest.png" style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid #fff' }} alt="BTFC" />
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '.05em', lineHeight: 1 }}>BRIMSCOMBE</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '.05em', lineHeight: 1 }}>& THRUPP FC</div>
                </div>
              </div>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: 'rgba(255,255,255,.3)', lineHeight: 1.7, marginBottom: 16 }}>Est. 1886 · The Lilywhites</p>
              <div style={{ display: 'flex', gap: 9 }}>
                {[['𝕏', 'https://x.com/Btfcthemeadow'], ['f', 'https://www.facebook.com/BrimscombeandThruppFC/'], ['in', 'https://www.instagram.com/brimscombeandthruppfc/']].map(([icon, url]) => (
                  <a key={url} href={url} target="_blank" rel="noopener noreferrer" style={{ width: 34, height: 34, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,.5)', textDecoration: 'none' }}>
                    {icon}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 10, color: 'rgba(255,255,255,.28)', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 14 }}>Navigation</div>
              {[['News', '/news'], ['Teams', '/teams'], ['Fixtures', '/fixtures'], ['Tickets', '/tickets'], ['Matchday', '/matchday'], ['Sponsors', '/sponsors'], ['Club', '/club'], ['Shop', '/shop'], ['Contact', '/contact']].map(([label, href]) => (
                <Link key={href} href={href} style={{ display: 'block', fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: 'rgba(255,255,255,.45)', marginBottom: 9, textDecoration: 'none' }}>{label}</Link>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 10, color: 'rgba(255,255,255,.28)', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 14 }}>Kit Sponsor</div>
              <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 6, padding: '10px 12px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src="/brackenfern-logo.png" style={{ height: 28, objectFit: 'contain', background: '#fff', borderRadius: 3, padding: '2px 4px' }} alt="Brackenfern Advisory Limited" />
                <div>
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12, color: '#fff' }}>Brackenfern Advisory</div>
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: '#D4AF37' }}>First Team Sponsor</div>
                </div>
              </div>
              <Link href="/tickets" style={{ display: 'block', width: '100%', background: '#1149D8', color: '#fff', padding: '10px 0', borderRadius: 6, fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', textDecoration: 'none', textAlign: 'center', marginTop: 12 }}>
                🎟 Buy Season Tickets
              </Link>
            </div>
            <div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 10, color: 'rgba(255,255,255,.28)', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 14 }}>Contact</div>
              {['📍 The Jessons Meadow, London Road, Brimscombe, GL5 2SH', '📧 info@brimscombeandthruppfc.co.uk', '📞 07814 854108', '🕐 Mon–Fri 9am–5pm'].map(line => (
                <div key={line} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 10, lineHeight: 1.5 }}>{line}</div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.05)', paddingTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: 'rgba(255,255,255,.18)' }}>© 2026 Brimscombe & Thrupp FC. All rights reserved.</div>
            <div style={{ display: 'flex', gap: 18 }}>
              {['Privacy Policy', 'Terms of Use', 'Cookie Policy'].map(l => (
                <span key={l} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: 'rgba(255,255,255,.18)' }}>{l}</span>
              ))}
            </div>
          </div>
        </footer>

      </main>
    </>
  )
}
