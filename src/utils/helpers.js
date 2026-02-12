// Calculate countdown from now until event date
export function getCountdown(dateString, timeString) {
    const eventDateTime = new Date(`${dateString} ${timeString}`)
    const now = new Date()
    const diff = eventDateTime - now

    if (diff <= 0) {
        return { expired: true, text: 'Event Started' }
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 7) {
        return { expired: false, text: `${days} days left`, urgent: false }
    } else if (days > 1) {
        return { expired: false, text: `${days} days left`, urgent: false }
    } else if (days === 1) {
        return { expired: false, text: 'Tomorrow!', urgent: true }
    } else if (hours > 1) {
        return { expired: false, text: `${hours}h ${minutes}m left`, urgent: true }
    } else {
        return { expired: false, text: `${minutes}m left`, urgent: true }
    }
}

// Share to different platforms
export const shareEvent = {
    whatsapp: (event) => {
        const text = encodeURIComponent(
            `🎉 Check out "${event.title}" at ${event.location}!\n📅 ${event.date} at ${event.time}\n🏛️ Organized by ${event.club}\n\nJoin us at Chitkara Buzz!`
        )
        window.open(`https://wa.me/?text=${text}`, '_blank')
    },

    twitter: (event) => {
        const text = encodeURIComponent(
            `🎉 Excited for "${event.title}" at Chitkara! 📅 ${event.date}\n#ChitkaraBuzz #CollegeEvents`
        )
        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
    },

    copyLink: async (event) => {
        const text = `Check out "${event.title}" on Chitkara Buzz!\n📅 ${event.date} at ${event.time}\n📍 ${event.location}`
        try {
            await navigator.clipboard.writeText(text)
            return true
        } catch {
            return false
        }
    },

    email: (event) => {
        const subject = encodeURIComponent(`Check out: ${event.title} at Chitkara`)
        const body = encodeURIComponent(
            `Hey!\n\nI found this interesting event:\n\n${event.title}\n📅 ${event.date} at ${event.time}\n📍 ${event.location}\n🏛️ Organized by ${event.club}\n\n${event.description}\n\nCheck it out on Chitkara Buzz!`
        )
        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank')
    }
}

// Format relative time
export function getRelativeTime(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((date - now) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays < 7) return `In ${diffDays} days`
    if (diffDays < 30) return `In ${Math.floor(diffDays / 7)} weeks`
    return `In ${Math.floor(diffDays / 30)} months`
}

// Get category color
export function getCategoryColor(category) {
    const colors = {
        'Technology': { bg: 'rgba(102, 126, 234, 0.2)', text: '#667eea', border: 'rgba(102, 126, 234, 0.5)' },
        'Cultural': { bg: 'rgba(240, 147, 251, 0.2)', text: '#f093fb', border: 'rgba(240, 147, 251, 0.5)' },
        'Sports': { bg: 'rgba(79, 172, 254, 0.2)', text: '#4facfe', border: 'rgba(79, 172, 254, 0.5)' },
        'Business': { bg: 'rgba(67, 233, 123, 0.2)', text: '#43e97b', border: 'rgba(67, 233, 123, 0.5)' },
        'Workshop': { bg: 'rgba(250, 112, 154, 0.2)', text: '#fa709a', border: 'rgba(250, 112, 154, 0.5)' },
        'Creative': { bg: 'rgba(168, 237, 234, 0.2)', text: '#a8edea', border: 'rgba(168, 237, 234, 0.5)' }
    }
    return colors[category] || colors['Technology']
}

// Get category icon
export function getCategoryIcon(category) {
    const icons = {
        'Technology': '💻',
        'Cultural': '🎭',
        'Sports': '🏆',
        'Business': '💼',
        'Workshop': '🔧',
        'Creative': '🎨'
    }
    return icons[category] || '📅'
}

// Group events by date for calendar
export function groupEventsByDate(events) {
    const grouped = {}
    events.forEach(event => {
        const date = event.date
        if (!grouped[date]) {
            grouped[date] = []
        }
        grouped[date].push(event)
    })
    return grouped
}

// Get statistics from events
export function getEventStats(events, registeredEvents, clubs) {
    const now = new Date()
    const upcoming = events.filter(e => new Date(e.date) >= now)
    const totalRegistrations = registeredEvents.length
    const categories = [...new Set(events.map(e => e.category))]

    const categoryStats = categories.map(cat => ({
        name: cat,
        count: events.filter(e => e.category === cat).length,
        icon: getCategoryIcon(cat)
    }))

    return {
        totalEvents: events.length,
        upcomingEvents: upcoming.length,
        totalClubs: clubs.length,
        totalRegistrations,
        categoryStats
    }
}
