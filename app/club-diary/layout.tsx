import type { ReactNode } from 'react'

export default function ClubDiaryLayout({ children }: { children: ReactNode }) {
  return <>
    <style dangerouslySetInnerHTML={{ __html: `
      .clubDiaryBackRow {
        width: 100%;
        box-sizing: border-box;
        padding: 10px 16px 0;
        background: #f2f4f7;
      }

      .clubDiaryBackLink {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        min-height: 40px;
        padding: 8px 13px;
        border: 1px solid #d0d5dd;
        border-radius: 10px;
        background: #fff;
        color: #0b2f69;
        font-family: 'Montserrat', sans-serif;
        font-size: 13px;
        font-weight: 800;
        line-height: 1;
        text-decoration: none;
        box-shadow: 0 2px 7px rgba(16, 24, 40, .05);
      }

      .clubDiaryBackLink:hover,
      .clubDiaryBackLink:focus-visible {
        background: #f8fafc;
        outline: 2px solid #0b5fa5;
        outline-offset: 2px;
      }

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

      /* Month tiles are deliberately summary-only. The whole tile opens the
         individual detail, so an extra "View details" line is unnecessary. */
      [data-month-details] {
        display: none !important;
      }

      @media (min-width: 761px) {
        [class*="ClubDiary_monthDay__"] {
          height: 158px !important;
          min-height: 158px !important;
          max-height: 158px !important;
          overflow: hidden !important;
        }

        [class*="ClubDiary_monthDay__"] [class*="ClubDiary_dayNumberRow__"] {
          margin-bottom: 5px !important;
        }

        [class*="ClubDiary_monthDay__"] [class*="ClubDiary_calendarChip__"] {
          min-height: 24px !important;
          height: 24px !important;
          margin: 0 0 3px !important;
          padding: 3px 6px !important;
          display: flex !important;
          align-items: center !important;
          overflow: hidden !important;
        }

        [class*="ClubDiary_monthDay__"] [class*="ClubDiary_calendarChip__"] strong {
          display: block !important;
          min-width: 0 !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
          font-size: 10.5px !important;
          line-height: 1.1 !important;
        }

        [class*="ClubDiary_monthDay__"] [class*="ClubDiary_calendarChip__"] > span {
          display: none !important;
        }

        [class*="ClubDiary_monthDay__"] [class*="ClubDiary_moreItems__"] {
          display: inline-flex !important;
          align-items: center !important;
          min-height: 18px !important;
          margin: 0 !important;
          padding: 1px 4px !important;
          border: 0 !important;
          border-radius: 5px !important;
          background: #eef2f6 !important;
          color: #344054 !important;
          font: inherit !important;
          font-size: 9.5px !important;
          line-height: 1 !important;
          font-weight: 900 !important;
          cursor: pointer !important;
        }
      }

      @media (max-width: 760px) {
        html,
        body {
          max-width: 100%;
          overflow-x: clip;
        }

        .clubDiaryBackRow {
          padding: 8px 10px 0;
        }

        .clubDiaryBackLink {
          min-height: 38px;
          padding: 7px 11px;
          font-size: 12px;
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
    <div className="clubDiaryBackRow">
      <a className="clubDiaryBackLink" href="/" aria-label="Back to Brimscombe and Thrupp FC home page">← Back to home</a>
    </div>
    {children}
  </>
}
