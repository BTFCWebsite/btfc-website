'use client'
import Link from 'next/link'

const mobileStyles = `
  @media(max-width:768px) {
    .news-grid { grid-template-columns: 1fr !important; }
    .fixtures-grid { grid-template-columns: 1fr !important; }
    .sponsor-grid { flex-direction: column; align-items: center; }
    .hero-cards { flex-direction: column; align-items: stretch; }
    .hero-cards > div { min-width: unset !important; }
    .promo-inner { flex-direction: column !important; }
    .promo-prices { justify-content: center; }
    .jessons-strip { flex-direction: column; gap: 8px !important; text-align: center; }
    .stats-strip > div { padding: 12px 20px !important; }
    .hero-title { font-size: clamp(42px,12vw,80px) !important; }
  }
`


const NEXT_FIXTURE = {
  opponent: 'Fixture TBC',
  date: 'Fixtures released July 2026',
  time: '15:00',
}

const LAST_RESULT = {
  opponent: 'FC Stratford',
  score: '1–2',
  date: 'Sat 18 Apr 2026',
  competition: 'Hellenic Div One',
  win: false,
}

const NEWS = [
  { category: 'Match Report', color: '#1149D8', icon: '⚽', date: '24 May 2026', title: 'Tyler Cross Hits 18 Goals for the Season', summary: 'A brace against Vale Athletic takes our top scorer to an incredible 18 league goals this season.' },
  { category: 'Tickets', color: '#7C3AED', icon: '🎟', date: '21 May 2026', title: '2026/27 Season Tickets Now on Sale', summary: 'Season tickets for the 2026/27 campaign are now available online. Adult £100 · Concession £80.' },
  { category: 'Club News', color: '#059669', icon: '🤝', date: '20 May 2026', title: 'Brackenfern Advisory — Kit Sponsorship Confirmed', summary: 'We are delighted to confirm Brackenfern Advisory Limited as our First Team kit sponsor for 2026/27.' },
]

const SPONSORS = [
  { name: 'Jessons Real Estate', role: 'Ground Sponsor', logo: '/sponsors/jessons-logo.png' },
  { name: 'Brackenfern Advisory Limited', role: 'First Team Sponsor', logo: '/sponsors/brackenfern-logo.png' },
]

