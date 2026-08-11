import { ImageResponse } from 'next/og'

export const size = {
  width: 64,
  height: 64,
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          borderRadius: '50%',
          overflow: 'hidden',
        }}
      >
        <img
          src="https://www.brimscombeandthruppfc.co.uk/branding/crest.png"
          alt=""
          width="64"
          height="64"
          style={{ width: '64px', height: '64px', objectFit: 'cover' }}
        />
      </div>
    ),
    size
  )
}
