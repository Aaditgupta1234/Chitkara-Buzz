import React from 'react'
import './SkeletonCard.css'

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image shimmer"></div>
      <div className="skeleton-content">
        <div className="skeleton-club">
          <div className="skeleton-avatar shimmer"></div>
          <div className="skeleton-text-small shimmer"></div>
        </div>
        <div className="skeleton-title shimmer"></div>
        <div className="skeleton-text shimmer"></div>
        <div className="skeleton-text short shimmer"></div>
        <div className="skeleton-footer">
          <div className="skeleton-badge shimmer"></div>
          <div className="skeleton-badge shimmer"></div>
        </div>
      </div>
    </div>
  )
}

// Component to render multiple skeleton cards
export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="events-grid">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  )
}

export default SkeletonCard
