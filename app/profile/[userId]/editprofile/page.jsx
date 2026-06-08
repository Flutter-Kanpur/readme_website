"use client"
import './styles.css'
import EditProfileHeader from '@/components/EditProfileHeader/EditProfileHeader'
import EditProfileForm from '@/components/EditProfileForm/EditProfileForm'
import Preferences from '@/components/Preferences/Preferences'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  getProfileById,
} from '@/app/lib/supabase/queries'
import { supabase } from '@/app/lib/supabase/index'

import Navbar from '@/app/components/Navbar/Navbar'
import Footer from '@/components/Footer/Footer'

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
      <div className="page">
        <Navbar plain />
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Invalid profile URL</h2>
          <p>No user ID provided.</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="page">
        <Navbar plain />
        <div style={{ padding: '100px', textAlign: 'center' }}>
          <h2>Loading profile...</h2>
        </div>
        <Footer />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="page">
        <Navbar plain />
        <div style={{ padding: '100px', textAlign: 'center' }}>
          <h2>User not found</h2>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="page">
      <Navbar plain />
      <div className="edit-profile-page" style={{ position: 'relative', zIndex: 1 }}>
        <EditProfileHeader />

        <div className="edit-profile-layout">
          <EditProfileForm profile={profile} />
          <Preferences profile={profile} />
        </div>
      </div>
      <Footer />
    </div>
  )
}
