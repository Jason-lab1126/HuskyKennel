#!/usr/bin/env ts-node

import dotenv from 'dotenv';
import { redditScraper } from './scrapers/reddit';
import { apartmentsScraper } from './scrapers/apartments';

dotenv.config();

async function testRedditScraper() {
  console.log('\n🧪 Testing Reddit Scraper...');
  console.log('=' .repeat(50));

  try {
    const result = await redditScraper.scrapeReddit();
    console.log('✅ Reddit scraper test completed!');
    console.log(`📊 Results: ${result.count} listings found`);
    console.log(`🎯 Success: ${result.success}`);
    if (result.error) {
      console.log(`❌ Error: ${result.error}`);
    }
  } catch (error) {
    console.error('❌ Reddit scraper test failed:', error);
  }
}

async function testApartmentsScraper() {
  console.log('\n🧪 Testing Apartments Scraper...');
  console.log('=' .repeat(50));

  try {
    const result = await apartmentsScraper.scrapeApartments();
    console.log('✅ Apartments scraper test completed!');
    console.log(`📊 Results: ${result.count} listings found`);
    console.log(`🎯 Success: ${result.success}`);
    if (result.error) {
      console.log(`❌ Error: ${result.error}`);
    }
  } catch (error) {
    console.error('❌ Apartments scraper test failed:', error);
  }
}

async function testAllScrapers() {
  console.log('\n🧪 Testing All Scrapers...');
  console.log('=' .repeat(50));

  try {
    console.log('\n📱 Testing Reddit scraper...');
    const redditResult = await redditScraper.scrapeReddit();

    console.log('\n🏢 Testing Apartments scraper...');
    const apartmentsResult = await apartmentsScraper.scrapeApartments();

    console.log('\n📊 Summary:');
    console.log(`Reddit: ${redditResult.count} listings`);
    console.log(`Apartments: ${apartmentsResult.count} listings`);
    console.log(`Total: ${redditResult.count + apartmentsResult.count} listings`);

  } catch (error) {
    console.error('❌ All scrapers test failed:', error);
  }
}

async function main() {
  const args = process.argv.slice(2);

  console.log('🚀 HuskyKennel Scraper Test Suite');
  console.log('=' .repeat(50));

  if (args.length === 0) {
    console.log('Usage: npm run test:scrapers [reddit|apartments|all]');
    console.log('Running all tests by default...');
    await testAllScrapers();
  } else {
    const testType = args[0].toLowerCase();

    switch (testType) {
      case 'reddit':
        await testRedditScraper();
        break;
      case 'apartments':
        await testApartmentsScraper();
        break;
      case 'all':
        await testAllScrapers();
        break;
      default:
        console.log('❌ Invalid test type. Use: reddit, apartments, or all');
        process.exit(1);
    }
  }

  console.log('\n✅ Test suite completed!');
  process.exit(0);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

main().catch(console.error);