export default function HomePage() {
  return (
    <main>
      <style>{mobileStyles}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '100px 24px 0', position: 'relative', overflow: 'hidden' }}>

        {/* Background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img src="/matchday/Ground_Pic.jpeg" alt="Jessons Meadow" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 55%', filter: 'contrast(1.05) saturate(1.05)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(4,27,95,.12)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(0deg,rgba(4,27,95,.92) 0%,transparent 100%)' }} />
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center', paddingBottom: 60 }}>

          {/* First Team Sponsor — more prominent */}
          <div style={{ background: 'rgba(4,27,95,.7)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 8, padding: '10px 24px', marginBottom: 36, display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 10, color: 'rgba(255,255,255,.6)', letterSpacing: '.14em', textTransform: 'uppercase' }}>First Team Sponsor</span>
            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,.2)' }} />
            <div style={{ background: '#fff', borderRadius: 6, padding: '6px 14px', display: 'flex', alignItems: 'center' }}>
              <img src="/sponsors/brackenfern-logo.png" alt="Brackenfern Advisory Limited" style={{ height: 28, objectFit: 'contain' }} />
            </div>
          </div>

          {/* Crest */}
          <div style={{ width: 120, height: 120, borderRadius: '50%', border: '3px solid #fff', boxShadow: '0 0 0 3px #041B5F, 0 0 0 5px #1149D8', overflow: 'hidden', background: '#fff' }}>
            <img src="/branding/crest.png" alt="BTFC" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 'clamp(48px,10vw,110px)', color: '#fff', margin: '18px 0 0', letterSpacing: '.04em', lineHeight: .88, textShadow: '0 2px 20px rgba(4,27,95,.9)' }}>
            BRIMSCOMBE<br />&amp; THRUPP FC
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: 12, color: 'rgba(255,255,255,.7)', letterSpacing: '.22em', textTransform: 'uppercase', margin: '14px 0 44px', textShadow: '0 1px 10px rgba(4,27,95,.9)' }}>
            Est. 1886 · The Lilywhites
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 48 }}>
            <Link href="/tickets" style={{ background: '#1149D8', color: '#fff', padding: '16px 36px', borderRadius: 6, fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', textDecoration: 'none', boxShadow: '0 8px 28px rgba(17,73,216,.45)' }}>
              🎟 Season Tickets
            </Link>
            <Link href="/fixtures" style={{ background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,.28)', padding: '14px 36px', borderRadius: 6, fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
              View Fixtures
            </Link>
          </div>

          {/* Result + Fixture cards */}
          <div className="hero-cards" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderLeft: '4px solid #EF4444', borderRadius: 8, padding: '16px 22px', textAlign: 'left', minWidth: 230, backdropFilter: 'blur(8px)' }}>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 9, color: 'rgba(255,255,255,.5)', letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 6 }}>Latest Result</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 22, color: '#fff', letterSpacing: '.04em' }}>
                BTFC <span style={{ color: '#EF4444' }}>{LAST_RESULT.score}</span> {LAST_RESULT.opponent}
              </div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 4 }}>{LAST_RESULT.date} · {LAST_RESULT.competition}</div>
            </div>
            <div style={{ background: 'rgba(17,73,216,.3)', border: '1px solid rgba(255,255,255,.12)', borderLeft: '4px solid #1149D8', borderRadius: 8, padding: '16px 22px', textAlign: 'left', minWidth: 230, backdropFilter: 'blur(8px)' }}>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 9, color: 'rgba(255,255,255,.5)', letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 6 }}>Next Fixture</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 22, color: '#fff', letterSpacing: '.04em' }}>BTFC vs {NEXT_FIXTURE.opponent}</div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 4 }}>{NEXT_FIXTURE.date}</div>
            </div>
          </div>
        </div>

        {/* ── JESSONS MEADOW + STATS STRIP ── */}
        <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          {/* Jessons Meadow name bar */}
          <div className="jessons-strip" style={{ background: 'rgba(4,27,95,.95)', borderTop: '1px solid rgba(255,255,255,.08)', padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 10, color: 'rgba(255,255,255,.4)', letterSpacing: '.15em', textTransform: 'uppercase' }}>Home of BTFC</span>
              <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,.15)' }} />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '.06em' }}>JESSONS MEADOW</span>
              <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,.15)' }} />
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 10, color: 'rgba(255,255,255,.4)', letterSpacing: '.12em', textTransform: 'uppercase' }}>Ground Sponsor</span>
              <img src="/sponsors/jessons-logo.png" alt="Jessons Real Estate" style={{ height: 28, objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: .8 }} />
            </div>
          </div>
          {/* Stats strip */}
          <div className="stats-strip" style={{ background: '#1149D8', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              ['7th', 'League Position'],
              ['59', 'Goals Scored'],
              ['44%', 'Win Rate'],
              ['Hellenic', 'Division One'],
            ].map(([val, label]) => (
              <div key={label} style={{ padding: '14px 36px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,.18)' }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 26, color: '#fff', letterSpacing: '.04em' }}>{val}</div>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: 9, color: 'rgba(255,255,255,.65)', letterSpacing: '.12em', textTransform: 'uppercase', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LATEST NEWS ──────────────────────────────────────────────────── */}
      <section style={{ padding: '72px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 'clamp(30px,4.5vw,50px)', color: '#2D2D2D', margin: '0 0 8px', letterSpacing: '.04em' }}>Latest News</h2>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: '#6B7280' }}>The latest from Brimscombe & Thrupp FC</p>
            <div style={{ width: 52, height: 4, background: '#1149D8', margin: '12px auto 0', borderRadius: 2 }} />
          </div>
          <div className="news-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20, marginBottom: 36 }}>
            {NEWS.map(n => (
              <Link key={n.title} href="/news" style={{ textDecoration: 'none' }}>
                <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden', height: '100%', transition: 'transform .2s, box-shadow .2s' }}>
                  <div style={{ height: 6, background: n.color }} />
                  <div style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ background: `${n.color}18`, color: n.color, padding: '3px 10px', borderRadius: 4, fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>
                        {n.icon} {n.category}
                      </span>
                      <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: '#9CA3AF' }}>{n.date}</span>
                    </div>
                    <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, color: '#2D2D2D', margin: '0 0 8px', lineHeight: 1.15 }}>{n.title}</h3>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: '#6B7280', margin: '0 0 16px', lineHeight: 1.55 }}>{n.summary}</p>
                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 15, color: '#1149D8' }}>Read More →</span>
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

      {/* ── FIXTURES PREVIEW ─────────────────────────────────────────────── */}
      <section style={{ padding: '72px 24px', background: '#F2F2F2' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 'clamp(30px,4.5vw,50px)', color: '#2D2D2D', margin: '0 0 8px', letterSpacing: '.04em' }}>Fixtures & Results</h2>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: '#6B7280' }}>Upcoming games and recent results</p>
            <div style={{ width: 52, height: 4, background: '#1149D8', margin: '12px auto 0', borderRadius: 2 }} />
          </div>
          <div className="fixtures-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderLeft: '4px solid #EF4444', borderRadius: 8, padding: 24 }}>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 10, color: '#9CA3AF', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 12 }}>Latest Result</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, color: '#041B5F' }}>BTFC</span>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 32, color: '#EF4444', padding: '4px 12px', background: '#FEF2F2', borderRadius: 6 }}>{LAST_RESULT.score}</span>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, color: '#6B7280' }}>{LAST_RESULT.opponent}</span>
              </div>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: '#9CA3AF', margin: 0 }}>{LAST_RESULT.date} · {LAST_RESULT.competition} · Home</p>
            </div>
            <div style={{ background: '#041B5F', borderRadius: 8, padding: 24 }}>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 10, color: 'rgba(255,255,255,.5)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 12 }}>Next Home Game</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 24, color: '#fff', marginBottom: 8, letterSpacing: '.03em' }}>BTFC vs {NEXT_FIXTURE.opponent}</div>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: 'rgba(255,255,255,.5)', margin: '0 0 16px' }}>{NEXT_FIXTURE.date}</p>
              <Link href="/tickets" style={{ display: 'inline-block', background: '#1149D8', color: '#fff', padding: '10px 20px', borderRadius: 6, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 16, textDecoration: 'none' }}>
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

      {/* ── SEASON TICKET PROMO ──────────────────────────────────────────── */}
      <section style={{ padding: '72px 24px', background: '#F2F2F2' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="promo-inner" style={{ background: '#041B5F', borderRadius: 8, padding: '44px 40px', display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
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
                <div style={{ background: '#fff', border: '2px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '28px 24px', textAlign: 'center', width: 240, transition: 'transform .22s' }}>
                  <div style={{ height: 3, background: '#1149D8', margin: '-28px -24px 24px' }} />
                  <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <img src={s.logo} alt={s.name} style={{ maxHeight: 64, maxWidth: 200, objectFit: 'contain' }} />
                  </div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 17, color: '#2D2D2D', marginBottom: 4 }}>{s.name}</div>
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

    </main>
  )
}
