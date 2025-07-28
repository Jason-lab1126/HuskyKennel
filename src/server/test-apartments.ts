#!/usr/bin/env ts-node

import dotenv from 'dotenv';
import { apartmentsScraper } from './scrapers/apartments';

dotenv.config();

async function testApartmentsScraper() {
  console.log('🏢 Testing U District Apartments Scraper');
  console.log('=' .repeat(60));

  try {
    console.log('🚀 Starting comprehensive apartment scraping...');
    const result = await apartmentsScraper.scrapeApartments();

    console.log('\n📊 Test Results:');
    console.log(`✅ Success: ${result.success}`);
    console.log(`📈 Listings Found: ${result.count}`);

    if (result.error) {
      console.log(`❌ Error: ${result.error}`);
    } else {
      console.log('🎉 Apartment scraper test completed successfully!');
    }

  } catch (error) {
    console.error('❌ Apartment scraper test failed:', error);
  }
}

async function main() {
  console.log('🏢 HuskyKennel U District Apartments Scraper Test');
  console.log('=' .repeat(60));

  await testApartmentsScraper();

  console.log('\n✅ Test completed!');
  process.exit(0);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

main().catch(console.error);