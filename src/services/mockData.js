/**
 * Mock Data Service
 * Simulates backend data for MVP development
 */

export const mockAccommodations = [
  {
    id: 1,
    name: 'Kigali Serena Hotel',
    type: 'Hotel',
    location: 'Kigali, Rwanda',
    price: 250,
    rating: 4.8,
    reviews: 324,
    beds: 2,
    baths: 2,
    area: 450,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'
    ],
    description: 'Experience luxury in the heart of Kigali. Our hotel offers world-class amenities, stunning views, and exceptional service. Perfect for business travelers and tourists alike.',
    amenities: ['WiFi', 'Pool', 'Restaurant', 'Spa', 'Gym', 'Room Service', 'Air Conditioning', 'Parking', 'Conference Rooms', 'Airport Shuttle', 'Laundry Service', 'Concierge'],
    host: {
      name: 'Serena Hotels',
      joinedDate: 'Member since 2015',
      rating: 4.9,
      verified: true
    },
    reviewsList: [
      {
        id: 1,
        author: 'Sarah Johnson',
        date: 'November 2025',
        rating: 5.0,
        comment: 'Absolutely wonderful stay! The staff was incredibly welcoming and the facilities were top-notch.'
      },
      {
        id: 2,
        author: 'Michael Chen',
        date: 'October 2025',
        rating: 4.5,
        comment: 'Great location in the heart of Kigali. Rooms were spacious and clean.'
      }
    ],
    available: true,
    ecoFriendly: true
  },
  {
    id: 2,
    name: 'Lake Kivu Resort',
    type: 'Resort',
    location: 'Rubavu, Rwanda',
    price: 180,
    rating: 4.7,
    reviews: 198,
    beds: 3,
    baths: 2,
    area: 600,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80'
    ],
    description: 'Relax by the beautiful Lake Kivu with stunning sunsets, water sports, and beachfront dining. A perfect getaway destination.',
    amenities: ['WiFi', 'Pool', 'Beach Access', 'Restaurant', 'Bar', 'Water Sports', 'Spa', 'Parking'],
    host: {
      name: 'Lake Kivu Resorts Group',
      joinedDate: 'Member since 2017',
      rating: 4.8,
      verified: true
    },
    reviewsList: [
      {
        id: 1,
        author: 'Emma Williams',
        date: 'September 2025',
        rating: 5.0,
        comment: 'Beautiful lakeside location with amazing sunset views!'
      }
    ],
    available: true,
    ecoFriendly: true
  },
  {
    id: 3,
    name: 'Volcanoes Lodge',
    type: 'Lodge',
    location: 'Musanze, Rwanda',
    price: 320,
    rating: 4.9,
    reviews: 156,
    beds: 1,
    baths: 1,
    area: 400,
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&q=80'
    ],
    description: 'Wake up to views of the Virunga volcanoes. Perfect base for gorilla trekking adventures.',
    amenities: ['WiFi', 'Restaurant', 'Fireplace', 'Mountain Views', 'Hiking Tours', 'Bar', 'Parking'],
    host: {
      name: 'Mountain Lodges Rwanda',
      joinedDate: 'Member since 2016',
      rating: 4.9,
      verified: true
    },
    reviewsList: [],
    available: true,
    ecoFriendly: true
  },
  {
    id: 4,
    name: 'Kigali Heights Apartment',
    type: 'Apartment',
    location: 'Kigali, Rwanda',
    price: 120,
    rating: 4.6,
    reviews: 89,
    beds: 2,
    baths: 1,
    area: 850,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'
    ],
    description: 'Modern apartment with city views, fully equipped kitchen, and close to shopping centers.',
    amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'Parking', 'Balcony', 'Security'],
    host: {
      name: 'Urban Stays Rwanda',
      joinedDate: 'Member since 2019',
      rating: 4.5,
      verified: true
    },
    reviewsList: [],
    available: true,
    ecoFriendly: false
  },
  {
    id: 5,
    name: 'Akagera Safari Lodge',
    type: 'Lodge',
    location: 'Akagera National Park, Rwanda',
    price: 280,
    rating: 4.8,
    reviews: 142,
    beds: 2,
    baths: 2,
    area: 500,
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&q=80'
    ],
    description: 'Experience wildlife up close in this safari lodge with game drives and stunning savanna views.',
    amenities: ['WiFi', 'Restaurant', 'Safari Tours', 'Bar', 'Pool', 'Wildlife Viewing'],
    host: {
      name: 'Akagera Adventures',
      joinedDate: 'Member since 2018',
      rating: 4.8,
      verified: true
    },
    reviewsList: [],
    available: true,
    ecoFriendly: true
  },
  {
    id: 6,
    name: 'Gisenyi Beach House',
    type: 'Guesthouse',
    location: 'Gisenyi, Rwanda',
    price: 95,
    rating: 4.5,
    reviews: 67,
    beds: 3,
    baths: 2,
    area: 700,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80'
    ],
    description: 'Cozy beachfront guesthouse perfect for families and groups looking for a relaxed atmosphere.',
    amenities: ['WiFi', 'Beach Access', 'Kitchen', 'Garden', 'BBQ', 'Parking'],
    host: {
      name: 'Local Hosts Rwanda',
      joinedDate: 'Member since 2020',
      rating: 4.6,
      verified: false
    },
    reviewsList: [],
    available: true,
    ecoFriendly: false
  }
]

