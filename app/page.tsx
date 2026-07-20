export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { client } from './lib/sanity.client'
import NewsSection from './NewsSection'

const SPONSORS = [
  { name: 'Jessons Real Estate', role: 'Ground Sponsor', logo: '/sponsors/jessons-logo.png' },
  { name: 'Brackenfern Advisory Limited', role: 'First Team Sponsor', logo: '/sponsors/brackenfern-logo.png' },
]

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

const FALLBACK_LAST = {
  opponent: 'FC Stratford',
  btfcScore: 1,
  opponentScore: 2,
  date: '2026-04-18',
  competition: 'Hellenic Div One',
}

const FALLBACK_NEXT = {
  opponent: 'Fixture TBC',
  date: null as string | null,
  competition: 'Fixtures released July 2026',
  kickoff: '15:00',
}

const FALLBACK_SETTINGS = {
  leaguePosition: '7th',
  seasonYear: '2025/26',
}

export default async function HomePage() {
  let lastResult = FALLBACK_LAST
  let nextFixture = FALLBACK_NEXT
  let leaguePosition = FALLBACK_SETTINGS.leaguePosition
  let seasonYear = FALLBACK_SETTINGS.seasonYear

  try {
    const today = new Date().toISOString().split('T')[0]

    const [last, next, settings] = await Promise.all([
      client.fetch(
        `*[_type == "fixture" && team == "First XI" && played == true] | order(date desc)[0] {
          opponent, btfcScore, opponentScore, date, competition
        }`,
        {},
        { cache: 'no-store' }
      ),
      client.fetch(
        `*[_type == "fixture" && team == "First XI" && played != true && date >= $today] | order(date asc)[0] {
          opponent, date, competition, kickoff
        }`,
        { today },
        { cache: 'no-store' }
      ),
      client.fetch(
        `*[_type == "siteSettings"][0] { leaguePosition, seasonYear }`,
        {},
        { cache: 'no-store' }
      ),
    ])

    if (last) lastResult = last
    if (next) nextFixture = next
    if (settings?.leaguePosition) leaguePosition = settings.leaguePosition
    if (settings?.seasonYear) seasonYear = settings.seasonYear
  } catch (e) {
    // Use fallback data
  }

  const lastScore = `${lastResult.btfcScore ?? 0}–${lastResult.opponentScore ?? 0}`
  const longestFixtureTitleLength = Math.max(
    `BTFC ${lastScore} ${lastResult.opponent}`.length,
    `BTFC vs ${nextFixture.opponent}`.length
  )
  const fixtureCardsMaxWidth = Math.min(
    1100,
    Math.max(900, Math.ceil(longestFixtureTitleLength * 26.4 + 112))
  )
  const fixtureTitleFontSize = Math.max(
    15,
    Math.min(22, (fixtureCardsMaxWidth - 112) / (longestFixtureTitleLength * 1.35))
  )

  const fixtureCardBase = {
    border: '1px solid rgba(255,255,255,.12)',
    borderRadius: 8,
    padding: '16px 22px',
    textAlign: 'left' as const,
    flex: '1 1 0',
    minWidth: 0,
    minHeight: 112,
    boxSizing: 'border-box' as const,
    backdropFilter: 'blur(8px)',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
  }

  const fixtureTitle = {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 800,
    fontSize: fixtureTitleFontSize,
    color: '#fff',
    letterSpacing: '.03em',
    lineHeight: 1.08,
    whiteSpace: 'nowrap' as const,
    overflowWrap: 'normal' as const,
  }

  return (
    <main>
      <style>{`
        @media(max-width:768px) {
          .news-grid { grid-template-columns: 1fr !important; }
          .fixtures-grid { grid-template-columns: 1fr !important; }
          .hero-cards { flex-direction: column; align-items: stretch; }
          .hero-cards > div { min-width: unset !important; max-width: none !important; width: 100% !important; }
          .promo-inner { flex-direction: column !important; }
          .jessons-strip { flex-direction: column; gap: 8px !important; text-align: center; }
          .stats-strip > div { padding: 12px 20px !important; }
        }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '100px 24px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img src="/matchday/Ground_Pic.jpeg" alt="Jessons Meadow" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 55%', filter: 'contrast(1.05) saturate(1.05)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(4,27,95,.12)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(0deg,rgba(4,27,95,.92) 0%,transparent 100%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center', paddingBottom: 60 }}>
          {/* Crest */}
          <div style={{ width: 120, height: 120, borderRadius: '50%', border: '3px solid #fff', boxShadow: '0 0 0 3px #041B5F, 0 0 0 5px #1149D8', overflow: 'hidden', background: '#fff' }}>
            <img src="/branding/crest.png" alt="BTFC" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 'clamp(48px,10vw,110px)', color: '#fff', margin: '18px 0 0', letterSpacing: '.04em', lineHeight: .88, textShadow: '0 2px 20px rgba(4,27,95,.9)' }}>
            BRIMSCOMBE<br />&amp; THRUPP FC
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: 12, color: 'rgba(255,255,255,.7)', letterSpacing: '.22em', textTransform: 'uppercase', margin: '14px 0 44px' }}>
            Est. 1886 · The Lilywhites
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 48 }}>
            <Link href="/tickets" style={{ background: '#1149D8', color: '#fff', padding: '16px 36px', borderRadius: 6, fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', textDecoration: 'none', boxShadow: '0 8px 28px rgba(17,73,216,.45)' }}>
              🎟 Season Tickets
            </Link>
            <Link href="/fixtures" style={{ background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,.28)', padding: '14px 36px', borderRadius: 6, fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
              View Fixtures
            </Link>
          </div>

          {/* Result + Fixture cards */}
          <div className="hero-cards" style={{ display: 'flex', gap: 16, flexWrap: 'nowrap', justifyContent: 'center', alignItems: 'stretch', width: '100%', maxWidth: fixtureCardsMaxWidth }}>
            <div style={{ ...fixtureCardBase, background: 'rgba(255,255,255,.06)', borderLeft: '4px solid #EF4444' }}>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 9, color: 'rgba(255,255,255,.5)', letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 6 }}>Latest Result</div>
              <div style={fixtureTitle}>
                BTFC <span style={{ color: '#EF4444' }}>{lastScore}</span> {lastResult.opponent}
              </div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 7, lineHeight: 1.35, overflowWrap: 'anywhere' }}>
                {lastResult.date ? formatDate(lastResult.date) : ''} · {lastResult.competition}
              </div>
            </div>
            <div style={{ ...fixtureCardBase, background: 'rgba(17,73,216,.3)', borderLeft: '4px solid #1149D8' }}>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 9, color: 'rgba(255,255,255,.5)', letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 6 }}>Next Fixture</div>
              <div style={fixtureTitle}>BTFC vs {nextFixture.opponent}</div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 7, lineHeight: 1.35, overflowWrap: 'anywhere' }}>
                {nextFixture.date ? `${formatDate(nextFixture.date)}${nextFixture.kickoff ? ` · ${nextFixture.kickoff}` : ''}` : nextFixture.competition}
              </div>
            </div>
          </div>
        </div>

        {/* Jessons Meadow + Stats */}
        <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <div className="jessons-strip" style={{ background: 'rgba(4,27,95,.95)', borderTop: '1px solid rgba(255,255,255,.08)', padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 10, color: 'rgba(255,255,255,.4)', letterSpacing: '.15em', textTransform: 'uppercase' }}>Home of BTFC</span>
            <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,.15)' }} />
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '.06em' }}>JESSONS MEADOW</span>
            <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,.15)' }} />
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 10, color: 'rgba(255,255,255,.4)', letterSpacing: '.12em', textTransform: 'uppercase' }}>Ground Sponsor</span>
            <div style={{ background: '#fff', borderRadius: 4, padding: '3px 10px', display: 'flex', alignItems: 'center' }}>
              <img src="/sponsors/jessons-logo.png" alt="Jessons Real Estate" style={{ height: 22, objectFit: 'contain' }} />
            </div>
          </div>
          <div className="stats-strip" style={{ background: '#1149D8', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              [leaguePosition || '7th', 'League Position'],
              ['Hellenic', 'Division One'],
              [seasonYear || '2025/26', 'Season'],
              ['Est. 1886', 'Founded'],
            ].map(([val, label]) => (
              <div key={label} style={{ padding: '14px 36px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,.18)' }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 26, color: '#fff', letterSpacing: '.04em' }}>{val}</div>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: 9, color: 'rgba(255,255,255,.65)', letterSpacing: '.12em', textTransform: 'uppercase', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NewsSection />

      {/* ── SEASON TICKET PROMO ──────────────────────────────────────────── */}
      <section style={{ padding: '72px 24px', background: '#F2F2F2' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="promo-inner" style={{ background: '#041B5F', borderRadius: 8, padding: '44px 40px', display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <span style={{ display: 'inline-block', background: '#1149D8', color: '#fff', padding: '3px 10px', borderRadius: 4, fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>Now On Sale</span>
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 'clamp(26px,3.5vw,42px)', color: '#fff', margin: '0 0 8px', letterSpacing: '.04em' }}>2026/27 Season Tickets</h3>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: 'rgba(255,255,255,.55)', margin: 0 }}>Adult £89 · Concession £69 · All home league & cup games · Digital QR ticket by email</p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              {[['Adult', '£89'], ['Concession', '£69']].map(([label, price]) => (
                <div key={label} style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 6, padding: '12px 18px', textAlign: 'center' as const, minWidth: 90 }}>
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: 10, color: 'rgba(255,255,255,.5)', letterSpacing: '.1em', textTransform: 'uppercase' as const }}>{label}</div>
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

      {/* ── SPONSORS ─────────────────────────────────────────────────────── */}
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
                <div style={{ background: '#fff', border: '2px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '28px 24px', textAlign: 'center' as const, width: 240 }}>
                  <div style={{ height: 3, background: '#1149D8', margin: '-28px -24px 24px' }} />
                  <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <img src={s.logo} alt={s.name} style={{ maxHeight: 64, maxWidth: 200, objectFit: 'contain' }} />
                  </div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 17, color: '#2D2D2D', marginBottom: 4 }}>{s.name}</div>
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 9, color: '#1149D8', letterSpacing: '.1em', textTransform: 'uppercase' as const }}>{s.role}</div>
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
    </main>
  )
}
