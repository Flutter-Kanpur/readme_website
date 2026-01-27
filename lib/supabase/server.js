import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const supabaseServer = () => {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        // Supabase wants an array of { name, value }
        getAll() {
          return Array.from(cookieStore).map(c => ({
            name: c.name,
            value: c.value
          }))
        },

        // This will only work in Route Handlers / Middleware
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Safe to ignore in Server Components
          }
        }
      }
    }
  )
}
