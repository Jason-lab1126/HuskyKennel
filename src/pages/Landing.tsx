import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Heart, Users, Star } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative premium-gradient text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-uw-gold/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-48">
          <div className="text-center">
            <div className="mb-6 animate-fade-in-up">
              <span className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-8">
                🎓 Built for UW Huskies
              </span>
            </div>
            <h1 className="text-5xl md:text-8xl font-bold mb-8 leading-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Find your perfect
              <span className="block bg-gradient-to-r from-uw-gold to-yellow-200 bg-clip-text text-transparent">
                U District Home
              </span>
              <span className="text-4xl md:text-6xl block mt-4">🐾</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-white/80 max-w-4xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              AI-powered housing platform designed exclusively for UW students. Get personalized recommendations 
              based on your lifestyle, budget, and preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <Link
                to="/questionnaire"
                className="apple-button bg-white text-uw-purple hover:bg-gray-50 shadow-2xl flex items-center justify-center group"
              >
                Start Your Journey
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/chatbot"
                className="apple-button bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 flex items-center justify-center"
              >
                Ask AI Assistant
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block bg-uw-purple/10 text-uw-purple px-4 py-2 rounded-full text-sm font-medium mb-6">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Why Choose HuskeyHome?
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Experience the future of student housing with our AI-powered platform designed 
              specifically for the UW community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 glass-card rounded-3xl hover-lift group">
              <div className="w-20 h-20 premium-gradient rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Matching</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced machine learning understands your unique preferences to find your ideal home.
              </p>
            </div>

            <div className="text-center p-8 glass-card rounded-3xl hover-lift group">
              <div className="w-20 h-20 bg-gradient-to-br from-uw-gold to-yellow-400 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">U District Expert</h3>
              <p className="text-gray-600 leading-relaxed">
                Hyper-focused on the University District with intimate knowledge of every neighborhood.
              </p>
            </div>

            <div className="text-center p-8 glass-card rounded-3xl hover-lift group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Husky Community</h3>
              <p className="text-gray-600 leading-relaxed">
                Built by UW students, for UW students. Connect with your future roommates and neighbors.
              </p>
            </div>

            <div className="text-center p-8 glass-card rounded-3xl hover-lift group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Star className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Quality</h3>
              <p className="text-gray-600 leading-relaxed">
                Carefully curated listings with verified information and premium support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block bg-uw-purple/10 text-uw-purple px-4 py-2 rounded-full text-sm font-medium mb-6">
              Simple Process
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Three simple steps to find your perfect home in the U District
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 premium-gradient text-white rounded-3xl flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-2xl group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tell Us About You</h3>
              <p className="text-gray-600 leading-relaxed">
                Share your preferences, lifestyle, and budget through our intelligent questionnaire designed for students.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 premium-gradient text-white rounded-3xl flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-2xl group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Magic</h3>
              <p className="text-gray-600 leading-relaxed">
                Our sophisticated AI analyzes thousands of housing options to find your perfect matches.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 premium-gradient text-white rounded-3xl flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-2xl group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Find Your Home</h3>
              <p className="text-gray-600 leading-relaxed">
                Browse personalized recommendations and connect directly with verified landlords and students.
              </p>
            </div>
          </div>

          <div className="text-center mt-16">
            <Link
              to="/questionnaire"
              className="apple-button premium-gradient text-white shadow-2xl inline-flex items-center"
            >
              Start Your Journey
              <ArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Attribution Section */}
      <section className="py-20 premium-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🐾</span>
            </div>
            <h3 className="text-3xl font-bold mb-4">Built for Huskies, by a Husky</h3>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Created by <span className="font-bold text-uw-gold">Zhijian Xu</span>, a UW student who intimately understands 
              the unique challenges of finding quality housing in the U District.
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to find your home?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of UW students who've found their perfect housing match
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/questionnaire"
              className="apple-button premium-gradient text-white shadow-2xl"
            >
              Get Started Free
            </Link>
            <Link
              to="/listings"
              className="apple-button bg-gray-100 text-gray-800 hover:bg-gray-200"
            >
              Browse Listings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}