'use client'

import { useRef, useState } from 'react'
import styles from './styles.module.css'
import SocialLinks from '@/components/SocialLinks/SocialLinks'
import Image from 'next/image'

export default function EditProfileForm() {
  const fileInputRef = useRef(null)
  const [preview, setPreview] = useState('/google.png')

  const handleChangePhotoClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!validTypes.includes(file.type)) {
      alert('Only JPG, PNG, or GIF files are allowed')
      return
    }

    // Validate size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be under 2MB')
      return
    }

    // Preview image
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className={styles.profileForm}>
      {/* Avatar */}
      <div className={styles.avatarSection}>
        <Image
          src={preview}
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
        defaultValue="Arjun Sharma"
      />

      <label className={styles.label}>
        PROFESSIONAL TITLE / HEADLINE
      </label>
      <input
        className={styles.input}
        type="text"
        defaultValue="Product Designer & Flutter Enthusiast"
      />

      <label className={styles.label}>BIO</label>
      <textarea
        className={styles.textarea}
        rows="4"
        defaultValue={`Product Designer & Flutter Enthusiast. I write about bridging the gap
between design systems and high-performance code. Lead at Readme
Design Circle.`}
      />

      <SocialLinks />

      <button className={styles.saveBtn}>
        Save Changes
      </button>
    </div>
  )
}
