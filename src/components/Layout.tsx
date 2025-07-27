import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, MessageCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🐾</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                HuskeyHome
              </span>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === '/'
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                Home
              </Link>
              <Link
                to="/listings"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === '/listings'
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                Browse Listings
              </Link>
              <Link
                to="/questionnaire"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname.includes('/questionnaire')
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                Find Match
              </Link>
              <Link
                to="/chatbot"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === '/chatbot'
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
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
      <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 HuskeyHome. Made with ❤️ by <span className="font-medium text-purple-600">Zhijian Xu</span> for UW students.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around py-2">
          <Link
            to="/"
            className={`flex flex-col items-center py-2 px-3 text-xs ${
              location.pathname === '/'
                ? 'text-purple-600'
                : 'text-gray-600'
            }`}
          >
            <Home size={20} />
            <span className="mt-1">Home</span>
          </Link>
          <Link
            to="/listings"
            className={`flex flex-col items-center py-2 px-3 text-xs ${
              location.pathname === '/listings'
                ? 'text-purple-600'
                : 'text-gray-600'
            }`}
          >
            <Search size={20} />
            <span className="mt-1">Browse</span>
          </Link>
          <Link
            to="/questionnaire"
            className={`flex flex-col items-center py-2 px-3 text-xs ${
              location.pathname.includes('/questionnaire')
                ? 'text-purple-600'
                : 'text-gray-600'
            }`}
          >
            <Heart size={20} />
            <span className="mt-1">Match</span>
          </Link>
          <Link
            to="/chatbot"
            className={`flex flex-col items-center py-2 px-3 text-xs ${
              location.pathname === '/chatbot'
                ? 'text-purple-600'
                : 'text-gray-600'
            }`}
          >
            <MessageCircle size={20} />
            <span className="mt-1">AI Chat</span>
          </Link>
        </div>
      </nav>
      
      <div className="h-16 md:hidden"></div> {/* Spacer for mobile nav */}
    </div>
  );
}