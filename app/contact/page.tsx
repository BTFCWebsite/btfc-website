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

const contactDetails = [
  { icon: '📍', label: 'Address', value: 'Jessons Meadow, London Road, Brimscombe, Stroud, GL5 2SH' },
  { icon: '📧', label: 'Email', value: 'info@brimscombeandthruppfc.co.uk', href: 'mailto:info@brimscombeandthruppfc.co.uk' },
  { icon: '📞', label: 'Phone', value: '07814 854108', href: 'tel:07814854108' },
  { icon: '🕐', label: 'Office Hours', value: 'Mon–Fri 9am–5pm' },
]

const departments = [
  { icon: '⚽', title: 'First Team', contact: 'Tim Bond — Manager', email: 'manager@brimscombeandthruppfc.co.uk' },
  { icon: '🏟', title: 'Club Secretary', contact: 'Sarah Mills', email: 'secretary@brimscombeandthruppfc.co.uk' },
  { icon: '🤝', title: 'Sponsorship', contact: 'Commercial enquiries', email: 'sponsorship@brimscombeandthruppfc.co.uk' },
  { icon: '👶', title: 'Youth Teams', contact: 'Youth development', email: 'youth@brimscombeandthruppfc.co.uk' },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'General',
    message: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.includes('@') || !form.message.trim()) {
      alert('Please fill in all required fields.')
      return
    }
    setSubmitted(true)
  }

  return (
    <main style={{ background: '#F2F2F2', minHeight: '100vh', padding: '0 0 90px' }}>
      <section style={{ maxWidth: 980, margin: '0 auto' }}>

        {/* Main grid — form + contact details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: 28,
          marginBottom: 44,
          alignItems: 'start',
        }}>

          {/* Contact Form */}
          <div style={card}>
            <div style={{ height: 4, background: '#1149D8', marginBottom: 20, borderRadius: 2 }} />
            <h2 style={{ ...h2, fontSize: 28, marginBottom: 6 }}>Send a Message</h2>
            <p style={{ ...subhead, marginBottom: 20 }}>We aim to respond to all enquiries within 2 working days.</p>

            {submitted ? (
              <div style={{
                background: '#F0FDF4',
                border: '1px solid #86EFAC',
                borderRadius: 8,
                padding: '24px 20px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>✅</div>
                <h3 style={{ ...h3, color: '#16a34a' }}>Message Sent</h3>
                <p style={{ ...body, color: '#15803d' }}>
                  Thanks for getting in touch. We'll get back to you within 2 working days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ ...body, fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                      Full Name *
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      style={inputStyle}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ ...body, fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                      Email Address *
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ ...body, fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
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
                  <label style={{ ...body, fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    rows={6}
                    style={{ ...inputStyle, resize: 'vertical' as const }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    background: '#1149D8',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '12px 24px',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 800,
                    fontSize: 18,
                    cursor: 'pointer',
                    letterSpacing: '0.03em',
                  }}
                >
                  Send Message →
                </button>
              </form>
            )}
          </div>

          {/* Contact Details */}
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={card}>
              <div style={{ height: 4, background: '#1149D8', marginBottom: 20, borderRadius: 2 }} />
              <h3 style={h3}>Club Details</h3>
              <div style={{ display: 'grid', gap: 14 }}>
                {contactDetails.map(d => (
                  <div key={d.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 16, marginTop: 1 }}>{d.icon}</span>
                    <div>
                      <div style={{ ...body, fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '.08em', textTransform: 'uppercase' as const, marginBottom: 2 }}>
                        {d.label}
                      </div>
                      {d.href ? (
                        <a href={d.href} style={{ ...body, color: '#1149D8', textDecoration: 'none', fontWeight: 600 }}>
                          {d.value}
                        </a>
                      ) : (
                        <p style={{ ...body, color: '#374151' }}>{d.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div style={card}>
              <h3 style={{ ...h3, marginBottom: 14 }}>Follow Us</h3>
              <div style={{ display: 'grid', gap: 10 }}>
                {[
                  { label: '𝕏  Twitter / X', href: 'https://twitter.com/btfc' },
                  { label: 'f  Facebook', href: 'https://facebook.com/brimscombeandthruppfc' },
                  { label: '▶  YouTube', href: 'https://youtube.com' },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                    ...body,
                    color: '#1149D8',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: 13,
                    display: 'block',
                    padding: '8px 12px',
                    background: '#F8FAFF',
                    borderRadius: 6,
                    border: '1px solid #E5E7EB',
                  }}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Department contacts */}
        <div style={{ marginBottom: 44 }}>
          <h2 style={h2}>Department Contacts</h2>
          <p style={subhead}>For specific enquiries, contact the relevant department directly.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 20 }}>
            {departments.map(d => (
              <div key={d.title} style={card}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>{d.icon}</div>
                <h3 style={h3}>{d.title}</h3>
                <p style={{ ...body, marginBottom: 8 }}>{d.contact}</p>
                <a href={`mailto:${d.email}`} style={{ ...body, color: '#1149D8', fontSize: 11, wordBreak: 'break-all' as const }}>
                  {d.email}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div>
          <h2 style={{ ...h2, marginBottom: 6 }}>Find Us</h2>
          <p style={subhead}>Jessons Meadow · London Road · Brimscombe · Stroud · GL5 2SH</p>
          <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #E5E7EB', marginBottom: 16 }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2474.3!2d-2.147!3d51.717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487108b3b3b3b3b3%3A0x0!2sBrimscombe+%26+Thrupp+FC!5e0!3m2!1sen!2suk!4v1"
              width="100%"
              height="300"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Jessons Meadow location"
            />
          </div>
          <a
            href="https://maps.google.com/?q=Brimscombe+and+Thrupp+FC,+London+Road,+Brimscombe,+GL5+2SH"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: '#1149D8',
              padding: '10px 20px',
              borderRadius: 6,
              color: '#fff',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: 16,
              textDecoration: 'none',
            }}
          >
            Open in Google Maps →
          </a>
        </div>

      </section>
    </main>
  )
}
