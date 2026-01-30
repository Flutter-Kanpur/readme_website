'use client'

import './styles.css'

export default function RelatedArticles({ articles }) {
  if (!Array.isArray(articles) || articles.length === 0) {
    return null
  }

  return (
    <div className="related-articles">
      <h4 className="related-title">Related Articles</h4>

      <ul className="related-list">
        {articles.map((title, index) => (
          <li key={index} className="related-item">
            {title}
          </li>
        ))}
      </ul>
    </div>
  )
}