export const mockTours = [
  {
    id: 1,
    category: 'NATURE',
    title: 'Gorilla Trekking Experience',
    description: 'Get up close with mountain gorillas in Volcanoes National Park. An unforgettable wildlife encounter.',
    image: 'https://images.unsplash.com/photo-1571752239935-74f3d4d23816?w=600&q=80',
    duration: '3 days',
    price: 1500,
    rating: 4.9,
    reviews: 234,
    included: ['Park permits', 'Professional guide', 'Transport', 'Accommodation', 'Meals'],
    itinerary: [
      { day: 1, activities: 'Arrival and briefing', description: 'Meet your guide and prepare for the trek' },
      { day: 2, activities: 'Gorilla trekking', description: 'Full day trekking to observe gorillas in their natural habitat' },
      { day: 3, activities: 'Cultural visit and departure', description: 'Visit local communities before heading back' }
    ],
    available: true,
    maxGroupSize: 8
  },
  {
    id: 2,
    category: 'ADVENTURE',
    title: 'Lake Kivu Beach Escape',
    description: 'Enjoy water sports, island hopping, and relaxation on the beautiful shores of Lake Kivu.',
    image: 'https://images.unsplash.com/photo-1516826435551-36a8a09e4526?w=600&q=80',
    duration: '2 days',
    price: 250,
    rating: 4.7,
    reviews: 156,
    included: ['Boat rides', 'Water sports equipment', 'Guide', 'Meals'],
    itinerary: [
      { day: 1, activities: 'Beach activities', description: 'Swimming, kayaking, and beach volleyball' },
      { day: 2, activities: 'Island hopping', description: 'Visit Napoleon Island and other attractions' }
    ],
    available: true,
    maxGroupSize: 15
  },
  {
    id: 3,
    category: 'CULTURE',
    title: 'Kigali City Tour',
    description: 'Explore the vibrant capital city and its rich history including genocide memorial and local markets.',
    image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=600&q=80',
    duration: '1 day',
    price: 80,
    rating: 4.6,
    reviews: 298,
    included: ['Guide', 'Transport', 'Museum entrance fees', 'Lunch'],
    itinerary: [
      { day: 1, activities: 'Full city tour', description: 'Genocide memorial, local markets, craft centers, and city viewpoints' }
    ],
    available: true,
    maxGroupSize: 20
  },
  {
    id: 4,
    category: 'WILDLIFE',
    title: 'Akagera Safari Adventure',
    description: 'Two-day safari in Akagera National Park to see lions, elephants, giraffes, and more.',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80',
    duration: '2 days',
    price: 450,
    rating: 4.8,
    reviews: 187,
    included: ['Game drives', 'Park fees', 'Accommodation', 'Meals', 'Professional guide'],
    itinerary: [
      { day: 1, activities: 'Morning and evening game drives', description: 'Spot the big five and other wildlife' },
      { day: 2, activities: 'Boat safari and departure', description: 'Lake Ihema boat trip to see hippos and crocodiles' }
    ],
    available: true,
    maxGroupSize: 10
  },
  {
    id: 5,
    category: 'HISTORICAL',
    title: 'King\'s Palace & Museums Tour',
    description: 'Visit the ancient King\'s Palace in Nyanza and explore Rwanda\'s royal history.',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80',
    duration: '1 day',
    price: 120,
    rating: 4.5,
    reviews: 92,
    included: ['Transport', 'Guide', 'Entrance fees', 'Traditional dance performance'],
    itinerary: [
      { day: 1, activities: 'Palace tour and cultural experience', description: 'Explore the reconstructed palace and learn about Rwandan monarchy' }
    ],
    available: true,
    maxGroupSize: 15
  },
  {
    id: 6,
    category: 'ADVENTURE',
    title: 'Nyungwe Forest Canopy Walk',
    description: 'Walk among the treetops on East Africa\'s only canopy walkway in Nyungwe Forest.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
    duration: '2 days',
    price: 350,
    rating: 4.7,
    reviews: 143,
    included: ['Park fees', 'Canopy walk', 'Chimpanzee tracking', 'Accommodation', 'Meals'],
    itinerary: [
      { day: 1, activities: 'Canopy walkway', description: '50m high walkway with stunning forest views' },
      { day: 2, activities: 'Chimpanzee tracking', description: 'Early morning trek to find chimpanzees' }
    ],
    available: true,
    maxGroupSize: 12
  }
]

