'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ClubDiaryWording() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname.startsWith('/club-diary')) return

    const updateLabels = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
      let node: Node | null = walker.nextNode()

      while (node) {
        const value = node.nodeValue || ''
        const trimmed = value.trim()
        const parent = node.parentElement

        if (trimmed === 'Clubhouse' || trimmed === 'Clubhouse booking') {
          node.nodeValue = value.replace(trimmed, 'Clubhouse Events')
        } else if (/General access/i.test(value)) {
          node.nodeValue = value
            .replace(/General access/g, 'Standard login')
            .replace(/general access/g, 'standard login')
        }

        if (parent?.tagName === 'BUTTON' && trimmed === 'Admin') {
          node.nodeValue = value.replace('Admin', 'Admin login')
        }

        node = walker.nextNode()
      }

      document.querySelectorAll('button').forEach((button) => {
        if (button.textContent?.trim() === 'Switch access') {
          ;(button as HTMLElement).style.display = 'none'
          button.setAttribute('aria-hidden', 'true')
          button.setAttribute('tabindex', '-1')
        }
      })
    }

    updateLabels()
    const observer = new MutationObserver(updateLabels)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [pathname])

  return null
}
