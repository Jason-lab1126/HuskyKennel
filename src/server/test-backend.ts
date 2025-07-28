#!/usr/bin/env ts-node

import dotenv from 'dotenv';
import { db } from './services/database';

dotenv.config();

async function testBackend() {
  console.log('🧪 Testing Backend Functionality');
  console.log('=' .repeat(50));

  try {
    // Test 1: Check if we can connect to Supabase
    console.log('\n1️⃣ Testing Supabase connection...');
    const testListings = await db.getListings({});
    console.log(`✅ Connected to Supabase! Found ${testListings.length} listings`);

    // Test 2: Test filtering
    console.log('\n2️⃣ Testing listing filters...');
    const filteredListings = await db.getListings({ minRent: 1000, maxRent: 2000 });
    console.log(`✅ Filtered listings: ${filteredListings.length} between $1000-$2000`);

    // Test 3: Test matching listings
    console.log('\n3️⃣ Testing matching listings...');
    const mockPreferences = {
      budget: { min: 1000, max: 2500 },
      housingType: ['apartment', 'studio'],
      lifestyle: { pets: true },
      preferredLocations: ['U District']
    };

    const matchingListings = await db.getMatchingListings(mockPreferences, 3);
    console.log(`✅ Matching listings: ${matchingListings.length} found`);

    // Test 4: Show sample data
    if (testListings.length > 0) {
      console.log('\n4️⃣ Sample listing data:');
      const sample = testListings[0];
      console.log(`   Title: ${sample.title}`);
      console.log(`   Rent: $${sample.rent}`);
      console.log(`   Type: ${sample.type}`);
      console.log(`   Source: ${sample.source}`);
      console.log(`   Scraped: ${sample.scrapedAt}`);
    }

    console.log('\n🎉 All backend tests passed!');

  } catch (error) {
    console.error('❌ Backend test failed:', error);
  }
}

testBackend().catch(console.error);