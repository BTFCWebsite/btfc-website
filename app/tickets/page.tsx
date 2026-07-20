'use client'

const faqs = [
  ['Can I pay in instalments?', 'Not currently — season tickets must be paid in full at time of purchase.'],
  ['How do I get my ticket?', 'If you use an iPhone, you can add your digital season ticket to Apple Wallet. If you use Android, or would simply prefer a PDF, your ticket will be emailed to you. Both versions contain the QR code needed for entry.'],
  ['What is included?', 'Your season ticket covers all First XI home league and club cup fixtures throughout the 2026/27 season. Due to FA requirements, FA Vase matches are excluded and must be paid for separately on the day.'],
  ['Is my payment secure?', 'Yes. Payments are processed securely by Stripe.'],
  ['Do under 16s pay?', 'Under 16s are admitted free to all First XI matches. Proof of age may be requested.'],
  ['What about friendlies?', 'Pre-season and friendly matches are £3 for all. Season tickets do not cover friendly fixtures.'],
  ['Cash or card?', 'We accept both cash and card at the gate on matchday.'],
  ['When does the gate open?', 'The turnstiles open approximately one hour before kick-off.'],
]

export default function TicketsPage() {
  return (
    <main style={{ background: '#F2F2F2', minHeight: '100vh', padding: '0 0 90px' }}>
      <section style={{ maxWidth: 980, margin: '0 auto', padding: '52px 24px' }}>

        <div style={{
          background: '#041B5F',
          borderRadius: 8,
          padding: '32px 36px',
          color: '#fff',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 32,
          alignItems: 'center',
          marginBottom: 28,
        }}>
          <div>
            <span style={{ display: 'inline-block', background: '#1149D8', color: '#fff', padding: '3px 10px', borderRadius: 4, fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>
              Now On Sale
            </span>

            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 34, fontWeight: 800, margin: '0 0 10px', letterSpacing: '0.03em', lineHeight: 1 }}>
              2026/27 Season Tickets
            </h2>

            <p style={{ fontFamily: "'Montserrat', sans-serif", margin: '0 0 20px', color: 'rgba(255,255,255,.7)', fontSize: 13, lineHeight: 1.7 }}>
              All First XI home league &amp; club cup games included, excluding FA Vase ties.<br />
              Digital QR season ticket — add it to Apple Wallet on iPhone, or receive it as a PDF by email.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: 12,
              maxWidth: 420,
            }}>
              {[['Adult', '£89'], ['Concession', '£69'], ['Under 16', 'Free']].map(([label, price]) => (
                <div key={label} style={{
                  background: 'rgba(255,255,255,.08)',
                  border: '1px solid rgba(255,255,255,.15)',
                  borderRadius: 6,
                  padding: '10px 16px',
                  textAlign: 'center',
                  width: '100%',
                  maxWidth: 140,
                  margin: '0 auto',
                }}>
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: 'rgba(255,255,255,.55)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                    {label}
                  </div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 26, color: price === 'Free' ? '#22C55E' : '#fff' }}>
                    {price}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src="/matchday/btfc_apple_pass_mock.png" alt="BTFC Season Ticket Apple Wallet Pass" style={{ width: '100%', maxWidth: 220, borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,.4)' }} />
          </div>
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid #E5E7EB',
          borderRadius: 8,
          padding: 28,
          marginBottom: 52,
        }}>
          <div style={{ height: 4, background: '#1149D8', marginBottom: 20, borderRadius: 2 }} />

          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 800, color: '#2D2D2D', margin: '0 0 6px', letterSpacing: '0.03em' }}>
            Buy Your Season Ticket
          </h2>

          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: '#6B7280', margin: '0 0 20px' }}>
            Select your ticket type below and complete your purchase.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: 12,
              marginBottom: 24,
              padding: 18,
              background: '#EEF4FF',
              border: '1px solid #BFDBFE',
              borderLeft: '5px solid #1149D8',
              borderRadius: 8,
            }}
          >
            <div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 19, fontWeight: 800, color: '#041B5F', marginBottom: 5 }}>
                🍎 Using an iPhone?
              </div>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: '#374151', lineHeight: 1.6, margin: 0 }}>
                You can add your digital season ticket to <strong>Apple Wallet</strong> for quick and easy access at the turnstile.
              </p>
            </div>

            <div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 19, fontWeight: 800, color: '#041B5F', marginBottom: 5 }}>
                📧 Using Android or prefer a PDF?
              </div>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: '#374151', lineHeight: 1.6, margin: 0 }}>
                We will email your season ticket to you as a <strong>PDF</strong>. Simply open it on your phone and show the QR code at the gate.
              </p>
            </div>

            <p style={{ gridColumn: '1 / -1', fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: '#6B7280', lineHeight: 1.5, margin: 0 }}>
              Both formats contain the same QR code and are equally valid for matchday entry.
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '10px 0 4px' }}>
            <a
              href="https://www.tickettailor.com/all-tickets/brimscombeandthruppfc/?ref=website_widget"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: '#1149D8',
                color: '#fff',
                padding: '15px 30px',
                borderRadius: 7,
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: '.05em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              🎟 Buy Season Tickets
            </a>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: '#6B7280', lineHeight: 1.6, margin: '12px 0 0' }}>
              Opens the secure Ticket Tailor checkout in a new tab, with the full screen available throughout your purchase.
            </p>
          </div>
        </div>

        <div style={{ marginBottom: 52 }}>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 36, fontWeight: 800, color: '#2D2D2D', margin: '0 0 6px', letterSpacing: '0.03em' }}>
            Matchday Admission
          </h2>

          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: '#6B7280', margin: '0 0 20px' }}>
            Pay on the gate — First XI matches only. All other fixtures are free to attend.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
            marginBottom: 20,
          }}>
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: 24, width: '100%', maxWidth: 420, margin: '0 auto' }}>
              <div style={{ height: 4, background: '#1149D8', marginBottom: 16, borderRadius: 2 }} />

              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, color: '#2D2D2D', margin: '0 0 16px' }}>
                League &amp; Cup <span style={{ fontSize: 15, color: '#6B7280' }}>(except FA Vase)</span>
              </h3>

              {[
                { label: 'Adult', price: '£7' },
                { label: 'Concession (65+)', price: '£5' },
                { label: 'Under 16', price: 'Free' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: '#374151' }}>
                    {row.label}
                  </span>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, color: row.price === 'Free' ? '#16a34a' : '#1149D8' }}>
                    {row.price}
                  </span>
                </div>
              ))}

              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: '#6B7280', lineHeight: 1.6, margin: '14px 0 0' }}>
                FA Vase ties are excluded from season tickets and standard cup admission due to FA requirements. Admission will be charged separately on the day.
              </p>

              <div style={{ marginTop: 16, background: '#F0FDF4', borderRadius: 8, border: '2px solid #86EFAC', padding: '16px 18px' }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, color: '#16a34a', marginBottom: 6 }}>
                  🆓 Free Admission
                </div>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: '#15803d', lineHeight: 1.6, margin: 0 }}>
                  All <strong>Reserves</strong> and <strong>Under 17s</strong> home fixtures are completely free to attend — no ticket needed, just turn up and enjoy the football.
                </p>
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: 24, width: '100%', maxWidth: 420, margin: '0 auto' }}>
              <div style={{ height: 4, background: '#6B7280', marginBottom: 16, borderRadius: 2 }} />

              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, color: '#2D2D2D', margin: '0 0 16px' }}>
                Friendlies
              </h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: '#374151' }}>
                  Everyone
                </span>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, color: '#1149D8' }}>
                  £3
                </span>
              </div>

              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: '#9CA3AF', margin: '16px 0 0' }}>
                Season tickets do not cover friendly fixtures.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 36, fontWeight: 800, color: '#2D2D2D', margin: '0 0 20px', letterSpacing: '0.03em' }}>
            FAQs
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20,
          }}>
            {faqs.map(([title, text]) => (
              <div key={title} style={{
                background: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: 8,
                padding: 22,
                minHeight: 150,
                width: '100%',
                maxWidth: 360,
                margin: '0 auto',
              }}>
                <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, color: '#2D2D2D', margin: '0 0 12px', lineHeight: 1.1 }}>
                  {title}
                </h3>

                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: '#4B5563', lineHeight: 1.65, margin: 0 }}>
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
