import axios from 'axios';
import { HousingListing, ScrapeResult } from '../types';
import { db } from '../services/database';

interface RedditPost {
  data: {
    title: string;
    selftext: string;
    author: string;
    url: string;
    created_utc: number;
    permalink: string;
    subreddit: string;
    score: number;
    num_comments: number;
  };
}

interface RedditResponse {
  data: {
    children: RedditPost[];
  };
}

export class RedditScraper {
  private subreddits = ['udistrict', 'uw'];
  private housingKeywords = [
    'sublease', 'sublet', 'apartment', 'studio', '1b1b', '2b2b', '3b3b',
    'room', 'bedroom', 'lease', 'rent', 'available', 'looking for',
    'housing', 'accommodation', 'move-in', 'move in', 'furnished',
    'unfurnished', 'utilities', 'parking', 'pet friendly', 'no pets'
  ];

  private async fetchSubredditPosts(subreddit: string, limit: number = 25): Promise<RedditPost[]> {
    try {
      console.log(`🔍 Fetching ${limit} newest posts from r/${subreddit}...`);

      const url = `https://www.reddit.com/r/${subreddit}/new.json?limit=${limit}`;

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'HuskyKennel-Bot/1.0 (Housing Scraper) - Contact: admin@huskykennel.com'
        },
        timeout: 15000
      });

      const data: RedditResponse = response.data;
      console.log(`✅ Successfully fetched ${data.data.children.length} posts from r/${subreddit}`);

      return data.data.children;
    } catch (error) {
      console.error(`❌ Error fetching from r/${subreddit}:`, error);
      throw error;
    }
  }

  private isHousingRelated(post: RedditPost): boolean {
    const title = post.data.title.toLowerCase();
    const content = post.data.selftext.toLowerCase();
    const text = `${title} ${content}`;

    return this.housingKeywords.some(keyword => text.includes(keyword.toLowerCase()));
  }

  private extractHousingInfo(post: RedditPost): Partial<HousingListing> | null {
    const title = post.data.title;
    const content = post.data.selftext;
    const text = `${title} ${content}`.toLowerCase();

    // Extract rent amount - look for various formats
    const rentPatterns = [
      /\$(\d{1,4}(?:,\d{3})?)/g,  // $1,200 or $1200
      /(\d{1,4}(?:,\d{3})?)\s*(?:dollars?|bucks?|per\s*month)/gi,  // 1200 dollars
      /rent[:\s]*\$?(\d{1,4}(?:,\d{3})?)/gi,  // rent: $1200
      /price[:\s]*\$?(\d{1,4}(?:,\d{3})?)/gi  // price: $1200
    ];

    let rent: number | null = null;
    for (const pattern of rentPatterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        const rentStr = matches[0].replace(/[^\d]/g, '');
        rent = parseInt(rentStr);
        if (rent > 0) break;
      }
    }

    // Extract bedroom count
    const bedroomPatterns = [
      /(\d+)\s*(?:bed|bedroom|br|bdr)/i,
      /(\d+)\s*(?:bedroom|bed)s?/i
    ];

    let bedrooms: number | null = null;
    for (const pattern of bedroomPatterns) {
      const match = text.match(pattern);
      if (match) {
        bedrooms = parseInt(match[1]);
        break;
      }
    }

    // Extract bathroom count
    const bathroomPatterns = [
      /(\d+)\s*(?:bath|bathroom|ba)/i,
      /(\d+)\s*(?:bathroom|bath)s?/i
    ];

    let bathrooms: number | null = null;
    for (const pattern of bathroomPatterns) {
      const match = text.match(pattern);
      if (match) {
        bathrooms = parseInt(match[1]);
        break;
      }
    }

    // Determine housing type
    let type: 'apartment' | 'house' | 'studio' | 'shared' = 'apartment';
    if (text.includes('studio')) type = 'studio';
    else if (text.includes('house') || text.includes('townhouse')) type = 'house';
    else if (text.includes('room') && (text.includes('share') || text.includes('shared'))) type = 'shared';

    // Extract neighborhood
    const neighborhoods = [
      'u district', 'udistrict', 'university district', 'campus', 'northgate',
      'roosevelt', 'greenlake', 'wallingford', 'fremont', 'ballard'
    ];
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
    if (!title || title.length < 5) return null;

    return {
      title: title.length > 100 ? title.substring(0, 100) + '...' : title,
      description: content.length > 500 ? content.substring(0, 500) + '...' : content,
      rent: rent || 0,
      type,
      bedrooms: bedrooms || undefined,
      bathrooms: bathrooms || undefined,
      address: 'U District Area',
      neighborhood,
      petFriendly,
      furnished,
      utilities,
      parking,
      images: [],
      contactInfo: {
        name: post.data.author,
        email: emailMatch ? emailMatch[0] : '',
        phone: phoneMatch ? phoneMatch[0] : ''
      },
      source: 'Reddit' as const,
      sourceUrl: `https://reddit.com${post.data.permalink}`,
      scrapedAt: new Date()
    };
  }

  async scrapeReddit(): Promise<ScrapeResult> {
    const startTime = Date.now();
    let totalPosts = 0;
    let housingListings: HousingListing[] = [];

    try {
      console.log('🚀 Starting Reddit scraping process...');

      for (const subreddit of this.subreddits) {
        console.log(`\n📱 Processing r/${subreddit}...`);

        try {
          const posts = await this.fetchSubredditPosts(subreddit, 25);
          totalPosts += posts.length;

          const housingPosts = posts.filter(post => this.isHousingRelated(post));
          console.log(`🏠 Found ${housingPosts.length} housing-related posts in r/${subreddit}`);

          for (const post of housingPosts) {
            const housingInfo = this.extractHousingInfo(post);
            if (housingInfo) {
              const listing: HousingListing = {
                ...housingInfo,
                createdAt: new Date(),
                updatedAt: new Date()
              } as HousingListing;

              housingListings.push(listing);
              console.log(`✅ Extracted: ${listing.title.substring(0, 50)}...`);
            }
          }

          // Add delay between subreddits to be respectful
          await new Promise(resolve => setTimeout(resolve, 2000));

        } catch (error) {
          console.error(`❌ Error processing r/${subreddit}:`, error);
        }
      }

      // Save listings to database
      if (housingListings.length > 0) {
        console.log(`\n💾 Saving ${housingListings.length} listings to database...`);
        await db.addListingsBatch(housingListings);
        console.log('✅ Successfully saved listings to database');
      }

      const duration = Date.now() - startTime;
      console.log(`\n🎉 Reddit scraping completed in ${duration}ms`);
      console.log(`📊 Total posts processed: ${totalPosts}`);
      console.log(`🏠 Housing listings found: ${housingListings.length}`);

      return {
        source: 'Reddit',
        success: true,
        count: housingListings.length,
        error: undefined
      };

    } catch (error) {
      console.error('❌ Reddit scraping error:', error);
      return {
        source: 'Reddit',
        success: false,
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const redditScraper = new RedditScraper();