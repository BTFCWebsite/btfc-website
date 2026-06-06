'use client'
import { useEffect } from 'react'

// ─── UPDATE FIXTURES HERE WHEN RELEASED IN JULY ───────────────────────────────
const LEAGUE_AND_CUP_FIXTURES = [
  { date: 'TBC', opponent: 'Fixture TBC', home: true, time: 'TBC' },
  { date: 'TBC', opponent: 'Fixture TBC', home: true, time: 'TBC' },
  { date: 'TBC', opponent: 'Fixture TBC', home: false, time: 'TBC' },
  { date: 'TBC', opponent: 'Fixture TBC', home: true, time: 'TBC' },
  { date: 'TBC', opponent: 'Fixture TBC', home: false, time: 'TBC' },
]

const FRIENDLY_FIXTURES = [
  { date: 'TBC', opponent: 'Pre-season Friendly TBC', home: true, time: 'TBC' },
  { date: 'TBC', opponent: 'Pre-season Friendly TBC', home: true, time: 'TBC' },
  { date: 'TBC', opponent: 'Pre-season Friendly TBC', home: false, time: 'TBC' },
]
// ─────────────────────────────────────────────────────────────────────────────

const faqs = [
  ['Can I pay in instalments?', 'Not currently — season tickets must be paid in full at time of purchase.'],
  ['How do I get my ticket?', 'After payment you will receive your digital season ticket by email with a QR code. Save it to Apple Wallet or show it on your phone at the gate.'],
  ['What is included?', 'Your season ticket covers all First XI home league and cup fixtures throughout the 26/27 season.'],
  ['Is my payment secure?', 'Yes. Payments are processed securely by Stripe.'],
  ['Do under 16s pay?', 'Under 16s are admitted free to all First XI matches. Proof of age may be requested.'],
  ['What about friendlies?', 'Pre-season and friendly matches are £3 for all. Season tickets do not cover friendly fixtures.'],
  ['Cash or card?', 'We accept both cash and card at the gate on matchday.'],
  ['When does the gate open?', 'The turnstiles open approximately one hour before kick-off.'],
]

const labelStyle = (home: boolean) => ({
  display: 'inline-block',
  padding: '2px 10px',
  borderRadius: 4,
  fontSize: 10,
  fontWeight: 900,
  fontFamily: "'Montserrat', sans-serif",
  letterSpacing: '.08em',
  textTransform: 'uppercase' as const,
  background: home ? '#1149D8' : '#F2F2F2',
  color: home ? '#fff' : '#6B7280',
  border: home ? 'none' : '1px solid #E5E7EB',
})

