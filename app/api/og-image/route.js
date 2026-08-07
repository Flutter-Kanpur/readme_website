import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { isAllowedOgSource } from '@/app/lib/ogImageUrl';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const OG_TARGET_BYTES = 500 * 1024;

export async function GET(request) {
  const src = request.nextUrl.searchParams.get('src');

  if (!src || !isAllowedOgSource(src)) {
    return new NextResponse('Invalid image source', { status: 400 });
  }

  try {
    const res = await fetch(src, { cache: 'no-store' });
    if (!res.ok) {
      return new NextResponse('Image not found', { status: 404 });
    }

    const input = Buffer.from(await res.arrayBuffer());

    let quality = 82;
    let output = await renderOgJpeg(input, quality);

    while (output.length > OG_TARGET_BYTES && quality > 45) {
      quality -= 8;
      output = await renderOgJpeg(input, quality);
    }

    // Uint8Array avoids UTF-8 corruption of binary JPEG on some runtimes.
    return new NextResponse(new Uint8Array(output), {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Length': String(output.length),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('og-image error:', error);
    return new NextResponse('Failed to generate preview image', { status: 500 });
  }
}

function renderOgJpeg(input, quality) {
  return sharp(input)
    .rotate()
    .resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover', position: 'centre' })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();
}
