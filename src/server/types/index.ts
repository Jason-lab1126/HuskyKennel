export interface HousingListing {
  id?: string;
  title: string;
  description: string;
  rent: number;
  type: 'apartment' | 'house' | 'studio' | 'shared';
  bedrooms?: number;
  bathrooms?: number;
  address: string;
  neighborhood: string;
  petFriendly: boolean;
  furnished: boolean;
  utilities: boolean;
  parking: boolean;
  images: string[];
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  source: 'manual' | 'reddit' | 'facebook' | 'apartments';
  sourceUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserPreferences {
  id?: string;
  userId: string;
  maxRent: number;
  minBedrooms: number;
  maxBedrooms: number;
  petFriendly: boolean;
  furnished: boolean;
  utilities: boolean;
  parking: boolean;
  neighborhoods: string[];
  housingTypes: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ChatMessage {
  id?: string;
  userId: string;
  message: string;
  response: string;
  timestamp: Date;
}

export interface LogEntry {
  id?: string;
  userId: string;
  action: 'chat' | 'click' | 'view' | 'match';
  data: any;
  timestamp: Date;
}

export interface MatchResult {
  listing: HousingListing;
  score: number;
  reasons: string[];
}

export interface ScrapedPost {
  title: string;
  content: string;
  author: string;
  url: string;
  timestamp: Date;
  images: string[];
}

export interface ScrapeResult {
  source: string;
  success: boolean;
  count: number;
  error?: string;
}