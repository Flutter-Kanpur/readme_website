'use client'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar/Navbar'
import ProfileHeader from '@/components/ProfileHeader/ProfileHeader'
import UserStats from '@/components/UserStats/UserStats'
import ArticleCard from '@/components/ArticleCard/ArticleCard'
import { useCallback, useEffect, useState } from 'react'
import {
  getProfileById,
  getPublishedBlogsByAuthor,
  getAuthorByBlogId
} from '@/app/lib/supabase/queries'
import { getSafeUser } from '@/app/lib/supabase/auth'
import { getFollowStats } from '@/app/lib/supabase/follows'
import useFollowAuthor from '@/app/hooks/useFollowAuthor'
import CustomButton from '@/components/Button/CustomButton'
import Footer from '@/components/Footer/Footer'
import './styles.css'

export default function ProfilePage() {
  const { userId } = useParams()
  const [profile, setProfile] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [followStats, setFollowStats] = useState({ followers: 0, following: 0 })

  const router = useRouter()

  const refreshFollowStats = useCallback(async () => {
    if (!userId) return
    try {
      const stats = await getFollowStats(userId)
      setFollowStats(stats)
    } catch (err) {
      console.error('Follow stats error:', err)
    }
  }, [userId])

  const {
    isFollowing,
    isLoading: followStateLoading,
    isSelf,
    actionLoading,
    toggleFollow,
  } = useFollowAuthor(userId, { onStatsChange: refreshFollowStats })

  const handleEditProfile = () => {
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

        const [blogsData, user] = await Promise.all([
          getPublishedBlogsByAuthor(profileData.id),
          getSafeUser(),
          refreshFollowStats(),
        ])

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
        setLoggedInUser(user)
      } catch (err) {
        console.error('Profile load error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [userId, refreshFollowStats])

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
      <div className="page">
        <Navbar />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="profileSection">
            <div className="profile-skeleton-header">
              <div className="profile-skeleton-avatar shimmer bg-gray-200" />
              <div className="profile-skeleton-text">
                <div className="profile-skeleton-line profile-skeleton-line--name shimmer bg-gray-200" />
                <div className="profile-skeleton-line shimmer bg-gray-200" />
                <div className="profile-skeleton-line profile-skeleton-line--short shimmer bg-gray-200" />
              </div>
            </div>
            <div className="profile-skeleton-actions shimmer bg-gray-200" />
          </div>
          <div className="blogsarea">
            <div>
              <div className="profile-skeleton-section-title shimmer bg-gray-200" />
              <div className="articles">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="profile-skeleton-article shimmer bg-gray-200" />
                ))}
              </div>
            </div>
            <div className="sidebar">
              <div className="profile-skeleton-stats shimmer bg-gray-200" />
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
    <div className="page">
      <Navbar />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="profileSection">
          <ProfileHeader profile={profile} />
          <div className="profileActions">
            {loggedInUser && loggedInUser.id === profile.id && (
              <CustomButton handleClick={handleEditProfile} variant="secondary">
                Edit Profile
              </CustomButton>
            )}
            {!followStateLoading && !isSelf && (
              <CustomButton
                handleClick={toggleFollow}
                variant={isFollowing ? 'secondary' : 'primary'}
                disabled={actionLoading}
              >
                {actionLoading
                  ? 'Updating…'
                  : isFollowing
                    ? 'Following'
                    : 'Follow'}
              </CustomButton>
            )}
          </div>
        </div>
        <div className="blogsarea">
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

          <div className="sidebar">
            <UserStats
              profile={profile}
              articleCount={blogs.length}
              followers={followStats.followers}
              following={followStats.following}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
