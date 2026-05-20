import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default async function Icon() {
  const src = await fetch(new URL('./raw-icon.png', import.meta.url)).then((res) =>
    res.arrayBuffer()
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '15%', // Applies a nice smooth rounded square
          overflow: 'hidden',
          background: 'transparent'
        }}
      >
        <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    ),
    { ...size }
  );
}
