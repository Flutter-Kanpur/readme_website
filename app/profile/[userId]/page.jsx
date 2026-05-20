'use client'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar/Navbar'
import ProfileHeader from '@/components/ProfileHeader/ProfileHeader'
import UserStats from '@/components/UserStats/UserStats'
import ArticleCard from '@/components/ArticleCard/ArticleCard'
import { useEffect, useState } from 'react'
import {
  getProfileById,
  getPublishedBlogsByAuthor,
  getAuthorByBlogId
} from '@/app/lib/supabase/queries'
import { supabase } from '@/app/lib/supabase/index'
import CustomButton from '@/components/Button/CustomButton'
import Footer from '@/components/Footer/Footer'
// import Footer from "../../components/Footer/Footer";
import './styles.css'

export default function ProfilePage() {
  const { userId } = useParams()
  const [profile, setProfile] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [loggedInUser, setLoggedInUser] = useState(null)

  const router = useRouter()
  const handleClick = () => {
    router.push(`/profile/${userId}/editprofile`)
  }

  useEffect(() => {
    async function loadProfile() {
      if (!userId) return

      try {
        setLoading(true)

        const profileData = await getProfileById(userId)
        if (!profileData) return

        setProfile(profileData)

        const blogsData = await getPublishedBlogsByAuthor(profileData.id)

        const blogsWithAuthors = await Promise.all(
          blogsData.map(async (blog) => {
            const author = await getAuthorByBlogId(blog.blog_id)
            return {
              ...blog,
              author
            }
          })
        )

        setBlogs(blogsWithAuthors)

        const {
          data: { user }
        } = await supabase.auth.getUser()

        setLoggedInUser(user)


      } catch (err) {
        console.error('Profile load error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [userId])
  if (!userId) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Invalid profile URL</h2>
        <p>No user ID provided.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="page grid-background">
        <Navbar />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="profileSection">
            <div className="flex items-center gap-8 mb-10">
              <div className="w-40 h-40 rounded-full shimmer bg-gray-200"></div>
              <div className="flex-1 space-y-4">
                <div className="h-10 w-64 shimmer bg-gray-200 rounded-lg"></div>
                <div className="h-6 w-full max-w-md shimmer bg-gray-200 rounded-lg"></div>
                <div className="h-6 w-full max-w-sm shimmer bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
          <div className="blogsarea">
            <div className="flex-1 space-y-8">
              <div className="h-8 w-40 shimmer bg-gray-200 rounded-lg mb-6"></div>
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 w-full shimmer bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
            <div className="sidebar">
              <div className="h-64 w-full shimmer bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>User not found</h2>
      </div>
    )
  }

  return (
    <div className="page grid-background">
      <Navbar />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="profileSection">
          <ProfileHeader profile={profile} />
          <div className="profileActions">
            {loggedInUser && loggedInUser.id === profile.id && (
              <CustomButton handleClick={handleClick} variant="secondary">
                Edit Profile
              </CustomButton>
            )}
          </div>
        </div>
        <div className="blogsarea">
          {/* Articles */}
          <div>
            <h2 className="sectionTitle">Published</h2>

            <div className="articles">
              {blogs.length === 0 && (
                <p className="empty">No published articles yet.</p>
              )}

              {blogs.map(blog => (
                <div key={blog.blog_id} style={{ position: 'relative' }}>
                  <ArticleCard blog={blog} />
                  {loggedInUser && loggedInUser.id === profile.id && (
                    <Link 
                      href={`/edit/${blog.blog_id}`}
                      style={{ 
                        position: 'absolute', 
                        top: 24, 
                        right: 24, 
                        background: '#111827', 
                        color: '#fff', 
                        padding: '6px 14px', 
                        borderRadius: '20px', 
                        textDecoration: 'none', 
                        fontSize: '12px', 
                        fontWeight: 'bold',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        zIndex: 10
                      }}
                    >
                      Edit Blog
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            <UserStats profile={profile} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}