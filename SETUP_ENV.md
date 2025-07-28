# Environment Setup Guide

## Frontend Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Backend API URL
VITE_API_URL=http://localhost:3001
```

## Backend Environment Variables

Create a `.env` file in the `src/server/` directory with:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_SERVICE_KEY=your_supabase_service_role_key_here

# Optional: Logging Configuration
LOG_LEVEL=info
ENABLE_SCRAPING_LOGS=true
```

## Getting Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the "Project URL" for `VITE_SUPABASE_URL` and `SUPABASE_URL`
4. Copy the "anon public" key for `VITE_SUPABASE_ANON_KEY`
5. Copy the "service_role" key for `SUPABASE_SERVICE_KEY`

## Getting Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy it to `OPENAI_API_KEY`

## Database Setup

Make sure your Supabase project has the following tables:

- `listings` - for housing listings
- `user_preferences` - for user preferences
- `chat_messages` - for chat history
- `logs` - for system logs