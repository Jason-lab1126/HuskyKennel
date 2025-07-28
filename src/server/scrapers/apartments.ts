import axios from 'axios';
import puppeteer from 'puppeteer';
import { HousingListing, ScrapeResult } from '../types';
import { db } from '../services/database';

interface ApartmentListing {
  title: string;
  description: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  address: string;
  images: string[];
  amenities: string[];
  url: string;
}

export class ApartmentsScraper {
  private sites = [
    {
      name: 'Trailside',
      url: 'https://trailsideapartments.com',
      scraper: this.scrapeTrailside.bind(this)
    },
    {
      name: 'Strata',
      url: 'https://strataapartments.com',
      scraper: this.scrapeStrata.bind(this)
    },
    {
      name: 'Tripalink',
      url: 'https://tripalink.com',
      scraper: this.scrapeTripalink.bind(this)
    },
    {
      name: 'Here',
      url: 'https://hereapartments.com',
      scraper: this.scrapeHere.bind(this)
    }
  ];

  private async scrapeTrailside(): Promise<ApartmentListing[]> {
    const listings: ApartmentListing[] = [];

    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();

      await page.goto('https://trailsideapartments.com/floor-plans', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      const extractedListings = await page.evaluate(() => {
        const floorPlanElements = document.querySelectorAll('.floor-plan-item');
        const listings: any[] = [];

        floorPlanElements.forEach((element) => {
          const titleElement = element.querySelector('.floor-plan-title');
          const rentElement = element.querySelector('.rent-amount');
          const bedElement = element.querySelector('.bedroom-count');
          const bathElement = element.querySelector('.bathroom-count');
          const imageElement = element.querySelector('img');

          if (titleElement && rentElement) {
            const title = titleElement.textContent?.trim() || '';
            const rentText = rentElement.textContent?.trim() || '';
            const rent = parseInt(rentText.replace(/[^0-9]/g, '')) || 0;
            const bedrooms = parseInt(bedElement?.textContent?.trim() || '0');
            const bathrooms = parseInt(bathElement?.textContent?.trim() || '0');
            const imageUrl = imageElement?.getAttribute('src') || '';

            listings.push({
              title,
              description: `Trailside Apartments - ${title}`,
              rent,
              bedrooms,
              bathrooms,
              address: 'Trailside Apartments, U District',
              images: imageUrl ? [imageUrl] : [],
              amenities: ['Modern amenities', 'Close to UW campus'],
              url: window.location.href
            });
          }
        });

        return listings;
      });

      listings.push(...extractedListings);
      await browser.close();

    } catch (error) {
      console.error('Error scraping Trailside:', error);
    }

    return listings;
  }

  private async scrapeStrata(): Promise<ApartmentListing[]> {
    const listings: ApartmentListing[] = [];

    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();

      await page.goto('https://strataapartments.com/floor-plans', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      const extractedListings = await page.evaluate(() => {
        const floorPlanElements = document.querySelectorAll('.floor-plan');
        const listings: any[] = [];

        floorPlanElements.forEach((element) => {
          const titleElement = element.querySelector('.plan-name');
          const rentElement = element.querySelector('.price');
          const bedElement = element.querySelector('.beds');
          const bathElement = element.querySelector('.baths');
          const imageElement = element.querySelector('img');

          if (titleElement && rentElement) {
            const title = titleElement.textContent?.trim() || '';
            const rentText = rentElement.textContent?.trim() || '';
            const rent = parseInt(rentText.replace(/[^0-9]/g, '')) || 0;
            const bedrooms = parseInt(bedElement?.textContent?.trim() || '0');
            const bathrooms = parseInt(bathElement?.textContent?.trim() || '0');
            const imageUrl = imageElement?.getAttribute('src') || '';

            listings.push({
              title,
              description: `Strata Apartments - ${title}`,
              rent,
              bedrooms,
              bathrooms,
              address: 'Strata Apartments, U District',
              images: imageUrl ? [imageUrl] : [],
              amenities: ['Luxury amenities', 'UW campus proximity'],
              url: window.location.href
            });
          }
        });

        return listings;
      });

      listings.push(...extractedListings);
      await browser.close();

    } catch (error) {
      console.error('Error scraping Strata:', error);
    }

    return listings;
  }

