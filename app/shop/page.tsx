'use client'

export default function ShopPage() {
  return (
    <main style={{ background: '#F2F2F2', minHeight: '100vh', padding: '52px 24px 90px' }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>

        {/* Batemans Sports banner */}
        <div style={{ background: '#041B5F', borderRadius: 8, padding: '32px 36px', marginBottom: 48, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 48 }}>🛒</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 28, color: '#fff', letterSpacing: '.04em', marginBottom: 6 }}>Official BTFC Merchandise</div>
            <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: 'rgba(255,255,255,.6)', marginBottom: 16 }}>Our official club shop is powered by Batemans Sports. All items feature the official BTFC badge and are made to order.</div>
            <div style={{ background: 'rgba(255,255,255,.08)', borderRadius: 6, padding: '8px 14px', display: 'inline-block', fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: 'rgba(255,255,255,.5)', marginBottom: 16 }}>
              ℹ Please allow 3–4 weeks for delivery. Items with club badge or sponsor logo are non-returnable.
            </div>
            <div>
              <a href="https://www.batemanssports.co.uk/collections/club-shops-football-brimscombe-thrupp-fc" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#1149D8', color: '#fff', padding: '14px 28px', borderRadius: 6, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: '.06em', textDecoration: 'none', textTransform: 'uppercase' }}>Visit Club Shop →</a>
            </div>
          </div>
        </div>

        {/* Product categories */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 48 }}>
          {[
            { icon: '👕', title: 'Matchday Kit', desc: 'Home & away shirts, shorts and socks. Official Joma kit.' },
            { icon: '🧥', title: 'Training Wear', desc: 'Training tops, hoodies, jackets and warm-up gear.' },
            { icon: '🎽', title: 'Manager's Jacket', desc: 'Joma Managers Trivor Winter Bench Jacket in black. From £61.' },
            { icon: '🎁', title: 'Accessories', desc: 'Scarves, hats, bags and other official BTFC merchandise.' },
          ].map(p => (
            <a key={p.title} href="https://www.batemanssports.co.uk/collections/club-shops-football-brimscombe-thrupp-fc" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: 24, textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>{p.icon}</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 22, color: '#2D2D2D', marginBottom: 8 }}>{p.title}</div>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: '#6B7280', lineHeight: 1.6, marginBottom: 12 }}>{p.desc}</div>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 15, color: '#1149D8' }}>Shop Now →</span>
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', background: '#041B5F', borderRadius: 8, padding: 40 }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 30, color: '#fff', letterSpacing: '.04em', marginBottom: 8 }}>Support Your Club</div>
          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: 'rgba(255,255,255,.6)', marginBottom: 24, maxWidth: 440, margin: '0 auto 24px' }}>Every purchase helps support Brimscombe & Thrupp FC. Wear your colours with pride.</div>
          <a href="https://www.batemanssports.co.uk/collections/club-shops-football-brimscombe-thrupp-fc" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#1149D8', color: '#fff', padding: '16px 36px', borderRadius: 6, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: '.06em', textDecoration: 'none', textTransform: 'uppercase', boxShadow: '0 8px 28px rgba(17,73,216,.45)' }}>Visit Club Shop →</a>
        </div>

      </div>
    </main>
  )
}
