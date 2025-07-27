import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, MessageCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Header */}
      <header className="glass-card border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-12 h-12 premium-gradient rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">🐾</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-uw-purple to-uw-gold bg-clip-text text-transparent">
                HuskeyHome
              </span>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/"
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                  location.pathname === '/'
                    ? 'text-uw-purple bg-uw-purple/10 shadow-md'
                    : 'text-gray-700 hover:text-uw-purple hover:bg-uw-purple/5'
                }`}
              >
                Home
              </Link>
              <Link
                to="/listings"
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                  location.pathname === '/listings'
                    ? 'text-uw-purple bg-uw-purple/10 shadow-md'
                    : 'text-gray-700 hover:text-uw-purple hover:bg-uw-purple/5'
                }`}
              >
                Browse Listings
              </Link>
              <Link
                to="/questionnaire"
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                  location.pathname.includes('/questionnaire')
                    ? 'text-uw-purple bg-uw-purple/10 shadow-md'
                    : 'text-gray-700 hover:text-uw-purple hover:bg-uw-purple/5'
                }`}
              >
                Find Match
              </Link>
              <Link
                to="/chatbot"
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                  location.pathname === '/chatbot'
                    ? 'text-uw-purple bg-uw-purple/10 shadow-md'
                    : 'text-gray-700 hover:text-uw-purple hover:bg-uw-purple/5'
                }`}
              >
                AI Assistant
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="glass-card border-t border-white/10 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2">© 2025 HuskeyHome. Made with ❤️ for UW students.</p>
            <p className="text-sm text-uw-purple font-medium">Created by Zhijian Xu</p>
          </div>
        </div>
      </footer>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-card border-t border-white/10 z-50">
        <div className="flex justify-around py-3">
          <Link
            to="/"
            className={`flex flex-col items-center py-2 px-3 text-xs rounded-xl transition-all duration-300 ${
              location.pathname === '/'
                ? 'text-uw-purple bg-uw-purple/10'
                : 'text-gray-600'
            }`}
          >
            <Home size={20} />
            <span className="mt-1">Home</span>
          </Link>
          <Link
            to="/listings"
            className={`flex flex-col items-center py-2 px-3 text-xs rounded-xl transition-all duration-300 ${
              location.pathname === '/listings'
                ? 'text-uw-purple bg-uw-purple/10'
                : 'text-gray-600'
            }`}
          >
            <Search size={20} />
            <span className="mt-1">Browse</span>
          </Link>
          <Link
            to="/questionnaire"
            className={`flex flex-col items-center py-2 px-3 text-xs rounded-xl transition-all duration-300 ${
              location.pathname.includes('/questionnaire')
                ? 'text-uw-purple bg-uw-purple/10'
                : 'text-gray-600'
            }`}
          >
            <Heart size={20} />
            <span className="mt-1">Match</span>
          </Link>
          <Link
            to="/chatbot"
            className={`flex flex-col items-center py-2 px-3 text-xs rounded-xl transition-all duration-300 ${
              location.pathname === '/chatbot'
                ? 'text-uw-purple bg-uw-purple/10'
                : 'text-gray-600'
            }`}
          >
            <MessageCircle size={20} />
            <span className="mt-1">AI Chat</span>
          </Link>
        </div>
      </nav>
      
      <div className="h-20 md:hidden"></div> {/* Spacer for mobile nav */}
    </div>
  );
}