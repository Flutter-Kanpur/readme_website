import {
  buildExcerpt,
  sanitizeCoverImage,
} from '@/app/lib/supabase/queries';

const SITE_ORIGIN = 'https://readme.flutterkanpur.in';
const PUBLISHER_LOGO = `${SITE_ORIGIN}/blogs/icon.png`;

export function getArticleShareFields(blog, blogId) {
  const title = blog.title?.trim() || 'Untitled';
  const description =
    (typeof blog.excerpt === 'string' && blog.excerpt.trim()) ||
    buildExcerpt(blog.content, 160) ||
    'Read this story on Readme.';
  const cover = sanitizeCoverImage(blog.cover_image);
  const url = `${SITE_ORIGIN}/blogs/articles/${blog.blog_id || blogId}`;
  const publishedTime = blog.published_at ?? blog.created_at ?? undefined;
  const modifiedTime = blog.published_at ?? blog.created_at ?? undefined;

  return {
    title,
    description,
    cover,
    url,
    publishedTime,
    modifiedTime,
  };
}

function mapAuthorPerson(author) {
  if (!author?.name) return null;

  const person = {
    '@type': 'Person',
    name: author.name,
  };

  if (author.authorId) {
    person.url = `${SITE_ORIGIN}/blogs/profile/${author.authorId}`;
  }

  return person;
}

export function buildArticleJsonLd({ blog, author, coauthors = [], blogId }) {
  const { title, description, cover, url, publishedTime, modifiedTime } =
    getArticleShareFields(blog, blogId);

  const authors = [author, ...coauthors]
    .map(mapAuthorPerson)
    .filter(Boolean);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(publishedTime ? { datePublished: publishedTime } : {}),
    ...(modifiedTime ? { dateModified: modifiedTime } : {}),
    ...(cover ? { image: [cover] } : {}),
    ...(authors.length === 1
      ? { author: authors[0] }
      : authors.length > 1
        ? { author: authors }
        : {}),
    publisher: {
      '@type': 'Organization',
      name: 'Readme',
      url: SITE_ORIGIN,
      logo: {
        '@type': 'ImageObject',
        url: PUBLISHER_LOGO,
      },
    },
  };

  return jsonLd;
}

export function serializeJsonLd(jsonLd) {
  return JSON.stringify(jsonLd).replace(/</g, '\\u003c');
}
