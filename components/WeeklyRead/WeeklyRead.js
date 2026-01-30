'use client'

import { useState } from 'react'
import './styles.css'
import CustomButton from '../Button/CustomButton'

export default function WeeklyRead({ onSubscribe, text }) {
  const [email, setEmail] = useState('')

  // If no backend text is provided, don't render the component
  if (!text) return null

  function handleSubscribe() {
    if (!email.trim()) return
    onSubscribe()
  }

  return (
    <div className="weekly-read">
      <h4 className="weekly-title">Weekly Read</h4>

      <p className="weekly-text">{text}</p>

      <input
        type="email"
        placeholder="Your email address"
        className="weekly-input"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <CustomButton handleClick={handleSubscribe} styles={{
        width: "100%",
        backgroundColor: "#3b82f6", // bg-blue-500
        color: "#ffffff",
        padding: "8px 16px",
        borderRadius: "9999px",
        fontSize: "14px",
        cursor: "pointer",
      }}>
        Subscribe
      </CustomButton>
    </div>
  )
}
