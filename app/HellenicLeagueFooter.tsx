'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const LEAGUE_URL = 'https://www.thehellenicleague.com/'
const LEAGUE_CREST_URL = 'https://cdn-img.zerozero.pt/img/logos/edicoes/166279_imgbank_.png'

/** Add the league affiliation above the copyright row of the existing site footer. */
export default function HellenicLeagueFooter() {
  const [mount, setMount] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    const footer = document.querySelector('body > footer') || document.querySelector('footer')
    if (!footer) return
    const host = document.createElement('div')
    host.setAttribute('data-hellenic-affiliation', '')
    footer.insertBefore(host, footer.lastElementChild)
    setMount(host)
    return () => {
      setMount(null)
      host.remove()
    }
  }, [])

  if (!mount) return null

  return createPortal(
    <section aria-label="League affiliation" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 0 34px', borderBottom: '1px solid rgba(255,255,255,.08)', marginBottom: 22 }}>
      <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 10, color: 'rgba(255,255,255,.5)', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 14 }}>League affiliation</div>
      <a href={LEAGUE_URL} target="_blank" rel="noopener noreferrer" aria-label="Visit the Hellenic Football League's new official website" style={{ display: 'inline-flex', alignItems: 'center', gap: 16, maxWidth: '100%', color: '#fff', textDecoration: 'none' }}>
        <img src={LEAGUE_CREST_URL} alt="Hellenic Football League crest" loading="lazy" style={{ display: 'block', width: 68, height: 68, objectFit: 'contain', background: '#fff', borderRadius: 8, padding: 3, flexShrink: 0 }} />
        <span style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 23, lineHeight: 1.1, letterSpacing: '.03em' }}>THE HELLENIC FOOTBALL LEAGUE</span>
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, lineHeight: 1.5, color: 'rgba(255,255,255,.7)', overflowWrap: 'anywhere' }}>Visit the new official league website ↗</span>
        </span>
      </a>
    </section>,
    mount
  )
}
