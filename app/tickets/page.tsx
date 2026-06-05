'use client'

export default function TicketsPage() {
  const tickets = [
    {
      title: 'Adult Early Bird',
      price: '£90',
      note: '2026/27 Season — Early bird price, limited availability',
      badge: 'BEST VALUE',
      items: ['All home league games', 'All home cup games', 'Free matchday programme', 'Early bird saving — save £10'],
    },
    {
      title: 'Adult',
      price: '£100',
      note: '2026/27 Season — All home league and cup games',
      badge: '',
      items: ['All home league games', 'All home cup games', 'Free matchday programme'],
    },
    {
      title: 'Concession Early Bird',
      price: '£70',
      note: '2026/27 Season — 65+ / Students with valid ID',
      badge: 'BEST VALUE',
      items: ['All home league games', 'All home cup games', 'Free matchday programme', 'Early bird saving — save £10'],
    },
    {
      title: 'Concession',
      price: '£80',
      note: '2026/27 Season — 65+ / Students with valid ID',
      badge: '',
      items: ['All home league games', 'All home cup games', 'Free matchday programme'],
    },
  ]

  const faqs = [
    ['Can I pay in instalments?', 'Not currently — season tickets must be paid in full at time of purchase.'],
    ['How do I collect my ticket?', 'After payment you will receive an email with your digital season ticket. Simply show it on your phone at the gate or print it at home on any printer — both work perfectly fine.'],
    ['Refund policy', 'Please contact us within 14 days of purchase. Subject to our terms and conditions.'],
    ['Is my payment secure?', 'Yes. All payments are processed by Zettle, a PayPal company, using bank-grade encryption.'],
  ]

  return (
    <main style={{ background:'#F2F2F2', minHeight:'100vh', padding:'90px 24px 90px' }}>
      <section style={{ maxWidth:980, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:42 }}>
          <h1 style={{ fontSize:52, fontWeight:900, color:'#2D2D2D', margin:'0 0 8px' }}>
            Season Tickets
          </h1>
          <p style={{ color:'#6B7280', margin:0 }}>Secure your seat for the 2026/27 season</p>
          <div style={{ width:52, height:4, background:'#1149D8', margin:'14px auto 0' }} />
        </div>

        <div style={{
          background:'#041B5F',
          borderRadius:8,
          padding:'22px 28px',
          color:'#fff',
          display:'flex',
          alignItems:'center',
          justifyContent:'space-between',
          gap:20,
          flexWrap:'wrap',
          marginBottom:44
        }}>
          <div>
            <h2 style={{ fontSize:24, fontWeight:900, margin:'0 0 6px' }}>
              🎟️ 2026/27 Season Tickets On Sale Now
            </h2>
            <p style={{ margin:0, color:'rgba(255,255,255,.7)', fontSize:13, lineHeight:1.6, textAlign:'justify' }}>
              Adult Early Bird £90 · Concession Early Bird £70 · Secure payment via Zettle · All major cards accepted
            </p>
          </div>

          <div style={{ background:'#1149D8', padding:'12px 18px', borderRadius:6, textAlign:'center', fontWeight:900 }}>
            <div style={{ fontSize:9, opacity:.7 }}>POWERED BY</div>
            Zettle
          </div>
        </div>

        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',
          gap:20,
          marginBottom:44
        }}>
          {tickets.map((t) => (
            <div key={t.title} style={{
              background:'#fff',
              border:'1px solid #E5E7EB',
              borderRadius:8,
              padding:20,
              display:'flex',
              flexDirection:'column',
              minHeight:245,
              position:'relative'
            }}>
              <div style={{ height:4, background:'#1149D8', marginBottom:18 }} />

              {t.badge && (
                <div style={{
                  position:'absolute',
                  top:14,
                  right:14,
                  background:'#15803D',
                  color:'#fff',
                  fontSize:9,
                  fontWeight:900,
                  padding:'3px 8px',
                  borderRadius:4
                }}>
                  {t.badge}
                </div>
              )}

              <h2 style={{ fontSize:22, fontWeight:900, color:'#2D2D2D', margin:'0 0 4px' }}>
                {t.title}
              </h2>

              <div style={{ fontSize:42, fontWeight:900, color:'#1149D8', lineHeight:1 }}>
                {t.price}
              </div>

              <p style={{ fontSize:12, color:'#6B7280', lineHeight:1.55, textAlign:'justify', margin:'8px 0 16px' }}>
                {t.note}
              </p>

              <div style={{ display:'grid', gap:7, marginBottom:18 }}>
                {t.items.map((item) => (
                  <div key={item} style={{ fontSize:11, color:'#374151', lineHeight:1.4 }}>
                    <span style={{ color:'#1149D8', fontWeight:900 }}>✓</span> {item}
                  </div>
                ))}
              </div>

              <a href="/contact" style={{
                marginTop:'auto',
                border:'2px solid #1149D8',
                color:'#1149D8',
                textAlign:'center',
                padding:'10px 14px',
                borderRadius:6,
                textDecoration:'none',
                fontSize:11,
                fontWeight:900,
                letterSpacing:'.08em'
              }}>
                SELECT
              </a>
            </div>
          ))}
        </div>

        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',
          gap:20
        }}>
          {faqs.map(([title, text]) => (
            <div key={title} style={{
              background:'#fff',
              border:'1px solid #E5E7EB',
              borderRadius:8,
              padding:22,
              minHeight:150,
              display:'flex',
              flexDirection:'column'
            }}>
              <h3 style={{ fontSize:20, fontWeight:900, color:'#2D2D2D', margin:'0 0 12px' }}>
                {title}
              </h3>
              <p style={{ fontSize:12, color:'#4B5563', lineHeight:1.7, textAlign:'justify', margin:0 }}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
