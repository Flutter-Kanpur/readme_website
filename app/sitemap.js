import { createClient } from '@supabase/supabase-js';
import { getArticlePath } from '@/app/lib/blogSlug';

const SITE_ORIGIN = 'https://readme.flutterkanpur.in';
const APP_BASE = `${SITE_ORIGIN}/blogs`;

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function appUrl(path = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (normalized === '/' || normalized === '') return APP_BASE;
  return `${APP_BASE}${normalized}`;
}

function toLastModified(value) {
  if (!value) return new Date();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

/** @type {import('next').MetadataRoute.Sitemap} */
export default async function sitemap() {
  const staticPages = [
    { path: '/', changeFrequency: 'daily', priority: 1 },
    { path: '/articles', changeFrequency: 'daily', priority: 0.9 },
    { path: '/communities', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/writers', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/help', changeFrequency: 'monthly', priority: 0.4 },
    { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  ];

  const entries = staticPages.map(({ path, changeFrequency, priority }) => ({
    url: appUrl(path),
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const supabase = getSupabase();
  if (!supabase) return entries;

  const [{ data: blogs, error: blogsError }, { data: communities, error: communitiesError }] =
    await Promise.all([
      supabase
        .from('blogs')
        .select('blog_id, slug, published_at, created_at')
        .eq('is_published', true)
        .order('published_at', { ascending: false, nullsFirst: false }),
      supabase.from('communities').select('slug, created_at').order('name'),
    ]);

  if (blogsError) console.error('Sitemap blogs error:', blogsError);
  if (communitiesError) console.error('Sitemap communities error:', communitiesError);

  for (const blog of blogs ?? []) {
    if (!blog?.blog_id) continue;
    entries.push({
      url: appUrl(getArticlePath(blog)),
      lastModified: toLastModified(blog.published_at ?? blog.created_at),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  for (const community of communities ?? []) {
    if (!community?.slug) continue;
    entries.push({
      url: appUrl(`/communities/${community.slug}`),
      lastModified: toLastModified(community.created_at),
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }

  return entries;
}

export const revalidate = 3600;
