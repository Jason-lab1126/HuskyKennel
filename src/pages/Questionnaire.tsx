import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { UserPreferences } from '../types';

const steps = [
  'Basic Info',
  'Budget & Type',
  'Room Preferences',
  'Lifestyle',
  'Location'
];

export default function Questionnaire() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({
    gender: '',
    age: 20,
    background: '',
    studentType: 'undergraduate',
    budget: { min: 800, max: 2000 },
    roomPreferences: {
      size: 'medium',
      colorTone: 'neutral',
      layout: 'no-preference'
    },
    housingType: [],
    furniturePreferences: [],
    flooring: [],
    leaseDuration: 'flexible',
    leaseSourcePreferences: {
      acceptOfficialLease: true,
      acceptOfficialSublease: false,
      acceptUnofficialSublease: false
    },
    hobbies: [],
    lifestyle: {
      smoking: false,
      pets: false,
      quietHours: true,
      socialLevel: 'ambivert'
    },
    preferredLocations: []
  });

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save preferences and navigate to results
      const finalPrefs = { ...preferences, createdAt: new Date() };
      localStorage.setItem('userPreferences', JSON.stringify(finalPrefs));
      navigate('/results');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell us about yourself 👋</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={preferences.gender}
                onChange={(e) => updatePreferences({ gender: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="number"
                value={preferences.age}
                onChange={(e) => updatePreferences({ age: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="18" max="65"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
              <input
                type="text"
                value={preferences.background}
                onChange={(e) => updatePreferences({ background: e.target.value })}
                placeholder="e.g., Computer Science, International Student, etc."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student Type</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {['undergraduate', 'graduate', 'professional'].map((type) => (
                  <button
                    key={type}
                    onClick={() => updatePreferences({ studentType: type as any })}
                    className={`p-3 rounded-lg border text-center capitalize ${
                      preferences.studentType === type
                        ? 'bg-purple-100 border-purple-500 text-purple-700'
                        : 'bg-white border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Budget & Housing Type 💰</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Budget Range</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                  <input
                    type="number"
                    value={preferences.budget?.min}
                    onChange={(e) => updatePreferences({
                      budget: { ...preferences.budget!, min: parseInt(e.target.value) }
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="500" step="50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Maximum</label>
                  <input
                    type="number"
                    value={preferences.budget?.max}
                    onChange={(e) => updatePreferences({
                      budget: { ...preferences.budget!, max: parseInt(e.target.value) }
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="500" step="50"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Housing Type (select all that interest you)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Studio', '1B1B', '2B1B', '2B2B', '3B2B', 'Shared Room'].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      const current = preferences.housingType || [];
                      const updated = current.includes(type)
                        ? current.filter(t => t !== type)
                        : [...current, type];
                      updatePreferences({ housingType: updated });
                    }}
                    className={`p-3 rounded-lg border text-center ${
                      preferences.housingType?.includes(type)
                        ? 'bg-purple-100 border-purple-500 text-purple-700'
                        : 'bg-white border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lease Duration Preference</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'short-term', label: 'Short-term', emoji: '📅', desc: '1-6 months' },
                  { value: 'long-term', label: 'Long-term', emoji: '📆', desc: '6+ months' },
                  { value: 'flexible', label: 'Flexible', emoji: '🔄', desc: 'Either option' }
                ].map((duration) => (
                  <button
                    key={duration.value}
                    onClick={() => updatePreferences({ leaseDuration: duration.value as any })}
                    className={`p-4 rounded-lg border text-center ${
                      preferences.leaseDuration === duration.value
                        ? 'bg-purple-100 border-purple-500 text-purple-700'
                        : 'bg-white border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{duration.emoji}</div>
                    <div className="font-medium">{duration.label}</div>
                    <div className="text-xs text-gray-500">{duration.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Lease Source Preferences (select all acceptable options)
              </label>
              <div className="space-y-3">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={preferences.leaseSourcePreferences?.acceptOfficialLease || false}
                    onChange={(e) => updatePreferences({
                      leaseSourcePreferences: {
                        ...preferences.leaseSourcePreferences!,
                        acceptOfficialLease: e.target.checked
                      }
                    })}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Official Lease 🏢</span>
                    <p className="text-xs text-gray-500">Direct lease from apartment complexes or leasing offices</p>
                  </div>
                </label>
                
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={preferences.leaseSourcePreferences?.acceptOfficialSublease || false}
                    onChange={(e) => updatePreferences({
                      leaseSourcePreferences: {
                        ...preferences.leaseSourcePreferences!,
                        acceptOfficialSublease: e.target.checked
                      }
                    })}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Official Subleases 🏛️</span>
                    <p className="text-xs text-gray-500">Through apartment complexes or verified platforms</p>
                  </div>
                </label>
                
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={preferences.leaseSourcePreferences?.acceptUnofficialSublease || false}
                    onChange={(e) => updatePreferences({
                      leaseSourcePreferences: {
                        ...preferences.leaseSourcePreferences!,
                        acceptUnofficialSublease: e.target.checked
                      }
                    })}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Unofficial Subleases 👥</span>
                    <p className="text-xs text-gray-500">Direct from students via Reddit, Facebook, etc.</p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Furniture Preferences</label>
              <div className="grid grid-cols-2 gap-3">
                {['Furnished', 'Unfurnished', 'Partially Furnished'].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      const current = preferences.furniturePreferences || [];
                      const updated = current.includes(option)
                        ? current.filter(o => o !== option)
                        : [...current, option];
                      updatePreferences({ furniturePreferences: updated });
                    }}
                    className={`p-3 rounded-lg border text-center ${
                      preferences.furniturePreferences?.includes(option)
                        ? 'bg-purple-100 border-purple-500 text-purple-700'
                        : 'bg-white border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Room Preferences 🏠</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Size</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'small', label: 'Cozy', emoji: '🏠' },
                  { value: 'medium', label: 'Standard', emoji: '🏘️' },
                  { value: 'large', label: 'Spacious', emoji: '🏢' }
                ].map((size) => (
                  <button
                    key={size.value}
                    onClick={() => updatePreferences({
                      roomPreferences: { ...preferences.roomPreferences!, size: size.value as any }
                    })}
                    className={`p-4 rounded-lg border text-center ${
                      preferences.roomPreferences?.size === size.value
                        ? 'bg-purple-100 border-purple-500 text-purple-700'
                        : 'bg-white border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{size.emoji}</div>
                    <div className="font-medium">{size.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color Tone Preference</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'warm', label: 'Warm', emoji: '🧡', desc: 'Cozy, earthy tones' },
                  { value: 'cool', label: 'Cool', emoji: '💙', desc: 'Modern, crisp colors' },
                  { value: 'neutral', label: 'Neutral', emoji: '🤍', desc: 'Clean, minimalist' }
                ].map((tone) => (
                  <button
                    key={tone.value}
                    onClick={() => updatePreferences({
                      roomPreferences: { ...preferences.roomPreferences!, colorTone: tone.value as any }
                    })}
                    className={`p-4 rounded-lg border text-center ${
                      preferences.roomPreferences?.colorTone === tone.value
                        ? 'bg-purple-100 border-purple-500 text-purple-700'
                        : 'bg-white border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{tone.emoji}</div>
                    <div className="font-medium">{tone.label}</div>
                    <div className="text-xs text-gray-500">{tone.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Layout Preference</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'open', label: 'Open Plan', emoji: '🌐' },
                  { value: 'divided', label: 'Divided Rooms', emoji: '🏗️' },
                  { value: 'no-preference', label: 'No Preference', emoji: '🤷‍♀️' }
                ].map((layout) => (
                  <button
                    key={layout.value}
                    onClick={() => updatePreferences({
                      roomPreferences: { ...preferences.roomPreferences!, layout: layout.value as any }
                    })}
                    className={`p-4 rounded-lg border text-center ${
                      preferences.roomPreferences?.layout === layout.value
                        ? 'bg-purple-100 border-purple-500 text-purple-700'
                        : 'bg-white border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{layout.emoji}</div>
                    <div className="font-medium text-sm">{layout.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Flooring Preferences</label>
              <div className="grid grid-cols-3 gap-3">
                {['Hardwood', 'Carpet', 'Laminate', 'Tile', 'Vinyl', 'No Preference'].map((floor) => (
                  <button
                    key={floor}
                    onClick={() => {
                      const current = preferences.flooring || [];
                      const updated = current.includes(floor)
                        ? current.filter(f => f !== floor)
                        : [...current, floor];
                      updatePreferences({ flooring: updated });
                    }}
                    className={`p-3 rounded-lg border text-center text-sm ${
                      preferences.flooring?.includes(floor)
                        ? 'bg-purple-100 border-purple-500 text-purple-700'
                        : 'bg-white border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    {floor}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Lifestyle & Preferences 🎯</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hobbies & Interests</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  'Gaming 🎮', 'Reading 📚', 'Cooking 👨‍🍳', 'Music 🎵', 
                  'Sports ⚽', 'Art 🎨', 'Photography 📸', 'Studying 📖',
                  'Socializing 👥', 'Netflix 📺', 'Fitness 💪', 'Coding 💻'
                ].map((hobby) => (
                  <button
                    key={hobby}
                    onClick={() => {
                      const current = preferences.hobbies || [];
                      const updated = current.includes(hobby)
                        ? current.filter(h => h !== hobby)
                        : [...current, hobby];
                      updatePreferences({ hobbies: updated });
                    }}
                    className={`p-3 rounded-lg border text-center text-sm ${
                      preferences.hobbies?.includes(hobby)
                        ? 'bg-purple-100 border-purple-500 text-purple-700'
                        : 'bg-white border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    {hobby}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Social Level</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'introvert', label: 'Introvert', emoji: '🤫', desc: 'Prefer quiet, solo time' },
                  { value: 'ambivert', label: 'Ambivert', emoji: '🤝', desc: 'Balance of both' },
                  { value: 'extrovert', label: 'Extrovert', emoji: '🎉', desc: 'Love social activities' }
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => updatePreferences({
                      lifestyle: { ...preferences.lifestyle!, socialLevel: type.value as any }
                    })}
                    className={`p-4 rounded-lg border text-center ${
                      preferences.lifestyle?.socialLevel === type.value
                        ? 'bg-purple-100 border-purple-500 text-purple-700'
                        : 'bg-white border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.emoji}</div>
                    <div className="font-medium">{type.label}</div>
                    <div className="text-xs text-gray-500">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={preferences.lifestyle?.smoking}
                    onChange={(e) => updatePreferences({
                      lifestyle: { ...preferences.lifestyle!, smoking: e.target.checked }
                    })}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Smoking Friendly 🚬</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={preferences.lifestyle?.pets}
                    onChange={(e) => updatePreferences({
                      lifestyle: { ...preferences.lifestyle!, pets: e.target.checked }
                    })}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Pet Friendly 🐕</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={preferences.lifestyle?.quietHours}
                    onChange={(e) => updatePreferences({
                      lifestyle: { ...preferences.lifestyle!, quietHours: e.target.checked }
                    })}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Prefer Quiet Hours 🤫</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Location Preferences 📍</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Areas (select all that interest you)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Near Campus (5-10 min walk)',
                  'Ave District (The Ave shopping)',
                  'Greek Row Area',
                  'Ravenna Neighborhood',
                  'Northgate Area',
                  'Roosevelt District',
                  'Green Lake Area',
                  'Wallingford',
                  'No Strong Preference'
                ].map((location) => (
                  <button
                    key={location}
                    onClick={() => {
                      const current = preferences.preferredLocations || [];
                      const updated = current.includes(location)
                        ? current.filter(l => l !== location)
                        : [...current, location];
                      updatePreferences({ preferredLocations: updated });
                    }}
                    className={`p-3 rounded-lg border text-left ${
                      preferences.preferredLocations?.includes(location)
                        ? 'bg-purple-100 border-purple-500 text-purple-700'
                        : 'bg-white border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">🎉 Ready to find your match!</h3>
              <p className="text-purple-700 text-sm">
                We've gathered all your preferences. Click "Find My Match" to see personalized housing recommendations powered by AI!
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm text-gray-600">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-purple-800 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <span
                key={step}
                className={`text-xs ${
                  index <= currentStep ? 'text-purple-600 font-medium' : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center px-6 py-3 rounded-lg font-medium ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft size={20} className="mr-1" />
              Previous
            </button>

            <button
              onClick={nextStep}
              className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  Find My Match
                  <Check size={20} className="ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight size={20} className="ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}