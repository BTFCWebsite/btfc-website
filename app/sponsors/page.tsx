'use client'
import { useState } from 'react'

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

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  border: '1px solid #CBD5E1',
  borderRadius: 6,
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 13,
  color: '#2D2D2D',
  background: '#fff',
  boxSizing: 'border-box' as const,
  outline: 'none',
}

const packages = [
  {
    tier: 'Ground Sponsor',
    icon: '🏟',
    color: '#041B5F',
    highlight: true,
    taken: true,
    sponsor: 'Jessons Real Estate',
    benefits: [
      'Ground naming rights — The Jessons Meadow',
      'Large pitch-side hoarding',
      'Logo on all matchday materials',
      'Homepage feature — maximum visibility',
      'Social media recognition',
      'Hospitality tickets included',
    ],
  },
  {
    tier: 'First Team Sponsor',
    icon: '⚽',
    color: '#1149D8',
    highlight: true,
    taken: true,
    sponsor: 'Brackenfern Advisory Limited',
    benefits: [
      'First team shirt sponsorship',
      'Logo on all matchday graphics',
      'Homepage feature alongside club crest',
      'Social media recognition all season',
      'Hospitality tickets included',
      '14,200+ monthly website impressions',
    ],
  },
  {
    tier: 'Reserves Sponsor',
    icon: '⚽',
    color: '#1149D8',
    highlight: false,
    taken: false,
    sponsor: null,
    benefits: [
      'Reserves team shirt sponsorship',
      'Logo on reserves matchday materials',
      'Website sponsor page feature',
      'Social media recognition',
      'Complimentary match tickets',
    ],
  },
  {
    tier: 'Under 17s Sponsor',
    icon: '👶',
    color: '#1149D8',
    highlight: false,
    taken: false,
    sponsor: null,
    benefits: [
      'Under 17s team shirt sponsorship',
      'Logo on youth matchday materials',
      'Website sponsor page feature',
      'Social media recognition',
      'Community and youth development association',
    ],
  },
  {
    tier: 'Gold Partner',
    icon: '🌟',
    color: '#92400e',
    highlight: false,
    taken: false,
    sponsor: null,
    benefits: [
      'Pitch-side hoarding',
      'Logo on sponsor page',
      'Social media shoutout',
      'Complimentary match tickets',
    ],
  },
  {
    tier: 'Club Partner',
    icon: '🤝',
    color: '#374151',
    highlight: false,
    taken: false,
    sponsor: null,
    benefits: [
      'Logo on sponsor page',
      'Social media recognition',
      'Programme listing',
    ],
  },
]

const currentSponsors = {
  principal: [
    { name: 'Jessons Real Estate', role: 'Ground Sponsor', logo: '/sponsors/jessons-logo.png', url: '#' },
    { name: 'Brackenfern Advisory Limited', role: 'First Team Sponsor', logo: '/sponsors/brackenfern-logo.png', url: '#' },
  ],
  gold: [
    { name: 'Greenleaf Landscaping', role: 'Gold Partner', logo: null },
    { name: 'Swift Print Co.', role: 'Gold Partner', logo: null },
    { name: 'Elite Bootroom', role: 'Gold Partner', logo: null },
  ],
  club: [
    { name: 'The Crown Inn', role: 'Club Partner', logo: null },
    { name: 'TechFix IT', role: 'Club Partner', logo: null },
    { name: 'Riverside Dental', role: 'Club Partner', logo: null },
    { name: 'County Garage', role: 'Club Partner', logo: null },
  ],
}

const stats = [
  { value: '2,000+', label: 'Supporters reached' },
  { value: '14,200', label: 'Monthly website visits' },
  { value: '1,886', label: 'Social followers' },
  { value: '34', label: 'Home fixtures per season' },
]

