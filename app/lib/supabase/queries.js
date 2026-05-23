import { supabase } from './index'

/**
 * Cover images saved as base64 data URLs (from the editor upload) can be
 * 10MB+ each. Embedding them in static/ISR HTML blows past Vercel's ~19MB
 * page limit (FALLBACK_BODY_TOO_LARGE). Only pass through real HTTP(S) URLs
 * for server-rendered listings; detail pages load covers client-side.
 */
export function sanitizeCoverImage(cover) {
  if (!cover || typeof cover !== 'string') return null
  const trimmed = cover.trim()
  if (!trimmed || trimmed.startsWith('data:')) return null
  return trimmed
}

export function buildExcerpt(html, maxLength = 320) {
  if (!html || typeof html !== 'string') return ''
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!text) return ''
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trim()}…`
}

export async function getProfileById(userId) {
  if (!userId) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    console.error('getProfileById error:', error)
    throw new Error(error.message)
  }

  return data
}


export async function getPublishedBlogsByAuthor(authorId) {
  if (!authorId) return []

  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('author_id', authorId)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getPublishedBlogsByAuthor error:', error)
    throw new Error(error.message)
  }

  return (data || []).map((blog) => ({
    ...blog,
    cover_image: sanitizeCoverImage(blog.cover_image),
  }))
}

export async function getAuthorByBlogId(blogId) {
  if (!blogId) return null

  // Get blog
  const { data: blog, error: blogError } = await supabase
    .from('blogs')
    .select('author_id')
    .eq('blog_id', blogId)
    .maybeSingle()

  if (blogError || !blog) {
    console.error('getAuthorByBlogId blog error:', blogError)
    return null
  }

  // Get profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, name, avatar_url, headline, bio')
    .eq('id', blog.author_id)
    .maybeSingle()

  if (profileError || !profile) {
    console.error('getAuthorByBlogId profile error:', profileError)
    return null
  }

  return {
    authorId: profile.id,
    name: profile.name,
    avatar_url: profile.avatar_url,
    headline: profile.headline,
    bio: profile.bio
  }
}


function mapProfileToAuthor(profile) {
  if (!profile) return null
  return {
    authorId: profile.id,
    name: profile.name,
    avatar_url: profile.avatar_url,
    headline: profile.headline,
    bio: profile.bio,
  }
}

/** Blog + author in one round-trip (replaces getBlogDetailByBlogId + getAuthorByBlogId on detail page). */
export async function getArticleWithAuthor(blogId) {
  if (!blogId) return null

  try {
    return await fetchArticleWithAuthor(blogId, true)
  } catch (error) {
    const msg = error?.message?.toLowerCase() ?? ''
    if (
      msg.includes('communities') ||
      msg.includes('blog_coauthors') ||
      msg.includes('schema cache')
    ) {
      try {
        return await fetchArticleWithAuthor(blogId, false)
      } catch (fallbackError) {
        console.error('getArticleWithAuthor fallback error:', fallbackError?.message ?? fallbackError)
        return null
      }
    }
    console.error('getArticleWithAuthor error:', error?.message ?? error)
    return null
  }
}

async function fetchArticleWithAuthor(blogId, withCommunity) {
  const selectFields = withCommunity
    ? `
      blog_id,
      title,
      content,
      created_at,
      cover_image,
      category,
      is_published,
      author_id,
      community_id,
      profiles (
        id,
        name,
        avatar_url,
        headline,
        bio
      ),
      communities (
        id,
        name,
        slug,
        logo_url
      ),
      blog_coauthors (
        user_id,
        profiles (
          id,
          name,
          avatar_url,
          headline,
          bio
        )
      )
    `
    : `
      blog_id,
      title,
      content,
      created_at,
      cover_image,
      category,
      is_published,
      author_id,
      profiles (
        id,
        name,
        avatar_url,
        headline,
        bio
      )
    `

  const { data, error } = await supabase
    .from('blogs')
    .select(selectFields)
    .eq('blog_id', blogId)
    .eq('is_published', true)
    .single()

  if (error) {
    throw error
  }

  const { profiles, communities, blog_coauthors, ...blog } = data
  const author = mapProfileToAuthor(profiles)
  const coauthors = (blog_coauthors ?? [])
    .map((row) => mapProfileToAuthor(row.profiles))
    .filter(Boolean)
    .filter((profile) => profile.authorId !== author?.authorId)

  return {
    blog: {
      ...blog,
      cover_image: sanitizeCoverImage(blog.cover_image),
    },
    author,
    coauthors,
    community: withCommunity ? (communities ?? null) : null,
  }
}

/** Blog, author, and related articles (use getArticleWithAuthor + Suspense sidebar when streaming). */
export async function getArticlePageData(blogId) {
  const main = await getArticleWithAuthor(blogId)
  if (!main) return null

  const relatedArticles = main.blog.author_id
    ? await getRelatedArticlesByAuthorId(main.blog.author_id, blogId)
    : []

  return { ...main, relatedArticles: relatedArticles ?? [] }
}

export async function getBlogDetailByBlogId(blogId) {
  const { data, error } = await supabase
    .from('blogs')
    .select(`
      blog_id,
      title,
      content,
      created_at,
      cover_image,
      category,
      is_published,
      author_id
    `)
    .eq('blog_id', blogId)
    .single()

  if (error) {
    console.error('getBlogDetailByBlogId error:', error.message, error.details)
    throw error
  }

  return data
}



export async function getRelatedArticlesByAuthorId(authorId, currentBlogId) {
  const { data, error } = await supabase
    .from('blogs')
    .select(`
      blog_id,
      title,
      created_at,
      cover_image
    `)
    .eq('author_id', authorId)
    .eq('is_published', true)
    .neq('blog_id', currentBlogId) // exclude current blog
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('getRelatedArticlesByAuthorId error:', error.message)
    throw error
  }

  return (data || []).map((article) => ({
    ...article,
    cover_image: sanitizeCoverImage(article.cover_image),
  }))
}


export async function getLatestArticle(category = "for_you") {
  try {
    return await fetchLatestArticles(category, true);
  } catch (error) {
    const msg = error?.message?.toLowerCase() ?? "";
    if (
      msg.includes("communities") ||
      msg.includes("blog_coauthors") ||
      msg.includes("schema cache")
    ) {
      return fetchLatestArticles(category, false);
    }
    throw error;
  }
}

async function fetchLatestArticles(category, withCommunity) {
  const selectFields = withCommunity
    ? `
      blog_id,
      title,
      created_at,
      cover_image,
      category,
      community_id,
      profiles (
        name,
        avatar_url
      ),
      communities (
        id,
        name,
        slug,
        logo_url
      ),
      blog_coauthors (
        user_id,
        profiles (
          id,
          name,
          avatar_url
        )
      )
    `
    : `
      blog_id,
      title,
      created_at,
      cover_image,
      category,
      profiles (
        name,
        avatar_url
      )
    `;

  let query = supabase
    .from("blogs")
    .select(selectFields)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (category === "communities") {
    query = query.not("community_id", "is", null);
  } else if (category !== "for_you") {
    query = query.eq("category", category);
  }

  const { data: blogs, error } = await query.limit(3);

  if (error) throw error;
  if (!blogs?.length) return [];

  const ids = blogs.map((b) => b.blog_id);
  const { data: contentRows, error: contentError } = await supabase
    .from("blogs")
    .select("blog_id, content")
    .in("blog_id", ids);

  if (contentError) throw contentError;

  const contentById = Object.fromEntries(
    (contentRows ?? []).map((row) => [row.blog_id, row.content]),
  );

  return blogs.map((blog) => ({
    blog_id: blog.blog_id,
    title: blog.title,
    created_at: blog.created_at,
    cover_image: sanitizeCoverImage(blog.cover_image),
    category: blog.category,
    community_id: blog.community_id ?? null,
    profiles: blog.profiles,
    communities: blog.communities ?? null,
    blog_coauthors: blog.blog_coauthors ?? [],
    excerpt: buildExcerpt(contentById[blog.blog_id]),
  }));
}
