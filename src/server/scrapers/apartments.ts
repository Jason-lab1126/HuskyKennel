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

interface ScraperConfig {
  name: string;
  url: string;
  selectors: {
    container: string;
    title: string;
    price: string;
    beds?: string;
    baths?: string;
    image?: string;
  };
  usePuppeteer?: boolean;
}

export class ApartmentsScraper {
  private apartmentSites: ScraperConfig[] = [
    // Major U District Communities
    { name: 'Trailside', url: 'https://www.trailsideudistrict.com/floorplans', selectors: { container: '.floor-plan-item', title: '.floor-plan-title', price: '.rent-amount', beds: '.bedroom-count', baths: '.bathroom-count' } },
    { name: 'Strata', url: 'https://www.strataapts.com/floorplans', selectors: { container: '.floor-plan', title: '.plan-name', price: '.price', beds: '.beds', baths: '.baths' } },
    { name: 'The M', url: 'https://www.themseattle.com/floorplans', selectors: { container: '.floor-plan', title: '.plan-name', price: '.price', beds: '.beds', baths: '.baths' } },
    { name: 'Theory UDistrict', url: 'https://www.theoryudistrict.com/floorplans', selectors: { container: '.floor-plan', title: '.plan-name', price: '.price', beds: '.beds', baths: '.baths' } },
    { name: 'The Standard', url: 'https://thestandardseattle.landmark-properties.com/', selectors: { container: '.floor-plan', title: '.plan-name', price: '.price', beds: '.beds', baths: '.baths' } },
    { name: 'Muriel\'s Landing', url: 'https://www.murielslanding.com/floorplans', selectors: { container: '.floor-plan', title: '.plan-name', price: '.price', beds: '.beds', baths: '.baths' } },
    { name: 'HERE Seattle', url: 'https://www.hereseattle.com/floorplans', selectors: { container: '.floor-plan-card', title: '.plan-title', price: '.monthly-rent', beds: '.bed-count', baths: '.bath-count' } },
    { name: 'Bridge11', url: 'https://www.bridge11apartments.com/floorplans', selectors: { container: '.floor-plan', title: '.plan-name', price: '.price', beds: '.beds', baths: '.baths' } },
    { name: 'Tripalink', url: 'https://www.tripalink.com/seattle-uw', selectors: { container: '.property-card', title: '.property-name', price: '.rent', beds: '.bedrooms', baths: '.bathrooms' } },
    { name: 'Nolan', url: 'https://www.nolanudistrict.com/floorplans', selectors: { container: '.floor-plan', title: '.plan-name', price: '.price', beds: '.beds', baths: '.baths' } },
    { name: 'Nora', url: 'https://www.noraudistrict.com/floorplans', selectors: { container: '.floor-plan', title: '.plan-name', price: '.price', beds: '.beds', baths: '.baths' } },
    { name: 'Hub U District', url: 'https://www.hubudistrict.com/floorplans', selectors: { container: '.floor-plan', title: '.plan-name', price: '.price', beds: '.beds', baths: '.baths' } },
    { name: 'LaVita', url: 'https://www.lavitaudistrict.com/floorplans', selectors: { container: '.floor-plan', title: '.plan-name', price: '.price', beds: '.beds', baths: '.baths' } },
    { name: 'Viola', url: 'https://www.violaudistrict.com/floorplans', selectors: { container: '.floor-plan', title: '.plan-name', price: '.price', beds: '.beds', baths: '.baths' } },
    { name: 'Sora', url: 'https://www.soraudistrict.com/floorplans', selectors: { container: '.floor-plan', title: '.plan-name', price: '.price', beds: '.beds', baths: '.baths' } },
    { name: 'Greta', url: 'https://www.gretaudistrict.com/floorplans', selectors: { container: '.floor-plan', title: '.plan-name', price: '.price', beds: '.beds', baths: '.baths' } },
    { name: 'Fifty-Two', url: 'https://www.fiftytwoapartments.com/floorplans', selectors: { container: '.floor-plan', title: '.plan-name', price: '.price', beds: '.beds', baths: '.baths' } },
    { name: 'The Stax', url: 'https://www.thestaxseattle.com/floorplans', selectors: { container: '.floor-plan', title: '.plan-name', price: '.price', beds: '.beds', baths: '.baths' } },
    { name: 'Arista', url: 'https://www.aristaudistrict.com/floorplans', selectors: { container: '.floor-plan', title: '.plan-name', price: '.price', beds: '.beds', baths: '.baths' } },
    { name: 'Parsonage', url: 'https://www.parsonageudistrict.com/floorplans', selectors: { container: '.floor-plan', title: '.plan-name', price: '.price', beds: '.beds', baths: '.baths' } },
    { name: 'U Place', url: 'https://www.uplaceudistrict.com/floorplans', selectors: { container: '.floor-plan', title: '.plan-name', price: '.price', beds: '.beds', baths: '.baths' } },
    { name: 'Twelve at U District', url: 'https://www.twelveudistrict.com/floorplans', selectors: { container: '.floor-plan', title: '.plan-name', price: '.price', beds: '.beds', baths: '.baths' } },
    { name: 'ōLiv Seattle', url: 'https://www.olivseattle.com/floorplans', selectors: { container: '.floor-plan', title: '.plan-name', price: '.price', beds: '.beds', baths: '.baths' } },
    { name: 'The Accolade', url: 'https://www.theaccoladeseattle.com/floorplans', selectors: { container: '.floor-plan', title: '.plan-name', price: '.price', beds: '.beds', baths: '.baths' } },
    { name: 'Verve Flats', url: 'https://www.verveflatsseattle.com/floorplans', selectors: { container: '.floor-plan', title: '.plan-name', price: '.price', beds: '.beds', baths: '.baths' } },
    { name: 'Helix Ellipse', url: 'https://www.helixellipse.com/floorplans', selectors: { container: '.floor-plan', title: '.plan-name', price: '.price', beds: '.beds', baths: '.baths' } },
    { name: 'Montclair', url: 'https://www.montclairseattle.com/floorplans', selectors: { container: '.floor-plan', title: '.plan-name', price: '.price', beds: '.beds', baths: '.baths' } },
    { name: 'Ori on the Ave', url: 'https://www.oriontheave.com/floorplans', selectors: { container: '.floor-plan', title: '.plan-name', price: '.price', beds: '.beds', baths: '.baths' } },
    { name: 'Sundodger', url: 'https://www.sundodgerapartments.com/floorplans', selectors: { container: '.floor-plan', title: '.plan-name', price: '.price', beds: '.beds', baths: '.baths' } },
    { name: 'The Corydon', url: 'https://www.thecorydonseattle.com/floorplans', selectors: { container: '.floor-plan', title: '.plan-name', price: '.price', beds: '.beds', baths: '.baths' } },
    { name: 'Ivy Ridge', url: 'https://www.ivyridgeseattle.com/floorplans', selectors: { container: '.floor-plan', title: '.plan-name', price: '.price', beds: '.beds', baths: '.baths' } }
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

  private async scrapeWithCheerio(site: ScraperConfig): Promise<ApartmentListing[]> {
    try {
      console.log(`🔍 Attempting static scraping for ${site.name}...`);

      const response = await axios.get(site.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 15000
      });

      const $ = cheerio.load(response.data);
      const listings: ApartmentListing[] = [];

      $(site.selectors.container).each((_, element) => {
        const title = $(element).find(site.selectors.title).text().trim();
        const priceText = $(element).find(site.selectors.price).text().trim();
        const bedsText = site.selectors.beds ? $(element).find(site.selectors.beds).text().trim() : '';
        const bathsText = site.selectors.baths ? $(element).find(site.selectors.baths).text().trim() : '';
        const imageUrl = site.selectors.image ? $(element).find(site.selectors.image).attr('src') || '' : '';

        if (title && priceText) {
          const rent = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
          const bedrooms = parseInt(bedsText.replace(/[^0-9]/g, '')) || 0;
          const bathrooms = parseInt(bathsText.replace(/[^0-9]/g, '')) || 0;

          if (rent > 0) {
            listings.push({
              title,
              description: `${site.name} - ${title}`,
              rent,
              bedrooms,
              bathrooms,
              address: `${site.name}, U District`,
              images: imageUrl ? [imageUrl] : [],
              amenities: ['U District location', 'UW campus proximity'],
              url: site.url,
              source: site.name
            });
          }
        }
      });

      console.log(`✅ Static scraping successful for ${site.name}: ${listings.length} listings`);
      return listings;

    } catch (error) {
      console.log(`❌ Static scraping failed for ${site.name}, falling back to Puppeteer...`);
      throw error;
    }
  }

