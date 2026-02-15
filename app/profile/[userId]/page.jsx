'use client'
import { useParams, useRouter } from 'next/navigation'
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
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Loading profile...</h2>
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
    <div className="page">
      <Navbar />
      <div className="container">
        <div className="profileheader">
          <ProfileHeader profile={profile} />
          <div>
            {loggedInUser && loggedInUser.id === profile.id && (
              <CustomButton handleClick={handleClick}>
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
                <ArticleCard key={blog.blog_id} blog={blog} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            <UserStats profile={profile} />
          </div>
        </div>
      </div>
     <div style={{ position: 'absolute',  bottom: 0, width:'100%'}}><Footer/></div>
    </div>
  )
}