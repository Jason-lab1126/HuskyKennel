import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Heart, Filter, SortDesc, Search } from 'lucide-react';
import { MatchResult, HousingListing, UserPreferences } from '../types';
import { mockListings, generateAISummary } from '../utils/mockData';

export default function Results() {
  const navigate = useNavigate();
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<MatchResult[]>([]);
  const [userPrefs, setUserPrefs] = useState<UserPreferences | null>(null);
  const [sortBy, setSortBy] = useState<'score' | 'price' | 'distance'>('score');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minRent: 0,
    maxRent: 5000,
    petFriendly: null as boolean | null,
    furnished: null as boolean | null,
    minScore: 70
  });

  useEffect(() => {
    // Load user preferences
    const savedPrefs = localStorage.getItem('userPreferences');
    if (!savedPrefs) {
      navigate('/questionnaire');
      return;
    }

    const prefs = JSON.parse(savedPrefs);
    setUserPrefs(prefs);

    // Generate matches with AI summaries
    const matches = mockListings.map((listing): MatchResult => {
      // Simple scoring algorithm (in real app, this would be more sophisticated)
      let score = 70 + Math.random() * 30; // Base score 70-100
      
      // Adjust score based on budget
      if (listing.rent >= prefs.budget.min && listing.rent <= prefs.budget.max) {
        score += 10;
      } else if (listing.rent > prefs.budget.max) {
        score -= 20;
      }

      // Adjust for housing type
      if (prefs.housingType?.includes(listing.type)) {
        score += 15;
      }

      // Adjust for lifestyle preferences
      if (prefs.lifestyle?.pets && listing.petFriendly) {
        score += 10;
      } else if (!prefs.lifestyle?.pets && !listing.petFriendly) {
        score += 5;
      }

      // Furniture preference
      if (prefs.furniturePreferences?.includes('Furnished') && listing.furnished) {
        score += 8;
      } else if (prefs.furniturePreferences?.includes('Unfurnished') && !listing.furnished) {
        score += 8;
      }

      // Lease duration and sublease preferences
      if (prefs.leaseDuration === 'short-term' || prefs.leaseDuration === 'flexible') {
        if (listing.source === 'reddit' || listing.source === 'facebook') {
          // Unofficial sublease
          if (prefs.subleasePreferences?.acceptUnofficial) {
            score += 12;
          } else {
            score -= 15; // Penalize if they don't want unofficial
          }
        } else if (listing.source === 'sublease') {
          // Official sublease
          if (prefs.subleasePreferences?.acceptOfficial) {
            score += 10;
          }
        }
      }

      score = Math.min(100, Math.max(60, score)); // Clamp between 60-100

      const reasons = [];
      if (listing.rent >= prefs.budget.min && listing.rent <= prefs.budget.max) {
        reasons.push('Within your budget range');
      }
      if (prefs.housingType?.includes(listing.type)) {
        reasons.push('Matches your preferred housing type');
      }
      if (prefs.lifestyle?.pets && listing.petFriendly) {
        reasons.push('Pet-friendly as requested');
      }
      if (listing.furnished && prefs.furniturePreferences?.includes('Furnished')) {
        reasons.push('Fully furnished');
      }
      if (prefs.leaseDuration === 'short-term' && (listing.source === 'reddit' || listing.source === 'facebook' || listing.source === 'sublease')) {
        reasons.push('Available for short-term lease');
      }
      if (prefs.leaseSourcePreferences?.acceptOfficialLease && listing.source === 'apartment') {
        reasons.push('Official lease as requested');
      }
      if (prefs.leaseSourcePreferences?.acceptUnofficialSublease && (listing.source === 'reddit' || listing.source === 'facebook')) {
        reasons.push('Unofficial sublease as requested');
      }
      if (prefs.leaseSourcePreferences?.acceptOfficialSublease && listing.source === 'sublease') {
        reasons.push('Official sublease program');
      }

      return {
        listing,
        score: Math.round(score),
        reasons,
        aiSummary: generateAISummary(listing, prefs)
      };
    });

    // Sort by score initially
    matches.sort((a, b) => b.score - a.score);
    setMatchResults(matches);
    setFilteredResults(matches);
  }, [navigate]);

  useEffect(() => {
    let filtered = [...matchResults];

    // Apply filters
    filtered = filtered.filter(result => {
      const { listing } = result;
      
      if (listing.rent < filters.minRent || listing.rent > filters.maxRent) return false;
      if (filters.petFriendly !== null && listing.petFriendly !== filters.petFriendly) return false;
      if (filters.furnished !== null && listing.furnished !== filters.furnished) return false;
      if (result.score < filters.minScore) return false;
      
      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score;
        case 'price':
          return a.listing.rent - b.listing.rent;
        case 'distance':
          // Mock distance sorting (in real app, would calculate from user location)
          return Math.random() - 0.5;
        default:
          return 0;
      }
    });

    setFilteredResults(filtered);
  }, [matchResults, filters, sortBy]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 80) return 'Great Match';
    if (score >= 70) return 'Good Match';
    return 'Fair Match';
  };

  if (!userPrefs) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Housing Matches 🎯</h1>
              <p className="text-gray-600 mt-1">
                Found {filteredResults.length} personalized recommendations based on your preferences
              </p>
            </div>
            <Link
              to="/questionnaire"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Retake Quiz
            </Link>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter size={16} />
                Filters
              </button>
              
              <div className="flex items-center gap-2">
                <SortDesc size={16} className="text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="score">Best Match</option>
                  <option value="price">Price (Low to High)</option>
                  <option value="distance">Distance</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Budget: ${userPrefs.budget.min} - ${userPrefs.budget.max} • {userPrefs.housingType?.join(', ')}
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow-sm mt-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Rent</label>
                  <input
                    type="number"
                    value={filters.minRent}
                    onChange={(e) => setFilters(prev => ({ ...prev, minRent: parseInt(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Rent</label>
                  <input
                    type="number"
                    value={filters.maxRent}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxRent: parseInt(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Match Score</label>
                  <input
                    type="range"
                    min="60"
                    max="100"
                    value={filters.minScore}
                    onChange={(e) => setFilters(prev => ({ ...prev, minScore: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-500 text-center">{filters.minScore}%</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="grid gap-6">
          {filteredResults.map((result, index) => (
            <div key={result.listing.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="md:flex">
                {/* Image */}
                <div className="md:w-1/3">
                  <div className="relative h-64 md:h-full">
                    <img
                      src={result.listing.images[0]}
                      alt={result.listing.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(result.score)}`}>
                        {result.score}% Match
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
                        <Heart size={20} className="text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                    {index === 0 && (
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                          🏆 Top Match
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="md:w-2/3 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{result.listing.name}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin size={16} className="mr-1" />
                        <span className="text-sm">{result.listing.address}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{result.listing.type}</span>
                        <span>•</span>
                        <span>{result.listing.bedrooms} bed, {result.listing.bathrooms} bath</span>
                        <span>•</span>
                        <span className={result.listing.petFriendly ? 'text-green-600' : 'text-gray-600'}>
                          {result.listing.petFriendly ? '🐕 Pet Friendly' : '🚫 No Pets'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">
                        ${result.listing.rent.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">per month</div>
                    </div>
                  </div>

                  {/* AI Summary */}
                  <div className="bg-purple-50 p-4 rounded-lg mb-4">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs">AI</span>
                      </div>
                      <p className="text-purple-800 text-sm">{result.aiSummary}</p>
                    </div>
                  </div>

                  {/* Match Reasons */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Why this matches you:</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.reasons.map((reason, idx) => (
                        <span
                          key={idx}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                        >
                          ✓ {reason}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {result.listing.amenities.slice(0, 4).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {amenity}
                        </span>
                      ))}
                      {result.listing.amenities.length > 4 && (
                        <span className="text-gray-500 text-sm">
                          +{result.listing.amenities.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                      Contact Property
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      View Details
                    </button>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(result.listing.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <MapPin size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredResults.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No matches found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or preferences</p>
            <Link
              to="/questionnaire"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors inline-block"
            >
              Update Preferences
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}