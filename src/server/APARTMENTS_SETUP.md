# U District Apartments Scraper - Comprehensive Guide

This guide covers the upgraded apartments scraper that targets **30+ major apartment communities** in Seattle's University District.

## 🏢 **Covered Apartment Communities**

The scraper targets these major U District apartment communities:

### **Primary Communities**
- **Trailside U District** - Modern student housing
- **Strata Apartments** - Luxury amenities near campus
- **The M Seattle** - Contemporary living
- **Theory UDistrict** - Student-focused housing
- **The Standard** - Landmark Properties
- **Muriel's Landing** - UW campus proximity
- **HERE Seattle** - Modern amenities
- **Bridge11** - Student housing
- **Tripalink** - Co-living spaces

### **Additional Communities**
- **Nolan** - Premium student housing
- **Nora/aPodment** - Micro-apartments
- **Hub U District** - Student community
- **LaVita** - Italian-inspired living
- **Viola** - Modern apartments
- **Sora** - Contemporary design
- **Greta** - Student-focused
- **Fifty-Two** - Luxury apartments
- **The Stax** - Modern living
- **Arista** - Premium housing
- **Parsonage** - Historic charm
- **U Place/U-District Apartments** - Campus housing
- **Twelve at U District** - Modern amenities
- **ōLiv Seattle** - Contemporary living
- **The Accolade** - Luxury student housing
- **Verve Flats** - Modern apartments
- **Helix Ellipse** - Contemporary design
- **Montclair** - Classic apartments
- **Ori on the Ave** - Avenue living
- **Sundodger** - UW-themed housing
- **The Corydon** - Modern amenities
- **Ivy Ridge** - Premium housing

## 🚀 **Quick Start**

### **1. Install Dependencies**
```bash
cd src/server
npm install
```

### **2. Environment Setup**
```bash
cp env.example .env
```

Edit `.env` with your Supabase credentials:
```env
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_KEY=your_supabase_service_role_key_here
```

### **3. Test the Scraper**
```bash
# Test apartments scraper only
npm run test:apartments

# Test all scrapers
npm run test:scrapers apartments
```

### **4. Run via API**
```bash
# Start server
npm run dev

# Test scraping endpoint
curl http://localhost:3001/api/scrape-all/apartments
```

## 🔧 **Technical Implementation**

### **Dual Scraping Strategy**

The scraper uses a **two-tier approach**:

1. **Static Scraping (Primary)**
   - Uses `axios` + `cheerio` for fast, lightweight scraping
   - Targets server-rendered content
   - Faster execution, lower resource usage

2. **Puppeteer Fallback (Secondary)**
   - Automatically triggered if static scraping fails
   - Handles JavaScript-rendered content
   - More resource-intensive but more reliable

### **Smart Selectors**

Each apartment community has custom CSS selectors:
```typescript
{
  name: 'Trailside',
  url: 'https://www.trailsideudistrict.com/floorplans',
  selectors: {
    container: '.floor-plan-item',
    title: '.floor-plan-title',
    price: '.rent-amount',
    beds: '.bedroom-count',
    baths: '.bathroom-count'
  }
}
```

### **Data Extraction**

For each listing, the scraper extracts:
- **Title/Name**: Floorplan name
- **Price**: Monthly rent (handles various formats)
- **Bedrooms**: Number of bedrooms
- **Bathrooms**: Number of bathrooms
- **Images**: Property photos (when available)
- **URL**: Direct link to listing

## 📊 **Expected Output**

### **Console Logs**
```
🚀 Starting comprehensive U District apartment scraping...
📊 Targeting 30 apartment communities

🏢 Processing Trailside...
🔍 Attempting static scraping for Trailside...
✅ Static scraping successful for Trailside: 8 listings

🏢 Processing Strata...
🔍 Attempting static scraping for Strata...
❌ Static scraping failed for Strata, falling back to Puppeteer...
🤖 Using Puppeteer fallback for Strata...
✅ Puppeteer fallback successful for Strata: 12 listings

📊 Summary:
   • Total communities: 30
   • Successful scrapes: 28
   • Failed scrapes: 2
   • Total listings found: 245
   • Listings saved: 245
```

### **Database Records**
Each listing includes:
- `title`: Floorplan name
- `description`: Community description
- `rent`: Monthly rent in dollars
- `bedrooms`: Number of bedrooms
- `bathrooms`: Number of bathrooms
- `source`: Apartment community name
- `scraped_at`: ISO timestamp
- `source_url`: Original listing URL

## 🔄 **API Endpoints**

### **Available Routes**
- `GET /api/scrape-all/apartments` - Run apartments scraper only
- `GET /api/scrape-all` - Run all scrapers (Reddit + Apartments)

### **Response Format**
```json
{
  "source": "apartments",
  "success": true,
  "count": 245,
  "error": null
}
```

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Rate Limiting**
   ```bash
   # If you get blocked, increase delays in scraper
   # Current: 2 seconds between sites
   ```

2. **Puppeteer Installation**
   ```bash
   # If Puppeteer fails to install
   npm install puppeteer --unsafe-perm=true
   ```

3. **Memory Issues**
   ```bash
   # For large datasets, run scrapers separately
   npm run test:apartments
   ```

4. **Website Changes**
   - Apartment websites may update their HTML structure
   - Update selectors in `apartments.ts` as needed

### **Debug Mode**
```bash
# Enable detailed logging
NODE_ENV=development npm run test:apartments
```

## 📈 **Performance**

### **Expected Performance**
- **Static Scraping**: ~1-2 seconds per site
- **Puppeteer Fallback**: ~5-10 seconds per site
- **Total Runtime**: ~2-5 minutes for all 30 communities
- **Success Rate**: 85-95% (varies by website availability)

### **Resource Usage**
- **Memory**: ~200-500MB during scraping
- **CPU**: Moderate usage during Puppeteer operations
- **Network**: ~50-100MB total data transfer

## 🔄 **Automation**

### **Cron Job Setup**
```bash
# Run every 6 hours
0 */6 * * * cd /path/to/huskykennel/src/server && npm run test:apartments
```

### **Monitoring**
- All scraping activities logged to Supabase `logs` table
- Console output for real-time monitoring
- Error tracking for failed scrapes

## 🎯 **Customization**

### **Adding New Communities**
1. Add new entry to `apartmentSites` array
2. Define CSS selectors for the site
3. Test with `npm run test:apartments`

### **Modifying Selectors**
Update the `selectors` object for each community:
```typescript
{
  container: '.floor-plan-item',  // Main listing container
  title: '.floor-plan-title',     // Listing title
  price: '.rent-amount',          // Price element
  beds: '.bedroom-count',         // Bedroom count
  baths: '.bathroom-count'        // Bathroom count
}
```

## 📞 **Support**

For issues:
1. Check console logs for detailed error messages
2. Review database logs for scraping history
3. Test individual communities to isolate issues
4. Verify website availability and structure

## 🎉 **Success Metrics**

The scraper is considered successful when:
- ✅ 80%+ of communities return listings
- ✅ 200+ total listings found
- ✅ All data properly saved to database
- ✅ No critical errors in console logs