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

    // Get user preferences for potential recommendations
    const userPreferences = await db.getPreferences(userId);

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

    let response = completion.choices[0]?.message?.content || 'Sorry, I couldn\'t process your request.';

    // Check if user is asking for recommendations or has completed preferences
    const isAskingForRecommendations = message.toLowerCase().includes('recommend') ||
                                      message.toLowerCase().includes('find') ||
                                      message.toLowerCase().includes('suggest') ||
                                      message.toLowerCase().includes('match') ||
                                      message.toLowerCase().includes('housing') ||
                                      message.toLowerCase().includes('apartment');

    // If user has preferences and is asking for recommendations, provide them
    if (userPreferences && isAskingForRecommendations) {
      try {
        const matchingListings = await db.getMatchingListings(userPreferences, 5);

        if (matchingListings.length > 0) {
          const recommendationsText = matchingListings.map((listing, index) => {
            const distance = '0.5 miles'; // Placeholder - could be calculated based on coordinates
            return `${index + 1}. **${listing.title}** - $${listing.rent}/month\n   📍 ${listing.neighborhood} (${distance} to UW)\n   🏠 ${listing.type} • ${listing.bedrooms || 0} bed, ${listing.bathrooms || 0} bath\n   ${listing.petFriendly ? '🐕 Pet-friendly' : '🚫 No pets'} • ${listing.furnished ? '🛋️ Furnished' : '📦 Unfurnished'}`;
          }).join('\n\n');

          response += `\n\n🏠 **Here are your top ${matchingListings.length} housing matches:**\n\n${recommendationsText}\n\n💡 *These listings are sorted by recency and match your preferences for budget, location, and amenities.*`;
        } else {
          response += `\n\n😔 **We couldn't find a perfect match based on your preferences, but here are a few general options you may consider:**\n\n`;

          // Get some general listings as fallback
          const fallbackListings = await db.getListings({});
          const topListings = fallbackListings.slice(0, 3);

          if (topListings.length > 0) {
            const fallbackText = topListings.map((listing, index) => {
              return `${index + 1}. **${listing.title}** - $${listing.rent}/month\n   📍 ${listing.neighborhood}\n   🏠 ${listing.type} • ${listing.bedrooms || 0} bed, ${listing.bathrooms || 0} bath`;
            }).join('\n\n');

            response += fallbackText;
          }
        }
      } catch (error) {
        console.error('Error getting recommendations:', error);
        // Continue with original response if recommendations fail
      }
    }

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