export const mockTransportOptions = [
  {
    id: 1,
    type: 'Taxi',
    name: 'Airport Transfer - Standard',
    description: 'Comfortable sedan for airport transfers',
    price: 25,
    capacity: 4,
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80',
    features: ['Air conditioning', 'Professional driver', 'Meet & greet service'],
    available: true
  },
  {
    id: 2,
    type: 'Shuttle',
    name: 'City Shuttle Service',
    description: 'Shared shuttle service within Kigali',
    price: 10,
    capacity: 12,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80',
    features: ['Multiple daily departures', 'Central locations', 'Affordable'],
    available: true
  },
  {
    id: 3,
    type: 'Car Rental',
    name: 'Toyota RAV4 - SUV',
    description: 'Self-drive or with driver',
    price: 80,
    priceType: 'per day',
    capacity: 5,
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&q=80',
    features: ['4WD', 'GPS included', 'Insurance covered', 'Fuel efficient'],
    available: true
  },
  {
    id: 4,
    type: 'Private Transfer',
    name: 'Mercedes Vito - Luxury Van',
    description: 'Premium transport for groups',
    price: 120,
    capacity: 8,
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&q=80',
    features: ['Leather seats', 'WiFi', 'Refreshments', 'Professional chauffeur'],
    available: true
  },
  {
    id: 5,
    type: 'Bus',
    name: 'Intercity Bus Service',
    description: 'Long-distance travel between cities',
    price: 15,
    capacity: 50,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80',
    features: ['Comfortable seats', 'Rest stops', 'Affordable'],
    available: true
  }
]

export const mockServices = [
  {
    id: 1,
    category: 'Photography',
    title: 'Professional Photography Package',
    description: 'Capture your Rwanda adventure with a professional photographer',
    price: 150,
    duration: '4 hours',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&q=80',
    rating: 4.9,
    reviews: 78,
    included: ['Professional photographer', '100+ edited photos', 'Online gallery'],
    available: true
  },
  {
    id: 2,
    category: 'Spa & Wellness',
    title: 'Traditional Rwandan Spa Day',
    description: 'Relaxation and rejuvenation with local treatments',
    price: 120,
    duration: '3 hours',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80',
    rating: 4.8,
    reviews: 156,
    included: ['Massage', 'Facial', 'Traditional herbs treatment', 'Refreshments'],
    available: true
  },
  {
    id: 3,
    category: 'Food & Dining',
    title: 'Rwandan Cuisine Experience',
    description: 'Cooking class and traditional meal',
    price: 85,
    duration: '3 hours',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80',
    rating: 4.7,
    reviews: 203,
    included: ['Cooking lesson', 'Market visit', 'Full meal', 'Recipe booklet'],
    available: true
  },
  {
    id: 4,
    category: 'Adventure',
    title: 'Zip Line Adventure',
    description: 'Thrilling zip line experience over beautiful landscapes',
    price: 95,
    duration: '2 hours',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    rating: 4.9,
    reviews: 134,
    included: ['Safety equipment', 'Professional guide', 'Photos'],
    available: true
  }
]

// Mock users removed - All users are now real accounts created through Supabase authentication
// Users register via /signup and login via /login
// Real user data is stored in Supabase profiles table
export const mockUsers = []

export const mockBookings = []

// Helper functions to simulate API delays
export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

export const generateId = () => Date.now() + Math.random().toString(36).substr(2, 9)