  private async scrapeTripalink(): Promise<ApartmentListing[]> {
    const listings: ApartmentListing[] = [];

    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();

      await page.goto('https://tripalink.com/seattle', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      const extractedListings = await page.evaluate(() => {
        const listingElements = document.querySelectorAll('.property-card');
        const listings: any[] = [];

        listingElements.forEach((element) => {
          const titleElement = element.querySelector('.property-name');
          const rentElement = element.querySelector('.rent');
          const bedElement = element.querySelector('.bedrooms');
          const bathElement = element.querySelector('.bathrooms');
          const imageElement = element.querySelector('img');

          if (titleElement && rentElement) {
            const title = titleElement.textContent?.trim() || '';
            const rentText = rentElement.textContent?.trim() || '';
            const rent = parseInt(rentText.replace(/[^0-9]/g, '')) || 0;
            const bedrooms = parseInt(bedElement?.textContent?.trim() || '0');
            const bathrooms = parseInt(bathElement?.textContent?.trim() || '0');
            const imageUrl = imageElement?.getAttribute('src') || '';

            listings.push({
              title,
              description: `Tripalink - ${title}`,
              rent,
              bedrooms,
              bathrooms,
              address: 'Tripalink Property, Seattle',
              images: imageUrl ? [imageUrl] : [],
              amenities: ['Student housing', 'Furnished options'],
              url: window.location.href
            });
          }
        });

        return listings;
      });

      listings.push(...extractedListings);
      await browser.close();

    } catch (error) {
      console.error('Error scraping Tripalink:', error);
    }

    return listings;
  }

  private async scrapeHere(): Promise<ApartmentListing[]> {
    const listings: ApartmentListing[] = [];

    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();

      await page.goto('https://hereapartments.com/floor-plans', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      const extractedListings = await page.evaluate(() => {
        const floorPlanElements = document.querySelectorAll('.floor-plan-card');
        const listings: any[] = [];

        floorPlanElements.forEach((element) => {
          const titleElement = element.querySelector('.plan-title');
          const rentElement = element.querySelector('.monthly-rent');
          const bedElement = element.querySelector('.bed-count');
          const bathElement = element.querySelector('.bath-count');
          const imageElement = element.querySelector('img');

          if (titleElement && rentElement) {
            const title = titleElement.textContent?.trim() || '';
            const rentText = rentElement.textContent?.trim() || '';
            const rent = parseInt(rentText.replace(/[^0-9]/g, '')) || 0;
            const bedrooms = parseInt(bedElement?.textContent?.trim() || '0');
            const bathrooms = parseInt(bathElement?.textContent?.trim() || '0');
            const imageUrl = imageElement?.getAttribute('src') || '';

            listings.push({
              title,
              description: `Here Apartments - ${title}`,
              rent,
              bedrooms,
              bathrooms,
              address: 'Here Apartments, U District',
              images: imageUrl ? [imageUrl] : [],
              amenities: ['Modern living', 'UW campus access'],
              url: window.location.href
            });
          }
        });

        return listings;
      });

      listings.push(...extractedListings);
      await browser.close();

    } catch (error) {
      console.error('Error scraping Here:', error);
    }

    return listings;
  }

  private convertToHousingListing(apartmentListing: ApartmentListing): HousingListing {
    return {
      title: apartmentListing.title,
      description: apartmentListing.description,
      rent: apartmentListing.rent,
      type: apartmentListing.bedrooms === 0 ? 'studio' : 'apartment',
      bedrooms: apartmentListing.bedrooms || undefined,
      bathrooms: apartmentListing.bathrooms || undefined,
      address: apartmentListing.address,
      neighborhood: 'U District',
      petFriendly: apartmentListing.amenities.some(a => a.toLowerCase().includes('pet')),
      furnished: apartmentListing.amenities.some(a => a.toLowerCase().includes('furnished')),
      utilities: apartmentListing.amenities.some(a => a.toLowerCase().includes('utilities')),
      parking: apartmentListing.amenities.some(a => a.toLowerCase().includes('parking')),
      images: apartmentListing.images,
      contactInfo: {
        name: 'Property Management',
        email: '',
        phone: ''
      },
      source: 'apartments' as const,
      sourceUrl: apartmentListing.url,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async scrape(): Promise<ScrapeResult> {
    const startTime = Date.now();
    let totalListings = 0;
    let housingListings: HousingListing[] = [];

    try {
      for (const site of this.sites) {
        console.log(`Scraping ${site.name}...`);

        try {
          const apartmentListings = await site.scraper();
          totalListings += apartmentListings.length;

          console.log(`Found ${apartmentListings.length} listings from ${site.name}`);

          for (const apartmentListing of apartmentListings) {
            const housingListing = this.convertToHousingListing(apartmentListing);
            housingListings.push(housingListing);
          }

          // Add delay between sites
          await new Promise(resolve => setTimeout(resolve, 2000));

        } catch (error) {
          console.error(`Error scraping ${site.name}:`, error);
        }
      }

      // Save listings to database
      if (housingListings.length > 0) {
        await db.addListingsBatch(housingListings);
      }

      return {
        source: 'apartments',
        success: true,
        count: housingListings.length,
        error: undefined
      };

    } catch (error) {
      console.error('Apartments scraping error:', error);
      return {
        source: 'apartments',
        success: false,
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const apartmentsScraper = new ApartmentsScraper();