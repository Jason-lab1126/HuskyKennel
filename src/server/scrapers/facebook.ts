import puppeteer from 'puppeteer';
import { HousingListing, ScrapeResult } from '../types';
import { db } from '../services/database';

interface FacebookPost {
  title: string;
  content: string;
  author: string;
  url: string;
  timestamp: Date;
  images: string[];
}

export class FacebookScraper {
  private groups = [
    'UW Housing, Sublets & Roommates',
    'University of Washington Housing',
    'Seattle U District Housing'
  ];

  private async setupBrowser() {
    return await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
  }

  private async extractHousingInfo(post: FacebookPost): Promise<Partial<HousingListing> | null> {
    const text = `${post.title} ${post.content}`.toLowerCase();

    // Extract rent amount
    const rentMatch = text.match(/\$(\d{1,4}(?:,\d{3})?)/);
    const rent = rentMatch ? parseInt(rentMatch[1].replace(/,/g, '')) : null;

    // Extract bedroom count
    const bedroomMatch = text.match(/(\d+)\s*(?:bed|bedroom|br)/i);
    const bedrooms = bedroomMatch ? parseInt(bedroomMatch[1]) : null;

    // Extract bathroom count
    const bathroomMatch = text.match(/(\d+)\s*(?:bath|bathroom|ba)/i);
    const bathrooms = bathroomMatch ? parseInt(bathroomMatch[1]) : null;

    // Determine housing type
    let type: 'apartment' | 'house' | 'studio' | 'shared' = 'apartment';
    if (text.includes('studio')) type = 'studio';
    else if (text.includes('house')) type = 'house';
    else if (text.includes('room') && text.includes('share')) type = 'shared';

    // Extract neighborhood
    const neighborhoods = ['u district', 'udistrict', 'university district', 'campus', 'northgate', 'roosevelt', 'greenlake'];
    const neighborhood = neighborhoods.find(n => text.includes(n)) || 'U District';

    // Extract contact info
    const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    const phoneMatch = text.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/);

    // Determine features
    const petFriendly = text.includes('pet') || text.includes('dog') || text.includes('cat');
    const furnished = text.includes('furnished');
    const utilities = text.includes('utilities') || text.includes('utilities included');
    const parking = text.includes('parking');

    // Only return if we have basic info
    if (!rent || !post.title) return null;

    return {
      title: post.title.length > 100 ? post.title.substring(0, 100) + '...' : post.title,
      description: post.content.length > 500 ? post.content.substring(0, 500) + '...' : post.content,
      rent,
      type,
      bedrooms: bedrooms || undefined,
      bathrooms: bathrooms || undefined,
      address: 'U District Area',
      neighborhood,
      petFriendly,
      furnished,
      utilities,
      parking,
      images: post.images,
      contactInfo: {
        name: post.author,
        email: emailMatch ? emailMatch[0] : '',
        phone: phoneMatch ? phoneMatch[0] : ''
      },
      source: 'facebook' as const,
      sourceUrl: post.url
    };
  }

  private async scrapeGroupPosts(groupName: string): Promise<FacebookPost[]> {
    const browser = await this.setupBrowser();
    const posts: FacebookPost[] = [];

    try {
      const page = await browser.newPage();

      // Set user agent to avoid detection
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

      // Navigate to Facebook group (this is a simplified approach)
      // Note: Facebook has strong anti-scraping measures, so this is a basic implementation
      const groupUrl = `https://www.facebook.com/groups/${groupName.replace(/\s+/g, '')}`;

      console.log(`Attempting to scrape group: ${groupName}`);

      // This is a placeholder - actual Facebook scraping would require more sophisticated handling
      // including login, dealing with dynamic content, and avoiding detection

      await page.goto(groupUrl, { waitUntil: 'networkidle2', timeout: 30000 });

      // Wait for posts to load
      await page.waitForSelector('[data-testid="post_message"]', { timeout: 10000 });

      // Extract posts
      const extractedPosts = await page.evaluate(() => {
        const postElements = document.querySelectorAll('[data-testid="post_message"]');
        const posts: any[] = [];

        postElements.forEach((element, index) => {
          if (index < 20) { // Limit to first 20 posts
            const content = element.textContent || '';
            const title = content.substring(0, 100);

            // Extract images if available
            const images: string[] = [];
            const imgElements = element.querySelectorAll('img');
            imgElements.forEach(img => {
              const src = img.getAttribute('src');
              if (src) images.push(src);
            });

            posts.push({
              title,
              content,
              author: 'Facebook User', // Would need more complex extraction
              url: window.location.href,
              timestamp: new Date(),
              images
            });
          }
        });

        return posts;
      });

      posts.push(...extractedPosts);

    } catch (error) {
      console.error(`Error scraping Facebook group ${groupName}:`, error);
    } finally {
      await browser.close();
    }

    return posts;
  }

  async scrape(): Promise<ScrapeResult> {
    const startTime = Date.now();
    let totalPosts = 0;
    let housingListings: HousingListing[] = [];

    try {
      for (const group of this.groups) {
        console.log(`Scraping Facebook group: ${group}...`);

        const posts = await this.scrapeGroupPosts(group);
        totalPosts += posts.length;

        console.log(`Found ${posts.length} posts in ${group}`);

        for (const post of posts) {
          const housingInfo = await this.extractHousingInfo(post);
          if (housingInfo) {
            const listing: HousingListing = {
              ...housingInfo,
              createdAt: new Date(),
              updatedAt: new Date()
            } as HousingListing;

            housingListings.push(listing);
          }
        }

        // Add delay between groups
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Save listings to database
      if (housingListings.length > 0) {
        await db.addListingsBatch(housingListings);
      }

      return {
        source: 'facebook',
        success: true,
        count: housingListings.length,
        error: undefined
      };

    } catch (error) {
      console.error('Facebook scraping error:', error);
      return {
        source: 'facebook',
        success: false,
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const facebookScraper = new FacebookScraper();