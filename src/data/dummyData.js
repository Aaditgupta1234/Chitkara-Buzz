// Dummy Clubs Data
export const dummyClubs = [
    {
        id: 1,
        name: "Tech Innovators Club",
        category: "Technology",
        website: "https://techinnovators.chitkara.edu.in",
        description: "A club for tech enthusiasts to explore cutting-edge technologies, hackathons, and coding challenges.",
        logo: "https://img.icons8.com/color/96/code.png",
        addedAt: "2026-01-15"
    },
    {
        id: 2,
        name: "Cultural Arts Society",
        category: "Cultural",
        website: "https://culturalarts.chitkara.edu.in",
        description: "Celebrating diversity through music, dance, drama, and art performances.",
        logo: "https://img.icons8.com/color/96/theatre-mask.png",
        addedAt: "2026-01-20"
    },
    {
        id: 3,
        name: "Sports & Fitness Club",
        category: "Sports",
        website: "https://sportsclub.chitkara.edu.in",
        description: "Promoting physical fitness and sportsmanship through various athletic activities.",
        logo: "https://img.icons8.com/color/96/basketball.png",
        addedAt: "2026-01-25"
    },
    {
        id: 4,
        name: "Entrepreneurship Cell",
        category: "Business",
        website: "https://ecell.chitkara.edu.in",
        description: "Fostering entrepreneurial mindset and startup culture among students.",
        logo: "https://img.icons8.com/color/96/rocket.png",
        addedAt: "2026-02-01"
    },
    {
        id: 5,
        name: "Photography & Film Club",
        category: "Creative",
        website: "https://photoclub.chitkara.edu.in",
        description: "Capturing moments and creating visual stories through photography and filmmaking.",
        logo: "https://img.icons8.com/color/96/camera.png",
        addedAt: "2026-02-05"
    }
];

// Dummy Events Data with correct property names for EventCard
export const dummyEvents = [
    {
        id: 1,
        title: "HackFest 2026 - 48 Hour Coding Marathon",
        club: "Tech Innovators Club",
        category: "Technology",
        date: "2026-02-20",
        time: "09:00 AM",
        location: "Main Auditorium, Block A",
        description: "Join us for an exciting 48-hour hackathon where teams compete to build innovative solutions. Prizes worth ₹1,00,000! Food and accommodation provided.",
        banner: "https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=800",
        registered: 156,
        capacity: 200,
        registrationLink: "#"
    },
    {
        id: 2,
        title: "Annual Cultural Fest - Harmony 2026",
        club: "Cultural Arts Society",
        category: "Cultural",
        date: "2026-02-25",
        time: "05:00 PM",
        location: "Open Air Theatre",
        description: "Experience the vibrant celebration of arts and culture with performances from across India. Music, dance, drama, and much more!",
        banner: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800",
        registered: 420,
        capacity: 500,
        registrationLink: "#"
    },
    {
        id: 3,
        title: "Inter-College Basketball Tournament",
        club: "Sports & Fitness Club",
        category: "Sports",
        date: "2026-02-28",
        time: "10:00 AM",
        location: "Sports Complex",
        description: "Compete against top college teams in this thrilling basketball championship. Show your skills and win exciting prizes!",
        banner: "https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=800",
        registered: 64,
        capacity: 80,
        registrationLink: "#"
    },
    {
        id: 4,
        title: "Startup Pitch Competition",
        club: "Entrepreneurship Cell",
        category: "Business",
        date: "2026-03-05",
        time: "02:00 PM",
        location: "Conference Hall, Block B",
        description: "Present your startup idea to industry experts and investors. Top 3 ideas get seed funding and mentorship opportunities!",
        banner: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800",
        registered: 45,
        capacity: 60,
        registrationLink: "#"
    },
    {
        id: 5,
        title: "Photography Workshop - Light & Shadows",
        club: "Photography & Film Club",
        category: "Workshop",
        date: "2026-03-10",
        time: "11:00 AM",
        location: "Media Lab, Block C",
        description: "Learn professional photography techniques from award-winning photographer Rahul Sharma. Bring your own camera!",
        banner: "https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg?auto=compress&cs=tinysrgb&w=800",
        registered: 28,
        capacity: 40,
        registrationLink: "#"
    },
    {
        id: 6,
        title: "AI/ML Workshop - Building Smart Apps",
        club: "Tech Innovators Club",
        category: "Technology",
        date: "2026-03-15",
        time: "10:00 AM",
        location: "Computer Lab 3, Block A",
        description: "Hands-on workshop on building AI-powered applications using Python and TensorFlow. Perfect for beginners!",
        banner: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
        registered: 72,
        capacity: 100,
        registrationLink: "#"
    },
    {
        id: 7,
        title: "Classical Dance Competition - Nritya",
        club: "Cultural Arts Society",
        category: "Cultural",
        date: "2026-03-18",
        time: "04:00 PM",
        location: "Main Auditorium",
        description: "Showcase your classical dance skills in Bharatanatyam, Kathak, Odissi, and more. Solo and group categories available.",
        banner: "https://images.pexels.com/photos/2188012/pexels-photo-2188012.jpeg?auto=compress&cs=tinysrgb&w=800",
        registered: 38,
        capacity: 50,
        registrationLink: "#"
    },
    {
        id: 8,
        title: "Fitness Challenge - Transform 30",
        club: "Sports & Fitness Club",
        category: "Sports",
        date: "2026-03-20",
        time: "06:00 AM",
        location: "College Grounds",
        description: "30-day fitness transformation challenge with daily workouts, nutrition guidance, and amazing prizes for the most improved!",
        banner: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=800",
        registered: 89,
        capacity: 150,
        registrationLink: "#"
    }
];

// Force refresh dummy data (clears and reinitializes)
export const forceRefreshDummyData = () => {
    localStorage.setItem('registeredClubs', JSON.stringify(dummyClubs));
    localStorage.setItem('manualEvents', JSON.stringify(dummyEvents));
    return { clubs: dummyClubs, events: dummyEvents };
};

// Function to initialize dummy data in localStorage
export const initializeDummyData = () => {
    const existingClubs = localStorage.getItem('registeredClubs');
    const existingEvents = localStorage.getItem('manualEvents');

    // Only initialize if no data exists
    if (!existingClubs || JSON.parse(existingClubs).length === 0) {
        localStorage.setItem('registeredClubs', JSON.stringify(dummyClubs));
    }

    if (!existingEvents || JSON.parse(existingEvents).length === 0) {
        localStorage.setItem('manualEvents', JSON.stringify(dummyEvents));
    }

    return {
        clubs: JSON.parse(localStorage.getItem('registeredClubs')) || dummyClubs,
        events: JSON.parse(localStorage.getItem('manualEvents')) || dummyEvents
    };
};
