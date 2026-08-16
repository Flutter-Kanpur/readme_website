const SITE_ORIGIN = 'https://readme.flutterkanpur.in';

/** @type {import('next').MetadataRoute.Robots} */
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/blogs/',
      disallow: [
        '/blogs/login',
        '/blogs/register',
        '/blogs/drafts',
        '/blogs/write',
        '/blogs/edit/',
      ],
    },
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  };
}
