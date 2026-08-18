'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function FirstTeamTableEmbed() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== '/fixtures') return

    let applying = false

    function reset() {
      document.querySelectorAll('[data-first-xi-hidden="true"]').forEach((element) => {
        if (element instanceof HTMLElement) {
          element.style.removeProperty('display')
          element.removeAttribute('data-first-xi-hidden')
        }
      })
      document.querySelectorAll('[data-first-xi-table-embed="true"]').forEach((element) => element.remove())
    }

    function apply() {
      if (applying) return
      applying = true
      try {
        const heading = Array.from(document.querySelectorAll('h1')).find(
          (element) => element.textContent?.trim().toLowerCase() === 'btfc first xi league table'
        ) as HTMLElement | undefined

        if (!heading) {
          reset()
          return
        }

        const section = heading.closest('section')
        if (!section) return
        if (section.querySelector('[data-first-xi-table-embed="true"]')) return

        Array.from(section.children).forEach((child) => {
          if (child === heading || !(child instanceof HTMLElement)) return
          child.style.display = 'none'
          child.setAttribute('data-first-xi-hidden', 'true')
        })

        const wrapper = document.createElement('div')
        wrapper.setAttribute('data-first-xi-table-embed', 'true')
        wrapper.style.background = '#fff'
        wrapper.style.border = '1px solid #DCE3F1'
        wrapper.style.borderRadius = '8px'
        wrapper.style.overflow = 'hidden'
        wrapper.style.boxShadow = '0 8px 24px rgba(4,27,95,.06)'

        const frame = document.createElement('iframe')
        frame.src = '/full-time/first-team-table.html'
        frame.title = 'Official Hellenic League Division One table'
        frame.style.display = 'block'
        frame.style.width = '100%'
        frame.style.minHeight = '900px'
        frame.style.border = '0'
        frame.style.background = '#fff'
        wrapper.appendChild(frame)
        section.appendChild(wrapper)
      } finally {
        applying = false
      }
    }

    apply()
    const observer = new MutationObserver(() => window.setTimeout(apply, 0))
    observer.observe(document.body, { childList: true, subtree: true, characterData: true })

    return () => {
      observer.disconnect()
      reset()
    }
  }, [pathname])

  return null
}
