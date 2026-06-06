'use client'
import { useEffect } from 'react'

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

  const faqs = [
    ['Can I pay in instalments?', 'Not currently — season tickets must be paid in full at time of purchase.'],
    ['How do I get my ticket?', 'After payment you will receive your digital season ticket by email with a QR code. Save it to Apple Wallet or show it on your phone at the gate.'],
    ['What is included?', 'Your season ticket covers all First Team home league and cup fixtures, plus a free online matchday programme.'],
    ['Is my payment secure?', 'Yes. Payments are processed securely by Stripe.'],
  ]

  return (
    <main style={{ background: '#F2F2F2', minHeight: '100vh', padding: '90px 24px 90px' }}>
      <section style={{ maxWidth: 980, margin: '0 auto' }}>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 42 }}>
          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 52,
            fontWeight: 800,
            color: '#2D2D2D',
            margin: '0 0 8px',
            letterSpacing: '0.04em'
          }}>
            Season Tickets
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", color: '#6B7280', margin: 0, fontSize: 14 }}>
            Secure your seat for the 2026/27 season
          </p>
          <div style={{ width: 52, height: 4, background: '#1149D8', margin: '14px auto 0' }} />
        </div>

        {/* Banner */}
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
          marginBottom: 44
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
              Adult £100 · Concession £80 · League and cup games included · Free online programme · Digital QR ticket delivered by email
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

        {/* Ticket Tailor Widget */}
        <div style={{
          background: '#fff',
          border: '1px solid #E5E7EB',
          borderRadius: 8,
          padding: 28,
          marginBottom: 44
        }}>
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 28,
            fontWeight: 800,
            color: '#2D2D2D',
            margin: '0 0 20px',
            letterSpacing: '0.03em'
          }}>
            Buy Your Season Ticket
          </h2>
          <div id="tt-widget-container" style={{ minHeight: 100 }}>
            <noscript>
              <a
                href="https://www.tickettailor.com/all-tickets/brimscombeandthruppfc/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#1149D8' }}
              >
                Click here to buy tickets
              </a>
            </noscript>
          </div>
        </div>

        {/* FAQs */}
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
                textAlign: 'justify',
                margin: 0
              }}>
                {text}
              </p>
            </div>
          ))}
        </div>

      </section>
    </main>
  )
}
