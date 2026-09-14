/**
 * One-off backfill: migrate legacy base64 <img> tags embedded in blog
 * `content` (from before app/lib/uploadContentImages.js existed) to
 * Supabase Storage, compressing them the same way resolveContentImageUrls
 * does for new saves (see app/lib/uploadCoverImage.js's compressImageForUpload).
 *
 * Only rewrites <img src="data:...;base64,..."> occurrences inside
 * `content` — everything else in the row/document is left untouched.
 * Original content is backed up to scripts/backfill-backups/ before any
 * write, and the whole thing defaults to a dry run.
 *
 * Run (from repo root, with service role):
 *
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *     node scripts/backfill-content-images.mjs
 *
 * Optional dry run (default):
 *   DRY_RUN=1 node scripts/backfill-content-images.mjs
 * Apply for real:
 *   DRY_RUN=0 node scripts/backfill-content-images.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BUCKET = 'blog-covers';
const PAGE_SIZE = 50;
const BUCKET_MAX_BYTES = 5 * 1024 * 1024;
const UPLOAD_TARGET_BYTES = 4 * 1024 * 1024;
const MAX_DIMENSION = 1600;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const dryRun = process.env.DRY_RUN !== '0' && process.env.DRY_RUN !== 'false';

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Matches one <img ...src="data:...;base64,...">; only the src="..." span
// is captured/replaced, so any other attributes on the tag are left as-is.
const IMG_DATA_URL_RE = /(<img\b[^>]*?\ssrc=")(data:[^;"]+;base64,[^"]+)(")/gi;

function decodeDataUrl(dataUrl) {
  const commaIdx = dataUrl.indexOf(',');
  if (commaIdx === -1) return null;
  try {
    return Buffer.from(dataUrl.slice(commaIdx + 1), 'base64');
  } catch {
    return null;
  }
}

/** Mirrors app/lib/uploadCoverImage.js's compressImageForUpload, via sharp instead of canvas. */
async function compressBuffer(buffer) {
  if (buffer.length <= UPLOAD_TARGET_BYTES) {
    return sharp(buffer).jpeg({ quality: 90 }).toBuffer();
  }

  let quality = 85;
  let width = MAX_DIMENSION;
  let out = await sharp(buffer)
    .resize({ width, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality })
    .toBuffer();

  while (out.length > UPLOAD_TARGET_BYTES && quality > 45) {
    quality -= 10;
    out = await sharp(buffer)
      .resize({ width, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality })
      .toBuffer();
  }

  while (out.length > UPLOAD_TARGET_BYTES && width > 640) {
    width = Math.round(width * 0.85);
    out = await sharp(buffer)
      .resize({ width, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();
  }

  return out;
}

async function migrateBlogContent(blog) {
  const matches = [...blog.content.matchAll(IMG_DATA_URL_RE)];
  if (!matches.length) return null;

  let newContent = blog.content;
  let index = 0;
  let uploadedBytes = 0;
  let skippedImages = 0;

  for (const match of matches) {
    index += 1;
    const [full, prefix, dataUrl, suffix] = match;

    const raw = decodeDataUrl(dataUrl);
    if (!raw) {
      console.warn(`  [skip] image ${index}: couldn't decode data URL`);
      skippedImages += 1;
      continue;
    }

    let compressed;
    try {
      compressed = await compressBuffer(raw);
    } catch (err) {
      console.warn(`  [skip] image ${index}: compression failed — ${err.message}`);
      skippedImages += 1;
      continue;
    }

    if (compressed.length > BUCKET_MAX_BYTES) {
      console.warn(
        `  [skip] image ${index}: still too large after compression (${(compressed.length / 1024 / 1024).toFixed(1)} MB)`,
      );
      skippedImages += 1;
      continue;
    }

    const owner = blog.author_id || blog.blog_id;
    const uploadPath = `${owner}/content-backfill-${blog.blog_id}-${Date.now()}-${index}.jpg`;

    if (dryRun) {
      console.log(
        `  [dry-run] image ${index}: ${(raw.length / 1024).toFixed(0)} KB -> ${(compressed.length / 1024).toFixed(0)} KB, would upload to ${BUCKET}/${uploadPath}`,
      );
      newContent = newContent.replace(full, `${prefix}(dry-run)${uploadPath}${suffix}`);
      uploadedBytes += compressed.length;
      continue;
    }

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(uploadPath, compressed, { contentType: 'image/jpeg', upsert: false });

    if (uploadError) {
      console.error(`  [error] image ${index}: upload failed — ${uploadError.message}`);
      skippedImages += 1;
      continue;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(uploadPath);
    console.log(
      `  image ${index}: ${(raw.length / 1024).toFixed(0)} KB -> ${(compressed.length / 1024).toFixed(0)} KB -> ${data.publicUrl}`,
    );
    newContent = newContent.replace(full, `${prefix}${data.publicUrl}${suffix}`);
    uploadedBytes += compressed.length;
  }

  if (newContent === blog.content) return null;

  return { newContent, uploadedBytes, imageCount: matches.length, skippedImages };
}

async function main() {
  console.log(dryRun ? 'DRY RUN — no writes (set DRY_RUN=0 to apply)\n' : 'LIVE — writing to storage + blogs\n');

  const backupDir = path.join(__dirname, 'backfill-backups');
  const runBackupDir = path.join(backupDir, `run-${Date.now()}`);
  if (!dryRun) fs.mkdirSync(runBackupDir, { recursive: true });

  let migrated = 0;
  let skipped = 0;
  let failed = 0;
  let offset = 0;

  for (;;) {
    const { data: rows, error } = await supabase
      .from('blogs')
      .select('blog_id, slug, author_id, content')
      .not('content', 'is', null)
      .ilike('content', '%data:image%')
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      console.error('Query failed:', error.message);
      process.exit(1);
    }

    if (!rows?.length) break;

    for (const blog of rows) {
      const label = blog.slug || blog.blog_id;
      console.log(`\n--- ${label} (${blog.content.length.toLocaleString()} chars) ---`);

      try {
        const result = await migrateBlogContent(blog);
        if (!result) {
          console.log('  no embedded images matched, skipping');
          skipped += 1;
          continue;
        }

        console.log(
          `  content size: ${blog.content.length.toLocaleString()} -> ${result.newContent.length.toLocaleString()} chars` +
            (result.skippedImages ? ` (${result.skippedImages} image(s) left as-is)` : ''),
        );

        if (!dryRun) {
          // Written before the update so a crash mid-run never loses a
          // backup for a row that's about to be (or was just) overwritten.
          const backupFile = path.join(runBackupDir, `${blog.blog_id}.json`);
          fs.writeFileSync(
            backupFile,
            JSON.stringify({ blog_id: blog.blog_id, slug: blog.slug, content: blog.content }, null, 2),
          );

          const { error: updateError } = await supabase
            .from('blogs')
            .update({ content: result.newContent })
            .eq('blog_id', blog.blog_id);

          if (updateError) {
            throw new Error(updateError.message);
          }
          console.log(`  saved. (backup: ${backupFile})`);
        }

        migrated += 1;
      } catch (err) {
        failed += 1;
        console.error(`  [error] ${label}:`, err instanceof Error ? err.message : err);
      }
    }

    if (rows.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  if (!dryRun && migrated) {
    console.log(`\nBackups for this run: ${runBackupDir}`);
  }

  console.log('\n' + JSON.stringify({ migrated, skipped, failed, dryRun }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
