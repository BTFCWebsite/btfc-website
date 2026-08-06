'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@sanity/client'
import { getSiteSettings } from '../lib/sanity.client'

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

const client = createClient({
  projectId: 'vm0n9zl5',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

type ClubOfficial = {
  _id?: string
  name: string
  role?: string
  email?: string
  phone?: string
  department?: string
  displayOrder?: number
}

type SiteSettings = {
  clubName?: string
  groundName?: string
  addressLine1?: string
  addressLine2?: string
  postcode?: string
  contactEmail?: string
  contactPhone?: string
  openingHours?: string
  facebookUrl?: string
  instagramUrl?: string
  xUrl?: string
}

const defaults: Required<SiteSettings> = {
  clubName: 'Brimscombe & Thrupp FC',
  groundName: 'Brackenfern Meadow',
  addressLine1: 'London Road, Brimscombe, Stroud',
  addressLine2: '',
  postcode: 'GL5 2SH',
  contactEmail: 'info@brimscombeandthruppfc.co.uk',
  contactPhone: '07814 854108',
  openingHours: 'Mon–Fri 9am–5pm',
  facebookUrl: 'https://www.facebook.com/BrimscombeandThruppFC/',
  instagramUrl: 'https://www.instagram.com/brimscombeandthruppfc/',
  xUrl: 'https://x.com/Btfcthemeadow',
}

export default function ContactPage() {
  const [officials, setOfficials] = useState<ClubOfficial[]>([])
  const [settings, setSettings] = useState<SiteSettings>({})
  const [form, setForm] = useState({ name: '', email: '', subject: 'General', message: '' })

  useEffect(() => {
    async function loadContent() {
      const [settingsData, officialData] = await Promise.all([
        getSiteSettings().catch(() => ({})),
        client.fetch<ClubOfficial[]>(`
          *[_type == "clubOfficial" && active != false] | order(displayOrder asc) {
            _id, name, role, email, phone, department, displayOrder
          }
        `).catch(() => []),
      ])

      setSettings(settingsData || {})
      setOfficials(officialData || [])
    }

    loadContent()
  }, [])

  const resolved = { ...defaults, ...settings }
  const address = [resolved.groundName, resolved.addressLine1, resolved.addressLine2, resolved.postcode]
    .filter(Boolean)
    .join(', ')

  const contactDetails = [
    { icon: '📍', label: 'Address', value: address },
    { icon: '📧', label: 'Email', value: resolved.contactEmail, href: `mailto:${resolved.contactEmail}` },
    { icon: '📞', label: 'Phone', value: resolved.contactPhone, href: `tel:${resolved.contactPhone.replace(/\s/g, '')}` },
    { icon: '🕐', label: 'Office Hours', value: resolved.openingHours },
  ]

  const socialLinks = [
    { label: '𝕏 Twitter / X', href: resolved.xUrl },
    { label: 'f Facebook', href: resolved.facebookUrl },
    { label: '📷 Instagram', href: resolved.instagramUrl },
  ].filter(link => Boolean(link.href))

  const mapsUrl = useMemo(
    () => `https://maps.google.com/?q=${encodeURIComponent(address)}`,
    [address]
  )

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.includes('@') || !form.message.trim()) {
      alert('Please fill in all required fields.')
      return
    }

    const subject = encodeURIComponent(`${form.subject} enquiry from ${form.name}`)
    const message = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)
    window.location.href = `mailto:${resolved.contactEmail}?subject=${subject}&body=${message}`
  }

  return (
    <main style={{ background: '#F2F2F2', minHeight: '100vh', padding: '0 0 90px' }}>
      <section style={{ maxWidth: 980, margin: '0 auto', padding: '52px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, marginBottom: 44, alignItems: 'start' }}>
          <div style={{ ...card, width: '100%', maxWidth: 520, margin: '0 auto' }}>
            <div style={{ height: 4, background: '#1149D8', marginBottom: 20, borderRadius: 2 }} />
            <h2 style={{ ...h2, fontSize: 28, marginBottom: 6 }}>Send a Message</h2>
            <p style={{ ...subhead, marginBottom: 20 }}>Complete the form and your email app will open with the message ready to send.</p>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                <div>
                  <label style={{ ...body, fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" style={inputStyle} required />
                </div>
                <div>
                  <label style={{ ...body, fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Email Address *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" style={inputStyle} required />
                </div>
              </div>

              <div>
                <label style={{ ...body, fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Subject</label>
                <select name="subject" value={form.subject} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option>General</option>
                  <option>Player Registration</option>
                  <option>Sponsorship Enquiry</option>
                  <option>Ticketing</option>
                  <option>Volunteering</option>
                  <option>Press & Media</option>
                  <option>Youth Teams</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label style={{ ...body, fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange} placeholder="How can we help?" rows={6} style={{ ...inputStyle, resize: 'vertical' }} required />
              </div>

              <button type="submit" style={{ background: '#1149D8', color: '#fff', border: 'none', borderRadius: 6, padding: '12px 24px', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 18, cursor: 'pointer', letterSpacing: '0.03em' }}>
                Open Email →
              </button>
            </form>
          </div>

          <div style={{ display: 'grid', gap: 16, width: '100%' }}>
            <div style={{ ...card, width: '100%', maxWidth: 520, margin: '0 auto' }}>
              <div style={{ height: 4, background: '#1149D8', marginBottom: 20, borderRadius: 2 }} />
              <h3 style={h3}>Club Details</h3>
              <div style={{ display: 'grid', gap: 14 }}>
                {contactDetails.map(detail => (
                  <div key={detail.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 16, marginTop: 1 }}>{detail.icon}</span>
                    <div>
                      <div style={{ ...body, fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 2 }}>{detail.label}</div>
                      {detail.href ? (
                        <a href={detail.href} style={{ ...body, color: '#1149D8', textDecoration: 'none', fontWeight: 600, wordBreak: 'break-word' }}>{detail.value}</a>
                      ) : (
                        <p style={{ ...body, color: '#374151' }}>{detail.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...card, width: '100%', maxWidth: 520, margin: '0 auto' }}>
              <h3 style={{ ...h3, marginBottom: 14 }}>Follow Us</h3>
              <div style={{ display: 'grid', gap: 10 }}>
                {socialLinks.map(link => (
                  <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" style={{ ...body, color: '#1149D8', textDecoration: 'none', fontWeight: 600, fontSize: 13, display: 'block', padding: '8px 12px', background: '#F8FAFF', borderRadius: 6, border: '1px solid #E5E7EB' }}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 44 }}>
          <h2 style={{ ...h2, textAlign: 'left' }}>Department Contacts</h2>
          <p style={{ ...subhead, textAlign: 'left' }}>For specific enquiries, contact the relevant club official directly.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {officials.map(official => (
              <div key={official._id || `${official.name}-${official.email || official.phone || ''}`} style={{ ...card, width: '100%', maxWidth: 380, margin: '0 auto' }}>
                <h3 style={h3}>{official.department || official.role || 'Club Official'}</h3>
                <p style={{ ...body, marginBottom: 8 }}>{official.name}{official.role ? ` — ${official.role}` : ''}</p>
                {official.email && <a href={`mailto:${official.email}`} style={{ ...body, color: '#1149D8', fontSize: 11, wordBreak: 'break-all', display: 'block' }}>{official.email}</a>}
                {official.phone && <a href={`tel:${official.phone.replace(/\s/g, '')}`} style={{ ...body, color: '#1149D8', fontSize: 11, wordBreak: 'break-all', display: 'block', marginTop: 6 }}>{official.phone}</a>}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 style={{ ...h2, marginBottom: 6, textAlign: 'left' }}>Find Us</h2>
          <p style={{ ...subhead, textAlign: 'left' }}>{address.replace(/, /g, ' · ')}</p>
          <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #E5E7EB', marginBottom: 16 }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d737.3188611688546!2d-2.196166640744735!3d51.72201894723951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48710c418313cc5f%3A0x6e0c3c089afa1c4d!2sBrimscombe%20and%20Thrupp%20Football%20Club!5e1!3m2!1sen!2suk!4v1780823602873!5m2!1sen!2suk"
              width="100%"
              height="300"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${resolved.groundName} location`}
            />
          </div>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#1149D8', padding: '10px 20px', borderRadius: 6, color: '#fff', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 16, textDecoration: 'none' }}>
            Open in Google Maps →
          </a>
        </div>
      </section>
    </main>
  )
}
