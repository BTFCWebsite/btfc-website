'use client'

const NEXT_HOME_GAME = {
  opponent: 'Fixture TBC',
  date: 'TBC — fixtures released July 2026',
  time: '15:00',
  competition: '2026/27 Season',
}

const gettingHere = [
  {
    icon: '🚗',
    title: 'By Car',
    text: 'The Jessons Meadow is located on London Road, Brimscombe, Stroud, GL5 2SH. Free parking is available in the main car park off Station Road. Overflow parking at the leisure centre — approximately 5 minutes walk.',
  },
  {
    icon: '🚌',
    title: 'By Bus',
    text: 'Bus routes 14 and 22 stop directly outside the ground on London Road. Services run regularly from Stroud town centre. Check Traveline for timetables.',
  },
  {
    icon: '🚆',
    title: 'By Train',
    text: "Brimscombe station is approximately a 10-minute walk from the ground. Stroud station is served by GWR with regular services from Gloucester, Swindon and London Paddington.",
  },
  {
    icon: '🚶',
    title: 'On Foot',
    text: 'The ground is easily walkable from Brimscombe village centre. Follow London Road south — the floodlights are visible from the road.',
  },
]

const facilities = [
  {
    icon: '🍔',
    title: 'Food & Drink',
    text: 'Hot food, snacks and drinks available from the clubhouse and pitch-side kiosk. Open from one hour before kick-off. Licensed bar in the clubhouse.',
  },
  {
    icon: '🍺',
    title: 'Clubhouse Bar',
    text: 'The clubhouse bar is open before, during and after the match. A warm welcome for home and away supporters alike. Cash and card accepted.',
  },
  {
    icon: '♿',
    title: 'Accessibility',
    text: 'Wheelchair spaces are available in the main stand. Level access from the car park. Please contact us in advance if you require any additional assistance.',
  },
  {
    icon: '📋',
    title: 'Matchday Programme',
    text: 'Official matchday programme £2. Available at the gate. Free digital version available on the website for all season ticket holders.',
  },
  {
    icon: '🎫',
    title: 'Tickets',
    text: 'Match tickets available on the gate — cash and card accepted. Season ticket holders show their QR code at the turnstile. No pre-booking required.',
  },
  {
    icon: '🅿',
    title: 'Parking',
    text: 'Free parking in the main car park off Station Road. Please be considerate of local residents when parking on nearby streets.',
  },
]

const admission = [
  { label: 'Adult', league: '£7', friendly: '£3' },
  { label: 'Concession (65+)', league: '£5', friendly: '£3' },
  { label: 'Under 16', league: 'Free', friendly: '£3' },
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
            Matchday
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", color: '#6B7280', margin: 0, fontSize: 14 }}>
            Everything you need for matchday at The Jessons Meadow
          </p>
          <div style={{ width: 52, height: 4, background: '#1149D8', margin: '14px auto 0' }} />
        </div>

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
              textTransform: 'uppercase',
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
              📅 {NEXT_HOME_GAME.date} · ⏰ {NEXT_HOME_GAME.time} · 📍 The Jessons Meadow · {NEXT_HOME_GAME.competition}
            </p>
          </div>
          <a href="/tickets" style={{
            background: '#1149D8',
            padding: '12px 22px',
            borderRadius: 6,
            textAlign: 'center',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: 18,
            color: '#fff',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}>
            🎫 Get Tickets
          </a>
        </div>

        {/* Admission */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={h2}>Admission Prices</h2>
          <p style={subhead}>Pay on the gate — First XI matches only. All other fixtures are free to attend.</p>
          <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
            <div style={{ height: 4, background: '#1149D8' }} />
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  <th style={{ ...body, padding: '12px 20px', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Ticket Type</th>
                  <th style={{ ...body, padding: '12px 20px', textAlign: 'center', fontWeight: 700, color: '#374151' }}>League &amp; Cup</th>
                  <th style={{ ...body, padding: '12px 20px', textAlign: 'center', fontWeight: 700, color: '#374151' }}>Friendlies</th>
                </tr>
              </thead>
              <tbody>
                {admission.map((row, i) => (
                  <tr key={row.label} style={{ borderTop: '1px solid #F3F4F6', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                    <td style={{ ...body, padding: '14px 20px', color: '#374151' }}>{row.label}</td>
                    <td style={{
                      padding: '14px 20px',
                      textAlign: 'center',
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 22,
                      fontWeight: 800,
                      color: row.league === 'Free' ? '#16a34a' : '#1149D8',
                    }}>
                      {row.league}
                    </td>
                    <td style={{
                      padding: '14px 20px',
                      textAlign: 'center',
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 22,
                      fontWeight: 800,
                      color: '#1149D8',
                    }}>
                      {row.friendly}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '12px 20px', background: '#F9FAFB', borderTop: '1px solid #F3F4F6' }}>
              <p style={{ ...body, fontSize: 11, color: '#9CA3AF', margin: 0 }}>
                Cash and card accepted at the gate. Season ticket holders show QR code. Under 16s free for league &amp; cup only — £3 for friendlies.
              </p>
            </div>
          </div>
        </div>

        {/* Ground & Facilities */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={h2}>The Jessons Meadow</h2>
          <p style={subhead}>Ground facilities and matchday information</p>
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
        <div style={{ marginBottom: 52 }}>
          <h2 style={h2}>Getting Here</h2>
          <p style={subhead}>The Jessons Meadow · London Road · Brimscombe · Stroud · GL5 2SH</p>

          {/* Map embed */}
          <div style={{ borderRadius: 8, overflow: 'hidden', marginBottom: 20, border: '1px solid #E5E7EB' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2474.3!2d-2.147!3d51.717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487108b3b3b3b3b3%3A0x0!2sBrimscombe+%26+Thrupp+FC!5e0!3m2!1sen!2suk!4v1"
              width="100%"
              height="280"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="The Jessons Meadow location"
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

        {/* Ground address card */}
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
            <h3 style={{ ...h3, color: '#fff', fontSize: 20, margin: '0 0 8px' }}>🏟 The Jessons Meadow</h3>
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
              whiteSpace: 'nowrap',
            }}
          >
            Open in Maps →
          </a>
        </div>

      </section>
    </main>
  )
}
