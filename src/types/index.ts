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

export interface MatchResult {
  listing: HousingListing;
  score: number;
  reasons: string[];
  aiSummary: string;
}