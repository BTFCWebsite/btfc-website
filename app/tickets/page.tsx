'use client'
import { useState } from 'react'

export default function TicketsPage() {
  const [buyerName, setBuyerName] = useState('')
const [buyerEmail, setBuyerEmail] = useState('')
const [selectedTicket, setSelectedTicket] = useState<any>(null)

const paymentLinks: Record<string, string> = {
  Adult: 'https://pay.izettle.com/?k8L8pwP6Q',
  Concession: 'https://pay.izettle.com/?k8DRFS_yZ',
}

function startPurchase(ticket: any) {
  setSelectedTicket(ticket)
}

function createTicketAndPay() {
  if (!buyerName.trim() || !buyerEmail.includes('@')) {
    alert('Please enter a valid name and email address.')
    return
  }

  const type = selectedTicket.title.includes('Concession') ? 'Concession' : 'Adult'
  const ref = `BTFC-${type.toUpperCase()}-${Date.now()}`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(ref)}`

  const ticketWindow = window.open('', '_blank')

  if (ticketWindow) {
    ticketWindow.document.write(`
      <html>
        <head>
          <title>BTFC Season Ticket</title>
          <style>
            body { font-family: Arial, sans-serif; background:#F2F2F2; padding:40px; }
            .ticket { max-width:700px; margin:auto; background:#fff; border:4px solid #041B5F; padding:32px; }
            h1 { color:#041B5F; margin:0; }
            h2 { color:#1149D8; }
            .qr { text-align:center; margin:24px 0; }
            .ref { font-weight:bold; color:#041B5F; }
            .note { font-size:12px; color:#666; margin-top:20px; }
            button { background:#1149D8; color:#fff; border:0; padding:12px 22px; border-radius:6px; font-weight:bold; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <h1>Brimscombe & Thrupp FC</h1>
            <h2>2026/27 ${type} Season Ticket</h2>
            <p><strong>Name:</strong> ${buyerName}</p>
            <p><strong>Email:</strong> ${buyerEmail}</p>
            <p><strong>Ticket:</strong> ${selectedTicket.title} — ${selectedTicket.price}</p>
            <p><strong>Includes:</strong> First Team home league and cup games, plus free online matchday programme.</p>
            <div class="qr"><img src="${qrUrl}" /></div>
            <p class="ref">Ticket Ref: ${ref}</p>
            <p class="note">Ticket valid once payment has been confirmed by BTFC against Zettle records.</p>
            <button onclick="window.print()">Save / Print PDF</button>
          </div>
        </body>
      </html>
    `)
  }

  window.open(paymentLinks[type], '_blank')
}
  const paymentLinks: Record<string, string> = {
  Adult: 'https://pay.izettle.com/?k8L8pwP6Q',
  Concession: 'https://pay.izettle.com/?k8DRFS_yZ',
}
  const tickets = [
    {
      title: 'Adult',
      price: '£100',
      note: '2026/27 Season — Adult Season Ticket.',
      items: [
        'All First Team home league games',
        'All First Team home cup games',
        'Free online matchday programme',
        'Digital season ticket included',
      ],
    },
    {
      title: 'Concession',
      price: '£80',
      note: '2026/27 Season — Concession Season Ticket.',
      items: [
        'All First Team home league games',
        'All First Team home cup games',
        'Free online matchday programme',
        'Digital season ticket included',
      ],
    },
  ]

  const faqs = [
    ['Can I pay in instalments?', 'Not currently — season tickets must be paid in full at time of purchase.'],
    ['How do I collect my ticket?', 'After payment you will receive your digital season ticket by email. Show it on your phone at the gate or print it at home.'],
    ['What is included?', 'Your season ticket covers all First Team home league and cup fixtures, plus a free online matchday programme.'],
    ['Is my payment secure?', 'Yes. Payments are processed securely by Zettle, a PayPal company.'],
  ]

  return (
    <main style={{ background:'#F2F2F2', minHeight:'100vh', padding:'90px 24px 90px' }}>
      <section style={{ maxWidth:980, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:42 }}>
          <h1 style={{
            fontFamily:"'Barlow Condensed',sans-serif",
            fontSize:52,
            fontWeight:800,
            color:'#2D2D2D',
            margin:'0 0 8px',
            letterSpacing:'0.04em'
          }}>
            Season Tickets
          </h1>
          <p style={{ fontFamily:"'Montserrat',sans-serif", color:'#6B7280', margin:0, fontSize:14 }}>
            Secure your seat for the 2026/27 season
          </p>
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
            <h2 style={{
              fontFamily:"'Barlow Condensed',sans-serif",
              fontSize:28,
              fontWeight:800,
              margin:'0 0 6px',
              letterSpacing:'0.03em'
            }}>
              🎟️ 2026/27 Season Tickets On Sale Now
            </h2>
            <p style={{
              fontFamily:"'Montserrat',sans-serif",
              margin:0,
              color:'rgba(255,255,255,.7)',
              fontSize:13,
              lineHeight:1.6
            }}>
              Adult £100 · Concession £80 · League and cup games included · Free online programme · Secure payment via <strong>Zettle</strong>
            </p>
          </div>

          <div style={{
            background:'#1149D8',
            padding:'12px 22px',
            borderRadius:6,
            textAlign:'center',
            fontFamily:"'Barlow Condensed',sans-serif",
            fontWeight:800,
            fontSize:20
          }}>
            <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9, opacity:.7, letterSpacing:'.12em' }}>
              POWERED BY
            </div>
            Zettle
          </div>
        </div>

        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(2, minmax(0, 1fr))',
          gap:28,
          marginBottom:44,
          alignItems:'stretch'
        }}>
          {tickets.map((t) => (
            <div key={t.title} style={{
              background:'#fff',
              border:'1px solid #E5E7EB',
              borderRadius:8,
              padding:24,
              display:'flex',
              flexDirection:'column',
              minHeight:320
            }}>
              <div style={{ height:4, background:'#1149D8', marginBottom:20 }} />

              <h2 style={{
                fontFamily:"'Barlow Condensed',sans-serif",
                fontSize:30,
                fontWeight:800,
                color:'#2D2D2D',
                margin:'0 0 6px',
                lineHeight:1.05
              }}>
                {t.title}
              </h2>

              <div style={{
                fontFamily:"'Barlow Condensed',sans-serif",
                fontSize:54,
                fontWeight:800,
                color:'#1149D8',
                lineHeight:.95,
                marginBottom:10
              }}>
                {t.price}
              </div>

              <p style={{
                fontFamily:"'Montserrat',sans-serif",
                fontSize:13,
                color:'#6B7280',
                lineHeight:1.55,
                margin:'0 0 18px',
                minHeight:42
              }}>
                {t.note}
              </p>

              <div style={{ display:'grid', gap:8, marginBottom:22 }}>
                {t.items.map((item) => (
                  <div key={item} style={{
                    fontFamily:"'Montserrat',sans-serif",
                    fontSize:12,
                    color:'#374151',
                    lineHeight:1.4
                  }}>
                    <span style={{ color:'#1149D8', fontWeight:900 }}>✓</span> {item}
                  </div>
                ))}
              </div>

             <button
  onClick={() => startPurchase(t)}
  style={{
    marginTop:'auto',
    border:'2px solid #1149D8',
    color:'#1149D8',
    textAlign:'center',
    padding:'10px 14px',
    borderRadius:6,
    textDecoration:'none',
    fontSize:11,
    fontWeight:900,
    letterSpacing:'.08em',
    textTransform:'uppercase',
    background:'#fff',
    cursor:'pointer'
  }}
>
  SELECT
</button>
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, minmax(0, 1fr))', gap:20 }}>
          {faqs.map(([title, text]) => (
            <div key={title} style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:8, padding:22, minHeight:150 }}>
              <h3 style={{
                fontFamily:"'Barlow Condensed',sans-serif",
                fontSize:22,
                fontWeight:800,
                color:'#2D2D2D',
                margin:'0 0 12px',
                lineHeight:1.1
              }}>
                {title}
              </h3>
              <p style={{
                fontFamily:"'Montserrat',sans-serif",
                fontSize:12,
                color:'#4B5563',
                lineHeight:1.65,
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
