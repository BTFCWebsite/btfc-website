'use client'

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

const officials = [
  { role: 'Chairman', name: 'Neil Long' },
  { role: 'Vice Chairman', name: 'Nick Wright' },
  { role: 'Club Secretary', name: 'Sarah Mills' },
  { role: 'First Team Manager', name: 'Tim Bond' },
  { role: 'Welfare Officer', name: 'Mike Hill' },
]

const clubFacts = [
  { label: 'Founded', value: '1886' },
  { label: 'Nickname', value: 'The Lilywhites' },
  { label: 'Ground', value: 'The Jessons Meadow' },
  { label: 'Capacity', value: '1,200' },
  { label: 'League', value: 'Hellenic Division One' },
  { label: 'County', value: 'Gloucestershire' },
]

const youthAges = ['U6', 'U7', 'U8', 'U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U18']

export default function ClubPage() {
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
            The Club
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", color: '#6B7280', margin: 0, fontSize: 14 }}>
            Brimscombe & Thrupp FC — Est. 1886
          </p>
          <div style={{ width: 52, height: 4, background: '#1149D8', margin: '14px auto 0' }} />
        </div>

        {/* Hero banner */}
        <div style={{
          background: '#041B5F',
          borderRadius: 8,
          padding: '28px 32px',
          color: '#fff',
          marginBottom: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 28,
          flexWrap: 'wrap',
        }}>
          <div style={{ maxWidth: 580 }}>
            <div style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 10,
              letterSpacing: '.12em',
              opacity: .6,
              textTransform: 'uppercase' as const,
              marginBottom: 8,
            }}>
              Est. 1886 · The Lilywhites
            </div>
            <h2 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 32,
              fontWeight: 800,
              margin: '0 0 10px',
              letterSpacing: '0.03em',
            }}>
              Brimscombe & Thrupp FC
            </h2>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 13,
              color: 'rgba(255,255,255,.75)',
              lineHeight: 1.7,
              margin: 0,
            }}>
              One of Gloucestershire's oldest and most community-rooted football clubs.
              Based in the beautiful Cotswold valley, The Lilywhites have been part of the
              fabric of Brimscombe and Thrupp since 1886.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {clubFacts.map(f => (
              <div key={f.label} style={{
                background: 'rgba(255,255,255,.08)',
                borderRadius: 6,
                padding: '10px 14px',
                minWidth: 110,
              }}>
                <div style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 9,
                  letterSpacing: '.1em',
                  opacity: .6,
                  textTransform: 'uppercase' as const,
                  marginBottom: 4,
                }}>
                  {f.label}
                </div>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 18,
                  fontWeight: 800,
                }}>
                  {f.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Club History */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={h2}>Club History</h2>
          <p style={subhead}>Over 130 years in the heart of the Cotswold valley</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={card}>
              <div style={{ height: 4, background: '#1149D8', marginBottom: 20, borderRadius: 2 }} />
              <h3 style={h3}>Origins</h3>
              <p style={{ ...body, marginBottom: 14 }}>
                Brimscombe FC were formed in 1886 and became founder members of the
                Mid-Gloucestershire League in 1894 — one of the oldest league competitions
                in the county. The club has deep roots in the local industrial community,
                originally drawing its players from the mills and factories of the Stroud valleys.
              </p>
              <p style={body}>
                Thrupp FC, formed separately, eventually merged with Brimscombe to create
                the combined Brimscombe & Thrupp FC that supporters know today — bringing
                together two proud local football traditions under one banner.
              </p>
            </div>
            <div style={card}>
              <div style={{ height: 4, background: '#1149D8', marginBottom: 20, borderRadius: 2 }} />
              <h3 style={h3}>Recent History</h3>
              <p style={{ ...body, marginBottom: 14 }}>
                Under chairman Neil Long and the Long-Baker family, the club enjoyed a
                remarkable period of sustained success — winning four promotions in six years
                and claiming the Hellenic League Division One West title in 2012/13 to reach
                the Premier Division.
              </p>
              <p style={body}>
                The club is now rebuilding with ambition and purpose in Hellenic League
                Division One, with a clear aim of returning to the higher levels of the
                non-league pyramid. The Jessons Meadow has been renamed in honour of the
                club's ground sponsors.
              </p>
            </div>
          </div>
        </div>

        {/* The Ground */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={h2}>The Jessons Meadow</h2>
          <p style={subhead}>Home of Brimscombe & Thrupp FC since 1886</p>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
            <div style={card}>
              <div style={{ height: 4, background: '#1149D8', marginBottom: 20, borderRadius: 2 }} />
              <p style={{ ...body, marginBottom: 14 }}>
                The Jessons Meadow has been the home of Brimscombe & Thrupp FC since the
                club's foundation in 1886. Set in the beautiful Cotswold valley between
                Stroud and Chalford, the ground holds 1,200 supporters with covered seating
                in the main stand.
              </p>
              <p style={{ ...body, marginBottom: 14 }}>
                The ground is named in recognition of Jessons Real Estate, the club's
                official ground sponsor. It features a licensed clubhouse bar, pitch-side
                kiosk, and floodlights for evening fixtures.
              </p>
              <p style={body}>
                The setting — with the Cotswold hills as a backdrop — makes The Jessons
                Meadow one of the most picturesque non-league grounds in Gloucestershire.
              </p>
            </div>
            <div style={{ display: 'grid', gap: 16 }}>
              {[
                { icon: '🏟', label: 'Capacity', value: '1,200' },
                { icon: '💡', label: 'Floodlights', value: 'Yes' },
                { icon: '🍺', label: 'Licensed Bar', value: 'Yes' },
                { icon: '♿', label: 'Accessible', value: 'Yes' },
                { icon: '🅿', label: 'Free Parking', value: 'Yes' },
              ].map(f => (
                <div key={f.label} style={{
                  ...card,
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{f.icon}</span>
                    <span style={{ ...body, color: '#374151', fontSize: 13 }}>{f.label}</span>
                  </div>
                  <span style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 18,
                    fontWeight: 800,
                    color: '#1149D8',
                  }}>
                    {f.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Club Officials */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={h2}>Club Officials</h2>
          <p style={subhead}>The people who run Brimscombe & Thrupp FC</p>
          <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
            <div style={{ height: 4, background: '#1149D8' }} />
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {officials.map((o, i) => (
                  <tr key={o.role} style={{
                    borderBottom: i < officials.length - 1 ? '1px solid #F3F4F6' : 'none',
                    background: i % 2 === 0 ? '#fff' : '#FAFAFA',
                  }}>
                    <td style={{
                      ...body,
                      padding: '14px 24px',
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#9CA3AF',
                      letterSpacing: '.08em',
                      textTransform: 'uppercase' as const,
                      width: '40%',
                    }}>
                      {o.role}
                    </td>
                    <td style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 20,
                      fontWeight: 800,
                      color: '#2D2D2D',
                      padding: '14px 24px',
                    }}>
                      {o.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Community */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={h2}>Community & Youth</h2>
          <p style={subhead}>Football for everyone in Brimscombe, Thrupp and the wider Stroud area</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20 }}>
            <div style={card}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>👶</div>
              <h3 style={h3}>Youth Football</h3>
              <p style={{ ...body, marginBottom: 14 }}>
                We run youth teams from Under 6s through to Under 18s, providing a pathway
                for young players in the area to develop their football from grassroots
                to first team level.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {youthAges.map(a => (
                  <span key={a} style={{
                    background: '#F0F4FF',
                    border: '1px solid #C7D6FA',
                    borderRadius: 4,
                    padding: '3px 8px',
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#1149D8',
                  }}>
                    {a}
                  </span>
                ))}
              </div>
            </div>
            <div style={card}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>🚶</div>
              <h3 style={h3}>Walking Football</h3>
              <p style={body}>
                We offer walking football for over 50s — a slower-paced version of the
                game that keeps players active and connected to the club. All welcome,
                no experience necessary. Contact us to find out more.
              </p>
            </div>
            <div style={card}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>🤝</div>
              <h3 style={h3}>Get Involved</h3>
              <p style={{ ...body, marginBottom: 14 }}>
                We're always looking for volunteers, coaches, officials and supporters.
                Whether you want to help on matchday, behind the scenes or in a coaching
                capacity — there's a role for you at BTFC.
              </p>
              <a href="/contact" style={{
                display: 'inline-block',
                background: '#1149D8',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: 6,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
                fontSize: 15,
                textDecoration: 'none',
              }}>
                Contact Us →
              </a>
            </div>
          </div>
        </div>

        {/* Policies */}
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
            <h3 style={{ ...h3, color: '#fff', fontSize: 20, margin: '0 0 8px' }}>📄 Club Policies</h3>
            <p style={{ ...body, color: 'rgba(255,255,255,.7)', fontSize: 13 }}>
              Safeguarding, privacy and equal opportunities policies are available on request from the club secretary.
            </p>
          </div>
          <a href="/contact" style={{
            background: '#1149D8',
            padding: '10px 20px',
            borderRadius: 6,
            color: '#fff',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: 16,
            textDecoration: 'none',
            whiteSpace: 'nowrap' as const,
          }}>
            Request Policies →
          </a>
        </div>

      </section>
    </main>
  )
}
