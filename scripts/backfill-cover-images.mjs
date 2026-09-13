/**
 * One-off backfill: migrate legacy blog cover_image values to Supabase Storage.
 *
 * Migrates rows where cover_image is a data: URL.
 * Leaves null/empty/non-allowlisted hosts as-is (runtime default OG still covers crawlers).
 *
 * Run (from repo root, with service role):
 *
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *     node scripts/backfill-cover-images.mjs
 *
 * Optional dry run:
 *   DRY_RUN=1 node scripts/backfill-cover-images.mjs
 */

import { createClient } from '@supabase/supabase-js';

const ALLOWED_HOST = 'uktnmjykbyuvfsbtawwg.supabase.co';
const BUCKET = 'blog-covers';
const PAGE_SIZE = 50;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const dryRun = process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true';

if (!url || !serviceKey) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY',
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function isAllowedHttps(cover) {
  try {
    const parsed = new URL(cover);
    return parsed.protocol === 'https:' && parsed.hostname === ALLOWED_HOST;
  } catch {
    return false;
  }
}

function parseDataUrl(dataUrl) {
  const match = /^data:([^;]+);base64,(.+)$/s.exec(dataUrl);
  if (!match) return null;
  return {
    contentType: match[1] || 'image/jpeg',
    buffer: Buffer.from(match[2], 'base64'),
  };
}

async function migrateDataCover(blog) {
  const parsed = parseDataUrl(blog.cover_image);
  if (!parsed) {
    throw new Error('Could not parse data URL');
  }

  const owner = blog.author_id || blog.blog_id;
  const path = `${owner}/backfill-${blog.blog_id}-${Date.now()}.jpg`;

  if (dryRun) {
    return { publicUrl: `(dry-run) ${path}`, bytes: parsed.buffer.length };
  }

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, parsed.buffer, {
      contentType: 'image/jpeg',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const publicUrl = data.publicUrl;

  const { error: updateError } = await supabase
    .from('blogs')
    .update({ cover_image: publicUrl })
    .eq('blog_id', blog.blog_id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  return { publicUrl, bytes: parsed.buffer.length };
}

async function main() {
  let migrated = 0;
  let skipped = 0;
  let failed = 0;
  let offset = 0;

  console.log(dryRun ? 'DRY RUN — no writes' : 'LIVE — writing to storage + blogs');

  for (;;) {
    const { data: rows, error } = await supabase
      .from('blogs')
      .select('blog_id, author_id, cover_image')
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      console.error('Query failed:', error.message);
      process.exit(1);
    }

    if (!rows?.length) break;

    for (const blog of rows) {
      const cover =
        typeof blog.cover_image === 'string' ? blog.cover_image.trim() : '';

      if (!cover) {
        skipped += 1;
        continue;
      }

      if (isAllowedHttps(cover)) {
        skipped += 1;
        continue;
      }

      if (!cover.startsWith('data:')) {
        console.log(
          `skip non-allowlisted host blog_id=${blog.blog_id} cover=${cover.slice(0, 80)}`,
        );
        skipped += 1;
        continue;
      }

      try {
        const result = await migrateDataCover(blog);
        migrated += 1;
        console.log(
          `migrated blog_id=${blog.blog_id} bytes=${result.bytes} -> ${result.publicUrl}`,
        );
      } catch (err) {
        failed += 1;
        console.error(
          `failed blog_id=${blog.blog_id}:`,
          err instanceof Error ? err.message : err,
        );
      }
    }

    if (rows.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  console.log(
    JSON.stringify({ migrated, skipped, failed, dryRun }, null, 2),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
