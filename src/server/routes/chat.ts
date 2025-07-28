import { Router, Request, Response } from 'express';
import OpenAI from 'openai';
import { db } from '../services/database';
import { createError } from '../middleware/errorHandler';
import { ChatMessage } from '../types';

const router = Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { message, userId } = req.body;

    if (!message || !userId) {
      throw createError('Message and userId are required', 400);
    }

    // Get chat history for context
    const chatHistory = await db.getChatHistory(userId, 10);
    const conversationHistory = chatHistory.flatMap(msg => [
      { role: 'user' as const, content: msg.message },
      { role: 'assistant' as const, content: msg.response }
    ]);

    // Create system prompt for housing assistant
    const systemPrompt = `You are HuskyKennel, an AI housing assistant for UW students in the U District.
    You help students find housing by:
    - Answering questions about housing options, neighborhoods, and rental processes
    - Providing advice on budgeting, roommate matching, and lease agreements
    - Suggesting areas to look for housing based on preferences
    - Explaining UW housing policies and resources
    - Helping with housing-related questions and concerns

    Be friendly, helpful, and knowledgeable about UW and the U District area.
    Keep responses concise but informative.`;

    // Get response from OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'Sorry, I couldn\'t process your request.';

    // Save the chat message
    const chatMessage: ChatMessage = {
      userId,
      message,
      response,
      timestamp: new Date()
    };

    await db.saveChatMessage(chatMessage);

    res.json({
      response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export { router as chatRouter };