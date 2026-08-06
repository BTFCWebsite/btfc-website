'use client'

import { useEffect } from 'react'

type SiteSettings = {
  clubName?: string
  clubNickname?: string
  foundedYear?: string
  groundName?: string
  groundSponsorName?: string
  addressLine1?: string
  addressLine2?: string
  postcode?: string
  contactEmail?: string
  contactPhone?: string
  facebookUrl?: string
  instagramUrl?: string
  xUrl?: string
  openingHours?: string
  seasonYear?: string
  heroTitle?: string
  heroSubtitle?: string
  homepageNotice?: string
  homepageNoticeLink?: string
  showHomepageNotice?: boolean
  footerText?: string
  copyrightText?: string
  sponsorTicker?: string[]
}

const defaults = {
  clubName: 'Brimscombe & Thrupp FC',
  clubNickname: 'The Lilywhites',
  foundedYear: '1886',
  groundName: 'Brackenfern Meadow',
  groundSponsorName: 'Brackenfern Advisory Limited',
  addressLine1: 'London Road, Brimscombe',
  postcode: 'GL5 2SH',
  contactEmail: 'info@brimscombeandthruppfc.co.uk',
  contactPhone: '07814 854108',
  facebookUrl: 'https://www.facebook.com/BrimscombeandThruppFC/',
  instagramUrl: 'https://www.instagram.com/brimscombeandthruppfc/',
  xUrl: 'https://x.com/Btfcthemeadow',
  openingHours: 'Mon–Fri 9am–5pm',
  seasonYear: '2026/27',
  heroTitle: 'BRIMSCOMBE & THRUPP FC',
  heroSubtitle: 'Est. 1886 · The Lilywhites',
  footerText: 'Est. 1886 · The Lilywhites',
  copyrightText: '© 2026 Brimscombe & Thrupp FC. All rights reserved.',
}

function buildReplacements(settings: SiteSettings): Array<[RegExp, string]> {
  const groundName = settings.groundName || defaults.groundName
  const groundSponsorName = settings.groundSponsorName || defaults.groundSponsorName
  const clubName = settings.clubName || defaults.clubName
  const clubNameUpper = clubName.toUpperCase()
  const seasonYear = settings.seasonYear || defaults.seasonYear
  const footerText = settings.footerText || defaults.footerText
  const copyrightText = settings.copyrightText || defaults.copyrightText
  const heroSubtitle = settings.heroSubtitle || defaults.heroSubtitle
  const finalClubSegment = clubNameUpper.includes('THRUPP ')
    ? `THRUPP ${clubNameUpper.split('THRUPP ')[1]}`
    : 'THRUPP FC'
  const address = [groundName, settings.addressLine1 || defaults.addressLine1, settings.addressLine2, settings.postcode || defaults.postcode]
    .filter(Boolean)
    .join(', ')

  return [
    [/THE JESSONS MEADOW/g, groundName.toUpperCase()],
    [/The Jessons Meadow/g, groundName],
    [/JESSONS MEADOW/g, groundName.toUpperCase()],
    [/Jessons Meadow/g, groundName],
    [/Jessons Real Estate/g, groundSponsorName],
    [/Brackenfern Meadow/g, groundName],
    [/BRACKENFERN MEADOW/g, groundName.toUpperCase()],
    [/Brackenfern Advisory Limited/g, groundSponsorName],
    [/BRIMSCOMBE\s*&\s*THRUPP FC/g, clubNameUpper],
    [/THRUPP FC/g, finalClubSegment],
    [/Brimscombe & Thrupp FC/g, clubName],
    [/Est\. 1886 · The Lilywhites/g, heroSubtitle],
    [/2026\/27 Season/g, `${seasonYear} Season`],
    [/© 2026 Brimscombe & Thrupp FC\. All rights reserved\./g, copyrightText],
    [/📍 Jessons Meadow, London Road, Brimscombe, GL5 2SH/g, `📍 ${address}`],
    [/📍 Brackenfern Meadow, London Road, Brimscombe, GL5 2SH/g, `📍 ${address}`],
    [/📧 info@brimscombeandthruppfc\.co\.uk/g, `📧 ${settings.contactEmail || defaults.contactEmail}`],
    [/📞 07814 854108/g, `📞 ${settings.contactPhone || defaults.contactPhone}`],
    [/🕐 Mon–Fri 9am–5pm/g, `🕐 ${settings.openingHours || defaults.openingHours}`],
    [new RegExp(defaults.footerText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), footerText],
  ]
}

