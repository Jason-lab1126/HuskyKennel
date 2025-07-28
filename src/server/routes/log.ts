import { Router, Request, Response } from 'express';
import { db } from '../services/database';
import { createError } from '../middleware/errorHandler';
import { LogEntry } from '../types';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, action, data } = req.body;

    if (!userId || !action) {
      throw createError('UserId and action are required', 400);
    }

    // Validate action type
    const validActions = ['chat', 'click', 'view', 'match'];
    if (!validActions.includes(action)) {
      throw createError('Invalid action type', 400);
    }

    const logEntry: LogEntry = {
      userId,
      action,
      data: data || {},
      timestamp: new Date()
    };

    const savedLog = await db.addLog(logEntry);

    res.status(201).json({
      message: 'Log entry created successfully',
      log: savedLog
    });

  } catch (error) {
    console.error('Log error:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Batch log entries
router.post('/batch', async (req: Request, res: Response) => {
  try {
    const { logs } = req.body;

    if (!Array.isArray(logs) || logs.length === 0) {
      throw createError('Logs array is required and must not be empty', 400);
    }

    const savedLogs = [];
    const errors = [];

    for (const logData of logs) {
      try {
        const { userId, action, data } = logData;

        if (!userId || !action) {
          errors.push({ log: logData, error: 'UserId and action are required' });
          continue;
        }

        const validActions = ['chat', 'click', 'view', 'match'];
        if (!validActions.includes(action)) {
          errors.push({ log: logData, error: 'Invalid action type' });
          continue;
        }

        const logEntry: LogEntry = {
          userId,
          action,
          data: data || {},
          timestamp: new Date()
        };

        const savedLog = await db.addLog(logEntry);
        savedLogs.push(savedLog);

      } catch (error) {
        errors.push({ log: logData, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    res.json({
      message: 'Batch log processing completed',
      savedCount: savedLogs.length,
      errorCount: errors.length,
      savedLogs,
      errors
    });

  } catch (error) {
    console.error('Batch log error:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export { router as logRouter };