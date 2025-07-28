import React, { useState, useEffect } from 'react';
import { MapPin, Heart, Filter, Search, Star, Loader2, AlertCircle } from 'lucide-react';
import { HousingListing } from '../types';
import { db } from '../lib/supabase';

// Fallback data for when Supabase is not configured
const fallbackListings: HousingListing[] = [
  {
    id: '1',
    title: 'Cozy Studio Near UW Campus',
    description: 'Perfect for students! This studio apartment is just a 5-minute walk from campus. Features include hardwood floors, updated kitchen, and in-unit laundry.',
    rent: 1200,
    type: 'studio',
    bedrooms: 0,
    bathrooms: 1,
    address: '4500 University Way NE',
    neighborhood: 'U District',
    petFriendly: true,
    furnished: false,
    utilities: true,
    parking: false,
    images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'],
    contactInfo: {
      name: 'UW Housing Office',
      email: 'housing@uw.edu',
      phone: '(206) 543-4059'
    },
    source: 'manual',
    scrapedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: '2BR Apartment with Parking',
    description: 'Spacious 2-bedroom apartment with dedicated parking spot. Great for roommates! Close to grocery stores and restaurants.',
    rent: 1800,
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 1,
    address: '5200 Roosevelt Way NE',
    neighborhood: 'U District',
    petFriendly: false,
    furnished: true,
    utilities: false,
    parking: true,
    images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'],
    contactInfo: {
      name: 'U District Properties',
      email: 'info@udistrictproperties.com',
      phone: '(206) 555-0123'
    },
    source: 'manual',
    scrapedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    title: 'Shared Room in Student House',
    description: 'Affordable shared room in a student house. Great community atmosphere and close to campus. Utilities included.',
    rent: 800,
    type: 'shared',
    bedrooms: 1,
    bathrooms: 2,
    address: '4700 15th Ave NE',
    neighborhood: 'U District',
    petFriendly: true,
    furnished: true,
    utilities: true,
    parking: false,
    images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'],
    contactInfo: {
      name: 'Student Housing Co-op',
      email: 'housing@studentcoop.org',
      phone: '(206) 555-0456'
    },
    source: 'manual',
    scrapedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export default function Listings() {
  const [listings, setListings] = useState<HousingListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<HousingListing[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [filters, setFilters] = useState({
    minRent: 0,
    maxRent: 5000,
    housingType: [] as string[],
    petFriendly: null as boolean | null,
    furnished: null as boolean | null,
    source: 'all'
  });

  // Fetch listings from Supabase
  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingFallback(false);
      console.log('Starting to fetch listings...');

      const data = await db.getListings(filters);
      console.log('Fetched data:', data);

      if (data && data.length > 0) {
        setListings(data);
        setFilteredListings(data);
      } else {
        // If no data from Supabase, use fallback
        console.log('No listings found in database, using fallback data');
        setListings(fallbackListings);
        setFilteredListings(fallbackListings);
        setUsingFallback(true);
      }
    } catch (err) {
      console.error('Error fetching listings:', err);

      // Use fallback data on error
      console.log('Using fallback data due to error');
      setListings(fallbackListings);
      setFilteredListings(fallbackListings);
      setUsingFallback(true);
      setError('Unable to load live data. Showing sample listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    let filtered = [...listings];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    filtered = filtered.filter(listing => {
      if (listing.rent < filters.minRent || listing.rent > filters.maxRent) return false;
      if (filters.housingType.length > 0 && !filters.housingType.includes(listing.type)) return false;
      if (filters.petFriendly !== null && listing.petFriendly !== filters.petFriendly) return false;
      if (filters.furnished !== null && listing.furnished !== filters.furnished) return false;
      if (filters.source !== 'all' && listing.source !== filters.source) return false;

      return true;
    });

    setFilteredListings(filtered);
  }, [listings, searchTerm, filters]);

  const getSourceBadge = (source: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      reddit: { color: 'bg-orange-100 text-orange-800', label: 'Reddit' },
      Reddit: { color: 'bg-orange-100 text-orange-800', label: 'Reddit' },
      facebook: { color: 'bg-blue-100 text-blue-800', label: 'Facebook' },
      apartments: { color: 'bg-green-100 text-green-800', label: 'Apartments' },
      manual: { color: 'bg-purple-100 text-purple-800', label: 'Manual' },
      // Apartment communities
      Trailside: { color: 'bg-green-100 text-green-800', label: 'Trailside' },
      Strata: { color: 'bg-green-100 text-green-800', label: 'Strata' },
      'The M': { color: 'bg-green-100 text-green-800', label: 'The M' },
      'Theory UDistrict': { color: 'bg-green-100 text-green-800', label: 'Theory' },
      'The Standard': { color: 'bg-green-100 text-green-800', label: 'Standard' },
      'Muriel\'s Landing': { color: 'bg-green-100 text-green-800', label: 'Muriel\'s' },
      'HERE Seattle': { color: 'bg-green-100 text-green-800', label: 'HERE' },
      Bridge11: { color: 'bg-green-100 text-green-800', label: 'Bridge11' },
      Tripalink: { color: 'bg-green-100 text-green-800', label: 'Tripalink' },
      Nolan: { color: 'bg-green-100 text-green-800', label: 'Nolan' },
      Nora: { color: 'bg-green-100 text-green-800', label: 'Nora' },
      'Hub U District': { color: 'bg-green-100 text-green-800', label: 'Hub' },
      LaVita: { color: 'bg-green-100 text-green-800', label: 'LaVita' },
      Viola: { color: 'bg-green-100 text-green-800', label: 'Viola' },
      Sora: { color: 'bg-green-100 text-green-800', label: 'Sora' },
      Greta: { color: 'bg-green-100 text-green-800', label: 'Greta' },
      'Fifty-Two': { color: 'bg-green-100 text-green-800', label: 'Fifty-Two' },
      'The Stax': { color: 'bg-green-100 text-green-800', label: 'Stax' },
      Arista: { color: 'bg-green-100 text-green-800', label: 'Arista' },
      Parsonage: { color: 'bg-green-100 text-green-800', label: 'Parsonage' },
      'U Place': { color: 'bg-green-100 text-green-800', label: 'U Place' },
      'Twelve at U District': { color: 'bg-green-100 text-green-800', label: 'Twelve' },
      'ōLiv Seattle': { color: 'bg-green-100 text-green-800', label: 'ōLiv' },
      'The Accolade': { color: 'bg-green-100 text-green-800', label: 'Accolade' },
      'Verve Flats': { color: 'bg-green-100 text-green-800', label: 'Verve' },
      'Helix Ellipse': { color: 'bg-green-100 text-green-800', label: 'Helix' },
      Montclair: { color: 'bg-green-100 text-green-800', label: 'Montclair' },
      'Ori on the Ave': { color: 'bg-green-100 text-green-800', label: 'Ori' },
      Sundodger: { color: 'bg-green-100 text-green-800', label: 'Sundodger' },
      'The Corydon': { color: 'bg-green-100 text-green-800', label: 'Corydon' },
      'Ivy Ridge': { color: 'bg-green-100 text-green-800', label: 'Ivy Ridge' }
    };

    const badge = badges[source] || { color: 'bg-gray-100 text-gray-800', label: source };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Housing Listings 🏠</h1>
          <p className="text-gray-600 mb-6">
            Browse all available housing options in the U District area
          </p>

          {/* Fallback Data Notice */}
          {usingFallback && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Demo Mode:</strong> Showing sample listings. To see real data, please configure your Supabase credentials in the environment variables.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, location, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter size={16} />
                Filters
                {Object.values(filters).some(v => v !== null && v !== 'all' && (Array.isArray(v) ? v.length > 0 : v !== 0 && v !== 5000)) && (
                  <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                )}
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Rent</label>
                  <input
                    type="number"
                    value={filters.minRent}
                    onChange={(e) => setFilters(prev => ({ ...prev, minRent: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Rent</label>
                  <input
                    type="number"
                    value={filters.maxRent}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxRent: parseInt(e.target.value) || 5000 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Housing Type</label>
                  <select
                    onChange={(e) => {
                      const value = e.target.value;
                      setFilters(prev => ({
                        ...prev,
                        housingType: value ? [value] : []
                      }));
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Any Type</option>
                    <option value="studio">Studio</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="shared">Shared</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pet Friendly</label>
                  <select
                    value={filters.petFriendly === null ? '' : filters.petFriendly.toString()}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      petFriendly: e.target.value === '' ? null : e.target.value === 'true'
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Any</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Furnished</label>
                  <select
                    value={filters.furnished === null ? '' : filters.furnished.toString()}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      furnished: e.target.value === '' ? null : e.target.value === 'true'
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Any</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <select
                    value={filters.source}
                    onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="all">All Sources</option>
                    <option value="Reddit">Reddit</option>
                    <option value="Trailside">Trailside</option>
                    <option value="Strata">Strata</option>
                    <option value="The M">The M</option>
                    <option value="Theory UDistrict">Theory UDistrict</option>
                    <option value="The Standard">The Standard</option>
                    <option value="Muriel's Landing">Muriel's Landing</option>
                    <option value="HERE Seattle">HERE Seattle</option>
                    <option value="Bridge11">Bridge11</option>
                    <option value="Tripalink">Tripalink</option>
                    <option value="Nolan">Nolan</option>
                    <option value="Nora">Nora</option>
                    <option value="Hub U District">Hub U District</option>
                    <option value="LaVita">LaVita</option>
                    <option value="Viola">Viola</option>
                    <option value="Sora">Sora</option>
                    <option value="Greta">Greta</option>
                    <option value="Fifty-Two">Fifty-Two</option>
                    <option value="The Stax">The Stax</option>
                    <option value="Arista">Arista</option>
                    <option value="Parsonage">Parsonage</option>
                    <option value="U Place">U Place</option>
                    <option value="Twelve at U District">Twelve at U District</option>
                    <option value="ōLiv Seattle">ōLiv Seattle</option>
                    <option value="The Accolade">The Accolade</option>
                    <option value="Verve Flats">Verve Flats</option>
                    <option value="Helix Ellipse">Helix Ellipse</option>
                    <option value="Montclair">Montclair</option>
                    <option value="Ori on the Ave">Ori on the Ave</option>
                    <option value="Sundodger">Sundodger</option>
                    <option value="The Corydon">The Corydon</option>
                    <option value="Ivy Ridge">Ivy Ridge</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredListings.length} of {listings.length} listings
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="animate-spin mx-auto mb-4 text-purple-600" size={48} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading listings...</h3>
            <p className="text-gray-600">Fetching the latest housing options from our database</p>
          </div>
        )}

        {/* Error State */}
        {error && !usingFallback && (
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading listings</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchListings}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Listings Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Image */}
                <div className="relative h-48">
                  <img
                    src={listing.images[0] || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    {getSourceBadge(listing.source)}
                  </div>
                  <div className="absolute top-3 right-3">
                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
                      <Heart size={16} className="text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <div className="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                      {listing.images.length || 1} photos
                    </div>
                  </div>
                  {listing.scrapedAt && (
                    <div className="absolute bottom-3 right-3">
                      <div className="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                        {new Date(listing.scrapedAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">{listing.title}</h3>
                    <div className="text-right">
                      <div className="text-xl font-bold text-purple-600">
                        ${listing.rent.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">per month</div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin size={14} className="mr-1" />
                    <span className="text-sm">{listing.neighborhood || listing.address}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span>{listing.type}</span>
                    <span>•</span>
                    <span>{listing.bedrooms || 0} bed, {listing.bathrooms || 0} bath</span>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-3">
                      <span className={listing.petFriendly ? 'text-green-600' : 'text-gray-400'}>
                        {listing.petFriendly ? '🐕' : '🚫'} Pets
                      </span>
                      <span className={listing.furnished ? 'text-blue-600' : 'text-gray-400'}>
                        {listing.furnished ? '🛋️' : '📦'} {listing.furnished ? 'Furnished' : 'Unfurnished'}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {listing.description}
                  </p>

                  {/* Source and URL */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>Source: {listing.source}</span>
                    {listing.sourceUrl && (
                      <a
                        href={listing.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-700 underline"
                      >
                        View Original
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                      Contact
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <MapPin size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredListings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {listings.length === 0 ? 'No listings available right now' : 'No listings found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {listings.length === 0
                ? 'Please check back soon! Our scrapers are working to find the latest housing options.'
                : 'Try adjusting your search terms or filters'
              }
            </p>
            {listings.length > 0 && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({
                    minRent: 0,
                    maxRent: 5000,
                    housingType: [],
                    petFriendly: null,
                    furnished: null,
                    source: 'all'
                  });
                }}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Load More Button */}
        {filteredListings.length > 0 && filteredListings.length >= 9 && (
          <div className="text-center mt-8">
            <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              Load More Listings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}