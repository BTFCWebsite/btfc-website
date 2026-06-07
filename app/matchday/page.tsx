'use client'

const NEXT_HOME_GAME = {
  opponent: 'Fixture TBC',
  date: 'TBC — fixtures released July 2026',
  time: '15:00',
  competition: '2026/27 Season',
}

const facilities = [
  {
    icon: '🍺',
    title: 'Clubhouse Bar',
    text: 'The clubhouse bar is open before, during and after the match. A warm welcome for home and away supporters. Cash and card accepted.',
  },
  {
    icon: '🍔',
    title: 'Food & Drink',
    text: 'Hot food, snacks and drinks from the pitch-side kiosk. Open from one hour before kick-off.',
  },
  {
    icon: '♿',
    title: 'Accessibility',
    text: 'Wheelchair spaces available in the main stand. Level access from the car park. Contact us in advance if you need assistance.',
  },
  {
    icon: '📋',
    title: 'Programme',
    text: 'Official matchday programme £2 at the gate. Free digital version on the website for all season ticket holders.',
  },
  {
    icon: '🅿',
    title: 'Parking',
    text: 'Free parking in the main car park off Station Road. Overflow parking at the leisure centre — approximately 5 minutes walk.',
  },
  {
    icon: '📱',
    title: 'Season Tickets',
    text: 'Season ticket holders show their QR code at the turnstile. Save to Apple Wallet for quick and easy entry.',
  },
]

const gettingHere = [
  {
    icon: '🚗',
    title: 'By Car',
    text: 'Jessons Meadow is on London Road, Brimscombe, GL5 2SH. Free parking off Station Road. Overflow at the leisure centre (5 min walk).',
  },
  {
    icon: '🚌',
    title: 'By Bus',
    text: 'Bus routes 14 and 22 stop directly outside on London Road. Regular services from Stroud town centre. Check Traveline for timetables.',
  },
  {
    icon: '🚆',
    title: 'By Train',
    text: 'Brimscombe station is a 10-minute walk. Stroud station is served by GWR with regular services from Gloucester, Swindon and London Paddington.',
  },
  {
    icon: '🚶',
    title: 'On Foot',
    text: 'Easily walkable from Brimscombe village. Follow London Road south — the floodlights are visible from the road.',
  },
]

const h2 = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontSize: 36,
  fontWeight: 800,
  color: '#2D2D2D',
  margin: '0 0 6px',
  letterSpacing: '0.03em',
} as const

const h3 = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontSize: 22,
  fontWeight: 800,
  color: '#2D2D2D',
  margin: '0 0 10px',
  lineHeight: 1.1,
} as const

const body = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 12,
  color: '#4B5563',
  lineHeight: 1.65,
  margin: 0,
} as const

const card = {
  background: '#fff',
  border: '1px solid #E5E7EB',
  borderRadius: 8,
  padding: 24,
} as const

const subhead = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 12,
  color: '#6B7280',
  margin: '0 0 24px',
} as const

