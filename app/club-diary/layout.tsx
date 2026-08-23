import type { ReactNode } from 'react'

export default function ClubDiaryLayout({ children }: { children: ReactNode }) {
  return <>
    <style dangerouslySetInnerHTML={{ __html: `
      [class*="ClubDiary_calendarControls__"] {
        position: sticky;
        top: 82px;
        z-index: 45;
        margin: 12px -6px 0 !important;
        padding: 8px 6px;
        background: rgba(242, 244, 247, 0.96);
        border-bottom: 1px solid rgba(208, 213, 221, 0.9);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }

      [class*="ClubDiary_toolbar__"] {
        position: sticky;
        top: 145px;
        z-index: 44;
        margin: 0 -6px 10px !important;
        padding: 7px 6px 8px !important;
        background: rgba(242, 244, 247, 0.96);
        box-shadow: 0 8px 14px rgba(16, 24, 40, 0.05);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
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

      @media (max-width: 760px) {
        [class*="ClubDiary_calendarControls__"] {
          top: 76px;
          margin-left: -4px !important;
          margin-right: -4px !important;
        }

        [class*="ClubDiary_toolbar__"] {
          top: 181px;
          margin-left: -4px !important;
          margin-right: -4px !important;
        }
      }
    ` }} />
    {children}
  </>
}
