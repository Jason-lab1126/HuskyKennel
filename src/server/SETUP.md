# HuskyKennel Housing Scraper Setup Guide

This guide will help you set up and run the comprehensive housing scraper system for Seattle's U District.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd src/server
npm install
```

### 2. Environment Setup

```bash
cp env.example .env
```

Edit `.env` with your API keys:
```env
# Required
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_KEY=your_supabase_service_role_key_here

# Optional
PORT=3001
NODE_ENV=development
```

### 3. Database Setup

Create these tables in your Supabase project:

```sql
-- Housing Listings Table
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
  source TEXT,
  source_url TEXT,
  scraped_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX idx_housing_listings_source ON housing_listings(source);
CREATE INDEX idx_housing_listings_scraped_at ON housing_listings(scraped_at);
```

### 4. Storage Setup

Create a storage bucket named `housing-images` in Supabase for storing listing images.

## 🧪 Testing the Scrapers

### Test Individual Scrapers

```bash
# Test Reddit scraper only
npm run test:scrapers reddit

# Test Apartments scraper only
npm run test:scrapers apartments

# Test all scrapers
npm run test:scrapers all
```

### Test via API

```bash
# Start the server
npm run dev

# Test scraping endpoints
curl http://localhost:3001/api/scrape-all/reddit
curl http://localhost:3001/api/scrape-all/apartments
curl http://localhost:3001/api/scrape-all
```

## 📊 What Each Scraper Does

### Reddit Scraper (`scrapers/reddit.ts`)

- **Sources**: r/udistrict, r/uw
- **Posts**: Fetches 25 newest posts from each subreddit
- **Filtering**: Looks for housing keywords like "sublease", "apartment", "studio", "1b1b", "room"
- **Extraction**:
  - Rent amounts (various formats)
  - Bedroom/bathroom counts
  - Contact information
  - Housing features (pet-friendly, furnished, etc.)
- **Output**: Saves to Supabase with `source = "Reddit"`

### Apartments Scraper (`scrapers/apartments.ts`)

- **Sources**: 9 U District apartment websites
  - Trailside U District
  - Strata Apartments
  - The M Seattle
  - Theory UDistrict
  - The Standard
  - Muriel's Landing
  - HERE Seattle
  - Bridge11
  - Tripalink

- **Extraction**:
  - Floorplan names
  - Starting prices
  - Bedroom/bathroom counts
  - Images (when available)
  - Amenities

- **Technology**: Uses Puppeteer for dynamic content
- **Output**: Saves to Supabase with `source = [Apartment Name]`

## 🔧 Configuration

### Rate Limiting

The scrapers include built-in delays to be respectful:
- Reddit: 2 seconds between subreddits
- Apartments: 3 seconds between websites

### Error Handling

- Individual scraper failures don't stop the entire process
- Comprehensive logging for debugging
- Retry logic for network issues

### Data Quality

- Rent extraction handles multiple formats ($1,200, 1200 dollars, etc.)
- Bedroom/bathroom parsing with fallback patterns
- Automatic neighborhood detection
- Contact info extraction (email, phone)

## 📈 Monitoring

### Console Output

The scrapers provide detailed console output:
```
🚀 Starting Reddit scraping process...
📱 Processing r/udistrict...
🔍 Fetching 25 newest posts from r/udistrict...
✅ Successfully fetched 25 posts from r/udistrict
🏠 Found 8 housing-related posts in r/udistrict
✅ Extracted: Looking for roommate in 2b2b apartment...
💾 Saving 15 listings to database...
✅ Successfully saved listings to database
🎉 Reddit scraping completed in 4500ms
📊 Total posts processed: 50
🏠 Housing listings found: 15
```

### Database Logging

All scraping activities are logged to the `logs` table for monitoring and analytics.

## 🚨 Troubleshooting

### Common Issues

1. **Puppeteer Installation**
   ```bash
   # If you get Puppeteer installation errors
   npm install puppeteer --unsafe-perm=true
   ```

2. **Rate Limiting**
   - Reddit may temporarily block requests if too frequent
   - Increase delays in scraper code if needed

3. **Website Changes**
   - Apartment websites may change their HTML structure
   - Update CSS selectors in scraper code as needed

4. **Memory Issues**
   - Puppeteer uses significant memory
   - Consider running scrapers separately for large datasets

### Debug Mode

Enable detailed logging:
```bash
NODE_ENV=development npm run test:scrapers
```

## 🔄 Automation

### Cron Job Setup

To run scrapers automatically:

```bash
# Add to crontab (runs every 6 hours)
0 */6 * * * cd /path/to/huskykennel/src/server && npm run test:scrapers all
```

### API Integration

The scrapers are available via REST API:
- `GET /api/scrape-all` - Run all scrapers
- `GET /api/scrape-all/reddit` - Run Reddit scraper only
- `GET /api/scrape-all/apartments` - Run Apartments scraper only

## 📝 Data Schema

### Housing Listings Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | TEXT | Listing title |
| `description` | TEXT | Full description |
| `rent` | INTEGER | Monthly rent in dollars |
| `type` | TEXT | apartment/house/studio/shared |
| `bedrooms` | INTEGER | Number of bedrooms |
| `bathrooms` | INTEGER | Number of bathrooms |
| `address` | TEXT | Property address |
| `neighborhood` | TEXT | Neighborhood name |
| `pet_friendly` | BOOLEAN | Pet policy |
| `furnished` | BOOLEAN | Furnished status |
| `utilities` | BOOLEAN | Utilities included |
| `parking` | BOOLEAN | Parking available |
| `images` | TEXT[] | Array of image URLs |
| `contact_info` | JSONB | Contact details |
| `source` | TEXT | Data source |
| `source_url` | TEXT | Original listing URL |
| `scraped_at` | TIMESTAMP | When data was scraped |

## 🎯 Next Steps

1. **Customize Keywords**: Modify housing keywords in `reddit.ts`
2. **Add More Sources**: Extend scrapers for additional websites
3. **Image Processing**: Implement image download and storage
4. **Data Validation**: Add more robust data validation
5. **Analytics**: Build dashboards for scraping metrics

## 📞 Support

For issues or questions:
- Check console logs for detailed error messages
- Review database logs for scraping history
- Test individual scrapers to isolate issues