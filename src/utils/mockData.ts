import { HousingListing } from '../types';

export const mockListings: HousingListing[] = [
  {
    id: '1',
    name: 'Trailside Apartments',
    address: '1234 15th Ave NE, Seattle, WA 98105',
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rent: 1850,
    type: '1B1B',
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['Gym', 'Pool', 'Parking', 'In-unit Laundry'],
    description: 'Modern apartment with stunning city views',
    source: 'apartment',
    contactInfo: {
      email: 'leasing@trailside.com',
      phone: '(206) 555-0123'
    },
    location: {
      lat: 47.6616,
      lng: -122.3169,
      neighborhood: 'U District'
    },
    availability: new Date('2024-03-01'),
    petFriendly: true,
    furnished: false,
    utilities: ['Water', 'Trash'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Cozy Studio Near Campus',
    address: '4321 Brooklyn Ave NE, Seattle, WA 98105',
    images: [
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rent: 1200,
    type: 'Studio',
    bedrooms: 0,
    bathrooms: 1,
    amenities: ['Study Room', 'Bike Storage'],
    description: 'Perfect for focused students, quiet building',
    source: 'reddit',
    contactInfo: {
      email: 'student@uw.edu'
    },
    location: {
      lat: 47.6587,
      lng: -122.3156,
      neighborhood: 'U District'
    },
    availability: new Date('2024-02-15'),
    petFriendly: false,
    furnished: true,
    utilities: ['All included'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Bridge11 Apartments',
    address: '1100 NE 45th St, Seattle, WA 98105',
    images: [
      'https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rent: 2400,
    type: '2B2B',
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['Rooftop Deck', 'Study Lounge', 'Gym', 'Parking'],
    description: 'Luxury living with panoramic views',
    source: 'apartment',
    contactInfo: {
      email: 'info@bridge11.com',
      phone: '(206) 555-0456'
    },
    location: {
      lat: 47.6618,
      lng: -122.3178,
      neighborhood: 'U District'
    },
    availability: new Date('2024-04-01'),
    petFriendly: true,
    furnished: false,
    utilities: ['Water', 'Trash', 'Internet'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Short-term Sublease - Spring Quarter',
    address: '1515 NE 50th St, Seattle, WA 98105',
    images: [
      'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rent: 950,
    type: '1B1B',
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['WiFi Included', 'Shared Kitchen', 'Close to Bus'],
    description: 'Available for Spring quarter only. Unofficial sublease from UW student going abroad.',
    source: 'facebook',
    contactInfo: {
      email: 'uwstudent2024@gmail.com',
      source_url: 'https://facebook.com/groups/uwhousing'
    },
    location: {
      lat: 47.6656,
      lng: -122.3181,
      neighborhood: 'U District'
    },
    availability: new Date('2024-03-25'),
    petFriendly: false,
    furnished: true,
    utilities: ['Water', 'Internet'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    name: 'Official Summer Sublease Program',
    address: '4500 15th Ave NE, Seattle, WA 98105',
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rent: 1650,
    type: '1B1B',
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['Pool', 'Gym', 'Study Room', 'Parking Available'],
    description: 'Official 3-month summer sublease program through apartment management.',
    source: 'apartment',
    contactInfo: {
      email: 'leasing@example.com',
      phone: '(206) 555-0789'
    },
    location: {
      lat: 47.6621,
      lng: -122.3175,
      neighborhood: 'U District'
    },
    availability: new Date('2024-06-15'),
    petFriendly: true,
    furnished: false,
    utilities: ['Water', 'Trash'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const generateAISummary = (listing: HousingListing, userPrefs?: any): string => {
  const summaries = [
    `Perfect for a ${userPrefs?.lifestyle?.socialLevel || 'focused'} student who values ${listing.furnished ? 'convenience' : 'customization'} and modern amenities.`,
    `Ideal for someone who enjoys ${listing.amenities.includes('Gym') ? 'staying active' : 'quiet study time'} and appreciates ${listing.petFriendly ? 'pet-friendly' : 'peaceful'} environments.`,
    `Great choice for ${userPrefs?.studentType || 'students'} seeking ${listing.type === 'Studio' ? 'efficient living' : 'spacious comfort'} near campus.`,
    `Perfect match for someone who loves ${listing.location.neighborhood} and values ${listing.rent < 1500 ? 'affordable' : 'premium'} living.`
  ];
  
  return summaries[Math.floor(Math.random() * summaries.length)];
};