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
  { role: 'Club Secretary', name: 'Clive Linehan' },
  { role: 'First Team Manager', name: 'Tim Bond' },
  { role: 'Welfare Officer', name: 'Neil Long' },
]

const clubFacts = [
  { label: 'Founded', value: '1886' },
  { label: 'Nickname', value: 'The Lilywhites' },
  { label: 'Ground', value: 'Jessons Meadow' },
  { label: 'Capacity', value: '1,200' },
  { label: 'League', value: 'Hellenic Division One' },
  { label: 'County', value: 'Gloucestershire' },
]



export default function ClubPage() {
  return (
    <main style={{ background: '#F2F2F2', minHeight: '100vh', padding: '52px 24px 90px' }}>
      <section style={{ maxWidth: 980, margin: '0 auto' }}>

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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20 }}>
            <div style={card}>
              <div style={{ height: 4, background: '#1149D8', marginBottom: 20, borderRadius: 2 }} />
              <h3 style={h3}>Brimscombe FC — Est. 1886</h3>
              <p style={{ ...body, marginBottom: 12 }}>
                Brimscombe Football Club was established in 1886. They were founding members of the
                Mid-Gloucestershire League in 1894 and played their first ever game on 29th September.
                The club switched to the Stroud & District League in 1902 and were its inaugural champions,
                going on to win the title again in 1906/07, 1907/08 and 1912/13.
              </p>
              <p style={{ ...body, marginBottom: 12 }}>
                After World War I, Brimscombe joined the North Gloucestershire League and were founding
                members of the Gloucestershire Northern Senior League in 1922 — becoming its first
                ever champions. Further titles followed in 1930/31 and 1947/48.
              </p>
              <p style={body}>
                The club joined the Gloucestershire County League in 1968 but left after the 1972/73
                season. Shortly after, Brimscombe FC merged with local side Thrupp FC to form
                Brimscombe & Thrupp FC.
              </p>
            </div>
            <div style={card}>
              <div style={{ height: 4, background: '#1149D8', marginBottom: 20, borderRadius: 2 }} />
              <h3 style={h3}>Brimscombe & Thrupp FC</h3>
              <p style={{ ...body, marginBottom: 12 }}>
                The newly formed club rejoined the County League but dropped out again in 1988/89.
                Returning to the Gloucestershire Northern Senior League, they finished as Division 1
                runners-up in 2008/09 before winning the County League in 2010/11 — earning promotion
                to the Hellenic League Division 1 West.
              </p>
              <p style={{ ...body, marginBottom: 12 }}>
                The Hellenic League Division 1 West title followed in 2012/13, securing promotion to
                the Premier Division. The 2013/14 season brought both the Floodlit Cup and Supplementary
                Cup. In 2018 the Lilywhites beat Bitton 3–1 to win the Gloucestershire Challenge Trophy.
              </p>
              <p style={body}>
                The club remained in the Premier Division for several seasons, narrowly missing
                promotion in 2018/19 after finishing second. Following a difficult 2024/25 campaign,
                BTFC now compete in Hellenic League Division One with ambitions to return to the
                higher levels of the pyramid.
              </p>
            </div>
          </div>
        </div>

        {/* The Ground */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={h2}>Jessons Meadow</h2>
          <p style={subhead}>Home of Brimscombe & Thrupp FC since 1886</p>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
            <div style={card}>
              <div style={{ height: 4, background: '#1149D8', marginBottom: 20, borderRadius: 2 }} />
              <p style={{ ...body, marginBottom: 14 }}>
                Jessons Meadow has been the home of Brimscombe & Thrupp FC since the
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

        {/* Honours */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={h2}>Club Honours</h2>
          <p style={subhead}>A proud record of achievement — 1886 to present</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
            {[
              {
                era: 'Hellenic League',
                honours: [
                  '🏆 Division 1 West Champions 2012/13',
                  '🏆 Floodlit Cup Winners 2013/14',
                  '🏆 Supplementary Cup Winners 2013/14',
                  '🥈 Premier Division Runners-up 2018/19',
                  '🥈 Floodlit Cup Runners-up 2015/16',
                ],
              },
              {
                era: 'County & Regional',
                honours: [
                  '🏆 Gloucestershire County League 2010/11',
                  '🏆 Gloucestershire FA Challenge Trophy 2017/18',
                  '🥈 GFA Challenge Trophy Runners-up 2021/22',
                  '🏆 Berkeley Hospital Cup Premier 1981/82',
                  '🏆 Gloucestershire Junior Challenge Cup 1981/82',
                  '🏆 Harry Greening Memorial Trophy 2013/14',
                ],
              },
              {
                era: 'Northern Senior League',
                honours: [
                  '🏆 Division 1 Champions 1922/23, 1947/48, 1984/85',
                  '🥈 Division 1 Runners-up 1946/47, 2008/09',
                  '🏆 Division 2 Champions 1981/82, 2004/05',
                ],
              },
              {
                era: 'Stroud & District League Div 1',
                honours: [
                  '🏆 Champions 1902/03, 1906/07, 1907/08, 1912/13, 1950/51',
                  '🥈 Runners-up 1903/04, 1904/05, 1910/11, 1911/12, 1913/14, 1921/22',
                ],
              },
              {
                era: 'Stroud & District League Div 2',
                honours: [
                  '🏆 Champions 1933/34, 1954/55, 1955/56, 1996/97',
                  '🥈 Runners-up 1928/29, 1938/39, 1960/61, 1975/76, 1983/84, 1987/88, 1990/91',
                ],
              },
              {
                era: 'Stroud & District Other',
                honours: [
                  '🏆 Division 4 Champions 1974/75',
                  '🥈 Division 3 Runners-up 1975/76, 1983/84, 2004/05',
                  '🥈 Auxiliary Cup Runners-up 1934/35',
                  '🥈 Charity Cup Runners-up 2008/09',
                ],
              },
            ].map(section => (
              <div key={section.era} style={card}>
                <div style={{ height: 4, background: '#1149D8', marginBottom: 14, borderRadius: 2 }} />
                <h3 style={{ ...h3, fontSize: 18, marginBottom: 12 }}>{section.era}</h3>
                {section.honours.map(h => (
                  <p key={h} style={{ ...body, fontSize: 11, marginBottom: 6 }}>{h}</p>
                ))}
              </div>
            ))}
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
                BTFC Under 17s will compete for the first time in the 2026/27 season — our inaugural youth team, managed by Clive Boulton. The U17s provide a pathway for young local players to develop their football and progress towards the first team.
              </p>
              <span style={{
                display: 'inline-block',
                background: '#F0F4FF',
                border: '1px solid #C7D6FA',
                borderRadius: 4,
                padding: '4px 12px',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                color: '#1149D8',
              }}>
                ⚽ Under 17s — Inaugural Season 2026/27
              </span>
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
