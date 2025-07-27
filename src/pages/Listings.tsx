import React, { useState, useEffect } from 'react';
import { MapPin, Heart, Filter, Search, Star } from 'lucide-react';
import { HousingListing } from '../types';
import { mockListings } from '../utils/mockData';

export default function Listings() {
  const [listings, setListings] = useState<HousingListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<HousingListing[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minRent: 0,
    maxRent: 5000,
    housingType: [] as string[],
    petFriendly: null as boolean | null,
    furnished: null as boolean | null,
    source: 'all'
  });

  useEffect(() => {
    setListings(mockListings);
    setFilteredListings(mockListings);
  }, []);

  useEffect(() => {
    let filtered = [...listings];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    const badges = {
      reddit: { color: 'bg-orange-100 text-orange-800', label: 'Reddit' },
      facebook: { color: 'bg-blue-100 text-blue-800', label: 'Facebook' },
      apartment: { color: 'bg-green-100 text-green-800', label: 'Apartment' },
      sublease: { color: 'bg-purple-100 text-purple-800', label: 'Official Sublease' }
    };
    
    const badge = badges[source as keyof typeof badges] || badges.apartment;
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
                    <option value="Studio">Studio</option>
                    <option value="1B1B">1B1B</option>
                    <option value="2B1B">2B1B</option>
                    <option value="2B2B">2B2B</option>
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
                    <option value="apartment">Apartments</option>
                    <option value="sublease">Subleases</option>
                    <option value="reddit">Reddit</option>
                    <option value="facebook">Facebook</option>
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

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Image */}
              <div className="relative h-48">
                <img
                  src={listing.images[0]}
                  alt={listing.name}
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
                    {listing.images.length} photos
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 text-lg">{listing.name}</h3>
                  <div className="text-right">
                    <div className="text-xl font-bold text-purple-600">
                      ${listing.rent.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">per month</div>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin size={14} className="mr-1" />
                  <span className="text-sm">{listing.location.neighborhood}</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span>{listing.type}</span>
                  <span>•</span>
                  <span>{listing.bedrooms} bed, {listing.bathrooms} bath</span>
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

                {/* Amenities */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {listing.amenities.slice(0, 3).map((amenity, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                    >
                      {amenity}
                    </span>
                  ))}
                  {listing.amenities.length > 3 && (
                    <span className="text-gray-500 text-xs px-2 py-1">
                      +{listing.amenities.length - 3} more
                    </span>
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

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search terms or filters</p>
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