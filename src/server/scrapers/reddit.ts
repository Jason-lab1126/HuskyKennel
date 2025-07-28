import axios from 'axios';
import { HousingListing, ScrapedPost, ScrapeResult } from '../types';
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
  };
}

interface RedditResponse {
  data: {
    children: RedditPost[];
  };
}

export class RedditScraper {
  private subreddits = ['udistrict', 'uw'];
  private keywords = [
    'rent', 'apartment', 'room', 'housing', 'lease', 'sublet',
    'roommate', 'available', 'looking', 'lease', 'move-in'
  ];

  private async fetchSubredditPosts(subreddit: string, limit: number = 100): Promise<RedditPost[]> {
    try {
      const url = `https://www.reddit.com/r/${subreddit}/search.json?q=housing&restrict_sr=on&sort=new&t=week&limit=${limit}`;

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'HuskyKennel-Bot/1.0 (Housing Scraper)'
        },
        timeout: 10000
      });

      const data: RedditResponse = response.data;
      return data.data.children;
    } catch (error) {
      console.error(`Error fetching from r/${subreddit}:`, error);
      throw error;
    }
  }

  private isHousingRelated(post: RedditPost): boolean {
    const title = post.data.title.toLowerCase();
    const content = post.data.selftext.toLowerCase();
    const text = `${title} ${content}`;

    return this.keywords.some(keyword => text.includes(keyword));
  }

  private extractHousingInfo(post: RedditPost): Partial<HousingListing> | null {
    const title = post.data.title;
    const content = post.data.selftext;
    const text = `${title} ${content}`;

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
    const neighborhood = neighborhoods.find(n => text.toLowerCase().includes(n)) || 'U District';

    // Extract contact info
    const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    const phoneMatch = text.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/);

    // Determine features
    const petFriendly = text.includes('pet') || text.includes('dog') || text.includes('cat');
    const furnished = text.includes('furnished');
    const utilities = text.includes('utilities') || text.includes('utilities included');
    const parking = text.includes('parking');

    // Only return if we have basic info
    if (!rent || !title) return null;

    return {
      title: title.length > 100 ? title.substring(0, 100) + '...' : title,
      description: content.length > 500 ? content.substring(0, 500) + '...' : content,
      rent,
      type,
      bedrooms: bedrooms || undefined,
      bathrooms: bathrooms || undefined,
      address: 'U District Area', // Reddit posts usually don't have exact addresses
      neighborhood,
      petFriendly,
      furnished,
      utilities,
      parking,
      images: [], // Reddit posts don't typically have images in the API response
      contactInfo: {
        name: post.data.author,
        email: emailMatch ? emailMatch[0] : '',
        phone: phoneMatch ? phoneMatch[0] : ''
      },
      source: 'reddit' as const,
      sourceUrl: `https://reddit.com${post.data.permalink}`
    };
  }

  async scrape(): Promise<ScrapeResult> {
    const startTime = Date.now();
    let totalPosts = 0;
    let housingListings: HousingListing[] = [];

    try {
      for (const subreddit of this.subreddits) {
        console.log(`Scraping r/${subreddit}...`);

        const posts = await this.fetchSubredditPosts(subreddit);
        totalPosts += posts.length;

        const housingPosts = posts.filter(post => this.isHousingRelated(post));
        console.log(`Found ${housingPosts.length} housing-related posts in r/${subreddit}`);

        for (const post of housingPosts) {
          const housingInfo = this.extractHousingInfo(post);
          if (housingInfo) {
            const listing: HousingListing = {
              ...housingInfo,
              createdAt: new Date(),
              updatedAt: new Date()
            } as HousingListing;

            housingListings.push(listing);
          }
        }

        // Add delay between subreddits to be respectful
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Save listings to database
      if (housingListings.length > 0) {
        await db.addListingsBatch(housingListings);
      }

      const duration = Date.now() - startTime;

      return {
        source: 'reddit',
        success: true,
        count: housingListings.length,
        error: undefined
      };

    } catch (error) {
      console.error('Reddit scraping error:', error);
      return {
        source: 'reddit',
        success: false,
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const redditScraper = new RedditScraper();