import type { ReactNode } from 'react'

export default function ClubDiaryLayout({ children }: { children: ReactNode }) {
  return <>
    <style dangerouslySetInnerHTML={{ __html: `
      [class*="ClubDiary_dayNumber__"] {
        display: inline-block !important;
        width: auto !important;
        height: auto !important;
        min-height: 0 !important;
        padding: 1px 2px !important;
        border: 0 !important;
        border-radius: 0 !important;
        background: transparent !important;
        color: #0b5fa5 !important;
        font-size: 13px !important;
        line-height: 1.1 !important;
        font-weight: 900 !important;
        box-shadow: none !important;
      }

      [class*="ClubDiary_todayNumber__"] {
        background: transparent !important;
        color: #c43d32 !important;
        text-decoration: underline;
        text-decoration-thickness: 2px;
        text-underline-offset: 3px;
      }

      [class*="ClubDiary_outsideMonth__"] [class*="ClubDiary_dayNumber__"] {
        color: #98a2b3 !important;
      }

      @media (max-width: 760px) {
        html,
        body {
          max-width: 100%;
          overflow-x: clip;
        }

        [class*="ClubDiary_page__"] {
          width: 100% !important;
          max-width: 100vw !important;
          box-sizing: border-box !important;
          overflow-x: clip !important;
        }

        [class*="ClubDiary_shell__"],
        [class*="ClubDiary_calendarControls__"],
        [class*="ClubDiary_calendarNav__"],
        [class*="ClubDiary_viewButtons__"],
        [class*="ClubDiary_toolbar__"],
        [class*="ClubDiary_calendarPanel__"],
        [class*="ClubDiary_calendarScroller__"] {
          min-width: 0 !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
        }

        [class*="ClubDiary_toolbar__"] {
          position: static !important;
          top: auto !important;
          left: auto !important;
          right: auto !important;
          transform: none !important;
          width: 100% !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
        }

        [class*="ClubDiary_monthGrid__"] {
          min-width: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          grid-template-columns: repeat(7, minmax(0, 1fr)) !important;
          box-sizing: border-box !important;
        }

        [class*="ClubDiary_calendarScroller__"]:has([class*="ClubDiary_monthGrid__"]) {
          width: 100% !important;
          max-width: 100% !important;
          overflow-x: hidden !important;
        }

        [class*="ClubDiary_calendarScroller__"]:has([class*="ClubDiary_monthGrid__"]) [class*="ClubDiary_weekHeader__"] {
          min-width: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          grid-template-columns: repeat(7, minmax(0, 1fr)) !important;
          box-sizing: border-box !important;
        }

        [class*="ClubDiary_monthDay__"],
        [class*="ClubDiary_weekHeaderCell__"] {
          min-width: 0 !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
          overflow: hidden;
        }
      }
    ` }} />
    {children}
  </>
}
