'use client'

import { useEffect } from 'react'

export default function ClubDiaryDeleteFeedback() {
  useEffect(() => {
    let pendingArticle: HTMLElement | null = null
    const originalFetch = window.fetch.bind(window)

    const renameButtons = () => {
      for (const button of Array.from(document.querySelectorAll('button'))) {
        if (button.textContent?.trim() === 'Remove') button.textContent = 'Delete'
      }
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const button = target?.closest('button')
      if (!button || button.textContent?.trim() !== 'Delete') return
      pendingArticle = button.closest('article') as HTMLElement | null
    }

    const patchedFetch: typeof window.fetch = async (input, init) => {
      const response = await originalFetch(input, init)
      try {
        const url = typeof input === 'string'
          ? input
          : input instanceof Request
            ? input.url
            : String(input)
        const body = typeof init?.body === 'string' ? JSON.parse(init.body) : null

        if (
          response.ok &&
          url.includes('/api/club-diary') &&
          String(init?.method || 'GET').toUpperCase() === 'POST' &&
          body?.action === 'deleteEvent'
        ) {
          const article = pendingArticle
          pendingArticle = null
          if (article?.isConnected) {
            article.style.transition = 'opacity 140ms ease, transform 140ms ease'
            article.style.opacity = '0'
            article.style.transform = 'scale(.985)'
            window.setTimeout(() => article.remove(), 150)
          }
        }
      } catch {
        // Leave the existing diary UI to show any API error.
      }
      return response
    }

    window.fetch = patchedFetch
    document.addEventListener('click', onClick, true)
    renameButtons()

    const observer = new MutationObserver(renameButtons)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('click', onClick, true)
      observer.disconnect()
      if (window.fetch === patchedFetch) window.fetch = originalFetch
    }
  }, [])

  return null
}
