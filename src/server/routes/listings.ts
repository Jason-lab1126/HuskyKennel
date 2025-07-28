import { Router, Request, Response } from 'express';
import { db } from '../services/database';
import { createError } from '../middleware/errorHandler';
import { HousingListing } from '../types';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const listingData: HousingListing = req.body;

    // Validate required fields
    const requiredFields = ['title', 'description', 'rent', 'type', 'address', 'neighborhood'];
    for (const field of requiredFields) {
      if (!listingData[field as keyof HousingListing]) {
        throw createError(`Missing required field: ${field}`, 400);
      }
    }

    // Validate rent is a positive number
    if (typeof listingData.rent !== 'number' || listingData.rent <= 0) {
      throw createError('Rent must be a positive number', 400);
    }

    // Validate housing type
    const validTypes = ['apartment', 'house', 'studio', 'shared'];
    if (!validTypes.includes(listingData.type)) {
      throw createError('Invalid housing type', 400);
    }

    // Set default values
    const listing: HousingListing = {
      ...listingData,
      images: listingData.images || [],
      petFriendly: listingData.petFriendly || false,
      furnished: listingData.furnished || false,
      utilities: listingData.utilities || false,
      parking: listingData.parking || false,
      source: listingData.source || 'manual',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const savedListing = await db.addListing(listing);

    res.status(201).json({
      message: 'Listing added successfully',
      listing: savedListing
    });

  } catch (error) {
    console.error('Add listing error:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export { router as listingsRouter };