'use client'

import { useEffect } from 'react'

const replacements: Array<[RegExp, string]> = [
  [/THE JESSONS MEADOW/g, 'BRACKENFERN MEADOW'],
  [/The Jessons Meadow/g, 'Brackenfern Meadow'],
  [/JESSONS MEADOW/g, 'BRACKENFERN MEADOW'],
  [/Jessons Meadow/g, 'Brackenfern Meadow'],
  [/Jessons Real Estate/g, 'Brackenfern Advisory Limited'],
]

function replaceText(value: string) {
  return replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value)
}

function updateNode(root: ParentNode) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()

  while (node) {
    if (node.nodeValue) {
      const updated = replaceText(node.nodeValue)
      if (updated !== node.nodeValue) node.nodeValue = updated
    }
    node = walker.nextNode()
  }

  root.querySelectorAll?.('img, iframe, a').forEach((element) => {
    if (element instanceof HTMLImageElement) {
      if (element.src.includes('/sponsors/jessons-logo.png')) {
        element.src = '/sponsors/brackenfern-logo.png'
      }
      element.alt = replaceText(element.alt)
    }

    for (const attribute of ['title', 'aria-label']) {
      const value = element.getAttribute(attribute)
      if (value) element.setAttribute(attribute, replaceText(value))
    }
  })
}

export default function SiteBrandingUpdates() {
  useEffect(() => {
    updateNode(document.body)

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE && node.nodeValue) {
            node.nodeValue = replaceText(node.nodeValue)
          } else if (node instanceof HTMLElement) {
            updateNode(node)
          }
        })
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return null
}
