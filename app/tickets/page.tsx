'use client'
import { useState } from 'react'

type Plan = 'full' | 'split' | 'matchday'

export default function TicketsPage() {
  const [plan, setPlan] = useState<Plan>('full')

  const plans = {
    full: {
      title: 'Pay in Full',
      price: '£85',
      subtitle: 'Best value season ticket option',
      text: 'Secure your place at The Meadow for the full 2026/27 season with one simple payment. This option gives supporters the easiest way to back the club and enjoy regular First Team football throughout the campaign.',
      bullets: [
        'Covers all First Team home league matches',
        'Best overall value for regular supporters',
        'Simple one-off payment',
        'Helps the club plan income ahead of the season',
      ],
      button: 'Buy Season Ticket',
    },
    split: {
      title: 'Payment Plan',
      price: '£45 + £40',
      subtitle: 'Spread the cost across two payments',
      text: 'The payment plan is designed to make season tickets more manageable while still giving supporters the same access and value. The first payment secures the ticket, with the balance paid later in the season.',
      bullets: [
        'Same season ticket benefits',
        'Initial payment secures your place',
        'Balance collected at an agreed later date',
        'Useful for families or regular supporters',
      ],
      button: 'Request Payment Plan',
    },
    matchday: {
      title: 'Pay on the Gate',
      price: '£6',
      subtitle: 'Flexible match-by-match entry',
      text: 'Supporters who cannot attend every week can continue to pay on the gate. This remains a simple and flexible option for occasional visitors, away supporters and anyone attending selected fixtures.',
      bullets: [
        'No commitment required',
        'Pay when you attend',
        'Available for First Team home matches',
        'Great for occasional supporters',
      ],
      button: 'View Fixtures',
    },
  }

  const active = plans[plan]

  return (
    <main style={{ background:'#F2F2F2', minHeight:'100vh', padding:'90px 24px 80px' }}>
      <section style={{ maxWidth:1100, margin:'0 auto' }}>

        <div style={{ textAlign:'center', marginBottom:42 }}>
          <h1 style={{
            fontFamily:"'Barlow Condensed',sans-serif",
            fontWeight:800,
            fontSize:56,
            color:'#041B5F',
            letterSpacing:'0.04em',
            textTransform:'uppercase',
            marginBottom:8
          }}>
            Tickets
          </h1>
          <div style={{ width:70, height:4, background:'#1149D8', margin:'0 auto 16px', borderRadius:2 }} />
          <p style={{ color:'#6B7280', maxWidth:720, margin:'0 auto', lineHeight:1.7 }}>
            Season tickets and matchday entry for Brimscombe & Thrupp FC First Team home fixtures.
          </p>
        </div>

        <div style={{
          background:'#041B5F',
          borderRadius:12,
          padding:'34px 38px',
          marginBottom:34,
          display:'flex',
          alignItems:'center',
          gap:24,
          flexWrap:'wrap',
          color:'#fff'
        }}>
          <img src="/crest.png" alt="BTFC" style={{ width:74, height:74 }} />

          <div style={{ flex:1, minWidth:260 }}>
            <h2 style={{
              fontFamily:"'Barlow Condensed',sans-serif",
              fontSize:34,
              fontWeight:800,
              margin:'0 0 8px'
            }}>
              2026/27 Season Tickets
            </h2>
            <p style={{ color:'rgba(255,255,255,.72)', lineHeight:1.7, margin:0 }}>
              Watch the Lilywhites at The Meadow and support the club throughout the season.
            </p>
          </div>

          <a href="/fixtures" style={{
            background:'#1149D8',
            color:'#fff',
            padding:'14px 24px',
            borderRadius:8,
            textDecoration:'none',
            fontWeight:800,
            textTransform:'uppercase',
            fontSize:13
          }}>
            View Matches
          </a>
        </div>

        <div style={{ display:'flex', gap:10, justifyContent:'center', marginBottom:28, flexWrap:'wrap' }}>
          {([
            ['full','Pay in Full'],
            ['split','Payment Plan'],
            ['matchday','Pay on Gate'],
          ] as [Plan,string][]).map(([id,label]) => (
            <button
              key={id}
              onClick={() => setPlan(id)}
              style={{
                padding:'11px 24px',
                borderRadius:7,
                cursor:'pointer',
                fontFamily:"'Barlow Condensed',sans-serif",
                fontWeight:800,
                fontSize:15,
                letterSpacing:'0.08em',
                textTransform:'uppercase',
                background: plan===id ? '#1149D8' : '#fff',
                color: plan===id ? '#fff' : '#041B5F',
                border:'2px solid #1149D8',
                boxShadow: plan===id ? '0 4px 16px rgba(17,73,216,0.3)' : 'none'
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{
          background:'#fff',
          border:'1px solid #E5E7EB',
          borderRadius:12,
          overflow:'hidden',
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',
          marginBottom:34
        }}>
          <div style={{ background:'#041B5F', color:'#fff', padding:'36px 34px' }}>
            <div style={{
              fontFamily:"'Barlow Condensed',sans-serif",
              fontSize:22,
              fontWeight:800,
              textTransform:'uppercase',
              letterSpacing:'0.06em',
              marginBottom:14
            }}>
              {active.title}
            </div>

            <div style={{
              fontFamily:"'Barlow Condensed',sans-serif",
              fontSize:64,
              fontWeight:800,
              lineHeight:1,
              marginBottom:10
            }}>
              {active.price}
            </div>

            <div style={{ color:'rgba(255,255,255,.68)', lineHeight:1.6 }}>
              {active.subtitle}
            </div>
          </div>

          <div style={{ padding:'34px 36px' }}>
            <p style={{
              color:'#374151',
              fontSize:15,
              lineHeight:1.8,
              margin:'0 0 24px',
              textAlign:'justify'
            }}>
              {active.text}
            </p>

            <div style={{ display:'grid', gap:10, marginBottom:26 }}>
              {active.bullets.map((b) => (
                <div key={b} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                  <span style={{ color:'#22C55E', fontWeight:800 }}>✓</span>
                  <span style={{ color:'#4B5563', fontSize:14, lineHeight:1.5 }}>{b}</span>
                </div>
              ))}
            </div>

            <a href={plan === 'matchday' ? '/fixtures' : '/contact'} style={{
              display:'inline-block',
              background:'#1149D8',
              color:'#fff',
              padding:'14px 26px',
              borderRadius:8,
              textDecoration:'none',
              fontWeight:800,
              textTransform:'uppercase',
              fontSize:13
            }}>
              {active.button}
            </a>
          </div>
        </div>

        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',
          gap:18
        }}>
          {[
            ['🎟️','Season Ticket Access','Season tickets apply to First Team home league fixtures only. Cup matches and friendlies may be priced separately.'],
            ['🏟️','The Meadow','All home matches are played at The Meadow, with clubhouse facilities available on matchdays.'],
            ['👨‍👩‍👧','Families Welcome','The club welcomes families, juniors and new supporters throughout the season.'],
          ].map(([icon,title,text]) => (
            <div key={title} style={{
              background:'#fff',
              border:'1px solid #E5E7EB',
              borderRadius:10,
              padding:24
            }}>
              <div style={{ fontSize:34, marginBottom:12 }}>{icon}</div>
              <h3 style={{
                fontFamily:"'Barlow Condensed',sans-serif",
                fontSize:24,
                color:'#041B5F',
                margin:'0 0 8px',
                fontWeight:800
              }}>
                {title}
              </h3>
              <p style={{
                color:'#6B7280',
                fontSize:13,
                lineHeight:1.7,
                textAlign:'justify',
                margin:0
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
