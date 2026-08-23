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
        const value = node.nodeValue?.trim()
        if (value === 'Clubhouse' || value === 'Clubhouse booking') {
          node.nodeValue = node.nodeValue?.replace(value, 'Clubhouse Events') || 'Clubhouse Events'
        }
        node = walker.nextNode()
      }
    }

    updateLabels()
    const observer = new MutationObserver(updateLabels)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [pathname])

  return null
}
