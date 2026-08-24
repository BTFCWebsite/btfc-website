'use client'

import { useEffect } from 'react'

export default function ClubDiaryStickyHero() {
  useEffect(() => {
    const media = window.matchMedia('(max-width: 900px)')
    let hero: HTMLElement | null = null
    let observer: MutationObserver | null = null
    let timer: ReturnType<typeof setTimeout> | null = null

    const findHero = () => {
      hero = Array.from(document.querySelectorAll('section')).find((section) =>
        section.querySelector('h1')?.textContent?.trim() === 'Club Diary'
      ) as HTMLElement | null
    }

    const apply = () => {
      if (!hero || !document.body.contains(hero)) findHero()
      if (!hero) return

      if (media.matches) {
        hero.style.position = 'sticky'
        hero.style.top = '8px'
        hero.style.zIndex = '90'
        hero.style.boxShadow = '0 12px 30px rgba(10,35,78,.28)'
      } else {
        hero.style.position = ''
        hero.style.top = ''
        hero.style.zIndex = ''
        hero.style.boxShadow = ''
      }
    }

    const queueApply = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(apply, 60)
    }

    findHero()
    apply()
    media.addEventListener('change', apply)

    observer = new MutationObserver(queueApply)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      if (timer) clearTimeout(timer)
      observer?.disconnect()
      media.removeEventListener('change', apply)
      if (hero) {
        hero.style.position = ''
        hero.style.top = ''
        hero.style.zIndex = ''
        hero.style.boxShadow = ''
      }
    }
  }, [])

  return null
}