  private async scrapeWithPuppeteer(site: ScraperConfig): Promise<ApartmentListing[]> {
    const browser = await this.setupBrowser();
    const listings: ApartmentListing[] = [];

    try {
      console.log(`🤖 Using Puppeteer fallback for ${site.name}...`);

      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

      await page.goto(site.url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Wait for content to load
      await page.waitForTimeout(3000);

      const extractedListings = await page.evaluate((selectors) => {
        const elements = document.querySelectorAll(selectors.container);
        const listings: any[] = [];

        elements.forEach((element) => {
          const titleElement = element.querySelector(selectors.title);
          const priceElement = element.querySelector(selectors.price);
          const bedsElement = selectors.beds ? element.querySelector(selectors.beds) : null;
          const bathsElement = selectors.baths ? element.querySelector(selectors.baths) : null;
          const imageElement = selectors.image ? element.querySelector(selectors.image) : null;

          if (titleElement && priceElement) {
            const title = titleElement.textContent?.trim() || '';
            const priceText = priceElement.textContent?.trim() || '';
            const bedsText = bedsElement?.textContent?.trim() || '';
            const bathsText = bathsElement?.textContent?.trim() || '';
            const imageUrl = imageElement?.getAttribute('src') || '';

            const rent = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
            const bedrooms = parseInt(bedsText.replace(/[^0-9]/g, '')) || 0;
            const bathrooms = parseInt(bathsText.replace(/[^0-9]/g, '')) || 0;

            if (rent > 0) {
              listings.push({
                title,
                rent,
                bedrooms,
                bathrooms,
                imageUrl
              });
            }
          }
        });

        return listings;
      }, site.selectors);

      extractedListings.forEach((item: any) => {
        listings.push({
          title: item.title,
          description: `${site.name} - ${item.title}`,
          rent: item.rent,
          bedrooms: item.bedrooms,
          bathrooms: item.bathrooms,
          address: `${site.name}, U District`,
          images: item.imageUrl ? [item.imageUrl] : [],
          amenities: ['U District location', 'UW campus proximity'],
          url: site.url,
          source: site.name
        });
      });

      console.log(`✅ Puppeteer fallback successful for ${site.name}: ${listings.length} listings`);
      return listings;

    } catch (error) {
      console.error(`❌ Puppeteer fallback failed for ${site.name}:`, error);
      return [];
    } finally {
      await browser.close();
    }
  }

  private async scrapeSite(site: ScraperConfig): Promise<ApartmentListing[]> {
    try {
      // Try static scraping first
      return await this.scrapeWithCheerio(site);
    } catch (error) {
      // Fallback to Puppeteer
      console.log(`🔄 Falling back to Puppeteer for ${site.name}`);
      return await this.scrapeWithPuppeteer(site);
    }
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
    let successfulSites = 0;
    let failedSites = 0;
    let puppeteerFallbacks = 0;

    try {
      console.log('🚀 Starting comprehensive U District apartment scraping...');
      console.log(`📊 Targeting ${this.apartmentSites.length} apartment communities`);

      for (const site of this.apartmentSites) {
        console.log(`\n🏢 Processing ${site.name}...`);

        try {
          const apartmentListings = await this.scrapeSite(site);
          totalListings += apartmentListings.length;

          if (apartmentListings.length > 0) {
            successfulSites++;
            console.log(`✅ ${site.name}: Found ${apartmentListings.length} listings`);

            for (const apartmentListing of apartmentListings) {
              const housingListing = this.convertToHousingListing(apartmentListing);
              housingListings.push(housingListing);
            }
          } else {
            failedSites++;
            console.log(`⚠️  ${site.name}: No listings found`);
          }

          // Add delay between sites
          await new Promise(resolve => setTimeout(resolve, 2000));

        } catch (error) {
          failedSites++;
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
      console.log(`📊 Summary:`);
      console.log(`   • Total communities: ${this.apartmentSites.length}`);
      console.log(`   • Successful scrapes: ${successfulSites}`);
      console.log(`   • Failed scrapes: ${failedSites}`);
      console.log(`   • Total listings found: ${totalListings}`);
      console.log(`   • Listings saved: ${housingListings.length}`);

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