# HuskyKennel Backend

A comprehensive backend server for the HuskyKennel housing matching platform, built with Express.js, TypeScript, and Supabase.

## Features

- **AI Chat Integration**: OpenAI GPT-4o powered chat assistant for housing questions
- **Housing Listings Management**: CRUD operations for housing listings
- **Smart Matching Algorithm**: Intelligent matching based on user preferences
- **Multi-Source Scraping**: Automated scraping from Reddit, Facebook, and apartment websites
- **User Preferences**: Save and manage user housing preferences
- **Comprehensive Logging**: Track user interactions and system events
- **Image Storage**: Supabase Storage integration for housing images

## API Endpoints

### Chat
- `POST /api/chat` - AI-powered chat responses

### Listings
- `POST /api/add-listing` - Add new housing listing

### Matching
- `POST /api/match` - Get top-matching listings based on preferences

### Preferences
- `POST /api/preferences` - Save user preferences
- `GET /api/preferences/:userId` - Get user preferences

### Logging
- `POST /api/log` - Log user actions
- `POST /api/log/batch` - Batch log entries

### Scraping
- `GET /api/scrape-all` - Run all scrapers
- `GET /api/scrape-all/reddit` - Run Reddit scraper only
- `GET /api/scrape-all/facebook` - Run Facebook scraper only
- `GET /api/scrape-all/apartments` - Run apartment scrapers only

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. **Install dependencies:**
   ```bash
   cd src/server
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp env.example .env
   ```

   Fill in your environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `SUPABASE_SERVICE_KEY`: Your Supabase service role key

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Start the server:**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## Database Schema

### Required Supabase Tables

```sql
-- Housing Listings
CREATE TABLE housing_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  rent INTEGER NOT NULL,
  type TEXT CHECK (type IN ('apartment', 'house', 'studio', 'shared')),
  bedrooms INTEGER,
  bathrooms INTEGER,
  address TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  pet_friendly BOOLEAN DEFAULT false,
  furnished BOOLEAN DEFAULT false,
  utilities BOOLEAN DEFAULT false,
  parking BOOLEAN DEFAULT false,
  images TEXT[] DEFAULT '{}',
  contact_info JSONB,
  source TEXT CHECK (source IN ('manual', 'reddit', 'facebook', 'apartments')),
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Preferences
CREATE TABLE user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  max_rent INTEGER NOT NULL,
  min_bedrooms INTEGER NOT NULL,
  max_bedrooms INTEGER NOT NULL,
  pet_friendly BOOLEAN DEFAULT false,
  furnished BOOLEAN DEFAULT false,
  utilities BOOLEAN DEFAULT false,
  parking BOOLEAN DEFAULT false,
  neighborhoods TEXT[] NOT NULL,
  housing_types TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Logs
CREATE TABLE logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  action TEXT CHECK (action IN ('chat', 'click', 'view', 'match')),
  data JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Storage Bucket

Create a storage bucket named `housing-images` in Supabase for storing listing images.

## Scrapers

### Reddit Scraper
- Scrapes r/udistrict and r/uw for housing posts
- Uses Reddit's JSON API
- Extracts rent, bedrooms, bathrooms, and contact info

### Facebook Scraper
- Uses Puppeteer for dynamic content
- Scrapes UW housing groups
- Handles anti-bot detection

### Apartment Scraper
- Scrapes multiple apartment websites:
  - Trailside Apartments
  - Strata Apartments
  - Tripalink
  - Here Apartments
- Extracts floor plans and pricing

## Development

### Project Structure
```
src/server/
├── index.ts              # Main server file
├── types/                # TypeScript type definitions
├── middleware/           # Express middleware
├── routes/               # API route handlers
├── services/             # Business logic services
├── scrapers/             # Web scraping modules
└── package.json          # Dependencies and scripts
```

### Adding New Scrapers

1. Create a new scraper class in `scrapers/`
2. Implement the `scrape()` method returning a `ScrapeResult`
3. Add the scraper to the main scraping route in `routes/scrape.ts`

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3001) |
| `NODE_ENV` | Environment | No (default: development) |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | Yes |

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

## Monitoring

The server includes comprehensive logging for:
- API requests and responses
- Scraping results and errors
- User interactions
- System events

Logs are stored in Supabase and can be monitored through the dashboard.

## Security

- CORS protection
- Rate limiting
- Input validation
- Error handling
- Environment variable protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.