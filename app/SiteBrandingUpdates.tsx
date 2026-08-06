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
  footerText?: string
  copyrightText?: string
  sponsorTicker?: string[]
}

const defaults: Required<Pick<SiteSettings,
  'clubName' | 'clubNickname' | 'foundedYear' | 'groundName' | 'groundSponsorName' |
  'addressLine1' | 'postcode' | 'contactEmail' | 'contactPhone' | 'facebookUrl' |
  'instagramUrl' | 'xUrl' | 'openingHours' | 'seasonYear' | 'footerText' | 'copyrightText'
>> = {
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
  footerText: 'Est. 1886 · The Lilywhites',
  copyrightText: '© 2026 Brimscombe & Thrupp FC. All rights reserved.',
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildReplacements(settings: SiteSettings): Array<[RegExp, string]> {
  const groundName = settings.groundName || defaults.groundName
  const groundSponsorName = settings.groundSponsorName || defaults.groundSponsorName
  const clubName = settings.clubName || defaults.clubName
  const seasonYear = settings.seasonYear || defaults.seasonYear
  const footerText = settings.footerText || defaults.footerText
  const copyrightText = settings.copyrightText || defaults.copyrightText
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
    [/BRIMSCOMBE & THRUPP FC/g, clubName.toUpperCase()],
    [/Brimscombe & Thrupp FC/g, clubName],
    [/2026\/27 Season/g, `${seasonYear} Season`],
    [/Est\. 1886 · The Lilywhites/g, footerText],
    [/© 2026 Brimscombe & Thrupp FC\. All rights reserved\./g, copyrightText],
    [/📍 Jessons Meadow, London Road, Brimscombe, GL5 2SH/g, `📍 ${address}`],
    [/📍 Brackenfern Meadow, London Road, Brimscombe, GL5 2SH/g, `📍 ${address}`],
    [/📧 info@brimscombeandthruppfc\.co\.uk/g, `📧 ${settings.contactEmail || defaults.contactEmail}`],
    [/📞 07814 854108/g, `📞 ${settings.contactPhone || defaults.contactPhone}`],
    [/🕐 Mon–Fri 9am–5pm/g, `🕐 ${settings.openingHours || defaults.openingHours}`],
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
      if (element.src.includes('/sponsors/jessons-logo.png')) {
        element.src = '/sponsors/brackenfern-logo.png'
      }
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

  const spans = Array.from(ticker.querySelectorAll('span'))
  const repeated = [...names, ...names]
  spans.forEach((span, index) => {
    span.textContent = repeated[index % repeated.length]
  })
}

export default function SiteBrandingUpdates() {
  useEffect(() => {
    let observer: MutationObserver | null = null
    let cancelled = false

    async function applySettings() {
      let settings: SiteSettings = {}
      try {
        const response = await fetch('/api/content?type=settings')
        if (response.ok) settings = await response.json()
      } catch {
        // Keep safe defaults when Sanity is temporarily unavailable.
      }

      if (cancelled) return
      const replacements = buildReplacements(settings)
      updateNode(document.body, settings, replacements)
      updateSponsorTicker(settings)

      observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE && node.nodeValue) {
              node.nodeValue = replaceText(node.nodeValue, replacements)
            } else if (node instanceof HTMLElement) {
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
