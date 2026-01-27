import { supabaseServer } from './supabase/server'

export async function getProfileById(userId) {
  if (!userId) return null

  const supabase = supabaseServer()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data
}


export async function getPublishedBlogsByAuthor(authorId) {
  const supabase = supabaseServer()

  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('author_id', authorId)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// export async function getAuthorByBlogId(blogId) {
//   const supabase = supabaseServer()

//   const { data, error } = await supabase
//     .from('blogs')
//     .select(`
//       author_id,
//       profiles (
//         id,
//         name,
//         avatar_url
//       )
//     `)
//     .eq('blog_id', blogId)
//     .maybeSingle()

//   if (error) {
//     console.log('Error fetching author by blog ID:', error)
//     throw new Error(error.message)
//   }

//   if (!data || !data.profiles) {
//     return null
//   }

//   return {
//     authorId: data.author_id,
//     name: data.profiles.name,
//     avatar: data.profiles.avatar_url
//   }
// }

export async function getAuthorByBlogId(blogId) {
  const supabase = supabaseServer()

  // Get blog
  const { data: blog, error: blogError } = await supabase
    .from('blogs')
    .select('author_id')
    .eq('blog_id', blogId)
    .maybeSingle()

  if (blogError || !blog) return null

  // Get profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, name, avatar_url')
    .eq('id', blog.author_id)
    .maybeSingle()

  if (profileError || !profile) return null

  return {
    authorId: profile.id,
    name: profile.name,
    avatar_url: profile.avatar_url
  }
}
