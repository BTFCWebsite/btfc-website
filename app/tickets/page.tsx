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
  return (
    <main style={{ background: '#F2F2F2', minHeight: '100vh', padding: '0 0 90px' }}>
      <section style={{ maxWidth: 980, margin: '0 auto', padding: '52px 24px' }}>

        {/* Page Title */}

        {/* ── SEASON TICKET PROMO ── */}
        <div style={{
          background: '#041B5F',
          borderRadius: 8,
          padding: '32px 36px',
          color: '#fff',
          display: 'grid',
          gridTemplateColumns: '1fr 200px',
          gap: 32,
          alignItems: 'center',
          marginBottom: 28,
        }}>
          <div>
            <span style={{ display: 'inline-block', background: '#1149D8', color: '#fff', padding: '3px 10px', borderRadius: 4, fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' as const, marginBottom: 12 }}>Now On Sale</span>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 34, fontWeight: 800, margin: '0 0 10px', letterSpacing: '0.03em', lineHeight: 1 }}>
              2026/27 Season Tickets
            </h2>
            <p style={{ fontFamily: "'Montserrat', sans-serif", margin: '0 0 20px', color: 'rgba(255,255,255,.7)', fontSize: 13, lineHeight: 1.7 }}>
              All First XI home league & cup games included.<br />
              Digital QR ticket delivered instantly by email — save to Apple Wallet for easy matchday entry.
            </p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' as const }}>
              {[['Adult', '£100'], ['Concession', '£80']].map(([label, price]) => (
                <div key={label} style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 6, padding: '10px 16px', textAlign: 'center' as const }}>
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: 'rgba(255,255,255,.55)', letterSpacing: '.1em', textTransform: 'uppercase' as const }}>{label}</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 26, color: '#fff' }}>{price}</div>
                </div>
              ))}
              <div style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 6, padding: '10px 16px', textAlign: 'center' as const }}>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: 'rgba(255,255,255,.55)', letterSpacing: '.1em', textTransform: 'uppercase' as const }}>Under 16</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 26, color: '#22C55E' }}>Free</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src="/matchday/btfc_apple_pass_mock.png" alt="BTFC Season Ticket Apple Wallet Pass" style={{ width: 190, borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,.4)' }} />
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
          <iframe
            src="https://www.tickettailor.com/all-tickets/brimscombeandthruppfc/?ref=website_widget"
            width="100%"
            height="500"
            frameBorder="0"
            style={{ border: 'none', borderRadius: 8 }}
            title="BTFC Season Tickets"
          />
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
              <div style={{ marginTop: 16, background: '#F0FDF4', borderRadius: 8, border: '2px solid #86EFAC', padding: '16px 18px' }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, color: '#16a34a', marginBottom: 6 }}>
                  🆓 Free Admission
                </div>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: '#15803d', lineHeight: 1.6, margin: 0 }}>
                  All <strong>Reserves</strong> and <strong>Under 17s</strong> home fixtures are completely free to attend — no ticket needed, just turn up and enjoy the football.
                </p>
              </div>
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
