'use client'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar/Navbar'
import ProfileHeader from '@/components/ProfileHeader/ProfileHeader'
import UserStats from '@/components/UserStats/UserStats'
import ArticleCard from '@/components/ArticleCard/ArticleCard'
import { useEffect, useState } from 'react'
import {
  getProfileById,
  getPublishedBlogsByAuthor,
  getAuthorByBlogId
} from '@/app/lib/supabase/queries'

import Footer from '@/components/Footer/Footer'
import './styles.css'

export default function ProfilePage() {
  const { userid } = useParams()
  const [profile, setProfile] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      if (!userid) return

      try {
        setLoading(true)

        const profileData = await getProfileById(userid)
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
      } catch (err) {
        console.error('Profile load error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [userid])
  if (!userid) {
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
        <ProfileHeader profile={profile} />

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

      <Footer />
    </div>
  )
}