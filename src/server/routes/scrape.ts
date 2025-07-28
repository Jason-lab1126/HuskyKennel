import { Router, Request, Response } from 'express';
import { redditScraper } from '../scrapers/reddit';
import { facebookScraper } from '../scrapers/facebook';
import { apartmentsScraper } from '../scrapers/apartments';
import { db } from '../services/database';
import { ScrapeResult } from '../types';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('🚀 Starting comprehensive scraping process...');
    const startTime = Date.now();

    const results: ScrapeResult[] = [];
    let totalListings = 0;

    // Run Reddit scraper
    console.log('📱 Scraping Reddit...');
    try {
      const redditResult = await redditScraper.scrape();
      results.push(redditResult);
      totalListings += redditResult.count;
      console.log(`✅ Reddit: ${redditResult.count} listings`);
    } catch (error) {
      console.error('❌ Reddit scraping failed:', error);
      results.push({
        source: 'reddit',
        success: false,
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Run Facebook scraper
    console.log('📘 Scraping Facebook...');
    try {
      const facebookResult = await facebookScraper.scrape();
      results.push(facebookResult);
      totalListings += facebookResult.count;
      console.log(`✅ Facebook: ${facebookResult.count} listings`);
    } catch (error) {
      console.error('❌ Facebook scraping failed:', error);
      results.push({
        source: 'facebook',
        success: false,
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Run Apartments scraper
    console.log('🏢 Scraping Apartment websites...');
    try {
      const apartmentsResult = await apartmentsScraper.scrape();
      results.push(apartmentsResult);
      totalListings += apartmentsResult.count;
      console.log(`✅ Apartments: ${apartmentsResult.count} listings`);
    } catch (error) {
      console.error('❌ Apartments scraping failed:', error);
      results.push({
        source: 'apartments',
        success: false,
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    const duration = Date.now() - startTime;
    const successfulScrapes = results.filter(r => r.success).length;
    const totalScrapes = results.length;

    // Log the scraping results
    await db.addLog({
      userId: 'system',
      action: 'view',
      data: {
        action: 'scrape_all_completed',
        results,
        totalListings,
        duration,
        successfulScrapes,
        totalScrapes
      },
      timestamp: new Date()
    });

    console.log(`🎉 Scraping completed in ${duration}ms`);
    console.log(`📊 Total listings found: ${totalListings}`);
    console.log(`✅ Successful scrapes: ${successfulScrapes}/${totalScrapes}`);

    res.json({
      message: 'Scraping completed',
      results,
      summary: {
        totalListings,
        duration,
        successfulScrapes,
        totalScrapes
      }
    });

  } catch (error) {
    console.error('Scraping error:', error);

    // Log the error
    await db.addLog({
      userId: 'system',
      action: 'view',
      data: {
        action: 'scrape_all_failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      timestamp: new Date()
    });

    res.status(500).json({
      error: 'Scraping failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Individual scraper endpoints
router.get('/reddit', async (req: Request, res: Response) => {
  try {
    const result = await redditScraper.scrape();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Reddit scraping failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/facebook', async (req: Request, res: Response) => {
  try {
    const result = await facebookScraper.scrape();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Facebook scraping failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/apartments', async (req: Request, res: Response) => {
  try {
    const result = await apartmentsScraper.scrape();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Apartments scraping failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as scrapeRouter };