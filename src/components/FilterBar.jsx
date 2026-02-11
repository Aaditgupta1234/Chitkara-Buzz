import React, { useState } from 'react'
import './FilterBar.css'

function FilterBar({ clubs, categories, onFilter, searchQuery, selectedClub, selectedCategory }) {
  const [search, setSearch] = useState(searchQuery)

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearch(value)
    onFilter(value, selectedClub, selectedCategory)
  }

  const handleClubChange = (e) => {
    const value = e.target.value
    onFilter(search, value, selectedCategory)
  }

  const handleCategoryChange = (e) => {
    const value = e.target.value
    onFilter(search, selectedClub, value)
  }

  return (
    <div className="filter-bar">
      <div className="filter-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search events by name or keyword..."
            value={search}
            onChange={handleSearchChange}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <select
          value={selectedClub}
          onChange={handleClubChange}
          className="filter-select"
        >
          <option value="all">All Clubs</option>
          {clubs.map((club) => (
            <option key={club} value={club}>
              {club}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default FilterBar
