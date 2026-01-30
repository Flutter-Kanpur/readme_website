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

      <CustomButton handleClick={handleSubscribe} className= "w-full bg-blue-500 text-white px-4 py-2 rounded-full text-sm cursor-pointer hover:opacity-90 transition">
        Subscribe
      </CustomButton>
    </div>
  )
}
