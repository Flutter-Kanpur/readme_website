import { withBasePath } from '@/app/lib/basePath';
import { getArticlePath } from '@/app/lib/blogSlug';
import {
  getSiteOrigin,
  resolveArticleShareImage,
} from '@/app/lib/ogImageUrl';
import {
  buildExcerpt,
  sanitizeCoverImage,
} from '@/app/lib/supabase/queries';

const PUBLISHER_LOGO_PATH = '/blogs/icon.png';

export function getArticleShareFields(blog) {
  const title = blog.title?.trim() || 'Untitled';
  const description =
    (typeof blog.excerpt === 'string' && blog.excerpt.trim()) ||
    buildExcerpt(blog.content, 160) ||
    'Read this story on Readme.';
  const cover = sanitizeCoverImage(blog.cover_image);
  const origin = getSiteOrigin();
  const url = `${origin}${withBasePath(getArticlePath(blog))}`;
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

  const origin = getSiteOrigin();
  const person = {
    '@type': 'Person',
    name: author.name,
  };

  if (author.authorId) {
    person.url = `${origin}/blogs/profile/${author.authorId}`;
  }

  return person;
}

export function buildArticleJsonLd({ blog, author, coauthors = [] }) {
  const { title, description, cover, url, publishedTime, modifiedTime } =
    getArticleShareFields(blog);
  const shareImage = resolveArticleShareImage(cover);
  const origin = getSiteOrigin();

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
    image: [shareImage],
    ...(authors.length === 1
      ? { author: authors[0] }
      : authors.length > 1
        ? { author: authors }
        : {}),
    publisher: {
      '@type': 'Organization',
      name: 'Readme',
      url: origin,
      logo: {
        '@type': 'ImageObject',
        url: `${origin}${PUBLISHER_LOGO_PATH}`,
      },
    },
  };

  return jsonLd;
}

export function serializeJsonLd(jsonLd) {
  return JSON.stringify(jsonLd).replace(/</g, '\\u003c');
}
