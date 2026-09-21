import Link from 'next/link'

const leagueUrl = 'https://www.thehellenicleague.com/'

export const metadata = {
  title: 'Hellenic League launches new website | Brimscombe & Thrupp FC',
  description: 'The Hellenic League has a new official website. Update your bookmarks and find the latest league information at thehellenicleague.com.',
}

export default function HellenicLeagueWebsiteNews() {
  return (
    <main style={{ background: '#F2F2F2', minHeight: '100vh', padding: '0 0 90px' }}>
      <section style={{ maxWidth: 780, margin: '0 auto', padding: '52px 24px' }}>
        <Link href="/news" style={{ display: 'inline-block', fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 700, color: '#1149D8', textDecoration: 'none', marginBottom: 32 }}>← Back to News</Link>
        <article style={{ background: '#fff', border: '1px solid #E5E7EB', borderTop: '6px solid #D97706', borderRadius: 8, overflow: 'hidden', padding: '36px 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            <span style={{ color: '#B45309', background: '#D9770618', padding: '4px 12px', borderRadius: 4, fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase' }}>📢 Announcement</span>
            <time dateTime="2026-09-21" style={{ color: '#9CA3AF', fontFamily: "'Montserrat', sans-serif", fontSize: 11 }}>Monday 21 September 2026</time>
          </div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#2D2D2D', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 1.12, marginBottom: 20 }}>Hellenic League launches new website</h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", color: '#4B5563', fontSize: 14, lineHeight: 1.7, fontWeight: 600, borderLeft: '3px solid #D97706', paddingLeft: 16, marginBottom: 28 }}>The Hellenic League has moved to a new website. Supporters, players and officials should update their bookmarks.</p>
          <div style={{ height: 1, background: '#E5E7EB', marginBottom: 28 }} />
          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: '#374151', lineHeight: 1.85 }}>
            <p style={{ marginBottom: 18 }}>The Hellenic League has confirmed that its new official website is now live following the loss of its previous website and social media accounts.</p>
            <p style={{ marginBottom: 18 }}>For league news, fixtures, results and tables, please use the new address and replace any saved links to the old site:</p>
            <p style={{ marginBottom: 22, overflowWrap: 'anywhere' }}><a href={leagueUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#1149D8', fontWeight: 800, textDecoration: 'underline' }}>www.thehellenicleague.com ↗</a></p>
            <p style={{ marginBottom: 18 }}>The league has also launched new social media channels. Please use the links on its new website to find its current accounts rather than relying on old bookmarks.</p>
            <p>We have updated the link in the footer of the Brimscombe & Thrupp FC website for easy access.</p>
          </div>
        </article>
        <div style={{ marginTop: 32, textAlign: 'center' }}><Link href="/news" style={{ display: 'inline-block', color: '#1149D8', border: '2px solid #1149D8', padding: '12px 28px', borderRadius: 6, fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', textDecoration: 'none' }}>← All News</Link></div>
      </section>
    </main>
  )
}
