export default function FixturesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        .fixtures-desktop-table {
          display: block !important;
          width: 100% !important;
          overflow-x: auto !important;
          -webkit-overflow-scrolling: touch;
        }

        .fixtures-mobile-list {
          display: none !important;
        }
      `}</style>
      {children}
    </>
  )
}
