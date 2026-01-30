import { supabase } from './index'

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

  return data || []
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
    .select('id, name, avatar_url')
    .eq('id', blog.author_id)
    .maybeSingle()

  if (profileError || !profile) {
    console.error('getAuthorByBlogId profile error:', profileError)
    return null
  }

  return {
    authorId: profile.id,
    name: profile.name,
    avatar_url: profile.avatar_url
  }
}


export async function getBlogDetailByBlogId(blogId) {
  console.log('Fetching blog with ID:', blogId)

  const { data, error } = await supabase
    .from('blogs')
    .select(`
      blog_id,
      title,
      content,
      created_at,
      cover_image,
      category,
      image_paths,
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

  return data
}
