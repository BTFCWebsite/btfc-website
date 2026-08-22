'use client'

import { useEffect, useMemo, useState } from 'react'
import { getSiteSettings, getSponsors, getSponsorshipPackages } from '../lib/sanity.client'

const h2 = { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 36, fontWeight: 800, color: '#2D2D2D', margin: '0 0 6px', letterSpacing: '0.03em' } as const
const h3 = { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, color: '#2D2D2D', margin: '0 0 10px', lineHeight: 1.1 } as const
const body = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: '#4B5563', lineHeight: 1.65, margin: 0 } as const
const card = { background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: 24 } as const
const subhead = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: '#6B7280', margin: '0 0 24px' } as const
const inputStyle = { width: '100%', padding: '11px 14px', border: '1px solid #CBD5E1', borderRadius: 6, fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: '#2D2D2D', background: '#fff', boxSizing: 'border-box' as const, outline: 'none' }

const fallbackPackages = [
  { name: 'Reserves Sponsor', icon: '⚽', colour: '#1149D8', available: true, featured: false, benefits: ['Reserves team shirt sponsorship', 'Logo on reserves matchday materials', 'Website sponsor page feature', 'Social media recognition', 'Complimentary match tickets'] },
  { name: 'Under 17s Sponsor', icon: '👶', colour: '#1149D8', available: true, featured: false, benefits: ['Under 17s team shirt sponsorship', 'Logo on youth matchday materials', 'Website sponsor page feature', 'Social media recognition', 'Community and youth development association'] },
  { name: 'Premium Partner', icon: '🌟', colour: '#92400e', available: true, featured: false, benefits: ['Large format pitch side board', 'Logo on sponsors page', 'Social Media Shoutouts', 'Matchday programme listing', 'Complimentary match tickets'] },
  { name: 'Club Partner', icon: '🤝', colour: '#374151', available: true, featured: false, benefits: ['Standard pitch side board', 'Logo on sponsors page'] },
]

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<any[]>([])
  const [packages, setPackages] = useState<any[]>([])
  const [settings, setSettings] = useState<any>({})
  const [form, setForm] = useState({ name: '', business: '', email: '', phone: '', package: 'Premium Partner', message: '' })

  useEffect(() => {
    Promise.all([getSponsors(), getSponsorshipPackages(), getSiteSettings()])
      .then(([sponsorData, packageData, settingsData]) => {
        setSponsors(sponsorData || [])
        setPackages(packageData?.length ? packageData : fallbackPackages)
        setSettings(settingsData || {})
      })
      .catch(console.error)
  }, [])

  const displayedSponsors = useMemo(() => ({
    principal: sponsors.filter(s => s.tier === 'principal'),
    premium: sponsors.filter(s => s.tier === 'official' || s.tier === 'premium'),
    club: sponsors.filter(s => s.tier === 'club'),
  }), [sponsors])

  const availablePackages = packages.filter(p => p.available !== false)
  const season = settings.seasonYear || '2026/27'

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.includes('@') || !form.business.trim()) {
      alert('Please fill in all required fields.')
      return
    }

    const recipient = settings.commercialEmail || settings.contactEmail || 'info@brimscombeandthruppfc.co.uk'
    const subject = encodeURIComponent(`Sponsorship enquiry: ${form.package}`)
    const message = encodeURIComponent(`Name: ${form.name}\nBusiness: ${form.business}\nEmail: ${form.email}\nPhone: ${form.phone || 'Not supplied'}\nPackage: ${form.package}\n\n${form.message}`)
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${message}`
  }

  const SponsorGrid = ({ items, compact = false, fullWidthSingle = false }: { items: any[]; compact?: boolean; fullWidthSingle?: boolean }) => {
    const featuredSingle = fullWidthSingle && items.length === 1

    return (
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${compact ? 220 : 280}px), 1fr))`, gap: 20 }}>
        {items.map(s => (
          <div
            key={s._id || s.name}
            style={{
              ...card,
              textAlign: featuredSingle || compact ? 'center' : 'left',
              width: '100%',
              maxWidth: featuredSingle ? 'none' : compact ? 320 : 420,
              margin: '0 auto',
              padding: featuredSingle ? '34px 40px' : 24,
            }}
          >
            {s.logoUrl && (
              <div style={{ height: featuredSingle ? 120 : compact ? 70 : 100, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <img src={s.logoUrl} alt={s.name} style={{ maxHeight: featuredSingle ? 90 : compact ? 52 : 70, maxWidth: featuredSingle ? '60%' : '80%', objectFit: 'contain' }} />
              </div>
            )}
            <h3 style={{ ...h3, fontSize: featuredSingle ? 28 : h3.fontSize }}>{s.name}</h3>
            {s.role && <p style={{ ...body, color: '#1149D8', fontWeight: 700 }}>{s.role}</p>}
          </div>
        ))}
      </div>
    )
  }

  return (
    <main style={{ background: '#F2F2F2', minHeight: '100vh', padding: '0 0 90px' }}>
      <section style={{ maxWidth: 980, margin: '0 auto', padding: '52px 24px' }}>
        <div style={{ marginBottom: 52 }}>
          <h2 style={h2}>Principal Partners</h2>
          <p style={subhead}>Our headline partners for the {season} season</p>
          <SponsorGrid items={displayedSponsors.principal} fullWidthSingle />

          {displayedSponsors.premium.length > 0 && <div style={{ marginTop: 32 }}><h3 style={h3}>Premium Partners</h3><SponsorGrid items={displayedSponsors.premium} compact /></div>}
          {displayedSponsors.club.length > 0 && <div style={{ marginTop: 32 }}><h3 style={h3}>Club Partners</h3><SponsorGrid items={displayedSponsors.club} compact /></div>}
        </div>

        <div style={{ marginBottom: 52 }}>
          <h2 style={h2}>Sponsorship Packages</h2>
          <p style={subhead}>Available packages for the {season} season — contact us for pricing</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 20 }}>
            {availablePackages.map(p => (
              <div key={p._id || p.name} style={{ ...card, border: `1px solid ${p.featured ? '#1149D8' : '#E5E7EB'}`, width: '100%', maxWidth: 380, margin: '0 auto' }}>
                <div style={{ height: 4, background: p.colour || '#1149D8', marginBottom: 20, borderRadius: 2 }} />
                <div style={{ fontSize: 24, marginBottom: 8 }}>{p.icon || '🤝'}</div>
                <h3 style={h3}>{p.name}</h3>
                {p.description && <p style={{ ...body, marginBottom: 14 }}>{p.description}</p>}
                <div style={{ display: 'grid', gap: 6, marginBottom: 18 }}>
                  {(p.benefits || []).map((benefit: string) => <div key={benefit} style={{ display: 'flex', gap: 8 }}><span style={{ color: '#1149D8', fontWeight: 900 }}>✓</span><span style={body}>{benefit}</span></div>)}
                </div>
                {p.priceNote && <p style={{ ...body, fontWeight: 700, marginBottom: 14 }}>{p.priceNote}</p>}
                <button onClick={() => { setForm({ ...form, package: p.name }); document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' }) }} style={{ width: '100%', background: '#fff', border: '2px solid #1149D8', color: '#1149D8', padding: '9px 14px', borderRadius: 6, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 16, cursor: 'pointer' }}>Enquire →</button>
              </div>
            ))}
          </div>
        </div>

        <div id="enquiry-form">
          <h2 style={h2}>Sponsorship Enquiry</h2>
          <p style={subhead}>Interested in partnering with BTFC? Send the club your enquiry directly.</p>
          <form onSubmit={handleSubmit} style={card}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 16, marginBottom: 16 }}>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" style={inputStyle} required />
              <input name="business" value={form.business} onChange={handleChange} placeholder="Business name" style={inputStyle} required />
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email address" style={inputStyle} required />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" style={inputStyle} />
            </div>
            <select name="package" value={form.package} onChange={handleChange} style={{ ...inputStyle, marginBottom: 16 }}>
              {availablePackages.map(p => <option key={p._id || p.name}>{p.name}</option>)}
              <option>Other / Not sure yet</option>
            </select>
            <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us what you are looking for..." rows={4} style={{ ...inputStyle, resize: 'vertical', marginBottom: 20 }} />
            <button type="submit" style={{ background: '#1149D8', color: '#fff', border: 'none', borderRadius: 6, padding: '12px 28px', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 18, cursor: 'pointer' }}>Send Enquiry →</button>
          </form>
        </div>
      </section>
    </main>
  )
}
