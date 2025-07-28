import axios from 'axios';
import * as cheerio from 'cheerio';
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
  source: string;
}

export class ApartmentsScraper {
  private sites = [
    {
      name: 'Trailside',
      url: 'https://www.trailsideudistrict.com/floorplans',
      scraper: this.scrapeTrailside.bind(this)
    },
    {
      name: 'Strata',
      url: 'https://www.strataapts.com/floorplans',
      scraper: this.scrapeStrata.bind(this)
    },
    {
      name: 'The M',
      url: 'https://www.themseattle.com/floorplans',
      scraper: this.scrapeTheM.bind(this)
    },
    {
      name: 'Theory UDistrict',
      url: 'https://www.theoryudistrict.com/floorplans',
      scraper: this.scrapeTheoryUDistrict.bind(this)
    },
    {
      name: 'The Standard',
      url: 'https://thestandardseattle.landmark-properties.com/',
      scraper: this.scrapeTheStandard.bind(this)
    },
    {
      name: 'Muriel\'s Landing',
      url: 'https://www.murielslanding.com/floorplans',
      scraper: this.scrapeMurielsLanding.bind(this)
    },
    {
      name: 'HERE Seattle',
      url: 'https://www.hereseattle.com/floorplans',
      scraper: this.scrapeHereSeattle.bind(this)
    },
    {
      name: 'Bridge11',
      url: 'https://www.bridge11apartments.com/floorplans',
      scraper: this.scrapeBridge11.bind(this)
    },
    {
      name: 'Tripalink',
      url: 'https://www.tripalink.com/seattle-uw',
      scraper: this.scrapeTripalink.bind(this)
    }
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
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });
  }

  private async scrapeTrailside(): Promise<ApartmentListing[]> {
    const listings: ApartmentListing[] = [];

    try {
      console.log('🏢 Scraping Trailside U District...');
      const browser = await this.setupBrowser();
      const page = await browser.newPage();

      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      await page.goto('https://www.trailsideudistrict.com/floorplans', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      const extractedListings = await page.evaluate(() => {
        const floorPlanElements = document.querySelectorAll('.floor-plan-item, .floorplan-item, .plan-item');
        const listings: any[] = [];

        floorPlanElements.forEach((element) => {
          const titleElement = element.querySelector('.floor-plan-title, .plan-title, .name');
          const rentElement = element.querySelector('.rent-amount, .price, .rent');
          const bedElement = element.querySelector('.bedroom-count, .beds, .bedrooms');
          const bathElement = element.querySelector('.bathroom-count, .baths, .bathrooms');
          const imageElement = element.querySelector('img');

          if (titleElement) {
            const title = titleElement.textContent?.trim() || '';
            const rentText = rentElement?.textContent?.trim() || '';
            const rent = parseInt(rentText.replace(/[^0-9]/g, '')) || 0;
            const bedrooms = parseInt(bedElement?.textContent?.trim() || '0');
            const bathrooms = parseInt(bathElement?.textContent?.trim() || '0');
            const imageUrl = imageElement?.getAttribute('src') || '';

            if (title && rent > 0) {
              listings.push({
                title,
                description: `Trailside U District - ${title}`,
                rent,
                bedrooms,
                bathrooms,
                address: 'Trailside U District, Seattle',
                images: imageUrl ? [imageUrl] : [],
                amenities: ['Modern amenities', 'Close to UW campus', 'U District location'],
                url: window.location.href,
                source: 'Trailside'
              });
            }
          }
        });

        return listings;
      });

      listings.push(...extractedListings);
      await browser.close();
      console.log(`✅ Trailside: Found ${extractedListings.length} floorplans`);

    } catch (error) {
      console.error('❌ Error scraping Trailside:', error);
    }

    return listings;
  }

  private async scrapeStrata(): Promise<ApartmentListing[]> {
    const listings: ApartmentListing[] = [];

    try {
      console.log('🏢 Scraping Strata Apartments...');
      const browser = await this.setupBrowser();
      const page = await browser.newPage();

      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      await page.goto('https://www.strataapts.com/floorplans', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      const extractedListings = await page.evaluate(() => {
        const floorPlanElements = document.querySelectorAll('.floor-plan, .plan, .floorplan');
        const listings: any[] = [];

        floorPlanElements.forEach((element) => {
          const titleElement = element.querySelector('.plan-name, .name, .title');
          const rentElement = element.querySelector('.price, .rent, .monthly-rent');
          const bedElement = element.querySelector('.beds, .bedrooms, .bed-count');
          const bathElement = element.querySelector('.baths, .bathrooms, .bath-count');
          const imageElement = element.querySelector('img');

          if (titleElement) {
            const title = titleElement.textContent?.trim() || '';
            const rentText = rentElement?.textContent?.trim() || '';
            const rent = parseInt(rentText.replace(/[^0-9]/g, '')) || 0;
            const bedrooms = parseInt(bedElement?.textContent?.trim() || '0');
            const bathrooms = parseInt(bathElement?.textContent?.trim() || '0');
            const imageUrl = imageElement?.getAttribute('src') || '';

            if (title && rent > 0) {
              listings.push({
                title,
                description: `Strata Apartments - ${title}`,
                rent,
                bedrooms,
                bathrooms,
                address: 'Strata Apartments, Seattle',
                images: imageUrl ? [imageUrl] : [],
                amenities: ['Luxury amenities', 'UW campus proximity', 'U District location'],
                url: window.location.href,
                source: 'Strata'
              });
            }
          }
        });

        return listings;
      });

      listings.push(...extractedListings);
      await browser.close();
      console.log(`✅ Strata: Found ${extractedListings.length} floorplans`);

    } catch (error) {
      console.error('❌ Error scraping Strata:', error);
    }

    return listings;
  }

  private async scrapeTheM(): Promise<ApartmentListing[]> {
    const listings: ApartmentListing[] = [];

    try {
      console.log('🏢 Scraping The M Seattle...');
      const browser = await this.setupBrowser();
      const page = await browser.newPage();

      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      await page.goto('https://www.themseattle.com/floorplans', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      const extractedListings = await page.evaluate(() => {
        const floorPlanElements = document.querySelectorAll('.floor-plan, .plan, .floorplan, .unit');
        const listings: any[] = [];

        floorPlanElements.forEach((element) => {
          const titleElement = element.querySelector('.plan-name, .name, .title, .unit-name');
          const rentElement = element.querySelector('.price, .rent, .monthly-rent, .starting-price');
          const bedElement = element.querySelector('.beds, .bedrooms, .bed-count');
          const bathElement = element.querySelector('.baths, .bathrooms, .bath-count');
          const imageElement = element.querySelector('img');

          if (titleElement) {
            const title = titleElement.textContent?.trim() || '';
            const rentText = rentElement?.textContent?.trim() || '';
            const rent = parseInt(rentText.replace(/[^0-9]/g, '')) || 0;
            const bedrooms = parseInt(bedElement?.textContent?.trim() || '0');
            const bathrooms = parseInt(bathElement?.textContent?.trim() || '0');
            const imageUrl = imageElement?.getAttribute('src') || '';

            if (title && rent > 0) {
              listings.push({
                title,
                description: `The M Seattle - ${title}`,
                rent,
                bedrooms,
                bathrooms,
                address: 'The M Seattle, Seattle',
                images: imageUrl ? [imageUrl] : [],
                amenities: ['Modern living', 'UW campus access', 'U District location'],
                url: window.location.href,
                source: 'The M'
              });
            }
          }
        });

        return listings;
      });

      listings.push(...extractedListings);
      await browser.close();
      console.log(`✅ The M: Found ${extractedListings.length} floorplans`);

    } catch (error) {
      console.error('❌ Error scraping The M:', error);
    }

    return listings;
  }

  private async scrapeTheoryUDistrict(): Promise<ApartmentListing[]> {
    const listings: ApartmentListing[] = [];

    try {
      console.log('🏢 Scraping Theory UDistrict...');
      const browser = await this.setupBrowser();
      const page = await browser.newPage();

      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      await page.goto('https://www.theoryudistrict.com/floorplans', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      const extractedListings = await page.evaluate(() => {
        const floorPlanElements = document.querySelectorAll('.floor-plan, .plan, .floorplan, .unit');
        const listings: any[] = [];

        floorPlanElements.forEach((element) => {
          const titleElement = element.querySelector('.plan-name, .name, .title, .unit-name');
          const rentElement = element.querySelector('.price, .rent, .monthly-rent, .starting-price');
          const bedElement = element.querySelector('.beds, .bedrooms, .bed-count');
          const bathElement = element.querySelector('.baths, .bathrooms, .bath-count');
          const imageElement = element.querySelector('img');

          if (titleElement) {
            const title = titleElement.textContent?.trim() || '';
            const rentText = rentElement?.textContent?.trim() || '';
            const rent = parseInt(rentText.replace(/[^0-9]/g, '')) || 0;
            const bedrooms = parseInt(bedElement?.textContent?.trim() || '0');
            const bathrooms = parseInt(bathElement?.textContent?.trim() || '0');
            const imageUrl = imageElement?.getAttribute('src') || '';

            if (title && rent > 0) {
              listings.push({
                title,
                description: `Theory UDistrict - ${title}`,
                rent,
                bedrooms,
                bathrooms,
                address: 'Theory UDistrict, Seattle',
                images: imageUrl ? [imageUrl] : [],
                amenities: ['Student housing', 'UW campus proximity', 'U District location'],
                url: window.location.href,
                source: 'Theory UDistrict'
              });
            }
          }
        });

        return listings;
      });

      listings.push(...extractedListings);
      await browser.close();
      console.log(`✅ Theory UDistrict: Found ${extractedListings.length} floorplans`);

    } catch (error) {
      console.error('❌ Error scraping Theory UDistrict:', error);
    }

    return listings;
  }

  private async scrapeTheStandard(): Promise<ApartmentListing[]> {
    const listings: ApartmentListing[] = [];

    try {
      console.log('🏢 Scraping The Standard...');
      const browser = await this.setupBrowser();
      const page = await browser.newPage();

      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      await page.goto('https://thestandardseattle.landmark-properties.com/', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      const extractedListings = await page.evaluate(() => {
        const floorPlanElements = document.querySelectorAll('.floor-plan, .plan, .floorplan, .unit, .apartment');
        const listings: any[] = [];

        floorPlanElements.forEach((element) => {
          const titleElement = element.querySelector('.plan-name, .name, .title, .unit-name, .apartment-name');
          const rentElement = element.querySelector('.price, .rent, .monthly-rent, .starting-price');
          const bedElement = element.querySelector('.beds, .bedrooms, .bed-count');
          const bathElement = element.querySelector('.baths, .bathrooms, .bath-count');
          const imageElement = element.querySelector('img');

          if (titleElement) {
            const title = titleElement.textContent?.trim() || '';
            const rentText = rentElement?.textContent?.trim() || '';
            const rent = parseInt(rentText.replace(/[^0-9]/g, '')) || 0;
            const bedrooms = parseInt(bedElement?.textContent?.trim() || '0');
            const bathrooms = parseInt(bathElement?.textContent?.trim() || '0');
            const imageUrl = imageElement?.getAttribute('src') || '';

            if (title && rent > 0) {
              listings.push({
                title,
                description: `The Standard Seattle - ${title}`,
                rent,
                bedrooms,
                bathrooms,
                address: 'The Standard Seattle, Seattle',
                images: imageUrl ? [imageUrl] : [],
                amenities: ['Landmark Properties', 'UW campus access', 'U District location'],
                url: window.location.href,
                source: 'The Standard'
              });
            }
          }
        });

        return listings;
      });

      listings.push(...extractedListings);
      await browser.close();
      console.log(`✅ The Standard: Found ${extractedListings.length} floorplans`);

    } catch (error) {
      console.error('❌ Error scraping The Standard:', error);
    }

    return listings;
  }

  private async scrapeMurielsLanding(): Promise<ApartmentListing[]> {
    const listings: ApartmentListing[] = [];

    try {
      console.log('🏢 Scraping Muriel\'s Landing...');
      const browser = await this.setupBrowser();
      const page = await browser.newPage();

      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      await page.goto('https://www.murielslanding.com/floorplans', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      const extractedListings = await page.evaluate(() => {
        const floorPlanElements = document.querySelectorAll('.floor-plan, .plan, .floorplan, .unit');
        const listings: any[] = [];

        floorPlanElements.forEach((element) => {
          const titleElement = element.querySelector('.plan-name, .name, .title, .unit-name');
          const rentElement = element.querySelector('.price, .rent, .monthly-rent, .starting-price');
          const bedElement = element.querySelector('.beds, .bedrooms, .bed-count');
          const bathElement = element.querySelector('.baths, .bathrooms, .bath-count');
          const imageElement = element.querySelector('img');

          if (titleElement) {
            const title = titleElement.textContent?.trim() || '';
            const rentText = rentElement?.textContent?.trim() || '';
            const rent = parseInt(rentText.replace(/[^0-9]/g, '')) || 0;
            const bedrooms = parseInt(bedElement?.textContent?.trim() || '0');
            const bathrooms = parseInt(bathElement?.textContent?.trim() || '0');
            const imageUrl = imageElement?.getAttribute('src') || '';

            if (title && rent > 0) {
              listings.push({
                title,
                description: `Muriel's Landing - ${title}`,
                rent,
                bedrooms,
                bathrooms,
                address: 'Muriel\'s Landing, Seattle',
                images: imageUrl ? [imageUrl] : [],
                amenities: ['Student housing', 'UW campus proximity', 'U District location'],
                url: window.location.href,
                source: 'Muriel\'s Landing'
              });
            }
          }
        });

        return listings;
      });

      listings.push(...extractedListings);
      await browser.close();
      console.log(`✅ Muriel's Landing: Found ${extractedListings.length} floorplans`);

    } catch (error) {
      console.error('❌ Error scraping Muriel\'s Landing:', error);
    }

    return listings;
  }

  private async scrapeHereSeattle(): Promise<ApartmentListing[]> {
    const listings: ApartmentListing[] = [];

    try {
      console.log('🏢 Scraping HERE Seattle...');
      const browser = await this.setupBrowser();
      const page = await browser.newPage();

      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      await page.goto('https://www.hereseattle.com/floorplans', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      const extractedListings = await page.evaluate(() => {
        const floorPlanElements = document.querySelectorAll('.floor-plan, .plan, .floorplan, .unit');
        const listings: any[] = [];

        floorPlanElements.forEach((element) => {
          const titleElement = element.querySelector('.plan-name, .name, .title, .unit-name');
          const rentElement = element.querySelector('.price, .rent, .monthly-rent, .starting-price');
          const bedElement = element.querySelector('.beds, .bedrooms, .bed-count');
          const bathElement = element.querySelector('.baths, .bathrooms, .bath-count');
          const imageElement = element.querySelector('img');

          if (titleElement) {
            const title = titleElement.textContent?.trim() || '';
            const rentText = rentElement?.textContent?.trim() || '';
            const rent = parseInt(rentText.replace(/[^0-9]/g, '')) || 0;
            const bedrooms = parseInt(bedElement?.textContent?.trim() || '0');
            const bathrooms = parseInt(bathElement?.textContent?.trim() || '0');
            const imageUrl = imageElement?.getAttribute('src') || '';

            if (title && rent > 0) {
              listings.push({
                title,
                description: `HERE Seattle - ${title}`,
                rent,
                bedrooms,
                bathrooms,
                address: 'HERE Seattle, Seattle',
                images: imageUrl ? [imageUrl] : [],
                amenities: ['Modern living', 'UW campus access', 'U District location'],
                url: window.location.href,
                source: 'HERE Seattle'
              });
            }
          }
        });

        return listings;
      });

      listings.push(...extractedListings);
      await browser.close();
      console.log(`✅ HERE Seattle: Found ${extractedListings.length} floorplans`);

    } catch (error) {
      console.error('❌ Error scraping HERE Seattle:', error);
    }

    return listings;
  }

  private async scrapeBridge11(): Promise<ApartmentListing[]> {
    const listings: ApartmentListing[] = [];

    try {
      console.log('🏢 Scraping Bridge11...');
      const browser = await this.setupBrowser();
      const page = await browser.newPage();

      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      await page.goto('https://www.bridge11apartments.com/floorplans', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      const extractedListings = await page.evaluate(() => {
        const floorPlanElements = document.querySelectorAll('.floor-plan, .plan, .floorplan, .unit');
        const listings: any[] = [];

        floorPlanElements.forEach((element) => {
          const titleElement = element.querySelector('.plan-name, .name, .title, .unit-name');
          const rentElement = element.querySelector('.price, .rent, .monthly-rent, .starting-price');
          const bedElement = element.querySelector('.beds, .bedrooms, .bed-count');
          const bathElement = element.querySelector('.baths, .bathrooms, .bath-count');
          const imageElement = element.querySelector('img');

          if (titleElement) {
            const title = titleElement.textContent?.trim() || '';
            const rentText = rentElement?.textContent?.trim() || '';
            const rent = parseInt(rentText.replace(/[^0-9]/g, '')) || 0;
            const bedrooms = parseInt(bedElement?.textContent?.trim() || '0');
            const bathrooms = parseInt(bathElement?.textContent?.trim() || '0');
            const imageUrl = imageElement?.getAttribute('src') || '';

            if (title && rent > 0) {
              listings.push({
                title,
                description: `Bridge11 Apartments - ${title}`,
                rent,
                bedrooms,
                bathrooms,
                address: 'Bridge11 Apartments, Seattle',
                images: imageUrl ? [imageUrl] : [],
                amenities: ['Student housing', 'UW campus proximity', 'U District location'],
                url: window.location.href,
                source: 'Bridge11'
              });
            }
          }
        });

        return listings;
      });

      listings.push(...extractedListings);
      await browser.close();
      console.log(`✅ Bridge11: Found ${extractedListings.length} floorplans`);

    } catch (error) {
      console.error('❌ Error scraping Bridge11:', error);
    }

    return listings;
  }

  private async scrapeTripalink(): Promise<ApartmentListing[]> {
    const listings: ApartmentListing[] = [];

    try {
      console.log('🏢 Scraping Tripalink...');
      const browser = await this.setupBrowser();
      const page = await browser.newPage();

      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      await page.goto('https://www.tripalink.com/seattle-uw', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      const extractedListings = await page.evaluate(() => {
        const listingElements = document.querySelectorAll('.property-card, .listing-card, .apartment-card');
        const listings: any[] = [];

        listingElements.forEach((element) => {
          const titleElement = element.querySelector('.property-name, .listing-name, .apartment-name');
          const rentElement = element.querySelector('.rent, .price, .monthly-rent');
          const bedElement = element.querySelector('.bedrooms, .beds, .bed-count');
          const bathElement = element.querySelector('.bathrooms, .baths, .bath-count');
          const imageElement = element.querySelector('img');

          if (titleElement) {
            const title = titleElement.textContent?.trim() || '';
            const rentText = rentElement?.textContent?.trim() || '';
            const rent = parseInt(rentText.replace(/[^0-9]/g, '')) || 0;
            const bedrooms = parseInt(bedElement?.textContent?.trim() || '0');
            const bathrooms = parseInt(bathElement?.textContent?.trim() || '0');
            const imageUrl = imageElement?.getAttribute('src') || '';

            if (title && rent > 0) {
              listings.push({
                title,
                description: `Tripalink - ${title}`,
                rent,
                bedrooms,
                bathrooms,
                address: 'Tripalink Property, Seattle',
                images: imageUrl ? [imageUrl] : [],
                amenities: ['Student housing', 'Furnished options', 'UW campus proximity'],
                url: window.location.href,
                source: 'Tripalink'
              });
            }
          }
        });

        return listings;
      });

      listings.push(...extractedListings);
      await browser.close();
      console.log(`✅ Tripalink: Found ${extractedListings.length} listings`);

    } catch (error) {
      console.error('❌ Error scraping Tripalink:', error);
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
      source: apartmentListing.source as any,
      sourceUrl: apartmentListing.url,
      scrapedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async scrapeApartments(): Promise<ScrapeResult> {
    const startTime = Date.now();
    let totalListings = 0;
    let housingListings: HousingListing[] = [];

    try {
      console.log('🚀 Starting apartment scraping process...');

      for (const site of this.sites) {
        console.log(`\n🏢 Processing ${site.name}...`);

        try {
          const apartmentListings = await site.scraper();
          totalListings += apartmentListings.length;

          console.log(`📊 Found ${apartmentListings.length} listings from ${site.name}`);

          for (const apartmentListing of apartmentListings) {
            const housingListing = this.convertToHousingListing(apartmentListing);
            housingListings.push(housingListing);
            console.log(`✅ Extracted: ${housingListing.title.substring(0, 50)}...`);
          }

          // Add delay between sites to be respectful
          await new Promise(resolve => setTimeout(resolve, 3000));

        } catch (error) {
          console.error(`❌ Error scraping ${site.name}:`, error);
        }
      }

      // Save listings to database
      if (housingListings.length > 0) {
        console.log(`\n💾 Saving ${housingListings.length} listings to database...`);
        await db.addListingsBatch(housingListings);
        console.log('✅ Successfully saved listings to database');
      }

      const duration = Date.now() - startTime;
      console.log(`\n🎉 Apartment scraping completed in ${duration}ms`);
      console.log(`📊 Total listings found: ${totalListings}`);
      console.log(`🏠 Housing listings saved: ${housingListings.length}`);

      return {
        source: 'apartments',
        success: true,
        count: housingListings.length,
        error: undefined
      };

    } catch (error) {
      console.error('❌ Apartment scraping error:', error);
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