function replaceText(value: string, replacements: Array<[RegExp, string]>) {
  return replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value)
}

function updateNode(root: ParentNode, settings: SiteSettings, replacements: Array<[RegExp, string]>) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()

  while (node) {
    if (node.nodeValue) {
      const updated = replaceText(node.nodeValue, replacements)
      if (updated !== node.nodeValue) node.nodeValue = updated
    }
    node = walker.nextNode()
  }

  root.querySelectorAll?.('img, iframe, a').forEach((element) => {
    if (element instanceof HTMLImageElement) {
      if (element.src.includes('/sponsors/jessons-logo.png')) element.src = '/sponsors/brackenfern-logo.png'
      element.alt = replaceText(element.alt, replacements)
    }

    for (const attribute of ['title', 'aria-label']) {
      const value = element.getAttribute(attribute)
      if (value) element.setAttribute(attribute, replaceText(value, replacements))
    }

    if (element instanceof HTMLAnchorElement) {
      if (element.href.includes('x.com/Btfcthemeadow') && settings.xUrl) element.href = settings.xUrl
      if (element.href.includes('facebook.com/BrimscombeandThruppFC') && settings.facebookUrl) element.href = settings.facebookUrl
      if (element.href.includes('instagram.com/brimscombeandthruppfc') && settings.instagramUrl) element.href = settings.instagramUrl
    }
  })
}

function updateSponsorTicker(settings: SiteSettings) {
  const names = (settings.sponsorTicker || []).map(name => name.trim()).filter(Boolean)
  if (!names.length) return

  const ticker = Array.from(document.querySelectorAll('div')).find(element =>
    element.style.animation?.includes('ticker') && element.querySelectorAll('span').length > 0
  )
  if (!ticker) return

  const repeated = [...names, ...names]
  Array.from(ticker.querySelectorAll('span')).forEach((span, index) => {
    span.textContent = repeated[index % repeated.length]
  })
}

function updateHomepageNotice(settings: SiteSettings) {
  document.getElementById('cms-homepage-notice')?.remove()
  if (!settings.showHomepageNotice || !settings.homepageNotice?.trim() || window.location.pathname !== '/') return

  const hero = document.querySelector('main section')
  if (!hero) return

  const notice = document.createElement(settings.homepageNoticeLink ? 'a' : 'div')
  notice.id = 'cms-homepage-notice'
  notice.textContent = settings.homepageNotice.trim()
  notice.setAttribute('style', [
    'position:absolute',
    'top:82px',
    'left:50%',
    'transform:translateX(-50%)',
    'z-index:5',
    'width:min(92%,760px)',
    'padding:12px 18px',
    'border-radius:6px',
    'background:#1149D8',
    'color:#fff',
    'font-family:Montserrat,sans-serif',
    'font-size:12px',
    'font-weight:800',
    'letter-spacing:.04em',
    'text-align:center',
    'text-decoration:none',
    'box-shadow:0 8px 24px rgba(4,27,95,.35)',
  ].join(';'))

  if (notice instanceof HTMLAnchorElement && settings.homepageNoticeLink) {
    notice.href = settings.homepageNoticeLink
    notice.target = '_blank'
    notice.rel = 'noopener noreferrer'
  }
  hero.appendChild(notice)
}

export default function SiteBrandingUpdates() {
  useEffect(() => {
    let observer: MutationObserver | null = null
    let cancelled = false

    async function applySettings() {
      let settings: SiteSettings = {}
      try {
        const response = await fetch('/api/content?type=settings', { cache: 'no-store' })
        if (response.ok) settings = await response.json()
      } catch {
        // Keep safe defaults when Sanity is temporarily unavailable.
      }

      if (cancelled) return
      const replacements = buildReplacements(settings)
      updateNode(document.body, settings, replacements)
      updateSponsorTicker(settings)
      updateHomepageNotice(settings)

      observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE && node.nodeValue) {
              node.nodeValue = replaceText(node.nodeValue, replacements)
            } else if (node instanceof HTMLElement && node.id !== 'cms-homepage-notice') {
              updateNode(node, settings, replacements)
              updateSponsorTicker(settings)
            }
          })
        }
      })

      observer.observe(document.body, { childList: true, subtree: true })
    }

    applySettings()
    return () => {
      cancelled = true
      observer?.disconnect()
    }
  }, [])

  return null
}
