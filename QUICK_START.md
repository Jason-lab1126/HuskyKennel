# HuskyKennel Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd src/server
npm install
cd ../..
```

### 2. Environment Setup

Create the following environment files:

**Frontend (.env in root directory):**
```env
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_API_URL=http://localhost:3001
```

**Backend (.env in src/server/ directory):**
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_SERVICE_KEY=your_supabase_service_role_key_here
```

### 3. Start the Backend Server

```bash
cd src/server
npm run dev
```

The backend will start on http://localhost:3001

### 4. Start the Frontend

In a new terminal:
```bash
npm run dev
```

The frontend will start on http://localhost:5173

## 🔧 Current Status

### ✅ Working Features
- **Browse Listings Page**: Shows sample listings with fallback data
- **Chatbot**: Connects to backend API for AI responses
- **Basic UI**: All pages render without breaking
- **Error Handling**: Graceful fallbacks when services are unavailable

### ⚠️ Demo Mode
- The app currently runs in "Demo Mode" showing sample data
- To see real data, configure your Supabase credentials
- The chatbot will work with real AI responses once OpenAI API key is set

### 🔄 Next Steps
1. Set up your Supabase project and add credentials
2. Add your OpenAI API key for chatbot functionality
3. Run the scrapers to populate the database with real listings

## 🛠️ Troubleshooting

### Common Issues

**"Cannot find module 'react'" errors:**
```bash
npm install @types/react @types/react-dom
```

**Backend won't start:**
- Check if port 3001 is available
- Ensure all environment variables are set
- Run `npm install` in the server directory

**Frontend shows "Error loading listings":**
- This is expected without Supabase credentials
- The app will show sample data instead

**Chatbot doesn't respond:**
- Check if backend is running on port 3001
- Ensure OpenAI API key is set in backend .env

## 📊 Database Schema

Your Supabase project should have these tables:

```sql
-- Listings table
CREATE TABLE listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  rent INTEGER NOT NULL,
  type TEXT NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  address TEXT,
  neighborhood TEXT,
  pet_friendly BOOLEAN DEFAULT false,
  furnished BOOLEAN DEFAULT false,
  utilities BOOLEAN DEFAULT false,
  parking BOOLEAN DEFAULT false,
  images TEXT[],
  contact_info JSONB,
  source TEXT,
  source_url TEXT,
  scraped_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences table
CREATE TABLE user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  preferences JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Logs table
CREATE TABLE logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  action TEXT NOT NULL,
  data JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎯 Testing the App

1. **Browse Listings**: Visit `/listings` to see sample housing data
2. **Chatbot**: Visit `/chatbot` to test AI responses
3. **Landing Page**: Visit `/` to see the main page
4. **Questionnaire**: Visit `/questionnaire` to test preference collection

## 📝 Notes

- The app is designed to work even without full configuration
- Sample data provides a good demonstration of functionality
- Real data integration requires Supabase and OpenAI setup
- All major routes are functional and won't break the app