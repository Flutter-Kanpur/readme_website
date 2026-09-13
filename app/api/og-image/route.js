import { NextResponse } from 'next/server';
import { getDefaultShareImageUrl, isAllowedOgSource } from '@/app/lib/ogImageUrl';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const OG_TARGET_BYTES = 500 * 1024;
const FETCH_TIMEOUT_MS = 8000;
const FETCH_RETRIES = 2;
const MAX_INPUT_BYTES = 8 * 1024 * 1024;
const CACHE_CONTROL =
  'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400';

let cachedDefaultBuffer = null;
let sharpModulePromise = null;

/**
 * Lazy-load sharp. A top-level import crashes the whole Vercel function when
 * the native binary fails to load (sharp 0.35 + Turbopack tracing), which
 * made every /api/og-image request return HTML 500 — so WhatsApp/LinkedIn
 * saw no preview even though og:image meta tags were correct.
 */
function loadSharp() {
  if (!sharpModulePromise) {
    sharpModulePromise = import('sharp')
      .then((mod) => mod.default || mod)
      .catch((error) => {
        sharpModulePromise = null;
        throw error;
      });
  }
  return sharpModulePromise;
}

async function getDefaultOgBuffer() {
  if (cachedDefaultBuffer) return cachedDefaultBuffer;
  const res = await fetch(getDefaultShareImageUrl(), { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Default OG asset fetch failed: HTTP ${res.status}`);
  }
  cachedDefaultBuffer = Buffer.from(await res.arrayBuffer());
  return cachedDefaultBuffer;
}

function jpegResponse(buffer) {
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Length': String(buffer.length),
      'Cache-Control': CACHE_CONTROL,
    },
  });
}

async function fallbackJpegResponse(reason, error) {
  if (error) {
    console.error('og-image fallback:', reason, error);
  } else {
    console.error('og-image fallback:', reason);
  }
  try {
    return jpegResponse(await getDefaultOgBuffer());
  } catch (fallbackError) {
    console.error('og-image default asset missing:', fallbackError);
    // Last resort: redirect to the static asset (CDN serves it reliably).
    return NextResponse.redirect(getDefaultShareImageUrl(), 302);
  }
}

async function fetchUpstream(src) {
  let lastError = null;

  for (let attempt = 0; attempt <= FETCH_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(src, {
        cache: 'no-store',
        signal: controller.signal,
      });
      if (!res.ok) {
        lastError = new Error(`Upstream HTTP ${res.status}`);
        continue;
      }
      const input = Buffer.from(await res.arrayBuffer());
      if (input.length > MAX_INPUT_BYTES) {
        throw new Error(`Upstream image too large: ${input.length} bytes`);
      }
      return input;
    } catch (error) {
      lastError = error;
      if (attempt < FETCH_RETRIES) {
        await new Promise((r) => setTimeout(r, 200 * (attempt + 1)));
      }
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError || new Error('Upstream fetch failed');
}

async function renderOgJpeg(input, quality) {
  const sharp = await loadSharp();
  return sharp(input)
    .rotate()
    .resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover', position: 'centre' })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();
}

export async function GET(request) {
  const src = request.nextUrl.searchParams.get('src');

  if (!src || !isAllowedOgSource(src)) {
    return fallbackJpegResponse(src ? 'invalid source' : 'missing source');
  }

  try {
    const input = await fetchUpstream(src);

    let quality = 82;
    let output = await renderOgJpeg(input, quality);

    while (output.length > OG_TARGET_BYTES && quality > 45) {
      quality -= 8;
      output = await renderOgJpeg(input, quality);
    }

    return jpegResponse(output);
  } catch (error) {
    return fallbackJpegResponse('fetch or sharp failed', error);
  }
}
