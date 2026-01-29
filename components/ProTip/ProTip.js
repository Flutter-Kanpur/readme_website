'use client'

import './styles.css'

export default function ProTip({ text }) {
  if (!text) return null

  return (
    <div className="pro-tip">
      <span className="pro-tip-label">PRO TIP</span>
      <p className="pro-tip-text">{text}</p>
    </div>
  )
}
