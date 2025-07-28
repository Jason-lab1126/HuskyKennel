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
  source: 'manual' | 'reddit' | 'facebook' | 'apartments' | 'Reddit' | 'Trailside' | 'Strata' | 'The M' | 'Theory UDistrict' | 'The Standard' | 'Muriel\'s Landing' | 'HERE Seattle' | 'Bridge11' | 'Tripalink' | 'Nolan' | 'Nora' | 'Hub U District' | 'LaVita' | 'Viola' | 'Sora' | 'Greta' | 'Fifty-Two' | 'The Stax' | 'Arista' | 'Parsonage' | 'U Place' | 'Twelve at U District' | 'ōLiv Seattle' | 'The Accolade' | 'Verve Flats' | 'Helix Ellipse' | 'Montclair' | 'Ori on the Ave' | 'Sundodger' | 'The Corydon' | 'Ivy Ridge';
  sourceUrl?: string;
  scrapedAt?: Date;
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