export default function TicketsPage() {
  useEffect(() => {
    const existing = document.getElementById('tt-widget-script')
    if (existing) existing.remove()

    const script = document.createElement('script')
    script.id = 'tt-widget-script'
    script.src = 'https://cdn.tickettailor.com/js/widgets/min/widget.js'
    script.setAttribute('data-url', 'https://www.tickettailor.com/all-tickets/brimscombeandthruppfc/?ref=website_widget&show_search_filter=true&show_date_filter=true&show_sort=true')
    script.setAttribute('data-type', 'inline')
    script.setAttribute('data-inline-minimal', 'true')
    script.setAttribute('data-inline-show-logo', 'false')
    script.setAttribute('data-inline-bg-fill', 'false')
    script.setAttribute('data-inline-inherit-ref-from-url-param', '')
    script.setAttribute('data-inline-ref', 'website_widget')
    script.async = true

    const container = document.getElementById('tt-widget-container')
    if (container) container.appendChild(script)

    return () => {
      const s = document.getElementById('tt-widget-script')
      if (s) s.remove()
    }
  }, [])

  return (
    <main style={{ background: '#F2F2F2', minHeight: '100vh', padding: '90px 24px 90px' }}>
      <section style={{ maxWidth: 980, margin: '0 auto' }}>

        {/* Page Title */}
        <div style={{ textAlign: 'center', marginBottom: 42 }}>
          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 52,
            fontWeight: 800,
            color: '#2D2D2D',
            margin: '0 0 8px',
            letterSpacing: '0.04em'
          }}>
            Tickets
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", color: '#6B7280', margin: 0, fontSize: 14 }}>
            Season tickets, matchday admission and fixture information
          </p>
          <div style={{ width: 52, height: 4, background: '#1149D8', margin: '14px auto 0' }} />
        </div>

        {/* ── SEASON TICKETS ── */}
        <div style={{
          background: '#041B5F',
          borderRadius: 8,
          padding: '22px 28px',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          flexWrap: 'wrap',
          marginBottom: 28
        }}>
          <div>
            <h2 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 28,
              fontWeight: 800,
              margin: '0 0 6px',
              letterSpacing: '0.03em'
            }}>
              🎟️ 2026/27 Season Tickets On Sale Now
            </h2>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              margin: 0,
              color: 'rgba(255,255,255,.7)',
              fontSize: 13,
              lineHeight: 1.6
            }}>
              Adult £100 · Concession £80 · All First XI home league & cup games · Digital QR ticket by email
            </p>
          </div>
          <div style={{
            background: '#1149D8',
            padding: '12px 22px',
            borderRadius: 6,
            textAlign: 'center',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: 20
          }}>
            <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, opacity: .7, letterSpacing: '.12em' }}>
              SECURE PAYMENT
            </div>
            Stripe
          </div>
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid #E5E7EB',
          borderRadius: 8,
          padding: 28,
          marginBottom: 52
        }}>
          <div style={{ height: 4, background: '#1149D8', marginBottom: 20, borderRadius: 2 }} />
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 28,
            fontWeight: 800,
            color: '#2D2D2D',
            margin: '0 0 6px',
            letterSpacing: '0.03em'
          }}>
            Buy Your Season Ticket
          </h2>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 12,
            color: '#6B7280',
            margin: '0 0 20px'
          }}>
            Select your ticket type below. Your QR code season ticket will be emailed to you instantly on payment.
          </p>
          <div id="tt-widget-container" style={{ minHeight: 100 }}>
            <noscript>
              <a href="https://www.tickettailor.com/all-tickets/brimscombeandthruppfc/" target="_blank" rel="noopener noreferrer" style={{ color: '#1149D8' }}>
                Click here to buy tickets
              </a>
            </noscript>
          </div>
        </div>

        {/* ── MATCHDAY ADMISSION ── */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 36,
            fontWeight: 800,
            color: '#2D2D2D',
            margin: '0 0 6px',
            letterSpacing: '0.03em'
          }}>
            Matchday Admission
          </h2>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 12,
            color: '#6B7280',
            margin: '0 0 20px'
          }}>
            Pay on the gate — First XI matches only. All other fixtures are free to attend.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20, marginBottom: 20 }}>
            {/* League & Cup */}
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: 24 }}>
              <div style={{ height: 4, background: '#1149D8', marginBottom: 16, borderRadius: 2 }} />
              <h3 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 22,
                fontWeight: 800,
                color: '#2D2D2D',
                margin: '0 0 16px'
              }}>
                League &amp; Cup
              </h3>
              {[
                { label: 'Adult', price: '£7' },
                { label: 'Concession (65+)', price: '£5' },
                { label: 'Under 16', price: 'Free' },
              ].map(row => (
                <div key={row.label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: '1px solid #F3F4F6'
                }}>
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: '#374151' }}>
                    {row.label}
                  </span>
                  <span style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 22,
                    fontWeight: 800,
                    color: row.price === 'Free' ? '#16a34a' : '#1149D8'
                  }}>
                    {row.price}
                  </span>
                </div>
              ))}
            </div>

            {/* Friendlies */}
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: 24 }}>
              <div style={{ height: 4, background: '#6B7280', marginBottom: 16, borderRadius: 2 }} />
              <h3 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 22,
                fontWeight: 800,
                color: '#2D2D2D',
                margin: '0 0 16px'
              }}>
                Friendlies
              </h3>
              {[
                { label: 'Everyone', price: '£3' },
              ].map(row => (
                <div key={row.label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: '1px solid #F3F4F6'
                }}>
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: '#374151' }}>
                    {row.label}
                  </span>
                  <span style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 22,
                    fontWeight: 800,
                    color: '#1149D8'
                  }}>
                    {row.price}
                  </span>
                </div>
              ))}
              <p style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 11,
                color: '#9CA3AF',
                margin: '16px 0 0'
              }}>
                Season tickets do not cover friendly fixtures.
              </p>
            </div>
          </div>
        </div>

        {/* ── FIXTURES ── */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 36,
            fontWeight: 800,
            color: '#2D2D2D',
            margin: '0 0 6px',
            letterSpacing: '0.03em'
          }}>
            2026/27 Fixtures
          </h2>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 12,
            color: '#6B7280',
            margin: '0 0 20px'
          }}>
            Full fixture list to be confirmed in July 2026. Check back soon.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20 }}>

            {/* League & Cup Fixtures */}
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: 24 }}>
              <div style={{ height: 4, background: '#1149D8', marginBottom: 16, borderRadius: 2 }} />
              <h3 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 22,
                fontWeight: 800,
                color: '#2D2D2D',
                margin: '0 0 16px'
              }}>
                First XI — League &amp; Cup
              </h3>
              {LEAGUE_AND_CUP_FIXTURES.map((f, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: '1px solid #F3F4F6',
                  gap: 10
                }}>
                  <div>
                    <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: '#374151', fontWeight: 600 }}>
                      {f.opponent}
                    </div>
                    <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
                      {f.date} · {f.time}
                    </div>
                  </div>
                  <span style={labelStyle(f.home)}>{f.home ? 'Home' : 'Away'}</span>
                </div>
              ))}
            </div>

            {/* Friendly Fixtures */}
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: 24 }}>
              <div style={{ height: 4, background: '#6B7280', marginBottom: 16, borderRadius: 2 }} />
              <h3 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 22,
                fontWeight: 800,
                color: '#2D2D2D',
                margin: '0 0 16px'
              }}>
                First XI — Friendlies
              </h3>
              {FRIENDLY_FIXTURES.map((f, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: '1px solid #F3F4F6',
                  gap: 10
                }}>
                  <div>
                    <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: '#374151', fontWeight: 600 }}>
                      {f.opponent}
                    </div>
                    <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
                      {f.date} · {f.time}
                    </div>
                  </div>
                  <span style={labelStyle(f.home)}>{f.home ? 'Home' : 'Away'}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── FAQs ── */}
        <div>
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 36,
            fontWeight: 800,
            color: '#2D2D2D',
            margin: '0 0 20px',
            letterSpacing: '0.03em'
          }}>
            FAQs
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 20 }}>
            {faqs.map(([title, text]) => (
              <div key={title} style={{
                background: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: 8,
                padding: 22,
                minHeight: 150
              }}>
                <h3 style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 22,
                  fontWeight: 800,
                  color: '#2D2D2D',
                  margin: '0 0 12px',
                  lineHeight: 1.1
                }}>
                  {title}
                </h3>
                <p style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 12,
                  color: '#4B5563',
                  lineHeight: 1.65,
                  margin: 0
                }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

      </section>
    </main>
  )
}
