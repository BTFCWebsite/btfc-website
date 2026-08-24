'use client'

import { useEffect } from 'react'

type SelectedItem = {
  title: string
  kicker: string
}

function normalise(value = '') {
  return value.replace(/\s+/g, ' ').trim().toLowerCase()
}

export default function ClubDiarySingleItemDetail() {
  useEffect(() => {
    let selected: SelectedItem | null = null
    let timer: ReturnType<typeof setTimeout> | null = null

    const restoreDay = () => {
      for (const article of Array.from(document.querySelectorAll<HTMLElement>('[data-btfc-single-hidden="true"]'))) {
        article.style.display = ''
        delete article.dataset.btfcSingleHidden
      }
      document.querySelector<HTMLElement>('[data-btfc-back-to-day]')?.remove()
    }

    const clearSelection = () => {
      selected = null
      restoreDay()
    }

    const applySelection = () => {
      if (!selected) return

      const dayView = document.querySelector<HTMLElement>('[class*="dayView"]')
      if (!dayView) return

      const articles = Array.from(dayView.querySelectorAll<HTMLElement>('article'))
      if (!articles.length) return

      const wantedTitle = normalise(selected.title)
      const wantedKicker = normalise(selected.kicker)

      const matching = articles.find((article) => {
        const title = normalise(article.querySelector('h3')?.textContent || '')
        if (title !== wantedTitle) return false
        if (!wantedKicker) return true
        const kicker = normalise(article.querySelector('p')?.textContent || '')
        return kicker === wantedKicker
      }) || articles.find((article) => normalise(article.querySelector('h3')?.textContent || '') === wantedTitle)

      if (!matching) return

      for (const article of articles) {
        if (article === matching) {
          article.style.display = ''
          delete article.dataset.btfcSingleHidden
        } else {
          article.style.display = 'none'
          article.dataset.btfcSingleHidden = 'true'
        }
      }

      const header = dayView.querySelector<HTMLElement>('[class*="dayViewHeader"]')
      if (header && !header.querySelector('[data-btfc-back-to-day]')) {
        const back = document.createElement('button')
        back.type = 'button'
        back.dataset.btfcBackToDay = 'true'
        back.textContent = '← Back to day'
        Object.assign(back.style, {
          border: '1px solid #d0d5dd',
          borderRadius: '10px',
          minHeight: '38px',
          padding: '7px 11px',
          background: '#fff',
          color: '#344054',
          font: 'inherit',
          fontSize: '12px',
          fontWeight: '800',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        })
        back.addEventListener('click', clearSelection)
        header.appendChild(back)
      }
    }

    const queueApply = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(applySelection, 30)
    }

    const onClickCapture = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null
      if (!target) return

      const tile = target.closest<HTMLElement>('[class*="calendarChip"]')
      const calendarCell = tile?.closest<HTMLElement>('[class*="monthDay"], [class*="weekDay"]')

      if (tile && calendarCell) {
        const title = tile.querySelector('strong')?.textContent?.trim() || ''
        if (!title) return
        const tooltip = tile.getAttribute('title') || ''
        const kicker = tooltip.includes(' · ') ? tooltip.split(' · ')[0].trim() : ''
        selected = { title, kicker }
        queueApply()
        return
      }

      if (
        target.closest('[class*="dayNumber"]') ||
        target.closest('[class*="viewButton"]') ||
        target.closest('[class*="navButton"]') ||
        target.closest('[class*="todayButton"]')
      ) {
        clearSelection()
      }
    }

    document.addEventListener('click', onClickCapture, true)

    const observer = new MutationObserver(() => {
      if (selected) queueApply()
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      if (timer) clearTimeout(timer)
      observer.disconnect()
      document.removeEventListener('click', onClickCapture, true)
      restoreDay()
    }
  }, [])

  return null
}
