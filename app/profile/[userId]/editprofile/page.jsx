"use client"
import './styles.css'
import EditProfileHeader from '@/components/EditProfileHeader/EditProfileHeader'
import EditProfileForm from '@/components/EditProfileForm/EditProfileForm'
import Preferences from '@/components/Preferences/Preferences'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  getProfileById,
  getPublishedBlogsByAuthor,
  getAuthorByBlogId
} from '@/app/lib/supabase/queries'
import { supabase } from '@/app/lib/supabase/index'

export default function EditProfile() {
  const { userId } = useParams()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
    async function loadProfile() {
      if (!userId) return

      try {
        setLoading(true)

        const profileData = await getProfileById(userId)
        if (!profileData) return

        setProfile(profileData)
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
    <div className="edit-profile-page">
      <EditProfileHeader/>

      <div className="edit-profile-layout">
        <EditProfileForm profile={profile} />
        <Preferences profile={profile}/>
      </div>
    </div>
  )
}