export default function MatchdayPage() {
  return (
    <main style={{ background: '#F2F2F2', minHeight: '100vh', padding: '0 0 90px' }}>
      <section style={{ maxWidth: 980, margin: '0 auto' }}>

        {/* Next Home Game Banner */}
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
          marginBottom: 44,
        }}>
          <div>
            <div style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 10,
              letterSpacing: '.12em',
              opacity: .6,
              textTransform: 'uppercase' as const,
              marginBottom: 6,
            }}>
              Next Home Game
            </div>
            <h2 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 28,
              fontWeight: 800,
              margin: '0 0 6px',
              letterSpacing: '0.03em'
            }}>
              BTFC vs {NEXT_HOME_GAME.opponent}
            </h2>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              margin: 0,
              color: 'rgba(255,255,255,.7)',
              fontSize: 13,
              lineHeight: 1.6,
            }}>
              📅 {NEXT_HOME_GAME.date} · ⏰ {NEXT_HOME_GAME.time} · 📍 Jessons Meadow · {NEXT_HOME_GAME.competition}
            </p>
          </div>
          <a href="/tickets" style={{
            background: '#1149D8',
            padding: '12px 22px',
            borderRadius: 6,
            textAlign: 'center' as const,
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: 18,
            color: '#fff',
            textDecoration: 'none',
            whiteSpace: 'nowrap' as const,
          }}>
            🎫 Season Tickets
          </a>
        </div>

        {/* Entrance Fees */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={h2}>Entrance Fees</h2>
          <p style={subhead}>Pay on the gate · First XI matches only · Cash and card accepted</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20 }}>

            {/* League & Cup */}
            <div style={card}>
              <div style={{ height: 4, background: '#1149D8', marginBottom: 20, borderRadius: 2 }} />
              <h3 style={h3}>League &amp; Cup</h3>
              {[
                { label: 'Adult', price: '£7', color: '#1149D8' },
                { label: 'Concession (65 and over)', price: '£5', color: '#1149D8' },
                { label: 'Under 16', price: 'Free', color: '#16a34a' },
              ].map((row, i, arr) => (
                <div key={row.label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid #F3F4F6' : 'none',
                }}>
                  <span style={{ ...body, color: '#374151', fontSize: 13 }}>{row.label}</span>
                  <span style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 26,
                    fontWeight: 800,
                    color: row.color,
                  }}>
                    {row.price}
                  </span>
                </div>
              ))}
              <p style={{ ...body, fontSize: 11, color: '#9CA3AF', marginTop: 14 }}>
                All other fixtures (reserves, youth) are free to attend.
              </p>
              {/* Season ticket upsell */}
              <div style={{
                background: '#F0F4FF',
                border: '1px solid #C7D6FA',
                borderRadius: 6,
                padding: '12px 14px',
                marginTop: 16,
              }}>
                <p style={{ ...body, fontSize: 11, color: '#1149D8', fontWeight: 600 }}>
                  💡 Save money — season tickets cover all First XI home league & cup games from £80.{' '}
                  <a href="/tickets" style={{ color: '#1149D8', textDecoration: 'underline' }}>Buy now →</a>
                </p>
              </div>
            </div>

            {/* Friendlies */}
            <div style={card}>
              <div style={{ height: 4, background: '#6B7280', marginBottom: 20, borderRadius: 2 }} />
              <h3 style={h3}>Pre-Season Friendlies</h3>
              {[
                { label: 'Everyone', price: '£3', color: '#1149D8' },
              ].map((row, i, arr) => (
                <div key={row.label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid #F3F4F6' : 'none',
                }}>
                  <span style={{ ...body, color: '#374151', fontSize: 13 }}>{row.label}</span>
                  <span style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 26,
                    fontWeight: 800,
                    color: row.color,
                  }}>
                    {row.price}
                  </span>
                </div>
              ))}
              <p style={{ ...body, fontSize: 11, color: '#9CA3AF', marginTop: 14 }}>
                Flat rate for all supporters including under 16s. Season tickets do not cover friendly fixtures.
              </p>
            </div>

          </div>
        </div>

        {/* Ground & Facilities */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={h2}>Ground & Facilities</h2>
          <p style={subhead}>Jessons Meadow — what to expect on matchday</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20 }}>
            {facilities.map(f => (
              <div key={f.title} style={card}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
                <h3 style={h3}>{f.title}</h3>
                <p style={body}>{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Getting Here */}
        <div style={{ marginBottom: 44 }}>
          <h2 style={h2}>Getting Here</h2>
          <p style={subhead}>Jessons Meadow · London Road · Brimscombe · Stroud · GL5 2SH</p>

          {/* Map */}
          <div style={{ borderRadius: 8, overflow: 'hidden', marginBottom: 20, border: '1px solid #E5E7EB' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2474.3!2d-2.147!3d51.717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487108b3b3b3b3b3%3A0x0!2sBrimscombe+%26+Thrupp+FC!5e0!3m2!1sen!2suk!4v1"
              width="100%"
              height="280"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Jessons Meadow location"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20 }}>
            {gettingHere.map(g => (
              <div key={g.title} style={card}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{g.icon}</div>
                <h3 style={h3}>{g.title}</h3>
                <p style={body}>{g.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Address bar */}
        <div style={{
          ...card,
          background: '#041B5F',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20,
        }}>
          <div>
            <h3 style={{ ...h3, color: '#fff', fontSize: 20, margin: '0 0 8px' }}>🏟 Jessons Meadow</h3>
            <p style={{ ...body, color: 'rgba(255,255,255,.7)', fontSize: 13 }}>
              London Road · Brimscombe · Stroud · Gloucestershire · GL5 2SH
            </p>
          </div>
          <a
            href="https://maps.google.com/?q=Brimscombe+and+Thrupp+FC,+London+Road,+Brimscombe,+GL5+2SH"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#1149D8',
              padding: '10px 20px',
              borderRadius: 6,
              color: '#fff',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: 16,
              textDecoration: 'none',
              whiteSpace: 'nowrap' as const,
            }}
          >
            Open in Maps →
          </a>
        </div>

      </section>
    </main>
  )
}
