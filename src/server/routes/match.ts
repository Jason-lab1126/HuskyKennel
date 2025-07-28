import { Router, Request, Response } from 'express';
import { db } from '../services/database';
import { createError } from '../middleware/errorHandler';
import { UserPreferences, MatchResult } from '../types';

const router = Router();

// Scoring algorithm for matching listings
function calculateMatchScore(listing: any, preferences: UserPreferences): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Rent scoring (0-30 points)
  if (listing.rent <= preferences.maxRent) {
    const rentScore = Math.max(0, 30 - ((listing.rent / preferences.maxRent) * 10));
    score += rentScore;
    reasons.push(`Rent within budget ($${listing.rent})`);
  } else {
    reasons.push(`Rent exceeds budget ($${listing.rent} vs $${preferences.maxRent})`);
  }

  // Bedroom scoring (0-20 points)
  if (listing.bedrooms >= preferences.minBedrooms && listing.bedrooms <= preferences.maxBedrooms) {
    score += 20;
    reasons.push(`Bedroom count matches (${listing.bedrooms})`);
  } else {
    reasons.push(`Bedroom count doesn't match (${listing.bedrooms} vs ${preferences.minBedrooms}-${preferences.maxBedrooms})`);
  }

  // Pet friendly scoring (0-15 points)
  if (preferences.petFriendly && listing.petFriendly) {
    score += 15;
    reasons.push('Pet friendly');
  } else if (preferences.petFriendly && !listing.petFriendly) {
    reasons.push('Not pet friendly');
  }

  // Furnished scoring (0-10 points)
  if (preferences.furnished === listing.furnished) {
    score += 10;
    reasons.push(`Furnished: ${listing.furnished ? 'Yes' : 'No'}`);
  }

  // Utilities scoring (0-10 points)
  if (preferences.utilities === listing.utilities) {
    score += 10;
    reasons.push(`Utilities included: ${listing.utilities ? 'Yes' : 'No'}`);
  }

  // Parking scoring (0-10 points)
  if (preferences.parking === listing.parking) {
    score += 10;
    reasons.push(`Parking available: ${listing.parking ? 'Yes' : 'No'}`);
  }

  // Neighborhood scoring (0-5 points)
  if (preferences.neighborhoods.includes(listing.neighborhood)) {
    score += 5;
    reasons.push(`Preferred neighborhood: ${listing.neighborhood}`);
  }

  return { score, reasons };
}

router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, limit = 10 } = req.body;

    if (!userId) {
      throw createError('UserId is required', 400);
    }

    // Get user preferences
    const preferences = await db.getPreferences(userId);
    if (!preferences) {
      throw createError('User preferences not found. Please complete the questionnaire first.', 404);
    }

    // Get all listings
    const listings = await db.getListings();

    // Calculate match scores for each listing
    const matchResults: MatchResult[] = listings.map(listing => {
      const { score, reasons } = calculateMatchScore(listing, preferences);
      return {
        listing,
        score,
        reasons
      };
    });

    // Sort by score (highest first) and take top matches
    const topMatches = matchResults
      .filter(result => result.score > 0) // Only include listings with some match
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    // Log the match request
    await db.addLog({
      userId,
      action: 'match',
      data: {
        preferences,
        resultsCount: topMatches.length,
        topScore: topMatches[0]?.score || 0
      },
      timestamp: new Date()
    });

    res.json({
      matches: topMatches,
      totalListings: listings.length,
      matchedListings: topMatches.length
    });

  } catch (error) {
    console.error('Match error:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export { router as matchRouter };