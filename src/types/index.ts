export interface UserPreferences {
  id?: string;
  gender: string;
  age: number;
  background: string;
  studentType: 'undergraduate' | 'graduate' | 'professional';
  budget: {
    min: number;
    max: number;
  };
  roomPreferences: {
    size: 'small' | 'medium' | 'large';
    colorTone: 'warm' | 'cool' | 'neutral';
    layout: 'open' | 'divided' | 'no-preference';
  };
  housingType: string[];
  furniturePreferences: string[];
  flooring: string[];
  leaseDuration: 'short-term' | 'long-term' | 'flexible';
  leaseSourcePreferences: {
    acceptOfficialLease: boolean;
    acceptOfficialSublease: boolean;
    acceptUnofficialSublease: boolean;
  };
  hobbies: string[];
  lifestyle: {
    smoking: boolean;
    pets: boolean;
    petType?: string;
    quietHours: boolean;
    socialLevel: 'introvert' | 'ambivert' | 'extrovert';
  };
  preferredLocations: string[];
  createdAt?: Date;
}

export interface HousingListing {
  id: string;
  name: string;
  address: string;
  images: string[];
  rent: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  description: string;
  source: 'reddit' | 'facebook' | 'apartment' | 'sublease';
  contactInfo: {
    email?: string;
    phone?: string;
    source_url?: string;
  };
  location: {
    lat: number;
    lng: number;
    neighborhood: string;
  };
  availability: Date;
  petFriendly: boolean;
  furnished: boolean;
  utilities: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchResult {
  listing: HousingListing;
  score: number;
  reasons: string[];
  aiSummary: string;
}