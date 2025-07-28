import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Home, MapPin, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI housing assistant for the U District. I can help you find the perfect housing based on your specific needs and preferences. What are you looking for?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageToAPI = async (message: string): Promise<string> => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          userId: 'user-' + Date.now(), // Generate a simple user ID
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response || 'Sorry, I couldn\'t process your request.';
    } catch (error) {
      console.error('Error calling chat API:', error);
      throw new Error('Failed to get response from AI assistant. Please try again.');
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setError(null);

    try {
      const aiResponse = await sendMessageToAPI(inputText);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error getting AI response:', err);
      setError(err instanceof Error ? err.message : 'Failed to get response');

      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again or check your connection.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    "I need pet-friendly housing under $1500",
    "Looking for a quiet place near campus for studying",
    "Need short-term summer housing",
    "Want a studio apartment with parking",
    "Looking for roommates and social environment"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center mr-3">
              <Bot className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">AI Housing Assistant</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tell me exactly what you're looking for in U District housing. I'll help you find options that match your specific needs and preferences.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Chat Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Messages Area */}
          <div className="h-96 md:h-[500px] overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-xs md:max-w-md lg:max-w-lg ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 ${message.sender === 'user' ? 'ml-3' : 'mr-3'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user'
                        ? 'bg-purple-600'
                        : 'bg-gradient-to-br from-blue-500 to-purple-600'
                    }`}>
                      {message.sender === 'user' ? (
                        <User size={16} className="text-white" />
                      ) : (
                        <Bot size={16} className="text-white" />
                      )}
                    </div>
                  </div>

                  {/* Message Bubble */}
                  <div className={`px-4 py-2 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex">
                  <div className="mr-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot size={16} className="text-white" />
                    </div>
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <Loader2 size={16} className="animate-spin text-gray-500" />
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 1 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Try these examples:</p>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setInputText(prompt)}
                    className="text-sm bg-white border border-gray-300 rounded-full px-3 py-1 hover:bg-purple-50 hover:border-purple-300 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your ideal housing situation..."
                  className="w-full resize-none border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={1}
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                  disabled={isTyping}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">AI-Powered</h3>
            <p className="text-sm text-gray-600">Smart recommendations based on your specific needs</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <Home className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">U District Focus</h3>
            <p className="text-sm text-gray-600">Specialized knowledge of campus area housing</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <MapPin className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Local Expertise</h3>
            <p className="text-sm text-gray-600">Insider knowledge of neighborhoods and transit</p>
          </div>
        </div>
      </div>
    </div>
  );
}