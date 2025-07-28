import { Router, Request, Response } from 'express';
import { db } from '../services/database';
import { createError } from '../middleware/errorHandler';
import { UserPreferences } from '../types';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const preferencesData: Partial<UserPreferences> = req.body;
    const { userId } = preferencesData;

    if (!userId) {
      throw createError('UserId is required', 400);
    }

    // Validate required fields
    const requiredFields = [
      'maxRent', 'minBedrooms', 'maxBedrooms', 'petFriendly',
      'furnished', 'utilities', 'parking', 'neighborhoods', 'housingTypes'
    ];

    for (const field of requiredFields) {
      if (preferencesData[field as keyof UserPreferences] === undefined) {
        throw createError(`Missing required field: ${field}`, 400);
      }
    }

    // Validate rent
    if (typeof preferencesData.maxRent !== 'number' || preferencesData.maxRent <= 0) {
      throw createError('Max rent must be a positive number', 400);
    }

    // Validate bedrooms
    if (typeof preferencesData.minBedrooms !== 'number' || preferencesData.minBedrooms < 0) {
      throw createError('Min bedrooms must be a non-negative number', 400);
    }

    if (typeof preferencesData.maxBedrooms !== 'number' || preferencesData.maxBedrooms < preferencesData.minBedrooms!) {
      throw createError('Max bedrooms must be greater than or equal to min bedrooms', 400);
    }

    // Validate arrays
    if (!Array.isArray(preferencesData.neighborhoods) || preferencesData.neighborhoods.length === 0) {
      throw createError('At least one neighborhood must be selected', 400);
    }

    if (!Array.isArray(preferencesData.housingTypes) || preferencesData.housingTypes.length === 0) {
      throw createError('At least one housing type must be selected', 400);
    }

    // Create preferences object
    const preferences: UserPreferences = {
      userId,
      maxRent: preferencesData.maxRent!,
      minBedrooms: preferencesData.minBedrooms!,
      maxBedrooms: preferencesData.maxBedrooms!,
      petFriendly: preferencesData.petFriendly!,
      furnished: preferencesData.furnished!,
      utilities: preferencesData.utilities!,
      parking: preferencesData.parking!,
      neighborhoods: preferencesData.neighborhoods!,
      housingTypes: preferencesData.housingTypes!,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const savedPreferences = await db.savePreferences(preferences);

    // Log the preferences save
    await db.addLog({
      userId,
      action: 'view',
      data: { action: 'preferences_saved', preferences: savedPreferences },
      timestamp: new Date()
    });

    res.json({
      message: 'Preferences saved successfully',
      preferences: savedPreferences
    });

  } catch (error) {
    console.error('Save preferences error:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      throw createError('UserId is required', 400);
    }

    const preferences = await db.getPreferences(userId);

    if (!preferences) {
      res.status(404).json({ error: 'Preferences not found' });
      return;
    }

    res.json({ preferences });

  } catch (error) {
    console.error('Get preferences error:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export { router as preferencesRouter };