export default function SponsorsPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    business: '',
    email: '',
    phone: '',
    package: 'Gold Partner',
    message: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.includes('@') || !form.business.trim()) {
      alert('Please fill in all required fields.')
      return
    }
    setSubmitted(true)
  }

  return (
    <main style={{ background: '#F2F2F2', minHeight: '100vh', padding: '0 0 90px' }}>
      <section style={{ maxWidth: 980, margin: '0 auto', padding: '52px 24px' }}>

        {/* Current Principal Sponsors */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={h2}>Principal Sponsors</h2>
          <p style={subhead}>Our headline partners for the 2026/27 season</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20, marginBottom: 20 }}>
            {currentSponsors.principal.map(s => (
              <div key={s.name} style={card}>
                <div style={{ height: 4, background: '#1149D8', marginBottom: 20, borderRadius: 2 }} />
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #E5E7EB',
                  borderRadius: 8,
                  height: 100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  <img src={s.logo} alt={s.name} style={{ maxHeight: 70, maxWidth: '80%', objectFit: 'contain' }} />
                </div>
                <h3 style={h3}>{s.name}</h3>
                <span style={{
                  display: 'inline-block',
                  background: '#1149D8',
                  color: '#fff',
                  padding: '3px 10px',
                  borderRadius: 4,
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '.08em',
                  textTransform: 'uppercase' as const,
                }}>
                  {s.role}
                </span>
              </div>
            ))}
          </div>

          {/* Gold Partners */}
          <h3 style={{ ...h3, marginBottom: 6, marginTop: 32 }}>Gold Partners</h3>
          <p style={{ ...subhead, marginBottom: 16 }}>Supporting the club at gold level</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, marginBottom: 32 }}>
            {currentSponsors.gold.map(s => (
              <div key={s.name} style={{ ...card, textAlign: 'center' as const }}>
                <div style={{
                  background: '#F8FAFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 6,
                  height: 70,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 10,
                  color: '#9CA3AF',
                }}>
                  Logo to be added
                </div>
                <p style={{ ...body, fontWeight: 700, color: '#2D2D2D', marginBottom: 4 }}>{s.name}</p>
                <p style={{ ...body, fontSize: 11, color: '#9CA3AF' }}>{s.role}</p>
              </div>
            ))}
          </div>

          {/* Club Partners */}
          <h3 style={{ ...h3, marginBottom: 6 }}>Club Partners</h3>
          <p style={{ ...subhead, marginBottom: 16 }}>Our valued club partners</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16 }}>
            {currentSponsors.club.map(s => (
              <div key={s.name} style={{ ...card, textAlign: 'center' as const, padding: 16 }}>
                <div style={{
                  background: '#F8FAFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 6,
                  height: 56,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 10,
                  color: '#9CA3AF',
                }}>
                  Logo
                </div>
                <p style={{ ...body, fontWeight: 700, color: '#2D2D2D', fontSize: 11, marginBottom: 2 }}>{s.name}</p>
                <p style={{ ...body, fontSize: 10, color: '#9CA3AF' }}>{s.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sponsorship Packages */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={h2}>Sponsorship Packages</h2>
          <p style={subhead}>Available packages for the 2026/27 season — contact us for pricing</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20 }}>
            {packages.filter(p => !p.taken).map(p => (
              <div key={p.tier} style={{
                ...card,
                border: `1px solid ${p.highlight ? '#1149D8' : '#E5E7EB'}`,
              }}>
                <div style={{ height: 4, background: p.color, marginBottom: 20, borderRadius: 2 }} />
                <div style={{ fontSize: 24, marginBottom: 8 }}>{p.icon}</div>
                <h3 style={h3}>{p.tier}</h3>
                <div style={{ display: 'grid', gap: 6, marginBottom: 20 }}>
                  {p.benefits.map(b => (
                    <div key={b} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ color: '#1149D8', fontWeight: 900, fontSize: 12, marginTop: 1 }}>✓</span>
                      <span style={{ ...body, fontSize: 12 }}>{b}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setForm({ ...form, package: p.tier })
                    document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  style={{
                    width: '100%',
                    background: '#fff',
                    border: '2px solid #1149D8',
                    color: '#1149D8',
                    padding: '9px 14px',
                    borderRadius: 6,
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 800,
                    fontSize: 16,
                    cursor: 'pointer',
                    letterSpacing: '.04em',
                  }}
                >
                  Enquire →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Enquiry Form */}
        <div id="enquiry-form" style={{ marginBottom: 0 }}>
          <h2 style={h2}>Sponsorship Enquiry</h2>
          <p style={subhead}>Interested in partnering with BTFC? Get in touch and we'll be in contact within 2 working days.</p>
          <div style={card}>
            <div style={{ height: 4, background: '#1149D8', marginBottom: 24, borderRadius: 2 }} />
            {submitted ? (
              <div style={{
                background: '#F0FDF4',
                border: '1px solid #86EFAC',
                borderRadius: 8,
                padding: '28px 24px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
                <h3 style={{ ...h3, color: '#16a34a' }}>Enquiry Received</h3>
                <p style={{ ...body, color: '#15803d' }}>
                  Thanks for your interest in sponsoring BTFC. We'll be in touch within 2 working days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ ...body, fontSize: 11, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>Your Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" style={inputStyle} required />
                  </div>
                  <div>
                    <label style={{ ...body, fontSize: 11, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>Business Name *</label>
                    <input name="business" value={form.business} onChange={handleChange} placeholder="Your business" style={inputStyle} required />
                  </div>
                  <div>
                    <label style={{ ...body, fontSize: 11, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>Email Address *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" style={inputStyle} required />
                  </div>
                  <div>
                    <label style={{ ...body, fontSize: 11, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>Phone Number</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="Optional" style={inputStyle} />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ ...body, fontSize: 11, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>Package of Interest</label>
                  <select name="package" value={form.package} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option>Reserves Sponsor</option>
                    <option>Under 17s Sponsor</option>
                    <option>Gold Partner</option>
                    <option>Club Partner</option>
                    <option>Other / Not sure yet</option>
                  </select>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ ...body, fontSize: 11, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us a bit about your business and what you're looking for..." rows={4} style={{ ...inputStyle, resize: 'vertical' as const }} />
                </div>
                <button type="submit" style={{
                  background: '#1149D8',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '12px 28px',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 800,
                  fontSize: 18,
                  cursor: 'pointer',
                  letterSpacing: '0.03em',
                }}>
                  Send Enquiry →
                </button>
              </form>
            )}
          </div>
        </div>

      </section>
    </main>
  )
}
