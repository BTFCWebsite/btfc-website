'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  ['Home',     '/'],
  ['News',     '/news'],
  ['Teams',    '/teams'],
  ['Matches',  '/fixtures'],
  ['Tickets',  '/tickets'],
  ['Matchday', '/matchday'],
  ['Sponsors', '/sponsors'],
  ['Club',     '/club'],
  ['Shop',     '/shop'],
  ['Contact',  '/contact'],
]

function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <>
      <style>{`
        @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @media(max-width:900px){
          .nav-desktop{display:none !important}
          .nav-hamburger{display:flex !important}
        }
        @media(min-width:901px){
          .nav-mobile-menu{display:none !important}
          .nav-hamburger{display:none !important}
        }
      `}</style>

      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? 'rgba(4,27,95,.98)' : '#041B5F',
        borderBottom: '3px solid #1149D8',
        transition: 'background .3s',
      }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/branding/crest.png" alt="BTFC" style={{ width: 42, height: 42, borderRadius: '50%', border: '2px solid #fff' }} />
            <div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '.06em', lineHeight: 1 }}>BRIMSCOMBE & THRUPP FC</div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 9, color: 'rgba(255,255,255,.4)', letterSpacing: '.15em', textTransform: 'uppercase' }}>Official Website</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="nav-desktop" style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
            {NAV_LINKS.map(([label, href]) => {
              const active = pathname === href || (href !== '/' && pathname.startsWith(href + '/'))
              return (
                <Link key={href} href={href} style={{
                  color: active ? '#fff' : 'rgba(255,255,255,.65)',
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: '.07em',
                  textTransform: 'uppercase',
                  padding: '8px 10px',
                  borderBottom: active ? '3px solid #1149D8' : '3px solid transparent',
                  textDecoration: 'none',
                  height: 64,
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  {label}
                </Link>
              )
            })}
            <Link href="/tickets" style={{
              background: '#1149D8', color: '#fff', padding: '10px 18px', borderRadius: 6,
              fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 11,
              letterSpacing: '.08em', textTransform: 'uppercase', textDecoration: 'none',
              marginLeft: 12, whiteSpace: 'nowrap',
            }}>
              🎟 Buy Tickets
            </Link>
          </div>

          {/* Hamburger button */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 8, flexDirection: 'column', gap: 5, alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Menu"
          >
            <span style={{ display: 'block', width: 24, height: 2, background: '#fff', transition: 'all .3s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ display: 'block', width: 24, height: 2, background: '#fff', transition: 'all .3s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: 24, height: 2, background: '#fff', transition: 'all .3s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className="nav-mobile-menu"
          style={{
            display: menuOpen ? 'block' : 'none',
            background: '#041B5F',
            borderTop: '1px solid rgba(255,255,255,.1)',
            padding: '12px 0 20px',
          }}
        >
          {NAV_LINKS.map(([label, href]) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href + '/'))
            return (
              <Link key={href} href={href} style={{
                display: 'block',
                color: active ? '#fff' : 'rgba(255,255,255,.7)',
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: '.07em',
                textTransform: 'uppercase',
                padding: '12px 24px',
                textDecoration: 'none',
                borderLeft: active ? '3px solid #1149D8' : '3px solid transparent',
                background: active ? 'rgba(17,73,216,.15)' : 'none',
              }}>
                {label}
              </Link>
            )
          })}
          <div style={{ padding: '12px 24px 0' }}>
            <Link href="/tickets" style={{
              display: 'block', textAlign: 'center',
              background: '#1149D8', color: '#fff', padding: '14px 18px', borderRadius: 6,
              fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 13,
              letterSpacing: '.08em', textTransform: 'uppercase', textDecoration: 'none',
            }}>
              🎟 Buy Tickets
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}

function Ticker() {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
      background: '#041B5F', borderTop: '2px solid #1149D8',
      padding: '7px 0', overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', gap: 52, whiteSpace: 'nowrap', animation: 'ticker 30s linear infinite' }}>
        {[
          ['Jessons Real Estate', 'Official Ground Sponsor — The Jessons Meadow'],
          ['Brackenfern Advisory Limited', 'First Team Sponsor'],
          ['Reserves Sponsor TBC', 'Reserves Sponsor — enquire now'],
          ['U17s Sponsor TBC', 'Under 17s Sponsor — enquire now'],
          ['Your Business Here', 'Gold Partner — enquire now'],
          ['Jessons Real Estate', 'Official Ground Sponsor — The Jessons Meadow'],
          ['Brackenfern Advisory Limited', 'First Team Sponsor'],
          ['Reserves Sponsor TBC', 'Reserves Sponsor — enquire now'],
          ['U17s Sponsor TBC', 'Under 17s Sponsor — enquire now'],
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
  )
}

function Footer() {
  return (
    <footer style={{ background: '#020B30', borderTop: '3px solid #1149D8', padding: '52px 24px 24px' }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 44, marginBottom: 44
      }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <img src="/branding/crest.png" style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid #fff' }} alt="BTFC" />
            <div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '.05em', lineHeight: 1 }}>BRIMSCOMBE</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '.05em', lineHeight: 1 }}>& THRUPP FC</div>
            </div>
          </div>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: 'rgba(255,255,255,.3)', lineHeight: 1.7, marginBottom: 16 }}>Est. 1886 · The Lilywhites</p>
          <div style={{ display: 'flex', gap: 9 }}>
            {[
              ['𝕏', 'https://x.com/Btfcthemeadow'],
              ['f', 'https://www.facebook.com/BrimscombeandThruppFC/'],
              ['in', 'https://www.instagram.com/brimscombeandthruppfc/'],
            ].map(([icon, url]) => (
              <a key={url} href={url} target="_blank" rel="noopener noreferrer" style={{ width: 34, height: 34, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,.5)', textDecoration: 'none' }}>
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 10, color: 'rgba(255,255,255,.28)', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 14 }}>Navigation</div>
          {NAV_LINKS.map(([label, href]) => (
            <Link key={href} href={href} style={{ display: 'block', fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: 'rgba(255,255,255,.45)', marginBottom: 9, textDecoration: 'none' }}>
              {label}
            </Link>
          ))}
        </div>

        {/* Kit Sponsor */}
        <div>
          <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 10, color: 'rgba(255,255,255,.28)', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 14 }}>Kit Sponsor</div>
          <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 6, padding: '10px 12px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/sponsors/brackenfern-logo.png" style={{ height: 28, objectFit: 'contain', background: '#fff', borderRadius: 3, padding: '2px 4px' }} alt="Brackenfern Advisory Limited" />
            <div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12, color: '#fff' }}>Brackenfern Advisory</div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: '#D4AF37' }}>First Team Sponsor</div>
            </div>
          </div>
          <Link href="/tickets" style={{ display: 'block', background: '#1149D8', color: '#fff', padding: '10px 0', borderRadius: 6, fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', textDecoration: 'none', textAlign: 'center', marginTop: 12 }}>
            🎟 Buy Season Tickets
          </Link>
        </div>

        {/* Contact */}
        <div>
          <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 10, color: 'rgba(255,255,255,.28)', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 14 }}>Contact</div>
          {[
            '📍 The Jessons Meadow, London Road, Brimscombe, GL5 2SH',
            '📧 info@brimscombeandthruppfc.co.uk',
            '📞 07814 854108',
            '🕐 Mon–Fri 9am–5pm',
          ].map(line => (
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
  )
}


const PAGE_HEADERS: Record<string, { title: string; subtitle: string }> = {
  '/news':     { title: 'Club News',          subtitle: 'The latest from Brimscombe & Thrupp FC' },
  '/teams':    { title: 'Our Teams',           subtitle: 'First XI · Reserves · Under 17s' },
  '/fixtures': { title: 'Fixtures & Results',  subtitle: '2025/26 Season' },
  '/tickets':  { title: 'Tickets',             subtitle: 'Season tickets and matchday admission' },
  '/matchday': { title: 'Matchday',            subtitle: 'Everything you need for The Jessons Meadow' },
  '/sponsors': { title: 'Sponsors',            subtitle: 'Our valued club partners' },
  '/club':     { title: 'The Club',            subtitle: 'Brimscombe & Thrupp FC — Est. 1886' },
  '/shop':     { title: 'Club Shop',           subtitle: 'Official BTFC merchandise' },
  '/contact':  { title: 'Contact Us',          subtitle: 'Get in touch with the club' },
}

function AutoPageHeader() {
  const pathname = usePathname()
  // Never show on homepage - it has its own hero
  if (pathname === '/') return null
  const header = PAGE_HEADERS[pathname]
  if (!header) return null
  return (
    <div style={{
      background: '#fff',
      borderBottom: '1px solid #E5E7EB',
      padding: '48px 24px 40px',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <h1 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(36px,6vw,64px)',
          color: '#041B5F',
          margin: '0 0 10px',
          letterSpacing: '.04em',
          lineHeight: 1,
        }}>
          {header.title}
        </h1>
        <p style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 14,
          color: '#6B7280',
          margin: '0 0 16px',
        }}>
          {header.subtitle}
        </p>
        <div style={{ width: 52, height: 4, background: '#1149D8', margin: '0 auto', borderRadius: 2 }} />
      </div>
    </div>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Brimscombe & Thrupp FC</title>
        <meta name="description" content="Official website of Brimscombe & Thrupp FC — The Lilywhites. Hellenic League Division One. Est. 1886." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Montserrat', sans-serif; background: #F2F2F2; color: #2D2D2D; }
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: #041B5F; }
          ::-webkit-scrollbar-thumb { background: #1149D8; border-radius: 3px; }
          a { color: inherit; }
        `}</style>
      </head>
      <body>
        <Nav />
        <div style={{ paddingTop: 64, paddingBottom: 48 }}>
          <AutoPageHeader />
          {children}
        </div>
        <Ticker />
        <Footer />
      </body>
    </html>
  )
}

// ─── PAGE HEADER ─────────────────────────────────────────────────────────────
// Use this on every inner page for consistent styling
// Usage: <PageHeader title="News" subtitle="The latest from BTFC" />
export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{
      background: '#041B5F',
      borderBottom: '3px solid #1149D8',
      padding: '52px 24px 44px',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <h1 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(36px,6vw,64px)',
          color: '#fff',
          margin: '0 0 10px',
          letterSpacing: '.04em',
          lineHeight: 1,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 14,
            color: 'rgba(255,255,255,.55)',
            margin: '0 0 16px',
          }}>
            {subtitle}
          </p>
        )}
        <div style={{ width: 52, height: 4, background: '#1149D8', margin: '0 auto', borderRadius: 2 }} />
      </div>
    </div>
  )
}
