'use client'

import { useRef, useState } from 'react'
import styles from './styles.module.css'
import SocialLinks from '@/components/SocialLinks/SocialLinks'
import Image from 'next/image'
import CustomButton from '@/components/Button/CustomButton'
import { supabase } from '@/app/lib/supabase/index'

export default function EditProfileForm({ profile }) {
  const [preview, setPreview] = useState(null)
  const [name, setName] = useState(profile.name || '')
  // const [headline, setHeadline] = useState(profile.headline || '')
  const [bio, setBio] = useState(profile.bio || '')
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const fileInputRef = useRef(null)

  const handleChangePhotoClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      alert('Only JPG, PNG, or JPEG files are allowed')
      return
    }

    // Validate size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be under 2MB')
      return
    }

    setSelectedFile(file)

    // Preview image
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

const handleSaveClick = async () => {
  try {
    setLoading(true)

    let avatarUrl = profile.avatar_url

    // Upload new image if changed
    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop()
      // const fileName = `${profile.id}.${fileExt}`
      const fileName = `${profile.id}/${Date.now()}.${fileExt}`


      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, selectedFile, {
          upsert: true
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      avatarUrl = data.publicUrl
    }

    // Update profile row with the new avatarUrl
    const { error } = await supabase
      .from('profiles')
      .update({
        name,
        bio,
        avatar_url: avatarUrl
      })
      .eq('id', profile.id)

    if (error) throw error

    alert('Profile updated successfully!')
    window.location.reload()
  } catch (err) {
    console.error(err)
    alert('Error saving profile')
    console.log(err)
  } finally {
    setLoading(false)
  }
}


  return (
    <div className={styles.profileForm}>
      {/* Avatar */}
      <div className={styles.avatarSection}>
        <Image
          src={preview || profile.avatar_url}
          alt="Profile"
          className={styles.avatar}
          width={80}
          height={80}
        />

        <button
          type="button"
          className={styles.changePhoto}
          onClick={handleChangePhotoClick}
        >
          Change Photo
        </button>

        <span className={styles.photoHint}>
          JPG, GIF or PNG. Max size 2MB.
        </span>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
      </div>

      {/* Inputs */}
      <label className={styles.label}>FULL NAME</label>
      <input
        className={styles.input}
        type="text"
        defaultValue={profile.name}
        onChange={(e) => setName(e.target.value)}
      />

      <label className={styles.label}>
        PROFESSIONAL TITLE / HEADLINE
      </label>
      <input
        className={styles.input}
        type="text"
        defaultValue={profile.headline}
        onChange={(e) => setHeadline(e.target.value)}
      />

      <label className={styles.label}>BIO</label>
      <textarea
        className={styles.textarea}
        rows="4"
        defaultValue={profile.bio}
         onChange={(e) => setBio(e.target.value)}
      />

      <SocialLinks />

      <CustomButton handleClick={handleSaveClick}>
        Save Changes
      </CustomButton>
    </div>
  )
}
